# Assistant API

Small FastAPI service for the floating portfolio assistant.

## Run

```bash
cd assistant-api
pip install -r requirements.txt
OPENAI_API_KEY=your_key uvicorn main:app --reload --port 8000
```

## Environment

- `OPENAI_API_KEY` - stored only on the FastAPI server
- `OPENAI_MODEL` - optional override, defaults to `gpt-5.5`
- `ALLOWED_ORIGINS` - comma-separated frontend origins, defaults to `http://localhost:3000`
