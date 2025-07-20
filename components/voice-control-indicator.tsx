"use client"

import { Mic, MicOff, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { UseVoiceControlReturn } from "@/hooks/use-voice-control"

export function VoiceControlIndicator({
  voiceControl,
  className,
}: {
  voiceControl: UseVoiceControlReturn
  className?: string
}) {
  const { isListening, isSupported, transcript, confidence, toggleListening, error } = voiceControl

  if (!isSupported) {
    return (
      <div className={cn("relative", className)}>
        <div
          className="flex h-6 w-6 items-center justify-center rounded-full text-red-400 opacity-50"
          title="Speech recognition not supported"
        >
          <MicOff className="h-4 w-4" />
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={toggleListening}
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200 text-white",
          isListening
            ? "bg-red-500/30 text-red-400 animate-pulse"
            : error
              ? "text-red-400 hover:bg-red-500/10"
              : "text-white/70 hover:bg-white/10 hover:text-white",
        )}
        title={error ? error : isListening ? "Stop listening" : "Start voice control"}
      >
        {error ? (
          <AlertCircle className="h-4 w-4" />
        ) : isListening ? (
          <Mic className="h-4 w-4" />
        ) : (
          <MicOff className="h-4 w-4" />
        )}
      </button>

      {/* Status popup */}
      {(isListening || error) && (
        <div className="absolute top-8 right-0 bg-black/95 backdrop-blur-md rounded-lg p-4 min-w-72 border border-white/20 shadow-xl z-50">
          {error ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <span className="text-sm text-red-400 font-medium">Error</span>
              </div>
              <div className="text-sm text-white/90">{error}</div>
              <div className="text-xs text-white/60">Try refreshing the page or check your microphone.</div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mic className="h-4 w-4 text-green-400 animate-pulse" />
                <span className="text-sm text-green-400 font-medium">Listening...</span>
              </div>

              {transcript && <div className="text-sm text-white/90 p-2 bg-white/10 rounded">"{transcript}"</div>}

              <div className="text-xs text-white/60">Confidence: {Math.round(confidence * 100)}%</div>

              <div className="border-t border-white/10 pt-2">
                <div className="text-xs text-white/50 mb-1">Try saying:</div>
                <div className="text-xs text-white/70 space-y-1">
                  <div>• "Hello"</div>
                  <div>• "Open projects"</div>
                  <div>• "About me"</div>
                  <div>• "Dark mode"</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Listening animation */}
      {isListening && <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-75" />}
    </div>
  )
}
