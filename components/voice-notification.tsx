"use client"

import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export function VoiceNotification({
  message,
  type = "info",
  onClose,
}: {
  message: string
  type: "success" | "error" | "info"
  onClose: () => void
}) {
  const color = type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : "bg-slate-700"

  return (
    <div
      className={cn(
        "fixed right-4 top-4 z-50 flex items-center gap-2 rounded-md px-4 py-2 text-sm text-white shadow-lg animate-in slide-in-from-top-4 fade-in",
        color,
      )}
    >
      <span>{message}</span>
      <button onClick={onClose} aria-label="Close notification">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
