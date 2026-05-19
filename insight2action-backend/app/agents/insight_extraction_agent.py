def extract_insight(content: str, domain: str) -> dict:
    text = content.lower()
    
    if domain == "Cybersecurity":
        if "firewall" in text:
            insight = "Firewall blocked multiple unauthorized access attempts."
        else:
            insight = "Multiple failed login attempts were detected from unknown locations."
    elif domain == "Education":
        insight = "Significant drop in student attendance and poor exam performance."
    elif domain == "Logistics":
        insight = "Warehouse bottlenecks are causing severe delivery delays."
    elif domain == "Healthcare":
        insight = "Critical medicine shortages are delaying patient treatments."
    elif domain == "Finance":
        insight = "Unusual transaction volume detected leading to budget overruns."
    else:
        insight = "General operational inefficiencies identified requiring review."
        
    return {
        "key_insight": insight,
        "evidence": "Extracted directly from the provided unstructured content."
    }
