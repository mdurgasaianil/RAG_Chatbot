"use client";
import { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  message: ChatMessage;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 px-4 py-3 group", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-medium mt-0.5",
        isUser
          ? "bg-[#D97757] text-white"
          : "bg-[#1a1a1a] dark:bg-[#e0e0e0] text-white dark:text-[#1a1a1a]"
      )}>
        {isUser ? "U" : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      {/* Message content */}
      <div className={cn("flex flex-col max-w-[75%]", isUser ? "items-end" : "items-start")}>
        <div className={cn(
          "rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-[#D97757] text-white rounded-tr-sm"
            : "bg-[#f5f5f5] dark:bg-[#1e1e1e] text-[#1a1a1a] dark:text-[#e0e0e0] rounded-tl-sm"
        )}>
          {message.content}
          {/* Streaming cursor */}
          {message.isStreaming && (
            <span className="inline-block w-0.5 h-4 bg-current ml-0.5 animate-pulse align-middle" />
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-[#999] mt-1 px-1">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

// Skeleton loader while streaming starts
export function MessageSkeleton() {
  return (
    <div className="flex gap-3 px-4 py-3">
      <div className="w-8 h-8 rounded-full bg-[#e0e0e0] dark:bg-[#2a2a2a] flex-shrink-0 animate-pulse" />
      <div className="flex flex-col gap-2 flex-1 max-w-[60%]">
        <div className="h-4 bg-[#e0e0e0] dark:bg-[#2a2a2a] rounded-full animate-pulse w-3/4" />
        <div className="h-4 bg-[#e0e0e0] dark:bg-[#2a2a2a] rounded-full animate-pulse w-1/2" />
      </div>
    </div>
  );
}
