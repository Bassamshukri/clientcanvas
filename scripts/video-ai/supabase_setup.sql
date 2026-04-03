-- Create the video_jobs table
CREATE TABLE IF NOT EXISTS video_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  topic TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  video_url TEXT,
  error_message TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE video_jobs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read jobs (for demo/simplicity, you might want to restrict this later)
CREATE POLICY "Public Read Access" ON video_jobs FOR SELECT USING (true);

-- Allow the service role to do everything
CREATE POLICY "Service Role Full Access" ON video_jobs FOR ALL USING (auth.role() = 'service_role');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to call the function
CREATE TRIGGER update_video_jobs_updated_at
BEFORE UPDATE ON video_jobs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- NOTE: You must manually create a bucket named 'videos' in the Supabase Storage dashboard
-- and set it to 'Public' if you want anonymous access to the videos.
