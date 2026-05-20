from pydantic import BaseModel, Field
from typing import List, Optional

class AnalyzeRequest(BaseModel):
    content: str = Field(..., min_length=1, description="The unstructured text to analyze.")
    file_name: Optional[str] = Field(None, description="Original file name if uploaded.")
    file_type: Optional[str] = Field(None, description="MIME type of the uploaded file.")

class SimulateCustomActionRequest(BaseModel):
    analysis_id: str
    custom_action: str

class RegenerateActionRequest(BaseModel):
    analysis_id: str
    feedback: str

class RegenerateActionResponse(BaseModel):
    recommended_action: str
    why_this_action: Optional[str] = None
    alternative_actions: Optional[List[str]] = None

class SimulationMock(BaseModel):
    type: str
    title: str
    priority: str
    assigned_team: str
    status: str
    description: str

class ImprovementStep(BaseModel):
    step_number: int
    title: str
    description: str
    expected_outcome: str
    timeline: str

class DetailedInsight(BaseModel):
    category: str
    finding: str
    evidence: str
    risk_level: str

class CounterfactualScenario(BaseModel):
    summary: str
    risk_level: str
    projected_outcome: str

class Counterfactual(BaseModel):
    if_action_taken: CounterfactualScenario
    if_no_action: CounterfactualScenario

class ProjectedImpact(BaseModel):
    expected_improvement: str
    risk_reduction: str
    operational_outcome: str

class GeneratedArtifact(BaseModel):
    type: str
    title: str
    content: str

class ActionPack(BaseModel):
    action_title: str
    action_summary: str
    priority: str
    approval_status: str
    responsible_team: str
    estimated_completion: str
    generated_artifact: GeneratedArtifact
    next_steps: List[str]

class ConfidenceFactor(BaseModel):
    name: str
    score: float
    description: str

class ConfidenceBreakdown(BaseModel):
    reasoning: str
    factors: List[ConfidenceFactor]

class AnalyzeResponse(BaseModel):
    domain: str
    key_insight: str
    impact: str
    severity: str
    recommended_action: str
    simulation: SimulationMock
    confidence: float
    # Enhanced fields
    detailed_insights: Optional[List[DetailedInsight]] = None
    improvement_steps: Optional[List[ImprovementStep]] = None
    executive_summary: Optional[str] = None
    data_quality_score: Optional[float] = None
    # Step 7: Counterfactual comparison
    counterfactual: Optional[Counterfactual] = None
    projected_impact: Optional[ProjectedImpact] = None
    # Step 8: Universal Action Pack
    action_pack: Optional[ActionPack] = None
    # Step 9: Decision Confidence Breakdown
    confidence_breakdown: Optional[ConfidenceBreakdown] = None
    # Step 7: Decision Approval
    why_this_action: Optional[str] = None
    alternative_actions: Optional[List[str]] = None
