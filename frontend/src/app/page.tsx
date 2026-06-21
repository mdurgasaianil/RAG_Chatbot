"use client";
import { useChatStore } from "@/store/chatStore";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { UploadZone } from "@/components/upload/UploadZone";

export default function Home() {
  const { activeSessionId } = useChatStore();

  return (
    <div className="flex h-screen bg-white dark:bg-[#161616] overflow-hidden">
      {/* Left sidebar — fixed width */}
      <aside className="w-64 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col min-w-0">
        {activeSessionId ? (
          <ChatWindow />
        ) : (
          <UploadZone />
        )}
      </main>
    </div>
  );
}
