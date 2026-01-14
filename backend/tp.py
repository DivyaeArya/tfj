from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, firestore, auth
import os
from pathlib import Path

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)




app = FastAPI(title="Auth Test API")

cred = credentials.Certificate("C:\\Users\\ninad\\Downloads\\ppt-maker-7f813-firebase-adminsdk-fbsvc-facb0c310f.json")
firebase_admin.initialize_app(cred)
db=firestore.client()


origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer(auto_error=False)

from fastapi import Depends, Header

from fastapi import Header, HTTPException
from firebase_admin import auth

def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")

    token = authorization.split(" ")[1]

    try:
        decoded_token = auth.verify_id_token(token)

        # Return useful user info
        return {
            "uid": decoded_token.get("uid"),
            "email": decoded_token.get("email"),
            "name": decoded_token.get("name"),          # Google / provider name
       
        }

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")



class PingResponse(BaseModel):
    status: str


@app.get("/health", response_model=PingResponse)
def health():
    return {"status": "healthy"}

#write this funcn with no logic just confirm login and send back user name
@app.post("/parse-resume")
async def parse_resume(
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user)
):

    safe_filename = f"{user['uid']}_{Path(file.filename).name}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())


    return {
        "success": True,
        "uid": user["uid"],
        "name": user["name"],
        "email": user["email"]
    }

