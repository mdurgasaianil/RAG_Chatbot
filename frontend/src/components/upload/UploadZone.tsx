"use client";
import { useCallback, useState } from "react";
import { useUploadDocument } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

const ACCEPTED = [".pdf", ".docx", ".txt"];
const MAX_SIZE_MB = 50;

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate: upload, isPending } = useUploadDocument();

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      if (!ACCEPTED.includes(ext)) {
        setError(`Unsupported file type. Use: ${ACCEPTED.join(", ")}`);
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`File too large. Max size: ${MAX_SIZE_MB}MB`);
        return;
      }
      upload(file, {
        onError: (e) => setError(e.message),
      });
    },
    [upload]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-6">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#D97757] flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-[#1a1a1a] dark:text-white">DocMind</h1>
        <p className="text-sm text-[#666] dark:text-[#999] mt-1">Upload a document to start chatting</p>
      </div>

      {/* Drop zone */}
      <label
        className={cn(
          "w-full max-w-md border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200",
          isDragging
            ? "border-[#D97757] bg-[#D97757]/5"
            : "border-[#e0e0e0] dark:border-[#333] hover:border-[#D97757] hover:bg-[#D97757]/5",
          isPending && "pointer-events-none opacity-60"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        <input
          type="file"
          className="hidden"
          accept={ACCEPTED.join(",")}
          onChange={onInputChange}
          disabled={isPending}
        />

        {isPending ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#D97757] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#666] dark:text-[#999]">Processing document...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f5f5f5] dark:bg-[#222] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#999]">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-[#1a1a1a] dark:text-white">
                Drop your file here
              </p>
              <p className="text-xs text-[#999] mt-1">
                or click to browse · PDF, DOCX, TXT · max {MAX_SIZE_MB}MB
              </p>
            </div>
          </div>
        )}
      </label>

      {error && (
        <p className="mt-3 text-xs text-red-500 text-center">{error}</p>
      )}

      {/* Suggested prompts */}
      <div className="mt-8 w-full max-w-md">
        <p className="text-xs text-[#999] mb-3 text-center">After uploading, you can ask things like</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            "Summarize this document",
            "What are the key points?",
            "What is the notice period?",
            "List all important dates",
          ].map((prompt) => (
            <div
              key={prompt}
              className="text-xs px-3 py-2 rounded-xl bg-[#f5f5f5] dark:bg-[#1a1a1a] text-[#666] dark:text-[#999] border border-[#e0e0e0] dark:border-[#2a2a2a] text-center"
            >
              {prompt}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
