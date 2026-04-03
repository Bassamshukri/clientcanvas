import time
import os
import shutil
from supabase import create_client, Client
from auto_shorts import VideoGenerator
from dotenv import load_dotenv

# Load environment variables from the root .env.local if possible, else current .env
load_dotenv("../../.env.local")
load_dotenv()

URL: str = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY") # Use Service Role Key for bypass RLS

if not URL or not KEY:
    print("Error: Missing Supabase credentials in .env")
    exit(1)

supabase: Client = create_client(URL, KEY)

def poll_jobs():
    print("Video AI Worker started. Polling for jobs...")
    
    while True:
        try:
            # Look for pending jobs
            res = supabase.table("video_jobs").select("*").eq("status", "pending").order("created_at").limit(1).execute()
            
            if res.data and len(res.data) > 0:
                job = res.data[0]
                process_job(job)
            else:
                # No jobs, wait 5 seconds
                time.sleep(5)
        except Exception as e:
            print(f"Polling error: {e}")
            time.sleep(10)

def process_job(job):
    job_id = job['id']
    topic = job['topic']
    
    print(f"Processing job {job_id} for topic: {topic}")
    
    # Update status to processing
    supabase.table("video_jobs").update({"status": "processing"}).eq("id", job_id).execute()
    
    try:
        generator = VideoGenerator()
        
        # 1. Generate Script
        spec = generator.generate_script(topic)
        
        # 2. Download Assets
        clips_dir = generator.download_videos(spec)
        
        # 3. Generate Audio
        audio_path = generator.generate_narration(spec)
        
        # 4. Assemble Video
        final_video_path = generator.assemble_video(spec, clips_dir, audio_path)
        
        if os.path.exists(final_video_path):
            # Upload to Supabase Storage
            file_name = f"{job_id}.mp4"
            with open(final_video_path, 'rb') as f:
                supabase.storage.from_("videos").upload(
                    path=file_name,
                    file=f,
                    file_options={"content-type": "video/mp4", "x-upsert": "true"}
                )
            
            # Get Public URL
            video_url = supabase.storage.from_("videos").get_public_url(file_name)
            
            # Update job as completed
            supabase.table("video_jobs").update({
                "status": "completed",
                "video_url": video_url
            }).eq("id", job_id).execute()
            
            print(f"Job {job_id} completed successfully!")
        else:
            raise Exception("Video assembly failed - output file not found.")

    except Exception as e:
        print(f"Error processing job {job_id}: {e}")
        supabase.table("video_jobs").update({
            "status": "failed",
            "error_message": str(e)
        }).eq("id", job_id).execute()

if __name__ == "__main__":
    poll_jobs()
