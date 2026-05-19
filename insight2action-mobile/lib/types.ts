export interface AnalyzeRequest {
  content: string;
}

export interface SimulationMock {
  type: string;
  title: string;
  priority: string;
  assigned_team: string;
  status: string;
  description: string;
}

export interface AnalyzeResponse {
  domain: string;
  key_insight: string;
  impact: string;
  severity: string;
  recommended_action: string;
  simulation: SimulationMock;
  confidence: number;
}

export interface AnalysisHistoryItem {
  id: string;
  contentPreview: string;
  originalContent: string;
  result: AnalyzeResponse;
  createdAt: string;
}
