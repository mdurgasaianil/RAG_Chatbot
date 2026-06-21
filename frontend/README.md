# DocMind — RAG Chatbot

Chat with any document using Gemini AI. Built with FastAPI + Next.js 15.

## Project Structure

```
docmind/
├── backend/                  ← Anil's FastAPI RAG API
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
└── frontend/                 ← Gowthami's Next.js UI
    ├── src/
    │   ├── app/              ← Next.js app router
    │   ├── components/
    │   │   ├── chat/         ← ChatWindow, MessageBubble, ChatInput
    │   │   ├── sidebar/      ← Session history sidebar
    │   │   └── upload/       ← Drag & drop upload zone
    │   ├── hooks/            ← TanStack Query hooks
    │   ├── services/         ← API calls (api.ts)
    │   ├── store/            ← Zustand state (chatStore.ts)
    │   └── types/            ← TypeScript types
    ├── package.json
    └── .env.local
```

## Setup

### Backend (Anil)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Create .env file
echo "GOOGLE_API_KEY=your-key-here" > .env

# Run API
uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### Frontend (Gowthami)

```bash
cd frontend
npm install
npm run dev
```

App runs at: http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /upload | Upload document, get session_id |
| POST | /chat | Stream answer via SSE |
| GET | /history/{session_id} | Get chat history |
| DELETE | /session/{session_id} | Delete one session |
| DELETE | /sessions/all | Delete all sessions |
| GET | /health | Health check |

## Tech Stack

**Backend:** Python · FastAPI · LangChain · ChromaDB · Gemini API · SSE Streaming

**Frontend:** Next.js 15 · React 19 · TypeScript · TanStack Query · Zustand · Tailwind CSS
