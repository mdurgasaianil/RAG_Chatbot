import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ChatMessage, SessionStore } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface ChatStore {
  // All sessions stored locally
  sessions: Record<string, SessionStore>;
  // Currently active session
  activeSessionId: string | null;

  // Actions
  addSession: (session_id: string, file_name: string) => void;
  setActiveSession: (session_id: string | null) => void;
  addMessage: (session_id: string, message: Omit<ChatMessage, "id">) => string;
  appendToMessage: (session_id: string, message_id: string, token: string) => void;
  setMessageStreaming: (session_id: string, message_id: string, isStreaming: boolean) => void;
  removeSession: (session_id: string) => void;
  clearAllSessions: () => void;
  getActiveSession: () => SessionStore | null;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      sessions: {},
      activeSessionId: null,

      addSession: (session_id, file_name) => {
        set((state) => ({
          sessions: {
            ...state.sessions,
            [session_id]: {
              session_id,
              file_name,
              created_at: Date.now(),
              messages: [],
            },
          },
          activeSessionId: session_id,
        }));
      },

      setActiveSession: (session_id) => {
        set({ activeSessionId: session_id });
      },

      addMessage: (session_id, message) => {
        const id = uuidv4();
        set((state) => ({
          sessions: {
            ...state.sessions,
            [session_id]: {
              ...state.sessions[session_id],
              messages: [
                ...state.sessions[session_id].messages,
                { ...message, id },
              ],
            },
          },
        }));
        return id;
      },

      appendToMessage: (session_id, message_id, token) => {
        set((state) => ({
          sessions: {
            ...state.sessions,
            [session_id]: {
              ...state.sessions[session_id],
              messages: state.sessions[session_id].messages.map((msg) =>
                msg.id === message_id
                  ? { ...msg, content: msg.content + token }
                  : msg
              ),
            },
          },
        }));
      },

      setMessageStreaming: (session_id, message_id, isStreaming) => {
        set((state) => ({
          sessions: {
            ...state.sessions,
            [session_id]: {
              ...state.sessions[session_id],
              messages: state.sessions[session_id].messages.map((msg) =>
                msg.id === message_id ? { ...msg, isStreaming } : msg
              ),
            },
          },
        }));
      },

      removeSession: (session_id) => {
        set((state) => {
          const { [session_id]: _, ...rest } = state.sessions;
          const newActiveId =
            state.activeSessionId === session_id
              ? Object.keys(rest)[0] || null
              : state.activeSessionId;
          return { sessions: rest, activeSessionId: newActiveId };
        });
      },

      clearAllSessions: () => {
        set({ sessions: {}, activeSessionId: null });
      },

      getActiveSession: () => {
        const { sessions, activeSessionId } = get();
        return activeSessionId ? sessions[activeSessionId] || null : null;
      },
    }),
    {
      name: "docmind-chat-store",
    }
  )
);
