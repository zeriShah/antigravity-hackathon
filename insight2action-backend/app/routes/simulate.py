import logging
from fastapi import APIRouter, HTTPException
from app.schemas.analysis import SimulateCustomActionRequest, SimulationMock
from app.services.agent_orchestrator import run_custom_simulation

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/simulate-custom-action", response_model=SimulationMock)
async def simulate_custom_action(request: SimulateCustomActionRequest):
    """
    Simulates a custom user-modified action and returns the simulation results.
    """
    try:
        response_data = run_custom_simulation(request.analysis_id, request.custom_action)
        return response_data
    except Exception as e:
        logger.error(f"Error simulating custom action: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to simulate action: {str(e)}")
