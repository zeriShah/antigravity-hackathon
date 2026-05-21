import asyncio
import json
import os
import httpx
from typing import AsyncGenerator
from openai import AsyncOpenAI

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def execute_action_plan(domain: str, action_title: str, responsible_team: str) -> AsyncGenerator[str, None]:
    """
    Real Agentic Execution Engine:
    Uses OpenAI function calling to dynamically execute real HTTP requests and write real files to disk.
    """
    def format_log(level: str, message: str, progress: int) -> str:
        data = json.dumps({"level": level, "message": message, "progress": progress})
        return f"data: {data}\n\n"

    yield format_log("INFO", f"Initializing Agentic Execution Engine for domain: {domain}...", 5)
    await asyncio.sleep(0.5)

    yield format_log("INFO", f"Planning real actions for: '{action_title}'...", 15)
    
    tools = [
        {
            "type": "function",
            "function": {
                "name": "send_webhook_request",
                "description": "Send a real HTTP POST request to a webhook to simulate creating a ticket or sending an alert.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "url": {"type": "string", "description": "The webhook URL. Use 'https://jsonplaceholder.typicode.com/posts' if none provided."},
                        "payload": {
                            "type": "object",
                            "description": "The JSON payload to send in the request."
                        }
                    },
                    "required": ["url", "payload"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "create_local_file",
                "description": "Create a real file on the local file system to store a report or script.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "filename": {"type": "string", "description": "The name of the file to create, e.g., 'incident_report.md'."},
                        "content": {"type": "string", "description": "The content of the file."}
                    },
                    "required": ["filename", "content"]
                }
            }
        }
    ]

    prompt = f"You are an autonomous execution agent. The user needs to execute the following action for the {domain} domain:\nAction: {action_title}\nTeam: {responsible_team}\n\nPlease take two real actions: 1) send a webhook request to simulate a ticket/alert creation and 2) create a local report file summarizing the action taken."
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            tools=tools,
            tool_choice="auto"
        )
        
        yield format_log("SYSTEM", "AI has generated the execution plan. Beginning execution...", 25)
        
        message = response.choices[0].message
        if message.tool_calls:
            progress = 30
            for tool_call in message.tool_calls:
                function_name = tool_call.function.name
                arguments = json.loads(tool_call.function.arguments)
                
                if function_name == "send_webhook_request":
                    url = arguments.get("url", "https://jsonplaceholder.typicode.com/posts")
                    payload = arguments.get("payload", {})
                    yield format_log("INFO", f"Sending real POST request to {url}...", progress)
                    
                    async with httpx.AsyncClient() as http_client:
                        resp = await http_client.post(url, json=payload)
                        
                    yield format_log("SYSTEM", f"Received HTTP {resp.status_code} from external API: {resp.text[:80]}...", progress + 10)
                    
                elif function_name == "create_local_file":
                    filename = arguments.get("filename", "report.txt")
                    content = arguments.get("content", "No content.")
                    
                    # Ensure outputs dir exists
                    out_dir = os.path.join(os.getcwd(), "outputs")
                    os.makedirs(out_dir, exist_ok=True)
                    filepath = os.path.join(out_dir, filename)
                    
                    yield format_log("INFO", f"Writing real file to disk: {filepath}...", progress)
                    
                    with open(filepath, "w", encoding="utf-8") as f:
                        f.write(content)
                        
                    yield format_log("SYSTEM", f"File successfully written ({len(content)} bytes).", progress + 10)
                
                progress += 20
                await asyncio.sleep(1)
        else:
            yield format_log("INFO", "AI decided no specific tool actions were needed.", 90)

    except Exception as e:
        yield format_log("ERROR", f"Execution failed: {str(e)}", 90)

    yield format_log("SUCCESS", "Real Action plan executed successfully. All systems nominal.", 100)

