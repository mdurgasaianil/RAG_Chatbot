"use client";
import { useEffect, useRef } from "react";
import { useChatStore } from "@/store/chatStore";
import { useStreamChat } from "@/hooks/useChat";
import { MessageBubble, MessageSkeleton } from "./MessageBubble";
import { ChatInput } from "./ChatInput";

export function ChatWindow() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { getActiveSession } = useChatStore();
  const { sendMessage, isStreaming, stopStreaming } = useStreamChat();

  const session = getActiveSession();

  // Auto scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.messages]);

  if (!session) return null;

  const handleSend = (question: string) => {
    sendMessage(session.session_id, question);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Session header */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-[#e0e0e0] dark:border-[#2a2a2a]">
        <div className="w-2 h-2 rounded-full bg-green-400" />
        <span className="text-sm font-medium text-[#1a1a1a] dark:text-white truncate">
          {session.file_name}
        </span>
        <span className="text-xs text-[#999] ml-auto flex-shrink-0">
          {session.messages.filter(m => m.role === "user").length} questions asked
        </span>
      </div>

      {/* Messages scroll area */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="max-w-3xl mx-auto">
          {session.messages.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center h-64 text-center px-6">
              <div className="w-12 h-12 rounded-2xl bg-[#f5f5f5] dark:bg-[#1e1e1e] flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#999]">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-[#1a1a1a] dark:text-white">
                Document ready
              </p>
              <p className="text-xs text-[#999] mt-1">
                Ask anything about <span className="text-[#D97757]">{session.file_name}</span>
              </p>

              {/* Quick prompts */}
              <div className="grid grid-cols-2 gap-2 mt-6 w-full max-w-sm">
                {[
                  "Summarize this document",
                  "What are the key points?",
                  "List all important dates",
                  "What are the terms and conditions?",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="text-xs px-3 py-2.5 rounded-xl bg-[#f5f5f5] dark:bg-[#1e1e1e] text-[#666] dark:text-[#999] border border-[#e0e0e0] dark:border-[#2a2a2a] hover:border-[#D97757] hover:text-[#D97757] transition-colors text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Messages list
            <>
              {session.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isStreaming && session.messages[session.messages.length - 1]?.role === "user" && (
                <MessageSkeleton />
              )}
            </>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <ChatInput
        onSend={handleSend}
        isStreaming={isStreaming}
        onStop={stopStreaming}
      />
    </div>
  );
}
