"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Battery, Wifi } from "lucide-react"
import { useTheme } from "next-themes"

export function MenuBar() {
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      )
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      )
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-8 bg-black/20 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 text-white text-sm font-medium z-50">
      {/* Left side - App menu */}
      <div className="flex items-center space-x-4">
        <span className="font-bold">Portfolio</span>
        <span className="text-white/70">File</span>
        <span className="text-white/70">Edit</span>
        <span className="text-white/70">View</span>
        <span className="text-white/70">Window</span>
        <span className="text-white/70">Help</span>
      </div>

      {/* Right side - System indicators */}
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-white hover:bg-white/10"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <div className="flex items-center space-x-1">
          <Wifi className="h-4 w-4" />
          <Battery className="h-4 w-4" />
          <span className="text-xs">100%</span>
        </div>

        <div className="text-right">
          <div className="text-xs leading-none">{currentDate}</div>
          <div className="text-xs leading-none">{currentTime}</div>
        </div>
      </div>
    </div>
  )
}
