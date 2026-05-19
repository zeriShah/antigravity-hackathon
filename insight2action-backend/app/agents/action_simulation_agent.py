def simulate_action(domain: str, recommended_action: str, priority: str) -> dict:
    if domain == "Cybersecurity":
        sim_type = "mock_ticket"
        title = "Suspicious activity detected"
        team = "Security Operations"
    elif domain == "Education":
        sim_type = "mock_notification"
        title = "Automated Counsel Warning"
        team = "Academic Support"
    elif domain == "Logistics":
        sim_type = "mock_dashboard_update"
        title = "Rerouting Active Shipments"
        team = "Logistics Coordinator"
    elif domain == "Healthcare":
        sim_type = "mock_alert"
        title = "Urgent Supply Restock"
        team = "Procurement"
    elif domain == "Finance":
        sim_type = "mock_ticket"
        title = "Account Freeze Audit"
        team = "Fraud Prevention"
    else:
        sim_type = "mock_log"
        title = "General Ops Review"
        team = "Operations"
        
    return {
        "type": sim_type,
        "title": title,
        "priority": priority,
        "assigned_team": team,
        "status": "Open",
        "description": f"Simulated execution of: {recommended_action}"
    }
