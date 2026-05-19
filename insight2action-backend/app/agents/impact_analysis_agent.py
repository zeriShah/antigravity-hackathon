def analyze_impact(domain: str, key_insight: str) -> dict:
    if domain == "Cybersecurity":
        impact = "Potential data breach and compromised credentials."
        severity = "Critical" if "firewall" in key_insight.lower() else "High"
    elif domain == "Education":
        impact = "Lower overall graduation rates and reduced school funding."
        severity = "Medium"
    elif domain == "Logistics":
        impact = "Customer dissatisfaction and breach of SLA for shipping."
        severity = "High"
    elif domain == "Healthcare":
        impact = "Risk to patient health and increased wait times."
        severity = "Critical"
    elif domain == "Finance":
        impact = "Financial losses and potential compliance violations."
        severity = "High"
    else:
        impact = "Minor disruption to daily operations."
        severity = "Low"
        
    return {
        "impact": impact,
        "severity": severity,
        "if_no_action": "The situation will likely worsen over the next 48 hours."
    }
