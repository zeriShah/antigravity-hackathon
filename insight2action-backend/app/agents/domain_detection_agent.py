def detect_domain(content: str, content_understanding: dict) -> dict:
    c_type = content_understanding.get("content_type", "")
    
    if c_type == "security_report":
        domain = "Cybersecurity"
    elif c_type == "education_report":
        domain = "Education"
    elif c_type == "logistics_report":
        domain = "Logistics"
    elif c_type == "healthcare_report":
        domain = "Healthcare"
    elif c_type == "finance_report":
        domain = "Finance"
    else:
        domain = "Business Operations"
        
    return {
        "domain": domain,
        "domain_confidence": 0.85
    }
