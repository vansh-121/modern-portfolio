"use client"

import { useState, useEffect, memo } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Battery, Wifi, Volume2, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"

export const MenuBar = memo(function MenuBar() {
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
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

  const menuItems = [
    { label: "About", action: () => console.log("About clicked") },
    { label: "Projects", action: () => console.log("Projects clicked") },
    { label: "LinkedIn", action: () => window.open("https://linkedin.com/in/vansh-sethi-vs/", "_blank") },
    { label: "GitHub", action: () => window.open("https://github.com/vansh-121", "_blank") },
    { label: "Portfolio", action: () => window.open("https://vanshsethi.netlify.app/", "_blank") },
    { label: "Contact", action: () => console.log("Contact clicked") },
  ]

  return (
    <>
      <div
        className={`
        fixed top-0 left-0 right-0 bg-black/20 backdrop-blur-md border-b border-white/10 
        flex items-center justify-between text-white font-medium z-50
        ${isMobile ? "h-10 px-3 text-xs" : "h-8 px-4 text-sm"}
      `}
      >
        {/* Left side - App menu */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <span
            className={`
            font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent
            ${isMobile ? "text-xs" : "text-sm"}
          `}
          >
            {isMobile ? "Portfolio" : "Portfolio OS"}
          </span>

          {/* Desktop menu items */}
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => (
              <span
                key={item.label}
                className="text-white/70 hover:text-white cursor-pointer transition-colors text-sm"
                onClick={item.action}
              >
                {item.label}
              </span>
            ))}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden h-6 w-6 p-0 text-white hover:bg-white/10"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="h-3 w-3" /> : <Menu className="h-3 w-3" />}
          </Button>
        </div>

        {/* Right side - System indicators */}
        <div className="flex items-center space-x-1 md:space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className={`
              p-0 text-white hover:bg-white/10 transition-all duration-200
              ${isMobile ? "h-5 w-5" : "h-6 w-6"}
            `}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
            ) : (
              <Moon className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
            )}
          </Button>

          {/* System indicators - Simplified for mobile */}
          {!isMobile && (
            <div className="flex items-center space-x-1">
              <Volume2 className="h-3 w-3 md:h-4 md:w-4 opacity-80" />
              <Wifi className="h-3 w-3 md:h-4 md:w-4 opacity-80" />
              <Battery className="h-3 w-3 md:h-4 md:w-4 opacity-80" />
              <span className="text-xs opacity-80 hidden md:inline">100%</span>
            </div>
          )}

          {/* Date and time - Mobile optimized */}
          <div className="text-right">
            {!isMobile && <div className="text-xs leading-none opacity-90">{currentDate}</div>}
            <div className={`leading-none font-mono ${isMobile ? "text-xs" : "text-xs"}`}>{currentTime}</div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && isMobile && (
        <div className="fixed top-10 left-0 right-0 bg-black/90 backdrop-blur-md border-b border-white/10 z-40">
          <div className="p-4 space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className="block w-full text-left text-white/70 hover:text-white transition-colors py-2 text-sm"
                onClick={() => {
                  item.action()
                  setShowMobileMenu(false)
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
})
