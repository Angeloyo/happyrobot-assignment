from fastapi import FastAPI
from mc_verification import router as mc_router

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "healthy"}

app.include_router(mc_router)
