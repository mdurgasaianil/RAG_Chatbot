import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import {
  uploadDocument,
  streamChat,
  getChatHistory,
  deleteSession,
  deleteAllSessions,
} from "@/services/api";
import { useChatStore } from "@/store/chatStore";

// ── Upload document mutation ──────────────────────────────────
export function useUploadDocument() {
  const { addSession } = useChatStore();

  return useMutation({
    mutationFn: uploadDocument,
    onSuccess: (data) => {
      addSession(data.session_id, data.file_name);
    },
  });
}

// ── Streaming chat hook ───────────────────────────────────────
export function useStreamChat() {
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef(false);
  const { addMessage, appendToMessage, setMessageStreaming } = useChatStore();

  const sendMessage = useCallback(
    async (session_id: string, question: string) => {
      abortRef.current = false;
      setIsStreaming(true);

      // Add user message
      addMessage(session_id, {
        role: "user",
        content: question,
        timestamp: Date.now(),
      });

      // Add empty assistant message (will be filled by stream)
      const assistantMsgId = addMessage(session_id, {
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        isStreaming: true,
      });

      await streamChat(
        session_id,
        question,
        (token) => {
          if (!abortRef.current) {
            appendToMessage(session_id, assistantMsgId, token);
          }
        },
        () => {
          setMessageStreaming(session_id, assistantMsgId, false);
          setIsStreaming(false);
        },
        (err) => {
          appendToMessage(session_id, assistantMsgId, `Error: ${err}`);
          setMessageStreaming(session_id, assistantMsgId, false);
          setIsStreaming(false);
        }
      );
    },
    [addMessage, appendToMessage, setMessageStreaming]
  );

  const stopStreaming = useCallback(() => {
    abortRef.current = true;
    setIsStreaming(false);
  }, []);

  return { sendMessage, isStreaming, stopStreaming };
}

// ── Chat history query ────────────────────────────────────────
export function useChatHistory(session_id: string | null) {
  return useQuery({
    queryKey: ["history", session_id],
    queryFn: () => getChatHistory(session_id!),
    enabled: !!session_id,
    staleTime: 30_000,
  });
}

// ── Delete session mutation ───────────────────────────────────
export function useDeleteSession() {
  const queryClient = useQueryClient();
  const { removeSession } = useChatStore();

  return useMutation({
    mutationFn: deleteSession,
    onSuccess: (_, session_id) => {
      removeSession(session_id);
      queryClient.removeQueries({ queryKey: ["history", session_id] });
    },
  });
}

// ── Delete all sessions mutation ──────────────────────────────
export function useDeleteAllSessions() {
  const queryClient = useQueryClient();
  const { clearAllSessions } = useChatStore();

  return useMutation({
    mutationFn: deleteAllSessions,
    onSuccess: () => {
      clearAllSessions();
      queryClient.clear();
    },
  });
}
