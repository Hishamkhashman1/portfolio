# Backend

FastAPI backend for the portfolio assistant.

## Local run

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

## Deployment

- Build from `backend/Dockerfile`
- Set `ASSISTANT_CORS_ORIGINS` to your frontend origin if needed
- Set `ASSISTANT_BACKEND_URL` in the frontend environment to the deployed backend URL

##Delete this file

Useful endpoints:
- `GET /`
- `GET /health`
- `POST /chat`
