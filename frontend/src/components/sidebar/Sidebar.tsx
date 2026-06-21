"use client";
import { useState } from "react";
import { useChatStore } from "@/store/chatStore";
import { useDeleteSession, useDeleteAllSessions } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { sessions, activeSessionId, setActiveSession, addSession } = useChatStore();
  const { mutate: deleteSession, isPending: isDeleting } = useDeleteSession();
  const { mutate: deleteAll, isPending: isDeletingAll } = useDeleteAllSessions();
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  const sessionList = Object.values(sessions).sort(
    (a, b) => b.created_at - a.created_at
  );

  const handleDeleteAll = () => {
    if (confirmDeleteAll) {
      deleteAll();
      setConfirmDeleteAll(false);
    } else {
      setConfirmDeleteAll(true);
      setTimeout(() => setConfirmDeleteAll(false), 3000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f9f9f9] dark:bg-[#111] border-r border-[#e0e0e0] dark:border-[#1e1e1e]">
      {/* Header */}
      <div className="px-4 py-4 border-b border-[#e0e0e0] dark:border-[#1e1e1e]">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-[#D97757] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-[#1a1a1a] dark:text-white">DocMind</span>
        </div>

        {/* New chat button */}
        <button
          onClick={() => setActiveSession(null)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#666] dark:text-[#999] hover:bg-[#f0f0f0] dark:hover:bg-[#1a1a1a] transition-colors border border-[#e0e0e0] dark:border-[#2a2a2a]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
          </svg>
          New document
        </button>
      </div>

      {/* Sessions list */}
      <div className="flex-1 overflow-y-auto py-2 px-2">
        {sessionList.length === 0 ? (
          <div className="text-center py-8 px-4">
            <p className="text-xs text-[#999]">No documents yet</p>
            <p className="text-xs text-[#bbb] mt-1">Upload a file to get started</p>
          </div>
        ) : (
          <>
            <p className="text-[10px] text-[#bbb] uppercase tracking-wider px-2 mb-2">
              Recent documents
            </p>
            {sessionList.map((session) => (
              <div
                key={session.session_id}
                className={cn(
                  "group flex items-center gap-2 px-3 py-2.5 rounded-xl mb-1 cursor-pointer transition-colors",
                  activeSessionId === session.session_id
                    ? "bg-white dark:bg-[#1e1e1e] shadow-sm border border-[#e0e0e0] dark:border-[#2a2a2a]"
                    : "hover:bg-[#f0f0f0] dark:hover:bg-[#1a1a1a]"
                )}
                onClick={() => setActiveSession(session.session_id)}
              >
                {/* File icon */}
                <div className="w-7 h-7 rounded-lg bg-[#D97757]/10 flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#1a1a1a] dark:text-white truncate">
                    {session.file_name}
                  </p>
                  <p className="text-[10px] text-[#999]">
                    {session.messages.filter(m => m.role === "user").length} messages ·{" "}
                    {new Date(session.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.session_id);
                  }}
                  disabled={isDeleting}
                  className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg flex items-center justify-center text-[#999] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex-shrink-0"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer — delete all */}
      {sessionList.length > 0 && (
        <div className="p-3 border-t border-[#e0e0e0] dark:border-[#1e1e1e]">
          <button
            onClick={handleDeleteAll}
            disabled={isDeletingAll}
            className={cn(
              "w-full text-xs px-3 py-2 rounded-xl transition-colors",
              confirmDeleteAll
                ? "bg-red-500 text-white"
                : "text-[#999] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            )}
          >
            {confirmDeleteAll ? "Click again to confirm" : "Clear all sessions"}
          </button>
        </div>
      )}
    </div>
  );
}
