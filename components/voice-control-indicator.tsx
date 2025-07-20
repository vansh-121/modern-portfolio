"use client"

import { Mic, MicOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoiceControlIndicatorProps {
  isListening: boolean
  isSupported: boolean
  onClick: () => void
}

export function VoiceControlIndicator({ isListening, isSupported, onClick }: VoiceControlIndicatorProps) {
  if (!isSupported) {
    return (
      <div className="flex items-center space-x-2 text-gray-500">
        <MicOff className="w-4 h-4" />
        <span className="text-xs">Not supported</span>
      </div>
    )
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105",
        isListening ? "bg-red-500/20 text-red-400 animate-pulse" : "bg-gray-500/20 text-gray-300 hover:bg-gray-500/30",
      )}
      title={isListening ? "Click to stop listening" : "Click to start voice control (or hold Spacebar)"}
    >
      {isListening ? (
        <>
          <div className="w-2 h-2 bg-red-400 rounded-full animate-ping" />
          <Mic className="w-4 h-4" />
          <span className="text-xs font-medium">Listening...</span>
        </>
      ) : (
        <>
          <Mic className="w-4 h-4" />
          <span className="text-xs">Voice</span>
        </>
      )}
    </button>
  )
}
