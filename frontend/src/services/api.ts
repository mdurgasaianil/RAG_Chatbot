import { Session, ChatHistory } from "@/types";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
// src/services/api.ts — change line 1
const BASE_URL = "http://localhost:8000";  // hardcode for now

// ── Upload document ──────────────────────────────────────────
export async function uploadDocument(file: File): Promise<Session> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Upload failed");
  }

  const data = await res.json();
  return { ...data, created_at: Date.now() };
}

// ── Stream chat response via SSE ─────────────────────────────
export async function streamChat(
  session_id: string,
  question: string,
  onToken: (token: string) => void,
  onDone: () => void,
  onError: (err: string) => void
) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id, question }),
  });

  if (!res.ok) {
    const err = await res.json();
    onError(err.detail || "Chat failed");
    return;
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const token = line.slice(6); // remove "data: " prefix
        if (token === "[DONE]") {
          onDone();
          return;
        }
        if (token.trim()) onToken(token);
      }
    }
  }
  onDone();
}

// ── Get chat history ─────────────────────────────────────────
export async function getChatHistory(session_id: string): Promise<ChatHistory> {
  const res = await fetch(`${BASE_URL}/history/${session_id}`);
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
}

// ── Delete single session ────────────────────────────────────
export async function deleteSession(session_id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/session/${session_id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete session");
}

// ── Delete all sessions ───────────────────────────────────────
export async function deleteAllSessions(): Promise<void> {
  const res = await fetch(`${BASE_URL}/sessions/all`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete all sessions");
}

// ── Health check ─────────────────────────────────────────────
export async function healthCheck() {
  const res = await fetch(`${BASE_URL}/health`);
  return res.json();
}
