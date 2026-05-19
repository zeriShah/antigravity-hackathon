# Insight2Action AI

Insight2Action AI is a full-stack prototype that turns unstructured text into a structured operational insight, severity assessment, recommended action, and simulated follow-up item.

The project contains:

- `insight2action-backend`: FastAPI backend with a mock multi-agent workflow and optional OpenAI-backed analysis.
- `insight2action-mobile`: Expo React Native app for entering content, uploading `.txt` files, viewing analysis results, and saving local history.

## Features

- Analyze pasted text or uploaded `.txt` files.
- Detect a likely business domain such as cybersecurity, logistics, education, healthcare, finance, public service, business operations, or general.
- Extract a key insight, impact statement, severity, recommended action, and mock execution result.
- Save recent analysis history locally on the device.
- Run fully in deterministic mock mode, or enable OpenAI analysis through environment variables.

## Tech Stack

### Backend

- Python
- FastAPI
- Pydantic
- Uvicorn
- python-dotenv
- OpenAI SDK and `openai-agents`

### Mobile App

- Expo
- React Native
- Expo Router
- TypeScript
- NativeWind / Tailwind CSS
- AsyncStorage
- Expo Document Picker and File System

## Project Structure

```text
insight2action/
|-- insight2action-backend/
|   |-- app/
|   |   |-- agents/              # Mock agent workflow steps
|   |   |-- routes/              # FastAPI route handlers
|   |   |-- schemas/             # Pydantic request/response models
|   |   |-- services/            # Orchestration and OpenAI integration
|   |   `-- main.py              # FastAPI app entry point
|   |-- .env.example             # Backend environment template
|   |-- pyproject.toml
|   `-- requirements.txt
|-- insight2action-mobile/
|   |-- app/                     # Expo Router screens
|   |-- components/              # Shared UI components
|   |-- constants/               # Theme constants
|   |-- lib/                     # API client, types, and local history storage
|   |-- assets/
|   `-- package.json
`-- README.md
```

## Prerequisites

- Python 3.14 or compatible with the backend configuration.
- Node.js and npm.
- Expo Go on a physical device, or an Android/iOS simulator, if running the mobile app natively.
- Optional: an OpenAI API key if you want real AI analysis instead of the built-in mock workflow.

## Backend Setup

From the project root:

```bash
cd insight2action-backend
python -m venv .venv
```

Activate the virtual environment:

```bash
# Windows PowerShell
.\.venv\Scripts\Activate.ps1

# macOS/Linux
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create the backend environment file:

```bash
cp .env.example .env
```

For mock mode, set:

```env
USE_REAL_AI=false
OPENAI_API_KEY=your_openai_api_key_here
AI_PROVIDER=openai
OPENAI_MODEL=gpt-4o-mini
```

For OpenAI-backed analysis, set:

```env
USE_REAL_AI=true
OPENAI_API_KEY=your_real_openai_api_key
AI_PROVIDER=openai
OPENAI_MODEL=gpt-4o-mini
```

Run the API:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at:

```text
http://localhost:8000
```

Interactive API docs are available at:

```text
http://localhost:8000/docs
```

## Backend API

### Health Check

```http
GET /
```

Example response:

```json
{
  "status": "ok",
  "message": "Insight2Action AI backend is running"
}
```

### Analyze Content

```http
POST /analyze
Content-Type: application/json
```

Example request:

```json
{
  "content": "The firewall is logging suspicious packets from unknown IP addresses trying to guess admin passwords."
}
```

Example `curl`:

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d "{\"content\":\"The firewall is logging suspicious packets from unknown IP addresses trying to guess admin passwords.\"}"
```

Example response shape:

```json
{
  "domain": "Cybersecurity",
  "key_insight": "Suspicious login activity suggests a possible brute-force attack.",
  "impact": "Unauthorized access could expose systems or sensitive data.",
  "severity": "High",
  "recommended_action": "Review firewall logs, block suspicious IP addresses, and enforce stronger admin authentication.",
  "simulation": {
    "type": "mock_ticket",
    "title": "Investigate suspicious firewall activity",
    "priority": "High",
    "assigned_team": "Security Operations",
    "status": "Open",
    "description": "A mock ticket was created for the security team to investigate the suspicious activity."
  },
  "confidence": 0.9
}
```

## Mobile App Setup

Open a second terminal from the project root:

```bash
cd insight2action-mobile
npm install
```

Start Expo:

```bash
npm run start
```

Run on a target platform:

```bash
npm run android
npm run ios
npm run web
```

For web development, the app calls:

```text
http://localhost:8000
```

For Android emulator development, the app calls:

```text
http://10.0.2.2:8000
```

For Expo Go on a physical phone, update the development fallback in `insight2action-mobile/lib/api.ts` to your computer's local network IP address, for example:

```ts
return 'http://192.168.1.100:8000';
```

Make sure the backend is running and the phone is on the same network as the development machine.

## Common Development Flow

1. Start the backend on port `8000`.
2. Start the Expo app.
3. Open the app on web, simulator, emulator, or Expo Go.
4. Paste text or upload a `.txt` file.
5. Run an analysis and view the generated result.
6. Review saved results in the history screen.

## Verification

Backend syntax check:

```bash
cd insight2action-backend
python -m compileall app
```

Mobile TypeScript check:

```bash
cd insight2action-mobile
npx tsc --noEmit
```

On Windows PowerShell, if script execution policy blocks `npx`, run:

```bash
npx.cmd tsc --noEmit
```

## GitHub Readiness Notes

- Do not commit real `.env` files or API keys.
- Keep `node_modules`, Python virtual environments, Expo build output, and local caches out of Git.
- This workspace currently contains separate Git repositories inside `insight2action-backend` and `insight2action-mobile`. If you want one GitHub repository for the whole project, remove the nested `.git` folders first, then initialize Git at the root.
- If you prefer two GitHub repositories, push each subproject separately and keep this top-level README as shared project documentation.

## License

No license file is currently included. Add one before publishing if you want to define how others may use, copy, or modify this project.
