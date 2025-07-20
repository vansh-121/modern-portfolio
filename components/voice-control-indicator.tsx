"use client"

import { Mic, MicOff, Volume2, AlertCircle } from "lucide-react"
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
          title="Speech recognition not supported in this browser"
        >
          <MicOff className="h-4 w-4" />
        </div>
      </div>
    )
  }

  const handleClick = () => {
    console.log("Voice control button clicked")
    toggleListening()
  }

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={handleClick}
        disabled={!!error && error.includes("not supported")}
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200 text-white",
          isListening
            ? "bg-red-500/30 text-red-400 animate-pulse shadow-lg shadow-red-500/20"
            : error
              ? "text-red-400 hover:bg-red-500/10"
              : "text-white/70 hover:bg-white/10 hover:text-white",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        )}
        title={error ? `Error: ${error}` : isListening ? "Stop listening" : "Start voice control"}
        aria-label={isListening ? "Stop voice recognition" : "Start voice recognition"}
      >
        {error ? (
          <AlertCircle className="h-4 w-4" />
        ) : isListening ? (
          <Mic className="h-4 w-4" />
        ) : (
          <MicOff className="h-4 w-4" />
        )}
      </button>

      {/* Voice feedback popup */}
      {(isListening || error) && (
        <div className="absolute top-8 right-0 bg-black/95 backdrop-blur-md rounded-lg p-4 min-w-72 border border-white/20 shadow-xl z-50">
          {error ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <span className="text-sm text-red-400 font-medium">Error</span>
              </div>
              <div className="text-sm text-white/90 leading-relaxed">{error}</div>
              <div className="text-xs text-white/60">Try refreshing the page or checking your browser permissions.</div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4 text-green-400 animate-pulse" />
                <span className="text-sm text-green-400 font-medium">Listening...</span>
              </div>

              {transcript && (
                <div className="text-sm text-white/90 p-2 bg-white/10 rounded border-l-2 border-blue-400">
                  "{transcript}"
                </div>
              )}

              <div className="text-xs text-white/60">Confidence: {Math.round(confidence * 100)}%</div>

              <div className="border-t border-white/10 pt-3">
                <div className="text-xs text-white/50 mb-2">Try saying:</div>
                <div className="text-xs text-white/70 space-y-1">
                  <div>• "Hello" (test command)</div>
                  <div>• "Open projects"</div>
                  <div>• "About me"</div>
                  <div>• "Dark mode"</div>
                  <div>• "Contact"</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Listening animation ring */}
      {isListening && <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-75" />}
    </div>
  )
}
