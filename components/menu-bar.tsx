"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2, Wifi, Battery } from "lucide-react"
import { ThemeSelector } from "@/components/theme-selector"
import { DarkModeToggle } from "@/components/dark-mode-toggle"

interface MenuBarProps {
  voiceControl: {
    isListening: boolean
    isSupported: boolean
    startListening: () => void
    stopListening: () => void
    transcript: string
  }
  onNavigate: (section: string) => void
}

export function MenuBar({ voiceControl, onNavigate }: MenuBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [batteryLevel, setBatteryLevel] = useState(100)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const navigationItems = [
    { label: "About", id: "about" },
    { label: "Projects", id: "projects" },
    { label: "LinkedIn", id: "linkedin", external: "https://linkedin.com" },
    { label: "GitHub", id: "github", external: "https://github.com" },
    { label: "Medium", id: "medium", external: "https://medium.com" },
    { label: "Contact", id: "contact" },
  ]

  const handleNavClick = (item: any) => {
    if (item.external) {
      window.open(item.external, "_blank")
    } else {
      onNavigate(item.id)
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-8 bg-black/20 backdrop-blur-md border-b border-white/10 z-50 flex items-center justify-between px-4 text-white text-sm">
      {/* Left side - Portfolio OS and Navigation */}
      <div className="flex items-center space-x-6">
        <span className="font-medium text-blue-400">Portfolio OS</span>

        <div className="flex items-center space-x-4">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => handleNavClick(item)}
              className="h-6 px-2 text-xs font-normal hover:bg-white/10 text-white/90 hover:text-white"
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Right side - System indicators */}
      <div className="flex items-center space-x-3">
        {/* Voice Control */}
        <Button
          variant="ghost"
          size="sm"
          onClick={voiceControl.isListening ? voiceControl.stopListening : voiceControl.startListening}
          className={`h-6 w-6 p-0 hover:bg-white/10 ${voiceControl.isListening ? "text-red-400" : "text-white/70"}`}
          disabled={!voiceControl.isSupported}
        >
          {voiceControl.isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
        </Button>

        {/* Dark Mode Toggle */}
        <DarkModeToggle />

        {/* Theme Selector */}
        <ThemeSelector />

        {/* Volume */}
        <Volume2 className="h-3 w-3 text-white/70" />

        {/* WiFi */}
        <Wifi className="h-3 w-3 text-white/70" />

        {/* Battery */}
        <div className="flex items-center space-x-1">
          <Battery className="h-3 w-3 text-white/70" />
          <span className="text-xs text-white/70">{batteryLevel}%</span>
        </div>

        {/* Time */}
        <span className="text-xs font-medium text-white">{formatTime(currentTime)}</span>
      </div>
    </div>
  )
}
