import os
import logging
from app.schemas.analysis import (
    AnalyzeResponse, SimulationMock, 
    Counterfactual, CounterfactualScenario, ProjectedImpact,
    ActionPack, GeneratedArtifact, ConfidenceBreakdown, ConfidenceFactor
)
from app.agents.content_understanding_agent import understand_content
from app.agents.domain_detection_agent import detect_domain
from app.agents.insight_extraction_agent import extract_insight
from app.agents.impact_analysis_agent import analyze_impact
from app.agents.action_recommendation_agent import recommend_action
from app.agents.action_simulation_agent import simulate_action
from app.services.ai_analysis_service import analyze_with_openai

logger = logging.getLogger(__name__)


def generate_mock_counterfactual(domain: str, severity: str, key_insight: str, recommended_action: str) -> Counterfactual:
    """Generate domain-specific counterfactual comparison for mock workflow."""
    d = domain.lower()
    
    if "cyber" in d or "security" in d:
        return Counterfactual(
            if_action_taken=CounterfactualScenario(
                summary="Security posture strengthened. Threat vectors blocked and monitoring enhanced.",
                risk_level="Low",
                projected_outcome="Risk reduced by ~85%. Attack surface minimized within 48 hours."
            ),
            if_no_action=CounterfactualScenario(
                summary="Vulnerability remains exploitable. Attackers may escalate to data exfiltration.",
                risk_level="Critical",
                projected_outcome="Breach probability increases by +60% over the next 7 days."
            )
        )
    elif "health" in d or "medical" in d:
        return Counterfactual(
            if_action_taken=CounterfactualScenario(
                summary="Patient capacity stabilized. Resource allocation optimized to handle demand.",
                risk_level="Low",
                projected_outcome="Wait times reduced by ~35%. Patient satisfaction improves."
            ),
            if_no_action=CounterfactualScenario(
                summary="Patient overflow risk increases. Staff burnout accelerates and care quality drops.",
                risk_level="High",
                projected_outcome="ER wait times may increase by additional +25% within 2 weeks."
            )
        )
    elif "education" in d or "academic" in d:
        return Counterfactual(
            if_action_taken=CounterfactualScenario(
                summary="Student engagement improves with targeted intervention. Pass rates recover.",
                risk_level="Low",
                projected_outcome="Pass rate improvement of +15-20% by end of semester."
            ),
            if_no_action=CounterfactualScenario(
                summary="Failure rates remain high. At-risk students continue to disengage.",
                risk_level="High",
                projected_outcome="Failure rate stays elevated. Dropout risk increases by +12%."
            )
        )
    elif "logistic" in d or "supply" in d or "shipping" in d:
        return Counterfactual(
            if_action_taken=CounterfactualScenario(
                summary="Supply chain bottleneck resolved. Delivery timelines return to normal.",
                risk_level="Low",
                projected_outcome="Fulfillment rate recovers to 95%+ within 1 week."
            ),
            if_no_action=CounterfactualScenario(
                summary="Delays compound. Customer satisfaction drops and order cancellations increase.",
                risk_level="High",
                projected_outcome="Revenue loss of -15% from delayed/cancelled orders."
            )
        )
    elif "finance" in d or "revenue" in d or "budget" in d:
        return Counterfactual(
            if_action_taken=CounterfactualScenario(
                summary="Financial controls strengthened. Revenue leakage identified and plugged.",
                risk_level="Medium",
                projected_outcome="+12% cost savings or revenue recovery projected."
            ),
            if_no_action=CounterfactualScenario(
                summary="Financial inefficiencies persist. Budget overruns continue unchecked.",
                risk_level="High",
                projected_outcome="-8% additional decline in margins expected."
            )
        )
    else:
        return Counterfactual(
            if_action_taken=CounterfactualScenario(
                summary="Issue addressed proactively. Operational efficiency improves.",
                risk_level="Low",
                projected_outcome="Measurable improvement expected within 1-2 weeks."
            ),
            if_no_action=CounterfactualScenario(
                summary="Problem persists and may escalate. Resource waste continues.",
                risk_level="High",
                projected_outcome="Issue severity likely to increase over the next 30 days."
            )
        )


def generate_mock_projected_impact(domain: str, severity: str) -> ProjectedImpact:
    """Generate domain-specific projected impact for mock workflow."""
    d = domain.lower()
    
    if "cyber" in d or "security" in d:
        return ProjectedImpact(
            expected_improvement="Threat detection and response capabilities enhanced",
            risk_reduction="Attack surface reduced by blocking identified vectors",
            operational_outcome="Security posture moves from reactive to proactive monitoring"
        )
    elif "health" in d:
        return ProjectedImpact(
            expected_improvement="Patient throughput and care quality metrics improve",
            risk_reduction="Patient overflow and staff burnout risks mitigated",
            operational_outcome="ER and department operations return to sustainable levels"
        )
    elif "education" in d:
        return ProjectedImpact(
            expected_improvement="Student engagement and academic performance recover",
            risk_reduction="Dropout and failure risks reduced through early intervention",
            operational_outcome="Academic programs meet target completion rates"
        )
    elif "logistic" in d or "supply" in d:
        return ProjectedImpact(
            expected_improvement="Order fulfillment rates and delivery speed restored",
            risk_reduction="Customer churn risk reduced by resolving delays",
            operational_outcome="Supply chain returns to target efficiency levels"
        )
    elif "finance" in d:
        return ProjectedImpact(
            expected_improvement="Revenue leakage plugged and cost controls strengthened",
            risk_reduction="Budget overrun risk reduced through tighter monitoring",
            operational_outcome="Financial performance aligns with quarterly targets"
        )
    else:
        return ProjectedImpact(
            expected_improvement="Core operational metrics show measurable improvement",
            risk_reduction="Primary risk factors identified and mitigation in progress",
            operational_outcome="Operations move toward target performance levels"
        )


def generate_mock_confidence_breakdown(domain: str, severity: str, confidence: float) -> ConfidenceBreakdown:
    """Generate domain-specific confidence breakdown for mock workflow."""
    d = domain.lower()
    
    if "cyber" in d or "security" in d:
        return ConfidenceBreakdown(
            reasoning="Detected strong indicators of compromise matching known brute-force attack vectors with high certainty.",
            factors=[
                ConfidenceFactor(name="Evidence Strength", score=0.95, description="Authentic raw IP and auth log patterns extracted from the input data."),
                ConfidenceFactor(name="Source Reliability", score=0.90, description="Firewall and system access logs provide direct observation of threat activity."),
                ConfidenceFactor(name="Pattern Matching", score=0.98, description="Highly aligned with standard brute-force credential stuffing signatures.")
            ]
        )
    elif "health" in d or "medical" in d:
        return ConfidenceBreakdown(
            reasoning="Capacity constraints and patient admission trends indicate elevated department strain, backed by direct metrics.",
            factors=[
                ConfidenceFactor(name="Evidence Strength", score=0.88, description="High availability of patient admission numbers and department wait times."),
                ConfidenceFactor(name="Source Reliability", score=0.85, description="Clinical operational dashboards provide direct performance indicators."),
                ConfidenceFactor(name="Clinical Alignment", score=0.92, description="Strong correlation with standard patient flow bottleneck models.")
            ]
        )
    elif "education" in d or "academic" in d:
        return ConfidenceBreakdown(
            reasoning="Student engagement logs show high variance, but persistent low participation predicts academic risk.",
            factors=[
                ConfidenceFactor(name="Evidence Strength", score=0.82, description="LMS engagement and grade metrics show clear downward trends."),
                ConfidenceFactor(name="Predictive Validity", score=0.85, description="Historically, engagement drops of this level correlate with academic warning states."),
                ConfidenceFactor(name="Data Completeness", score=0.75, description="Some missing attendance records, but grade trends provide sufficient evidence.")
            ]
        )
    elif "logistic" in d or "supply" in d or "shipping" in d:
        return ConfidenceBreakdown(
            reasoning="Severe bottleneck detected at the central distribution hub, with delivery delays matching disruption models.",
            factors=[
                ConfidenceFactor(name="Evidence Strength", score=0.92, description="Exact delayed order counts and transit times extracted from carrier sheets."),
                ConfidenceFactor(name="Source Reliability", score=0.88, description="Real-time shipping and dispatch logs provide high fidelity data."),
                ConfidenceFactor(name="Disruption Modeling", score=0.90, description="High similarity to previous port/hub bottlenecks in our history.")
            ]
        )
    elif "finance" in d or "revenue" in d or "budget" in d:
        return ConfidenceBreakdown(
            reasoning="Identified substantial anomalies in cost items and vendor spending that deviate from budget allocations.",
            factors=[
                ConfidenceFactor(name="Evidence Strength", score=0.88, description="Transaction logs and ledger records match invoice discrepancies."),
                ConfidenceFactor(name="Financial Auditing", score=0.85, description="Direct ledger mappings isolate the leak to vendor overpayments."),
                ConfidenceFactor(name="Trend Analysis", score=0.92, description="Highly anomalous divergence from standard historical quarterly spending.")
            ]
        )
    else:
        return ConfidenceBreakdown(
            reasoning="Standard pattern detection identified actionable anomalies in operational logs, with sufficient evidence to proceed.",
            factors=[
                ConfidenceFactor(name="Evidence Strength", score=0.85, description="Clear indicators of process inefficiency or errors in the text input."),
                ConfidenceFactor(name="Context Clarity", score=0.80, description="Unstructured context is clear and describes a well-defined operational issue."),
                ConfidenceFactor(name="Recommended Fit", score=0.90, description="Standard operational protocols exist for this category of issue.")
            ]
        )


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
    
    # 7. Counterfactual Comparison Agent (Step 7)
    counterfactual = generate_mock_counterfactual(domain, severity, key_insight, recommended_action)
    projected_impact = generate_mock_projected_impact(domain, severity)
    
    # 8. Action Pack Generator (Step 8)
    action_pack = generate_mock_action_pack(domain, severity, key_insight, recommended_action, priority)
    
    # 9. Confidence Breakdown Generator (Step 9)
    confidence_breakdown = generate_mock_confidence_breakdown(domain, severity, domain_result["domain_confidence"])
    
    why_this_action = f"This action is recommended because {key_insight.lower()} which directly impacts {domain.lower()} performance."
    alternative_actions = [
        "Conduct a deeper investigation before taking action.",
        "Escalate to senior management for review.",
        "Implement a partial workaround to mitigate immediate risks."
    ]

    # 10. Final Response Builder
    return AnalyzeResponse(
        domain=domain,
        key_insight=key_insight,
        impact=impact,
        severity=severity,
        recommended_action=recommended_action,
        simulation=SimulationMock(**simulation_result),
        confidence=domain_result["domain_confidence"],
        counterfactual=counterfactual,
        projected_impact=projected_impact,
        action_pack=action_pack,
        confidence_breakdown=confidence_breakdown,
        why_this_action=why_this_action,
        alternative_actions=alternative_actions,
    )

def run_custom_simulation(analysis_id: str, custom_action: str) -> SimulationMock:
    # Minimal mock implementation for custom simulation
    return SimulationMock(
        type="custom_intervention",
        title="Custom Action Simulation",
        priority="High",
        assigned_team="Cross-functional Team",
        status="Pending Review",
        description=f"Simulating custom action: {custom_action}"
    )

def run_regenerate_action(analysis_id: str, feedback: str) -> dict:
    return {
        "recommended_action": f"Adjusted action based on feedback: '{feedback}'",
        "why_this_action": "This alternative was generated to address the user's specific feedback and constraints.",
        "alternative_actions": [
            "Explore vendor alternatives.",
            "Adjust the implementation timeline.",
            "Reallocate budget from other departments."
        ]
    }


def generate_mock_action_pack(domain: str, severity: str, key_insight: str, recommended_action: str, priority: str) -> ActionPack:
    """Generate domain-specific action pack for mock workflow."""
    d = domain.lower()
    
    if "cyber" in d or "security" in d:
        return ActionPack(
            action_title="Investigate & Remediate Security Threat",
            action_summary=f"Execute security incident response: {recommended_action}",
            priority=priority,
            approval_status="Pending Approval",
            responsible_team="Security Operations",
            estimated_completion="4-8 hours",
            generated_artifact=GeneratedArtifact(
                type="Incident Ticket",
                title="Security Incident Response Ticket",
                content=f"Priority {priority} security incident detected. Key finding: {key_insight} Immediate containment and investigation required. Escalation path: SOC Lead → CISO."
            ),
            next_steps=[
                "Review incident ticket and validate threat assessment",
                "Approve containment measures and IP blocking",
                "Execute forensic analysis on affected systems",
                "Update firewall rules and monitoring alerts",
                "Document findings and close incident report"
            ]
        )
    elif "health" in d or "medical" in d:
        return ActionPack(
            action_title="Implement Patient Care Optimization Plan",
            action_summary=f"Address healthcare operations: {recommended_action}",
            priority=priority,
            approval_status="Pending Approval",
            responsible_team="Hospital Operations",
            estimated_completion="1-3 business days",
            generated_artifact=GeneratedArtifact(
                type="Capacity Allocation Plan",
                title="Patient Flow & Capacity Optimization Plan",
                content=f"Rebalance patient load across departments. Key issue: {key_insight} Target: reduce wait times by 30% and optimize staff scheduling for peak hours."
            ),
            next_steps=[
                "Review capacity allocation plan with department heads",
                "Approve staff schedule adjustments",
                "Implement patient triage protocol updates",
                "Monitor wait times and patient satisfaction metrics"
            ]
        )
    elif "education" in d or "academic" in d:
        return ActionPack(
            action_title="Launch Academic Intervention Program",
            action_summary=f"Deploy educational support initiative: {recommended_action}",
            priority=priority,
            approval_status="Pending Approval",
            responsible_team="Academic Coordination",
            estimated_completion="3-5 business days",
            generated_artifact=GeneratedArtifact(
                type="Remedial Class Plan",
                title="Student Support & Remedial Program Plan",
                content=f"Target at-risk students with additional support. Issue: {key_insight} Plan includes extra tutoring sessions, mentoring programs, and progress tracking for identified students."
            ),
            next_steps=[
                "Review remedial class plan with academic leads",
                "Approve resource allocation for tutoring",
                "Notify students and schedule intervention sessions",
                "Set up weekly progress tracking dashboard",
                "Evaluate program effectiveness after 2 weeks"
            ]
        )
    elif "logistic" in d or "supply" in d or "shipping" in d:
        return ActionPack(
            action_title="Execute Supply Chain Recovery Plan",
            action_summary=f"Resolve logistics bottleneck: {recommended_action}",
            priority=priority,
            approval_status="Pending Approval",
            responsible_team="Supply Chain Operations",
            estimated_completion="1-2 business days",
            generated_artifact=GeneratedArtifact(
                type="Operational Plan",
                title="Supply Chain Recovery & Optimization Plan",
                content=f"Restore fulfillment rates to 95%+. Issue: {key_insight} Deploy backup fleet, reroute critical shipments, and prioritize delayed orders for immediate processing."
            ),
            next_steps=[
                "Review recovery plan with logistics manager",
                "Approve backup fleet deployment",
                "Prioritize and reroute delayed shipments",
                "Notify affected customers with updated ETAs",
                "Monitor fulfillment rate recovery daily"
            ]
        )
    elif "finance" in d or "revenue" in d or "budget" in d:
        return ActionPack(
            action_title="Implement Financial Controls & Recovery",
            action_summary=f"Address financial issue: {recommended_action}",
            priority=priority,
            approval_status="Pending Approval",
            responsible_team="Finance Operations",
            estimated_completion="3-5 business days",
            generated_artifact=GeneratedArtifact(
                type="Financial Review Report",
                title="Revenue Recovery & Cost Control Plan",
                content=f"Plug revenue leakage and strengthen controls. Issue: {key_insight} Implement tighter budget monitoring, review vendor contracts, and optimize cost allocation."
            ),
            next_steps=[
                "Review financial analysis with CFO",
                "Approve budget adjustment recommendations",
                "Implement cost control measures",
                "Schedule weekly financial health check-ins"
            ]
        )
    else:
        return ActionPack(
            action_title="Execute Operational Improvement Plan",
            action_summary=f"Address operational issue: {recommended_action}",
            priority=priority,
            approval_status="Pending Approval",
            responsible_team="Operations Team",
            estimated_completion="3-5 business days",
            generated_artifact=GeneratedArtifact(
                type="Review Ticket",
                title="Operational Review & Action Plan",
                content=f"Comprehensive review required. Issue: {key_insight} Develop targeted response plan, assign ownership, and establish monitoring criteria for resolution."
            ),
            next_steps=[
                "Review action plan with team lead",
                "Approve resource allocation",
                "Assign task ownership and deadlines",
                "Monitor progress and report weekly"
            ]
        )
