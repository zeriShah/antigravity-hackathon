import os
import logging
from app.schemas.analysis import AnalyzeResponse, SimulationMock
from app.agents.content_understanding_agent import understand_content
from app.agents.domain_detection_agent import detect_domain
from app.agents.insight_extraction_agent import extract_insight
from app.agents.impact_analysis_agent import analyze_impact
from app.agents.action_recommendation_agent import recommend_action
from app.agents.action_simulation_agent import simulate_action
from app.services.ai_analysis_service import analyze_with_openai

logger = logging.getLogger(__name__)

def run_agentic_workflow(content: str) -> AnalyzeResponse:
    use_real_ai = os.environ.get("USE_REAL_AI", "false").lower() == "true"
    api_key = os.environ.get("OPENAI_API_KEY")
    
    if use_real_ai and api_key and api_key != "your_openai_api_key_here":
        try:
            # Try to get analysis from real AI
            ai_result_dict = analyze_with_openai(content)
            return AnalyzeResponse(**ai_result_dict)
        except Exception as e:
            # Log the error safely without leaking sensitive info
            logger.error(f"Real AI analysis failed, falling back to mock workflow. Error: {str(e)}")
            # Fall through to mock workflow
            
    # --- MOCK WORKFLOW FALLBACK ---
    
    # 1. Content Understanding Agent
    understanding_result = understand_content(content)
    
    # 2. Domain Detection Agent
    domain_result = detect_domain(content, understanding_result)
    domain = domain_result["domain"]
    
    # 3. Insight Extraction Agent
    insight_result = extract_insight(content, domain)
    key_insight = insight_result["key_insight"]
    
    # 4. Impact Analysis Agent
    impact_result = analyze_impact(domain, key_insight)
    impact = impact_result["impact"]
    severity = impact_result["severity"]
    
    # 5. Action Recommendation Agent
    action_result = recommend_action(domain, key_insight, severity)
    recommended_action = action_result["recommended_action"]
    priority = action_result["priority"]
    
    # 6. Action Simulation Agent
    simulation_result = simulate_action(domain, recommended_action, priority)
    
    # 7. Optional Internal Trace (For debugging the agentic flow)
    _trace = {
        "understanding": understanding_result,
        "domain": domain_result,
        "insight": insight_result,
        "impact": impact_result,
        "action": action_result,
        "simulation": simulation_result
    }
    
    # 8. Final Response Builder (Maps back to our typed Pydantic Model)
    return AnalyzeResponse(
        domain=domain,
        key_insight=key_insight,
        impact=impact,
        severity=severity,
        recommended_action=recommended_action,
        simulation=SimulationMock(**simulation_result),
        confidence=domain_result["domain_confidence"]
    )
