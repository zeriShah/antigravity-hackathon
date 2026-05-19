from pydantic import BaseModel, Field

class AnalyzeRequest(BaseModel):
    content: str = Field(..., min_length=1, description="The unstructured text to analyze.")

class SimulationMock(BaseModel):
    type: str
    title: str
    priority: str
    assigned_team: str
    status: str
    description: str

class AnalyzeResponse(BaseModel):
    domain: str
    key_insight: str
    impact: str
    severity: str
    recommended_action: str
    simulation: SimulationMock
    confidence: float
