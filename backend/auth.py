from fastapi import HTTPException, Header
from dotenv import load_dotenv
import os

load_dotenv(".env")

def verify_api_key(x_api_key: str = Header()):
    """
    Dependency to verify API key from X-API-Key header
    """
    project_api_key = os.getenv("PROJECT_API_KEY")
    
    if not project_api_key:
        raise HTTPException(
            status_code=500, 
            detail="API key not configured on server"
        )
    
    if x_api_key != project_api_key:
        raise HTTPException(
            status_code=401, 
            detail="Invalid API key"
        )
    
    return True
