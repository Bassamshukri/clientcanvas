from dotenv import load_dotenv
from huggingface_hub import InferenceClient

# Load environment variables
load_dotenv()

PEXELS_API_KEY = os.getenv("PEXELS_API_KEY", "oGXXNnPklq6RymDZAw2NueXw82T6SA3548TZdHPLvX7Bl9dYpPtdxg03")
HF_API_TOKEN = os.getenv("HF_TOKEN") or os.getenv("HF_API_TOKEN")
TTS_VOICE = os.getenv("TTS_VOICE", "en-US-AvaNeural")
# Engine choice: "inference_api" or "local_llama"
ENGINE_TYPE = os.getenv("ENGINE_TYPE", "inference_api")

# Configure Hugging Face Inference Client
HF_MODEL = os.getenv("HF_MODEL", "meta-llama/Meta-Llama-3-8B-Instruct:novita")
client = None
if ENGINE_TYPE == "inference_api" and HF_API_TOKEN:
    client = InferenceClient(api_key=HF_API_TOKEN)

class VideoGenerator:
    def __init__(self, topic):
        self.topic = topic
        self.run_folder = f"runs/{self.topic.replace(' ', '_').lower()}"
        os.makedirs(self.run_folder, exist_ok=True)
        self.script_file = os.path.join(self.run_folder, "script.json")
        self.audio_file = os.path.join(self.run_folder, "voiceover.mp3")
        self.srt_file = os.path.join(self.run_folder, "subtitles.srt")

    def generate_script(self):
        """Step 1: Scripting (Engine Selection)"""
        if ENGINE_TYPE == "local_llama":
            return self.generate_script_local()
        else:
            return self.generate_script_api()

    def generate_script_api(self):
        """Step 1: Scripting (Hugging Face Inference API) - Standard Engine"""
        if not client:
            raise Exception("HF_TOKEN missing in .env. Get one at https://huggingface.co/settings/tokens")

        print(f"Generating script for: {self.topic} via HF {HF_MODEL}...")
        
        prompt = f"""
        Create a 10-segment video script for a 50-second social media video about '{self.topic}'.
        Total word count MUST be under 140 words.
        Output ONLY a JSON array of 10 objects. 
        Each object:
        1. 'segment_id': number (1-10)
        2. 'text': Narration (~14 words each)
        3. 'keywords': 3 portrait-stock keywords
        
        JSON only. No other text.
        """

        messages = [
            {"role": "user", "content": prompt}
        ]

        completion = client.chat.completions.create(
            model=HF_MODEL,
            messages=messages,
            max_tokens=1000
        )
        
        raw_text = completion.choices[0].message.content
        return self._parse_json(raw_text)

    def generate_script_local(self):
        """Step 1: Scripting (Local 1-Bit Llama-3) - Experimental Engine"""
        import torch
        from transformers import AutoModelForCausalLM, AutoTokenizer
        
        model_id = "HF1BitLLM/Llama3-8B-1.58-100B-tokens"
        print(f"Loading {model_id} (Experimental 1.58-bit)...")
        
        # CPU/GPU Check
        device = "cuda" if torch.cuda.is_available() else "cpu"
        dtype = torch.float16 if device == "cuda" else torch.float32
        
        tokenizer = AutoTokenizer.from_pretrained("meta-llama/Meta-Llama-3-8B-Instruct")
        model = AutoModelForCausalLM.from_pretrained(
            model_id, 
            device_map=device, 
            torch_dtype=dtype,
            low_cpu_mem_usage=True
        )

        prompt = f"Create a 10-segment JSON video script for '{self.topic}'. 5s each. Max 140 words. JSON only.\nAnswer:"
        input_ids = tokenizer.encode(prompt, return_tensors="pt").to(device)
        
        output = model.generate(input_ids, max_new_tokens=1000, do_sample=False)
        raw_text = tokenizer.decode(output[0], skip_special_tokens=True)
        return self._parse_json(raw_text)

    def _parse_json(self, raw_text):
        """Helper to extract JSON from LLM output"""
        try:
            start = raw_text.find('[')
            end = raw_text.rfind(']') + 1
            script_data = json.loads(raw_text[start:end])
            
            with open(self.script_file, "w") as f:
                json.dump(script_data, f, indent=2)
            
            print(f"Script saved to {self.script_file}")
            return script_data
        except Exception as e:
            print(f"Failed to parse JSON: {e}")
            print(f"Raw Output: {raw_text}")
            raise

    async def generate_voiceover(self, script):
        """Step 2: Voice & Subtitles (Edge-TTS)"""
        print("Generating voiceover and SRT...")
        full_text = " ".join([s['text'] for s in script])
        
        communicate = edge_tts.Communicate(full_text, TTS_VOICE)
        await communicate.save(self.audio_file)
        
        # Simple SRT Generation (5.0s per segment)
        srt_content = ""
        for i, seg in enumerate(script):
            start_s = i * 5
            end_s = (i + 1) * 5
            
            def format_time(seconds):
                h = int(seconds // 3600)
                m = int((seconds % 3600) // 60)
                s = int(seconds % 60)
                ms = int((seconds * 1000) % 1000)
                return f"{h:02}:{m:02}:{s:02},{ms:03}"

            srt_content += f"{i+1}\n"
            srt_content += f"{format_time(start_s)} --> {format_time(end_s)}\n"
            srt_content += f"{seg['text']}\n\n"

        with open(self.srt_file, "w") as f:
            f.write(srt_content)
        
        print(f"Audio saved to {self.audio_file}")
        print(f"SRT saved to {self.srt_file}")

    def download_visuals(self, script):
        """Step 3: Visuals (Pexels API)"""
        print("Searching Pexels for portrait clips...")
        headers = {"Authorization": PEXELS_API_KEY}
        
        for i, seg in enumerate(script):
            segment_id = seg['segment_id']
            keywords = seg['keywords']
            url = f"https://api.pexels.com/videos/search?query={keywords}&orientation=portrait&per_page=1"
            
            response = requests.get(url, headers=headers)
            if response.status_code != 200:
                print(f"Pexels Error (Seg {segment_id}): {response.text}")
                continue
                
            data = response.json()
            if not data['videos']:
                print(f"No video found for: {keywords}")
                continue
                
            # Get the best vertical file (typically the first one with enough quality)
            video = data['videos'][0]
            video_files = video['video_files']
            
            # Filter for 1080x1920 or similar
            best_file = next((f for f in video_files if f['width'] >= 1080), video_files[0])
            video_url = best_file['link']
            
            filename = os.path.join(self.run_folder, f"clip_{segment_id}.mp4")
            print(f"Downloading clip {segment_id}: {keywords}...")
            
            with requests.get(video_url, stream=True) as v_res:
                with open(filename, "wb") as f:
                    for chunk in v_res.iter_content(chunk_size=1024*1024):
                        f.write(chunk)
            
            print(f"Saved {filename}")

    def assemble_video(self, script):
        """Step 4: Assembly (MoviePy v2)"""
        from moviepy import VideoFileClip, concatenate_videoclips, AudioFileClip, TextClip, CompositeVideoClip
        
        clips = []
        print("Assembling video clips...")
        
        for i, seg in enumerate(script):
            segment_id = seg['segment_id']
            video_path = os.path.join(self.run_folder, f"clip_{segment_id}.mp4")
            
            if not os.path.exists(video_path):
                print(f"Missing clip {segment_id}, skipping...")
                continue
                
            clip = VideoFileClip(video_path).subclipped(0, 5) # Snap to 5s
            
            # Basic Subtitle Overlay (Simple centered bottom)
            # MoviePy v2 requires a font (Arial/Roboto usually safe)
            # If ImageMagick is missing, this might fail unless using a logic that doesn't need it.
            txt = TextClip(
                text=seg['text'],
                font_size=50,
                color='white',
                stroke_color='black',
                stroke_width=2,
                method='caption',
                size=(clip.w * 0.8, None)
            ).with_duration(5).with_position(('center', clip.h * 0.8))
            
            final_segment = CompositeVideoClip([clip, txt])
            clips.append(final_segment)

        if not clips:
            print("No clips to assemble!")
            return

        final_video = concatenate_videoclips(clips)
        audio = AudioFileClip(self.audio_file)
        final_video = final_video.with_audio(audio)
        
        output_path = os.path.join(self.run_folder, "final_output.mp4")
        print(f"Rendering final output to {output_path}...")
        final_video.write_videofile(output_path, fps=24, codec="libx264", audio_codec="aac")
        print("Project complete!")

if __name__ == "__main__":
    # For testing scripting and TTS
    gen = VideoGenerator("General Business Tips")
    try:
        # Load script if it exists
        if os.path.exists(gen.script_file):
            with open(gen.script_file, "r") as f:
                data = json.load(f)
        else:
            data = gen.generate_script()
            asyncio.run(gen.generate_voiceover(data))
            
        gen.download_visuals(data)
        gen.assemble_video(data)
    except Exception as e:
        print(f"Error: {e}")
