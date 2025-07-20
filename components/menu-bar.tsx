"use client"

import { useState } from "react"
import { Calendar, Wifi, Battery, VolumeX } from "lucide-react"
import { VoiceControlIndicator } from "./voice-control-indicator"

interface MenuBarProps {
  voiceControl: {
    isListening: boolean
    isSupported: boolean
    startListening: () => void
    stopListening: () => void
  }
}

export function MenuBar({ voiceControl }: MenuBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second
  useState(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  })

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const handleVoiceToggle = () => {
    if (voiceControl.isListening) {
      voiceControl.stopListening()
    } else {
      voiceControl.startListening()
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-8 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left side - App menu */}
        <div className="flex items-center space-x-4">
          <div className="text-white text-sm font-medium">Portfolio</div>
        </div>

        {/* Right side - System indicators */}
        <div className="flex items-center space-x-4">
          {/* Voice Control */}
          <VoiceControlIndicator
            isListening={voiceControl.isListening}
            isSupported={voiceControl.isSupported}
            onClick={handleVoiceToggle}
          />

          {/* System icons */}
          <div className="flex items-center space-x-2 text-white/70">
            <Battery className="w-4 h-4" />
            <Wifi className="w-4 h-4" />
            <VolumeX className="w-4 h-4" />
          </div>

          {/* Date and time */}
          <div className="flex items-center space-x-2 text-white text-xs">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(currentTime)}</span>
            <span>{formatTime(currentTime)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
