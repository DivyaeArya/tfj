import os
import json
import tempfile
import numpy as np
import pytesseract
from pdf2image import convert_from_path
from groq import Groq
from google import genai
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict, List

# Load environment variables
load_dotenv()

# Tesseract and Poppler paths
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
POPPLER_PATH = r"D:\Release-25.12.0-0\poppler-25.12.0\Library\bin"
SYSTEM_PROMPT_PATH = r"D:\Codes\Job-recommender\system_prompt.txt"
DATABASE_PATH = os.path.join(os.path.dirname(__file__), "data", "database_with_embeddings.json")

app = FastAPI(title="Resume Parser & Job Recommendation API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:8080", "http://localhost:8081", "http://127.0.0.1:8080", "http://127.0.0.1:8081"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class SaveProfileRequest(BaseModel):
    job_dict: Dict[str, Any]

class RankedJob(BaseModel):
    id: str
    title: str
    company: str
    tags: List[str]
    location: str
    date_posted: str
    apply_link: str
    description_snippet: str
    score: float


def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from PDF using OCR."""
    try:
        images = convert_from_path(pdf_path, poppler_path=POPPLER_PATH)
        text_content = ""
        for image in images:
            text_content += pytesseract.image_to_string(image)
        return text_content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF extraction error: {str(e)}")


def parse_resume_with_llm(text_content: str) -> dict:
    """Parse resume text to JSON using Groq LLM."""
    api_key = os.getenv("GROQ_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GROQ_KEY not found in environment")
    
    if not os.path.exists(SYSTEM_PROMPT_PATH):
        raise HTTPException(status_code=500, detail="system_prompt.txt not found")

    with open(SYSTEM_PROMPT_PATH, "r", encoding="utf-8") as f:
        system_prompt = f.read()

    client = Groq(api_key=api_key)

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text_content}
            ],
            temperature=0,
            response_format={"type": "json_object"}
        )
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM parsing error: {str(e)}")


def create_embedding(text: str) -> np.ndarray:
    """Create embedding using Gemini text-embedding-004."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not found in environment")
    
    client = genai.Client(api_key=api_key)
    
    try:
        response = client.models.embed_content(
            model="text-embedding-004",
            contents=text
        )
        return np.array(response.embeddings[0].values).reshape(1, -1)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Embedding error: {str(e)}")


def load_job_database() -> List[dict]:
    """Load the job database with embeddings."""
    if not os.path.exists(DATABASE_PATH):
        raise HTTPException(status_code=500, detail=f"Database not found at {DATABASE_PATH}")
    
    with open(DATABASE_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)


def rank_jobs_by_similarity(job_dict: dict, database: List[dict], top_k: int = 50) -> List[dict]:
    """Rank jobs by cosine similarity to the job_dict embedding."""
    # Create text representation of job_dict for embedding
    job_text = json.dumps(job_dict, sort_keys=True)
    query_embedding = create_embedding(job_text)
    
    results = []
    for item in database:
        if 'embedding' in item:
            item_embedding = np.array(item['embedding']).reshape(1, -1)
            score = cosine_similarity(query_embedding, item_embedding)[0][0]
            
            # Create job result without embedding (too large to send)
            job_result = {
                "id": item.get("id", ""),
                "title": item.get("title", ""),
                "company": item.get("company", ""),
                "tags": item.get("tags", []),
                "location": item.get("location", ""),
                "date_posted": item.get("date_posted", ""),
                "apply_link": item.get("apply_link", ""),
                "description_snippet": item.get("description_snippet", ""),
                "score": float(score)
            }
            results.append(job_result)
    
    # Sort by score descending and return top_k
    results.sort(key=lambda x: x['score'], reverse=True)
    return results[:top_k]


@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    """
    Upload a resume PDF and get parsed info_dict and job_dict.
    """
    # Validate file type
    if not file.filename.lower().endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
    
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
        content = await file.read()
        tmp_file.write(content)
        tmp_path = tmp_file.name
    
    try:
        # Extract text from PDF
        raw_text = extract_text_from_pdf(tmp_path)
        
        if not raw_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        
        # Parse with LLM
        parsed_data = parse_resume_with_llm(raw_text)
        
        # Get both info_dict and job_dict
        info_dict = parsed_data.get("info_dict", {})
        job_dict = parsed_data.get("job_dict", {})
        new_keys_tracker = parsed_data.get("new_keys_tracker", {})
        
        return {
            "success": True,
            "info_dict": info_dict,
            "job_dict": job_dict,
            "dynamic_keys": {
                "info_dict": new_keys_tracker.get("info_dict", []),
                "job_dict": new_keys_tracker.get("job_dict", [])
            }
        }
        
    finally:
        # Clean up temp file
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


@app.post("/save-profile")
async def save_profile(request: SaveProfileRequest):
    """
    Save profile and get ranked job recommendations.
    
    Takes job_dict, creates embedding, and returns jobs ranked by similarity.
    """
    try:
        # Load database
        database = load_job_database()
        
        # Rank jobs by similarity
        ranked_jobs = rank_jobs_by_similarity(request.job_dict, database)
        
        return {
            "success": True,
            "ranked_jobs": ranked_jobs,
            "total_jobs": len(ranked_jobs)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
