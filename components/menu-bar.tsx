"use client"

import { useState, useEffect, memo } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Battery, Wifi, Volume2, Menu } from "lucide-react"
import { useTheme } from "next-themes"

export const MenuBar = memo(function MenuBar() {
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
    <div className="fixed top-0 left-0 right-0 h-8 md:h-8 bg-black/20 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-2 md:px-4 text-white text-xs md:text-sm font-medium z-50">
      {/* Left side - App menu */}
      <div className="flex items-center space-x-2 md:space-x-4">
        <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-xs md:text-sm">
          Portfolio OS
        </span>
        <div className="hidden md:flex items-center space-x-4">
          <span className="text-white/70 hover:text-white cursor-pointer transition-colors">File</span>
          <span className="text-white/70 hover:text-white cursor-pointer transition-colors">Edit</span>
          <span className="text-white/70 hover:text-white cursor-pointer transition-colors">View</span>
          <span className="text-white/70 hover:text-white cursor-pointer transition-colors">Window</span>
          <span className="text-white/70 hover:text-white cursor-pointer transition-colors">Help</span>
        </div>
        <Button variant="ghost" size="sm" className="md:hidden h-5 w-5 p-0 text-white hover:bg-white/10">
          <Menu className="h-3 w-3" />
        </Button>
      </div>

      {/* Right side - System indicators */}
      <div className="flex items-center space-x-1 md:space-x-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 md:h-6 md:w-6 p-0 text-white hover:bg-white/10 transition-all duration-200"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-3 w-3 md:h-4 md:w-4" /> : <Moon className="h-3 w-3 md:h-4 md:w-4" />}
        </Button>

        <div className="hidden sm:flex items-center space-x-1">
          <Volume2 className="h-3 w-3 md:h-4 md:w-4 opacity-80" />
          <Wifi className="h-3 w-3 md:h-4 md:w-4 opacity-80" />
          <Battery className="h-3 w-3 md:h-4 md:w-4 opacity-80" />
          <span className="text-xs opacity-80 hidden md:inline">100%</span>
        </div>

        <div className="text-right">
          <div className="text-xs leading-none opacity-90 hidden sm:block">{currentDate}</div>
          <div className="text-xs leading-none font-mono">{currentTime}</div>
        </div>
      </div>
    </div>
  )
})
