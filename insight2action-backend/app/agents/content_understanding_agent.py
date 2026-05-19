def understand_content(content: str) -> dict:
    text = content.lower()
    
    if any(word in text for word in ["login", "firewall", "malware", "ip address", "breach", "password"]):
        content_type = "security_report"
        terms = ["security", "threat", "system"]
    elif any(word in text for word in ["student", "course", "exam", "attendance"]):
        content_type = "education_report"
        terms = ["education", "academic", "student"]
    elif any(word in text for word in ["delivery", "shipment", "warehouse", "order"]):
        content_type = "logistics_report"
        terms = ["supply chain", "logistics", "shipping"]
    elif any(word in text for word in ["patient", "doctor", "medicine", "appointment", "hospital"]):
        content_type = "healthcare_report"
        terms = ["medical", "health", "care"]
    elif any(word in text for word in ["transaction", "budget", "revenue", "expense", "invoice"]):
        content_type = "finance_report"
        terms = ["financial", "money", "budget"]
    else:
        content_type = "general_report"
        terms = ["general", "information"]
        
    return {
        "content_type": content_type,
        "short_summary": f"A {content_type} outlining key operational events.",
        "important_terms": terms
    }
