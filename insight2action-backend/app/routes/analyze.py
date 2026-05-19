from fastapi import APIRouter
from app.schemas.analysis import AnalyzeRequest, AnalyzeResponse
from app.services.agent_orchestrator import run_agentic_workflow

router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_content(request: AnalyzeRequest):
    """
    Analyzes unstructured content and returns a structured insight and simulated action.
    Currently uses a deterministic mock multi-agent workflow.
    """
    # The 'request' is automatically validated by FastAPI/Pydantic
    # If 'content' is empty, FastAPI returns a 422 Error automatically
    
    # Process the content through our agentic orchestrator
    response_data = run_agentic_workflow(request.content)
    
    return response_data
