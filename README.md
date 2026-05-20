# Insight2Action AI

Insight2Action AI is an enterprise-grade web application built to convert complex, unstructured operational logs (server failures, supply chain bottlenecks, financial anomalies) into immediate, simulation-backed, and executive-ready decision recommendations.

## 🌟 Key Features

- **Multi-Domain Intelligence**: Automatically detects whether an issue is related to Cybersecurity, Logistics, Healthcare, Finance, or general Operations.
- **Human-in-the-Loop Workflow**: Never execute blindly. Review the AI's primary recommendation, read "Why This Action" was suggested, and seamlessly **Approve**, **Modify**, or **Reject & Suggest** alternative actions.
- **Action Simulation**: Before committing, the platform runs a lightweight simulation generating counterfactuals ("What happens if we take action" vs. "What if we do nothing") and predicts metrics improvements.
- **Executive Summary Dashboard**: A highly polished, dynamic dashboard condensing the entire situation into a 10-second read tailored for decision-makers.
- **Instant Export**: Generate a beautifully formatted Action Report in PDF format natively, ready to be attached to tickets or shared on Slack/Email with a single tap.

## 🏗️ Architecture & Tech Stack

This project is organized into two primary workspaces:
1. **Frontend**: Built with **React Native / Expo** and **NativeWind (Tailwind CSS)**. Designed for modern mobile and web experiences.
2. **Backend**: Built with **FastAPI** (Python). Highly concurrent, powered by Langchain/OpenAI integrations for intelligent reasoning, with fully structured Pydantic fallback engines for robust offline testing.

## 🚀 Setup & Installation

### Prerequisites
- Node.js & npm (for the frontend)
- Python 3.10+ (for the backend)
- Optional: OpenAI API Key

### Backend Setup (`insight2action-backend`)

1. Navigate to the backend directory:
   ```bash
   cd insight2action-backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the backend root:
   ```env
   OPENAI_API_KEY=your_actual_key_here
   USE_REAL_AI=true # Set to false to use the structured offline mock workflows
   ```
5. Start the backend server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   *The backend will be running at `http://localhost:8000`.*

### Frontend Setup (`insight2action-mobile`)

1. Navigate to the frontend directory:
   ```bash
   cd insight2action-mobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update API configuration (if necessary):
   Ensure `BASE_URL` in `lib/api.ts` points to your backend IP (e.g., `http://localhost:8000` or `http://<your-local-ip>:8000` for physical devices).
4. Start the application:
   ```bash
   npm start
   ```
   *Press `w` to open in a web browser, or scan the QR code with the Expo Go app on your phone.*

## 📖 Usage Workflow

1. **Upload**: Drop a massive unstructured log file (.txt, .csv, .log up to 70MB).
2. **Analyze**: The backend parses the file, extracts the key insight, severity, and builds a comprehensive action recommendation.
3. **Decide**: View the Executive Dashboard. Click "Approve" to simulate the action, "Modify" to write a custom prompt, or "Reject" to explore AI-generated alternatives.
4. **Execute & Export**: Observe the simulated metrics, and hit **Export Pack** to download the professional PDF report.

---
*Built to empower executives to act on intelligence with unprecedented speed and confidence.*
