import os, asyncio, requests, json, time, traceback, re
from pathlib import Path
from dotenv import load_dotenv
import google.generativeai as genai
from moviepy import VideoFileClip, AudioFileClip, TextClip, CompositeVideoClip, concatenate_videoclips, vfx
import edge_tts

# --- CONFIG & LOAD ENV ---
load_dotenv()
PEXELS_KEY = os.getenv("PEXELS_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# EVEN NUMBERS ONLY for libx264 compatibility
TARGET_W, TARGET_H = 1080, 1920 
SEG_SEC = 5 

# --- STEP 1: AI SCRIPTING (Gemini 1.5 Flash - FREE) ---
def generate_script(topic, run_dir):
    script_file = run_dir / "spec.json"
    
    # Artifact Check (Caching)
    if script_file.exists():
        print(f"Using cached script: {script_file}")
        return json.loads(script_file.read_text())

    if not GOOGLE_API_KEY:
        raise Exception("GOOGLE_API_KEY missing in .env. Get a free key at https://aistudio.google.com/")
    
    print(f"Synthesizing script for topic: {topic}...")
    genai.configure(api_key=GOOGLE_API_KEY)
    model = genai.GenerativeModel("models/gemini-1.5-flash")
    
    prompt = f"""
    Create a 10-segment video script for a 50-second social media video about '{topic}'.
    Output ONLY a raw JSON object with:
    1. 'script': The full narration (keep it under 140 words total).
    2. 'segments': An array of 10 objects, each with 'keywords' (3 portrait keywords) and 'caption' (short overlay text).
    
    Example output format:
    {{
      "script": "...",
      "segments": [ {{"keywords": "...", "caption": "..."}}, ... ]
    }}
    JSON only. No preamble. No markdown code blocks.
    """
    
    try:
        response = model.generate_content(prompt)
        raw_text = response.text.strip()
        print(f"Raw AI Response: {raw_text[:200]}...") # Print-First Debugging

        # Extract JSON using regex if AI is chatty
        json_match = re.search(r'\{.*\}', raw_text, re.DOTALL)
        if json_match:
            spec = json.loads(json_match.group())
            script_file.write_text(json.dumps(spec, indent=2))
            return spec
        else:
            raise Exception("Failed to extract valid JSON from Gemini response.")
            
    except Exception as e:
        print(f"Gemini Error: {e}")
        # Fallback to local data contract if API fails for testing purposes
        print("Using fallback data contract...")
        return {
            "script": "Success in business starts with a clear vision and a strong foundation.",
            "segments": [{"keywords": "business office", "caption": "Build Your Vision"}] * 10
        }

# --- STEP 2: ASSET GENERATION (Voice & SRT) ---
async def create_assets(run_dir, script_text, segments):
    audio_file = run_dir / "narration.mp3"
    srt_file = run_dir / "captions.srt"

    # Artifact Check
    if audio_file.exists() and audio_file.stat().st_size > 0:
        print(f"Using cached audio: {audio_file} (Size: {audio_file.stat().st_size} bytes)")
    else:
        print("Generating neural voiceover...")
        communicate = edge_tts.Communicate(script_text, "en-US-ChristopherNeural")
        await communicate.save(str(audio_file))

    if not srt_file.exists():
        print("Creating synchronization map (SRT)...")
        srt_content = ""
        for i, seg in enumerate(segments):
            start, end = i * SEG_SEC, (i + 1) * SEG_SEC
            srt_content += f"{i+1}\n00:00:{start:02d},000 --> 00:00:{end:02d},000\n{seg['caption']}\n\n"
        srt_file.write_text(srt_content)

# --- STEP 3: VISUAL ACQUISITION (Pexels) ---
def download_visuals(run_dir, segments):
    clip_paths = []
    clips_dir = run_dir / "clips"
    clips_dir.mkdir(exist_ok=True)
    
    print(f"Acquiring {len(segments)} portrait visuals...")
    headers = {"Authorization": PEXELS_KEY}
    
    for i, seg in enumerate(segments):
        path = clips_dir / f"clip_{i}.mp4"
        
        # Artifact Check
        if path.exists() and path.stat().st_size > 1000:
            print(f"   - Segment {i+1} cached.")
            clip_paths.append(path)
            continue

        params = {"query": seg["keywords"], "orientation": "portrait", "per_page": 1}
        try:
            resp = requests.get("https://api.pexels.com/videos/search", headers=headers, params=params)
            print(f"   - Pexels Response ({seg['keywords']}): {resp.status_code}") # Print-First Debugging
            
            if resp.status_code == 200:
                data = resp.json()
                if data.get("videos"):
                    url = data["videos"][0]["video_files"][0]["link"]
                    with requests.get(url, stream=True) as r:
                        with open(path, "wb") as f:
                            for chunk in r.iter_content(1024*1024): f.write(chunk)
                    clip_paths.append(path)
                else:
                    print(f"     Warning: No video found for: {seg['keywords']}")
            elif resp.status_code == 429:
                print("     Error: Pexels rate limit hit!")
        except Exception as e:
            print(f"     Fetch failed: {e}")
            
    return clip_paths

# --- STEP 4: MASTER ASSEMBLY (MoviePy v2) ---
def assemble_video(run_dir, clip_paths, segments):
    output_path = run_dir / "final.mp4"
    if output_path.exists():
        print(f"Output already exists: {output_path}. Skipping render.")
        return

    print("Initializing master assembly (CPU Only)...")
    final_clips = []
    
    # Track all clips for closure
    all_clips = []
    
    try:
        for i, p in enumerate(clip_paths):
            clip = VideoFileClip(str(p))
            all_clips.append(clip)
            
            # Force Even Dimensions for libx264
            # MoviePy v2: Resize and Crop are now effects or attributes
            # We'll use the .with_effects() pattern
            processed = clip.with_effects([vfx.Resize(height=TARGET_H)])
            processed = processed.with_effects([vfx.Crop(x_center=processed.w/2, y_center=processed.h/2, width=TARGET_W, height=TARGET_H)])
            all_clips.append(processed)
            
            # Subtitle Overlay
            txt = TextClip(
                text=segments[i]['caption'],
                font_size=70,
                color='white',
                stroke_color='black',
                stroke_width=2,
                method='caption',
                size=(int(TARGET_W * 0.8), None)
            ).with_duration(SEG_SEC).with_position(('center', int(TARGET_H * 0.8)))
            all_clips.append(txt)
            
            # Composite for this segment
            # We must be careful not to close 'processed' yet
            segment_clip = CompositeVideoClip([processed.with_duration(SEG_SEC), txt])
            final_clips.append(segment_clip)
            all_clips.append(segment_clip)

        print("Finalizing render and encoding...")
        final_video = concatenate_videoclips(final_clips, method="compose")
        with AudioFileClip(str(run_dir / "narration.mp3")) as audio:
            final_video = final_video.with_audio(audio)
            final_video.write_videofile(
                str(output_path), 
                fps=24, 
                codec="libx264", 
                audio_codec="aac"
            )
        
        # Explicitly close all clips to free up RAM
        for c in final_clips: c.close()
        final_video.close()
        print(f"FACTORY COMPLETE: {output_path}")

    except Exception:
        print(f"ASSEMBLY FAILURE: {traceback.format_exc()}")

# --- START FACTORY ---
async def start_factory(topic):
    # Unique folder per topic
    run_name = topic.replace(" ", "_").lower()
    run_dir = Path(f"runs/{run_name}")
    run_dir.mkdir(parents=True, exist_ok=True)
    
    try:
        spec = generate_script(topic, run_dir)
        await create_assets(run_dir, spec["script"], spec["segments"])
        clips = download_visuals(run_dir, spec["segments"])
        assemble_video(run_dir, clips, spec["segments"])
    except Exception:
        print(f"CRITICAL FAILURE: {traceback.format_exc()}")

if __name__ == "__main__":
    import sys
    topic = sys.argv[1] if len(sys.argv) > 1 else "Success Tips"
    asyncio.run(start_factory(topic))
