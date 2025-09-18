from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mc_verification import router as mc_router
from loads import router as loads_router
from call_logs import router as call_logs_router

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy"}

app.include_router(mc_router)
app.include_router(loads_router)
app.include_router(call_logs_router)
