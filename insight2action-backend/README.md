# Insight2Action AI Backend

This is the backend API foundation for the Insight2Action AI mobile app. It is built with FastAPI and Python.

## Using Real AI Analysis

The backend now supports real AI analysis using OpenAI! When configured, the API sends unstructured content to an LLM to dynamically generate insights and simulated actions.

### How to configure Real AI:
1. Copy the `.env.example` file and create a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file and configure it:
   - Paste your actual OpenAI API key into `OPENAI_API_KEY`.
   - Set `USE_REAL_AI=true` to enable OpenAI processing.
3. Restart your backend server for the environment variables to take effect.

### Fallback Mode
The backend features a robust **Graceful Fallback Mechanism**. If `USE_REAL_AI=false`, or if your API key is invalid/missing, or if the OpenAI service experiences an outage, the backend will automatically and seamlessly fall back to our deterministic **Mock Multi-Agent Workflow**. 

This guarantees the mobile app never crashes and always receives a valid response!

## Mock Multi-Agent Workflow

To prepare for integrating real Agentic AI (like OpenAI/Gemini), this backend uses a simulated, modular agent workflow. Each "agent" is a distinct Python function that receives specific context and returns a specialized output.

The `AgentOrchestrator` runs the following sequence when `/analyze` is called (in fallback/mock mode):
1. **Content Understanding Agent**: Determines the type of content based on keywords (e.g. security, education, logistics).
2. **Domain Detection Agent**: Takes the content type and maps it to a specific industry domain (e.g. Cybersecurity).
3. **Insight Extraction Agent**: Parses the text within the context of the domain to find the core issue.
4. **Impact Analysis Agent**: Analyzes how severe the extracted insight is.
5. **Action Recommendation Agent**: Suggests exactly what humans should do to mitigate the problem.
6. **Action Simulation Agent**: Creates a mocked result of automating the recommendation (e.g. creating a mock ticket).
7. **Final Response Builder**: Aggregates all these outputs into a clean `AnalyzeResponse` API object.

## Setup Instructions

### 1. Create a Virtual Environment
It is recommended to use a virtual environment to manage dependencies.
```bash
python -m venv venv
```

### 2. Activate the Virtual Environment
- **Windows:**
  ```bash
  .\venv\Scripts\activate
  ```
- **macOS/Linux:**
  ```bash
  source venv/bin/activate
  ```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Server
Use Uvicorn (or FastAPI CLI) to run the application:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
The server will start on `http://localhost:8000`.

## API Endpoints

### 1. Health Check
Check if the API is running.
- **URL:** `/`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "status": "ok",
    "message": "Insight2Action AI backend is running"
  }
  ```

### 2. Analyze Content
Endpoint to analyze unstructured content using Real AI or the Mock Multi-Agent flow.
- **URL:** `/analyze`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "content": "Your long unstructured text here..."
  }
  ```
- **Response:**
  Returns a structured JSON analysis containing domain, key insight, severity, and simulated actions.
