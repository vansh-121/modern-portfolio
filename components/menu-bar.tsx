"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Sun, Moon, Wifi, Battery, Volume2, Menu, X } from "lucide-react"

export function MenuBar() {
  const [currentTime, setCurrentTime] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 right-0 h-10 bg-black/90 backdrop-blur-md border-b border-gray-700/50 z-dock safe-area-inset-top">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:bg-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={14} /> : <Menu size={14} />}
            </Button>
            <span className="text-white text-sm font-semibold macos-text">Portfolio OS</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:bg-white/10"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun size={12} /> : <Moon size={12} />}
            </Button>
            <span className="text-white text-sm font-mono macos-mono">{currentTime}</span>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-b border-gray-700/50 p-4">
            <div className="grid grid-cols-2 gap-4 text-white text-sm">
              <div className="flex items-center gap-2">
                <Wifi size={14} />
                <span className="macos-text">Connected</span>
              </div>
              <div className="flex items-center gap-2">
                <Battery size={14} />
                <span className="macos-text">100%</span>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 size={14} />
                <span className="macos-text">75%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="macos-text">Online</span>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-8 bg-black/90 backdrop-blur-md border-b border-gray-700/50 z-dock">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left side - Apple menu and app name */}
        <div className="flex items-center space-x-4">
          <div className="text-white text-sm font-bold macos-text">🍎</div>
          <span className="text-white text-sm font-semibold macos-text">Portfolio OS</span>
        </div>

        {/* Right side - System indicators */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-white text-xs">
            <Wifi size={12} />
            <Battery size={12} />
            <Volume2 size={12} />
          </div>

          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white hover:bg-white/10" onClick={toggleTheme}>
            {theme === "dark" ? <Sun size={12} /> : <Moon size={12} />}
          </Button>

          <span className="text-white text-sm font-mono macos-mono">{currentTime}</span>
        </div>
      </div>
    </div>
  )
}
