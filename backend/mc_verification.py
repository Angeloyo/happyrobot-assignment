from fastapi import APIRouter, Depends
import requests
import os
from dotenv import load_dotenv
from auth import verify_api_key

load_dotenv(".env")
router = APIRouter()

@router.get("/verify-mc/{mc_number}", dependencies=[Depends(verify_api_key)])
def verify_mc(mc_number: str):
    
    fmcsa_api_key = os.getenv("FMCSA_API_KEY")
    if not fmcsa_api_key:
        return {"error": "FMCSA_API_KEY not found in environment"}
    
    url = f"https://mobile.fmcsa.dot.gov/qc/services/carriers/docket-number/{mc_number}?webKey={fmcsa_api_key}"
    response = requests.get(url)
    data = response.json()
    
    if not data.get("content"):
        return {"eligible": False, "reason": "MC number not found"}
    
    carrier = data["content"][0]["carrier"]
    eligible = (carrier.get("allowedToOperate") == "Y" 
                # and carrier.get("statusCode") == "A" # ????
                )
    
    return {
        "eligible": eligible,
        "company_name": carrier.get("legalName"),
        "mc_number": mc_number,
        "dot_number": str(carrier.get("dotNumber")),
        "reason": "Carrier approved" if eligible else "Does not meet requirements"
    }
