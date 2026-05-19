import os
from dotenv import load_dotenv

# Load environment variables from .env file before anything else
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import analyze

# Initialize the FastAPI application
app = FastAPI(
    title="Insight2Action AI Backend",
    description="Backend API for converting unstructured content into clear decisions and simulated actions.",
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

# Include the analyze router
app.include_router(analyze.router)

# Health check route
@app.get("/")
async def root():
    return {
        "status": "ok",
        "message": "Insight2Action AI backend is running"
    }
