export interface Session {
  session_id: string;
  file_name: string;
  total_chunks: number;
  message: string;
  created_at: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

export interface ChatHistory {
  session_id: string;
  file_name: string;
  total_messages: number;
  history: Array<{
    question: string;
    answer: string;
  }>;
}

export interface ChatRequest {
  session_id: string;
  question: string;
}

export interface SessionStore {
  session_id: string;
  file_name: string;
  created_at: number;
  messages: ChatMessage[];
}
