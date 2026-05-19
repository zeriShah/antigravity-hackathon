def recommend_action(domain: str, key_insight: str, severity: str) -> dict:
    if domain == "Cybersecurity":
        action = "Create a security incident ticket and force password reset for affected accounts."
    elif domain == "Education":
        action = "Schedule a meeting with academic counselors and send attendance warnings."
    elif domain == "Logistics":
        action = "Reroute pending shipments to backup warehouses and notify affected customers."
    elif domain == "Healthcare":
        action = "Issue an urgent restock order and reschedule non-critical appointments."
    elif domain == "Finance":
        action = "Freeze affected accounts temporarily and run a full transaction audit."
    else:
        action = "Log the event for next week's operational review."
        
    priority = "High" if severity in ["High", "Critical"] else "Low"
        
    return {
        "recommended_action": action,
        "action_reason": f"Required to mitigate {severity.lower()} severity impact.",
        "priority": priority
    }
