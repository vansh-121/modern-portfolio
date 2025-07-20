"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoiceControlIndicatorProps {
  isListening: boolean
  isSupported: boolean
  transcript: string
  confidence: number
  onToggle: () => void
  className?: string
}

export function VoiceControlIndicator({
  isListening,
  isSupported,
  transcript,
  confidence,
  onToggle,
  className,
}: VoiceControlIndicatorProps) {
  const [showTranscript, setShowTranscript] = useState(false)

  if (!isSupported) {
    return null
  }

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-5 w-5 md:h-6 md:w-6 p-0 text-white hover:bg-white/10 transition-all duration-200",
          isListening && "bg-red-500/20 animate-pulse",
        )}
        onClick={onToggle}
        title={isListening ? "Stop listening" : "Start voice control"}
      >
        {isListening ? (
          <Mic className="h-3 w-3 md:h-4 md:w-4 text-red-400" />
        ) : (
          <MicOff className="h-3 w-3 md:h-4 md:w-4 opacity-80" />
        )}
      </Button>

      {/* Voice feedback */}
      {isListening && (
        <div className="absolute top-8 right-0 bg-black/90 backdrop-blur-md rounded-lg p-3 min-w-48 border border-white/20 shadow-xl">
          <div className="flex items-center space-x-2 mb-2">
            <Volume2 className="h-4 w-4 text-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-medium">Listening...</span>
          </div>

          {transcript && <div className="text-xs text-white/80 mb-1">"{transcript}"</div>}

          <div className="text-xs text-white/60">Confidence: {Math.round(confidence * 100)}%</div>

          <div className="mt-2 pt-2 border-t border-white/10">
            <div className="text-xs text-white/50">Try saying:</div>
            <div className="text-xs text-white/70 space-y-1 mt-1">
              <div>"Open projects"</div>
              <div>"Show about"</div>
              <div>"Dark mode"</div>
            </div>
          </div>
        </div>
      )}

      {/* Listening animation */}
      {isListening && <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-75" />}
    </div>
  )
}
