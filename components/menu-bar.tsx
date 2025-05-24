"use client"

import { useState, useEffect, memo } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Battery, Wifi, Volume2, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"

export const MenuBar = memo(function MenuBar() {
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) {
        setIsMobileMenuOpen(false) // Close mobile menu on desktop
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

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
          weekday: isMobile ? "short" : "short",
          month: "short",
          day: "numeric",
        }),
      )
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)
    return () => clearInterval(interval)
  }, [isMobile])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const menuItems = ["File", "Edit", "View", "Window", "Help"]

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-8 md:h-8 bg-black/20 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-2 md:px-4 text-white text-xs md:text-sm font-medium z-50">
        {/* Left side - App menu */}
        <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
          <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-xs md:text-sm flex-shrink-0">
            Portfolio OS
          </span>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => (
              <span key={item} className="text-white/70 hover:text-white cursor-pointer transition-colors">
                {item}
              </span>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden h-6 w-6 p-0 text-white hover:bg-white/10 touch-manipulation"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="h-3 w-3" /> : <Menu className="h-3 w-3" />}
          </Button>
        </div>

        {/* Right side - System indicators */}
        <div className="flex items-center space-x-1 md:space-x-3 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 md:h-6 md:w-6 p-0 text-white hover:bg-white/10 transition-all duration-200 touch-manipulation"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-3 w-3 md:h-4 md:w-4" /> : <Moon className="h-3 w-3 md:h-4 md:w-4" />}
          </Button>

          <div className="hidden sm:flex items-center space-x-1">
            <Volume2 className="h-3 w-3 md:h-4 md:w-4 opacity-80" />
            <Wifi className="h-3 w-3 md:h-4 md:w-4 opacity-80" />
            <Battery className="h-3 w-3 md:h-4 md:w-4 opacity-80" />
            <span className="text-xs opacity-80 hidden lg:inline">100%</span>
          </div>

          <div className="text-right">
            <div className="text-xs leading-none opacity-90 hidden sm:block">{currentDate}</div>
            <div className="text-xs leading-none font-mono">{currentTime}</div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && isMobile && (
        <div className="fixed top-8 left-0 right-0 bg-black/90 backdrop-blur-md border-b border-white/10 z-40 animate-in slide-in-from-top duration-200">
          <div className="px-4 py-3 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item}
                className="block w-full text-left text-white/70 hover:text-white py-2 px-2 rounded hover:bg-white/10 transition-colors touch-manipulation"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </button>
            ))}

            {/* Mobile System Info */}
            <div className="border-t border-white/10 pt-2 mt-2">
              <div className="flex items-center justify-between text-xs text-white/60">
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-3 w-3" />
                  <Wifi className="h-3 w-3" />
                  <Battery className="h-3 w-3" />
                  <span>100%</span>
                </div>
                <div>System Status: Online</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
})
