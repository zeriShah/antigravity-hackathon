from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.agents.execution_agent import execute_action_plan

router = APIRouter()

class ExecuteRequest(BaseModel):
    domain: str
    action_title: str
    responsible_team: str

@router.post("/execute")
async def execute_action(request: ExecuteRequest):
    """
    Endpoint to trigger autonomous agent execution.
    Returns a Server-Sent Events (SSE) stream of execution logs.
    """
    return StreamingResponse(
        execute_action_plan(request.domain, request.action_title, request.responsible_team),
        media_type="text/event-stream"
    )
