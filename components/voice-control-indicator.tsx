"use client"

import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"
import { useState, useEffect } from "react"

interface VoiceControlIndicatorProps {
  voiceControl: {
    isListening: boolean
    isSupported: boolean
    startListening: () => void
    stopListening: () => void
    transcript: string
  }
}

export function VoiceControlIndicator({ voiceControl }: VoiceControlIndicatorProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (voiceControl.isListening) {
      setIsAnimating(true)
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [voiceControl.isListening])

  if (!voiceControl.isSupported) {
    return (
      <div className="flex items-center space-x-1 opacity-50">
        <MicOff className="h-3 w-3 text-gray-500" />
        <span className="text-xs text-gray-500 hidden sm:inline">No Mic</span>
      </div>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={voiceControl.isListening ? voiceControl.stopListening : voiceControl.startListening}
      className={`h-6 px-2 text-xs transition-all duration-200 ${
        voiceControl.isListening ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "hover:bg-white/10 text-gray-300"
      }`}
    >
      <div className="flex items-center space-x-1">
        {voiceControl.isListening ? (
          <div className="relative">
            <Mic className="h-3 w-3" />
            {isAnimating && (
              <div className="absolute inset-0 animate-ping">
                <Mic className="h-3 w-3 text-red-400" />
              </div>
            )}
          </div>
        ) : (
          <Mic className="h-3 w-3" />
        )}
        <span className="hidden sm:inline">{voiceControl.isListening ? "Listening..." : "Voice"}</span>
      </div>
    </Button>
  )
}
