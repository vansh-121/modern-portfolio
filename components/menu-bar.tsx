"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Wifi, Battery, Search } from "lucide-react"
import { ThemeSelector } from "@/components/theme-selector"
import { VoiceControlIndicator } from "@/components/voice-control-indicator"

interface MenuBarProps {
  voiceControl: {
    isListening: boolean
    isSupported: boolean
    startListening: () => void
    stopListening: () => void
    transcript: string
  }
}

export function MenuBar({ voiceControl }: MenuBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [batteryLevel, setBatteryLevel] = useState(85)
  const [isOnline, setIsOnline] = useState(true)
  const [volume, setVolume] = useState(75)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Simulate battery drain
  useEffect(() => {
    const timer = setInterval(() => {
      setBatteryLevel((prev) => Math.max(0, prev - Math.random() * 0.1))
    }, 30000)

    return () => clearInterval(timer)
  }, [])

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

  const getBatteryColor = () => {
    if (batteryLevel > 50) return "text-green-400"
    if (batteryLevel > 20) return "text-yellow-400"
    return "text-red-400"
  }

  const getBatteryIcon = () => {
    const level = Math.floor(batteryLevel / 25)
    const bars = "█".repeat(level) + "░".repeat(4 - level)
    return bars
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-8 bg-black/80 backdrop-blur-md border-b border-gray-700/50 z-50 flex items-center justify-between px-4 text-white text-xs">
      {/* Left side - Logo and menu */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-sm flex items-center justify-center">
            <span className="text-[8px] font-bold text-white">P</span>
          </div>
          <span className="font-medium hidden sm:inline">Portfolio</span>
        </div>

        <div className="hidden md:flex items-center space-x-3 text-gray-300">
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs hover:bg-white/10">
            File
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs hover:bg-white/10">
            Edit
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs hover:bg-white/10">
            View
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs hover:bg-white/10">
            Window
          </Button>
        </div>
      </div>

      {/* Center - Search and theme selector */}
      <div className="flex items-center space-x-2">
        <div className="hidden sm:flex items-center space-x-1 bg-white/10 rounded px-2 py-1">
          <Search className="h-3 w-3 text-gray-400" />
          <span className="text-gray-400 text-xs">Spotlight Search</span>
        </div>
        <ThemeSelector />
      </div>

      {/* Right side - System indicators */}
      <div className="flex items-center space-x-3">
        {/* Voice Control */}
        <VoiceControlIndicator voiceControl={voiceControl} />

        {/* Volume */}
        <div className="hidden sm:flex items-center space-x-1">
          {volume > 0 ? <Volume2 className="h-3 w-3 text-gray-300" /> : <VolumeX className="h-3 w-3 text-gray-300" />}
          <span className="text-xs text-gray-300">{Math.round(volume)}%</span>
        </div>

        {/* WiFi */}
        <div className="flex items-center space-x-1">
          <Wifi className={`h-3 w-3 ${isOnline ? "text-green-400" : "text-red-400"}`} />
          <span className="hidden sm:inline text-xs text-gray-300">{isOnline ? "Connected" : "Offline"}</span>
        </div>

        {/* Battery */}
        <div className="hidden sm:flex items-center space-x-1">
          <Battery className={`h-3 w-3 ${getBatteryColor()}`} />
          <span className={`text-xs font-mono ${getBatteryColor()}`}>
            {getBatteryIcon()} {Math.round(batteryLevel)}%
          </span>
        </div>

        {/* Date and Time */}
        <div className="flex flex-col items-end">
          <span className="text-xs font-medium">{formatTime(currentTime)}</span>
          <span className="text-[10px] text-gray-400 hidden sm:inline">{formatDate(currentTime)}</span>
        </div>
      </div>
    </div>
  )
}
