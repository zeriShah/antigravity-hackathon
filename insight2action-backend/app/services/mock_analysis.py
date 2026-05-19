from app.schemas.analysis import AnalyzeResponse, SimulationMock

def get_mock_analysis(content: str) -> AnalyzeResponse:
    """
    Simulates an AI processing the unstructured content and returning a structured decision.
    For this foundation step, we return a static mock response.
    """
    return AnalyzeResponse(
        domain="Cybersecurity",
        key_insight="Multiple failed login attempts were detected from unknown locations.",
        impact="This may indicate a brute-force attack or compromised credentials.",
        severity="High",
        recommended_action="Create a security incident ticket and force password reset for affected accounts.",
        simulation=SimulationMock(
            type="mock_ticket",
            title="Suspicious login activity detected",
            priority="High",
            assigned_team="Security Operations",
            status="Open",
            description="A mock security ticket has been created for investigation."
        ),
        confidence=0.87
    )
