export interface AnalyzeRequest {
  content: string;
  file_name?: string;
  file_type?: string;
}

export interface SimulationMock {
  type: string;
  title: string;
  priority: string;
  assigned_team: string;
  status: string;
  description: string;
}

export interface DetailedInsight {
  category: string;
  finding: string;
  evidence: string;
  risk_level: string;
}

export interface ImprovementStep {
  step_number: number;
  title: string;
  description: string;
  expected_outcome: string;
  timeline: string;
}

// Step 7: Counterfactual Comparison
export interface CounterfactualScenario {
  summary: string;
  risk_level: string;
  projected_outcome: string;
}

export interface Counterfactual {
  if_action_taken: CounterfactualScenario;
  if_no_action: CounterfactualScenario;
}

export interface ProjectedImpact {
  expected_improvement: string;
  risk_reduction: string;
  operational_outcome: string;
}

// Step 8: Universal Action Pack
export interface GeneratedArtifact {
  type: string;
  title: string;
  content: string;
}

export interface ActionPack {
  action_title: string;
  action_summary: string;
  priority: string;
  approval_status: string;
  responsible_team: string;
  estimated_completion: string;
  generated_artifact: GeneratedArtifact;
  next_steps: string[];
}

// Step 9: Decision Confidence Breakdown
export interface ConfidenceFactor {
  name: string;
  score: number;
  description: string;
}

export interface ConfidenceBreakdown {
  reasoning: string;
  factors: ConfidenceFactor[];
}

export interface AnalyzeResponse {
  domain: string;
  key_insight: string;
  impact: string;
  severity: string;
  recommended_action: string;
  simulation: SimulationMock;
  confidence: number;
  // Enhanced fields
  detailed_insights?: DetailedInsight[];
  improvement_steps?: ImprovementStep[];
  executive_summary?: string;
  data_quality_score?: number;
  // Step 7: Counterfactual comparison
  counterfactual?: Counterfactual;
  projected_impact?: ProjectedImpact;
  // Step 8: Universal Action Pack
  action_pack?: ActionPack;
  // Step 9: Decision Confidence Breakdown
  confidence_breakdown?: ConfidenceBreakdown;
}

export interface AnalysisHistoryItem {
  id: string;
  contentPreview: string;
  originalContent: string;
  result: AnalyzeResponse;
  createdAt: string;
  fileName?: string;
}
