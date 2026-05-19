import os
import json
from openai import OpenAI
from pydantic import ValidationError
from app.schemas.analysis import AnalyzeResponse

# We will initialize the client dynamically to ensure env vars are loaded first
client = None

def get_openai_client():
    global client
    if client is None:
        client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    return client

def analyze_with_openai(content: str) -> dict:
    """
    Uses OpenAI to analyze the content and return a strict JSON dictionary.
    """
    openai_client = get_openai_client()
    model_name = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
    
    system_prompt = """
You are Insight2Action AI, an agentic AI system that converts unstructured content into clear decisions and simulated actions.
Your job is to read the user's content (e.g., reports, complaints, logs, policies) and return a structured analysis.

CRITICAL INSTRUCTIONS:
- Do not summarize generically.
- Extract the most actionable insight.
- Explain why the issue matters (impact).
- Recommend a realistic next action.
- Simulate a safe mock action.
- Never claim a real external system was updated.
- Only simulate tickets, alerts, dashboard updates, or notifications.
- Return ONLY valid JSON, without any markdown formatting or code blocks.

The JSON MUST match this exact schema:
{
  "domain": "Cybersecurity | Education | Logistics | Healthcare | Finance | Public Service | Business Operations | General",
  "key_insight": "string",
  "impact": "string",
  "severity": "Low | Medium | High | Critical",
  "recommended_action": "string",
  "simulation": {
    "type": "mock_ticket | mock_alert | mock_dashboard_update | mock_notification",
    "title": "string",
    "priority": "Low | Medium | High | Critical",
    "assigned_team": "string",
    "status": "Open | In Progress | Resolved | Draft",
    "description": "string"
  },
  "confidence": 0.0
}
"""

    response = openai_client.chat.completions.create(
        model=model_name,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": content}
        ],
        response_format={"type": "json_object"},
        temperature=0.2
    )

    result_text = response.choices[0].message.content
    
    try:
        parsed_json = json.loads(result_text)
        # Validate against our Pydantic schema to ensure all fields are correct
        # This will raise ValidationError if the shape is wrong
        validated_data = AnalyzeResponse(**parsed_json)
        return validated_data.model_dump()
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse JSON from OpenAI: {e}")
    except ValidationError as e:
        raise ValueError(f"OpenAI response did not match schema: {e}")
    except Exception as e:
        raise Exception(f"Unexpected error in OpenAI analysis: {e}")
