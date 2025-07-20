"use client"

import { useState } from "react"
import { Calendar, Wifi, Battery, VolumeX } from "lucide-react"
import { VoiceControlIndicator } from "./voice-control-indicator"
import type { UseVoiceControlReturn } from "@/hooks/use-voice-control"

interface MenuBarProps {
  voiceControl: UseVoiceControlReturn
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
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-8 bg-black/20 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 text-white text-sm z-50">
      {/* Left side - Apple menu and app name */}
      <div className="flex items-center space-x-4">
        <div className="text-white/90 font-medium">Portfolio</div>
      </div>

      {/* Right side - System indicators */}
      <div className="flex items-center space-x-3">
        {/* Voice Control Indicator */}
        <VoiceControlIndicator voiceControl={voiceControl} />

        {/* System icons */}
        <div className="flex items-center space-x-2 text-white/70">
          <Wifi className="h-4 w-4" />
          <VolumeX className="h-4 w-4" />
          <Battery className="h-4 w-4" />
        </div>

        {/* Date and Time */}
        <div className="flex items-center space-x-2 text-white/90">
          <Calendar className="h-4 w-4" />
          <span className="text-xs">
            {formatDate(currentTime)} {formatTime(currentTime)}
          </span>
        </div>
      </div>
    </div>
  )
}
