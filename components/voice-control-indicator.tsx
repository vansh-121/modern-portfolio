"use client"

import { Mic, MicOff, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { UseVoiceControlReturn } from "@/hooks/use-voice-control"

export function VoiceControlIndicator({
  voiceControl,
  className,
}: {
  voiceControl: UseVoiceControlReturn
  className?: string
}) {
  const { isListening, isSupported, transcript, confidence, toggleListening } = voiceControl

  if (!isSupported) {
    return null
  }

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={toggleListening}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200",
          isListening ? "bg-red-500/20 text-red-400 animate-pulse" : "text-white/70 hover:bg-white/10 hover:text-white",
        )}
        title={isListening ? "Stop listening" : "Start voice control"}
        aria-label={isListening ? "Stop voice recognition" : "Start voice recognition"}
      >
        {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
      </button>

      {/* Voice feedback popup */}
      {isListening && (
        <div className="absolute top-10 right-0 bg-black/90 backdrop-blur-md rounded-lg p-3 min-w-64 border border-white/20 shadow-xl z-50">
          <div className="flex items-center space-x-2 mb-2">
            <Volume2 className="h-4 w-4 text-green-400 animate-pulse" />
            <span className="text-sm text-green-400 font-medium">Listening...</span>
          </div>

          {transcript && <div className="text-sm text-white/90 mb-2 p-2 bg-white/10 rounded">"{transcript}"</div>}

          <div className="text-xs text-white/60 mb-3">Confidence: {Math.round(confidence * 100)}%</div>

          <div className="border-t border-white/10 pt-2">
            <div className="text-xs text-white/50 mb-1">Try saying:</div>
            <div className="text-xs text-white/70 space-y-1">
              <div>• "Open projects"</div>
              <div>• "About me"</div>
              <div>• "Dark mode"</div>
              <div>• "Contact"</div>
            </div>
          </div>
        </div>
      )}

      {/* Listening animation ring */}
      {isListening && <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-75" />}
    </div>
  )
}
