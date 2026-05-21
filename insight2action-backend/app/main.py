import os
from dotenv import load_dotenv

# Load environment variables from .env file before anything else
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import analyze, simulate, execute

# Initialize the FastAPI application
app = FastAPI(
    title="Insight2Action API",
    description="Backend for Insight2Action mobile application",
    version="1.0.0"
)

# Configure CORS so the mobile app can connect during local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

# Include the routers
app.include_router(analyze.router, prefix="/api/v1", tags=["Analysis"])
app.include_router(simulate.router, prefix="/api/v1", tags=["Simulation"])
app.include_router(execute.router, prefix="/api/v1", tags=["Execution"])

# Health check route
@app.get("/")
async def root():
    return {
        "status": "ok",
        "message": "Insight2Action API is running."
    }
