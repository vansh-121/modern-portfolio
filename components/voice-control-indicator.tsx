"use client"

import { Mic, MicOff } from "lucide-react"
import { cn } from "@/lib/utils"
import type { UseVoiceControlReturn } from "@/hooks/use-voice-control"

export function VoiceControlIndicator({
  voiceControl,
  className,
}: {
  voiceControl: UseVoiceControlReturn
  className?: string
}) {
  const { isListening, isSupported, toggleListening } = voiceControl

  if (!isSupported) return null

  return (
    <button
      aria-label="Voice control"
      onClick={toggleListening}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-full transition-colors",
        isListening ? "bg-red-500/20" : "hover:bg-muted/50",
        className,
      )}
    >
      {isListening ? <Mic className="h-5 w-5 text-red-600 animate-pulse" /> : <MicOff className="h-5 w-5 opacity-70" />}
    </button>
  )
}
