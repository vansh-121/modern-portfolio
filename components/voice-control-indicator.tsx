"use client"

import { Mic, MicOff, Volume2, AlertCircle, RefreshCw } from "lucide-react"
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
    console.log("🖱️ Voice control button clicked")
    toggleListening()
  }

  const getButtonState = () => {
    if (error) return "error"
    if (isListening) return "listening"
    return "idle"
  }

  const buttonState = getButtonState()

  const stateConfig = {
    listening: {
      icon: Mic,
      className: "bg-red-500/30 text-red-400 animate-pulse shadow-lg shadow-red-500/20",
      title: "Stop listening (click to stop)",
    },
    error: {
      icon: AlertCircle,
      className: "text-red-400 hover:bg-red-500/10",
      title: `Error: ${error}`,
    },
    idle: {
      icon: MicOff,
      className: "text-white/70 hover:bg-white/10 hover:text-white",
      title: "Start voice control (click to start)",
    },
  }

  const { icon: Icon, className: stateClassName, title } = stateConfig[buttonState]

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={handleClick}
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200",
          stateClassName,
        )}
        title={title}
        aria-label={isListening ? "Stop voice recognition" : "Start voice recognition"}
      >
        <Icon className="h-4 w-4" />
      </button>

      {/* Status popup */}
      {(isListening || error) && (
        <div className="absolute top-8 right-0 bg-black/95 backdrop-blur-md rounded-lg p-4 min-w-80 border border-white/20 shadow-xl z-50">
          {error ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <span className="text-sm text-red-400 font-medium">Voice Control Error</span>
              </div>

              <div className="text-sm text-white/90 leading-relaxed bg-red-500/10 p-3 rounded border-l-2 border-red-400">
                {error}
              </div>

              <div className="text-xs text-white/60 space-y-1">
                <div>• Make sure your microphone is connected</div>
                <div>• Allow microphone permissions in your browser</div>
                <div>• Try refreshing the page if the issue persists</div>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="flex items-center space-x-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Refresh Page</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Volume2 className="h-5 w-5 text-green-400 animate-pulse" />
                <span className="text-sm text-green-400 font-medium">Listening for Commands</span>
              </div>

              {transcript && (
                <div className="text-sm text-white/90 p-3 bg-blue-500/10 rounded border-l-2 border-blue-400">
                  <div className="text-xs text-blue-300 mb-1">You said:</div>
                  <div className="font-medium">"{transcript}"</div>
                </div>
              )}

              <div className="text-xs text-white/60">
                Confidence: {Math.round(confidence * 100)}% • Auto-stop in 10s
              </div>

              <div className="border-t border-white/10 pt-3">
                <div className="text-xs text-white/50 mb-2">Available Commands:</div>
                <div className="text-xs text-white/70 space-y-1">
                  <div>
                    🎯 <span className="text-green-300">"Hello"</span> - Test command
                  </div>
                  <div>
                    📁 <span className="text-blue-300">"Open projects"</span> - View projects
                  </div>
                  <div>
                    👤 <span className="text-purple-300">"About me"</span> - About section
                  </div>
                  <div>
                    🌙 <span className="text-yellow-300">"Dark mode"</span> - Toggle theme
                  </div>
                  <div>
                    📞 <span className="text-pink-300">"Contact"</span> - Contact info
                  </div>
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
