import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("No GOOGLE_API_KEY found")
    exit(1)

genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

try:
    print("Testing Gemini connection with topic 'Success Mindset'...")
    response = model.generate_content("Create a 1-sentence success tip.")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
