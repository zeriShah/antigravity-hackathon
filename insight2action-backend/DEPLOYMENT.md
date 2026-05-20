# Vercel Deployment Guide for Insight2Action Backend

## Current Setup

The backend is now configured for Vercel deployment with:
- **Entry point**: `api/index.py`
- **FastAPI app**: `app/main.py`
- **Python version**: 3.12
- **Configuration**: `vercel.json`

## Deployment Steps

### 1. Install Vercel CLI (if not already installed)
```bash
npm i -g vercel
```

### 2. Navigate to backend directory
```bash
cd insight2action-backend
```

### 3. Set Environment Variables on Vercel
Before deploying, you MUST set these environment variables in your Vercel project:

```bash
vercel env add OPENAI_API_KEY
# Paste your OpenAI API key when prompted

vercel env add USE_REAL_AI
# Enter: true

vercel env add AI_PROVIDER
# Enter: openai

vercel env add OPENAI_MODEL
# Enter: gpt-4o-mini
```

Or set them via Vercel Dashboard:
1. Go to your project settings
2. Navigate to Environment Variables
3. Add each variable for Production, Preview, and Development

### 4. Deploy to Vercel
```bash
vercel --prod
```

## Testing the Deployment

After deployment, test these endpoints:

1. **Health check**:
   ```bash
   curl https://your-deployment-url.vercel.app/
   ```
   Should return: `{"status": "ok", "message": "Insight2Action AI backend is running"}`

2. **Analyze endpoint**:
   ```bash
   curl -X POST https://your-deployment-url.vercel.app/analyze \
     -H "Content-Type: application/json" \
     -d '{"content": "Sales dropped 15% last quarter"}'
   ```

## Common Issues

### 404 NOT_FOUND Error
- **Cause**: Vercel couldn't find the entry point or routes are misconfigured
- **Solution**: Ensure `api/index.py` exists and `vercel.json` is correct (already fixed)

### Module Import Errors
- **Cause**: Missing dependencies or incorrect Python path
- **Solution**: Check `requirements.txt` has all dependencies (already fixed)

### Environment Variable Errors
- **Cause**: Missing OPENAI_API_KEY or other required env vars
- **Solution**: Set all environment variables in Vercel dashboard

## File Structure
```
insight2action-backend/
├── api/
│   └── index.py          # Vercel entry point
├── app/
│   ├── main.py           # FastAPI application
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── agents/           # AI agents
│   └── schemas/          # Pydantic models
├── vercel.json           # Vercel configuration
├── requirements.txt      # Python dependencies
└── .vercelignore         # Files to exclude from deployment
```

## Next Steps

1. Deploy using `vercel --prod`
2. Set environment variables in Vercel dashboard
3. Test the endpoints
4. Update your mobile app to use the new Vercel URL
