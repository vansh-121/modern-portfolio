"use client"

import { memo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FolderOpen, User, FileText, Mail, Briefcase, Terminal } from "lucide-react"

interface DockProps {
  onOpenWindow: (id: string) => void
  windows: Array<{ id: string; isOpen: boolean; isMinimized: boolean }>
}

export const Dock = memo(function Dock({ onOpenWindow, windows }: DockProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait")

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setIsMobile(width < 768)
      setOrientation(width > height ? "landscape" : "portrait")
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)
    window.addEventListener("orientationchange", () => {
      setTimeout(checkDevice, 100)
    })

    return () => {
      window.removeEventListener("resize", checkDevice)
      window.removeEventListener("orientationchange", checkDevice)
    }
  }, [])

  const dockItems = [
    { id: "projects", icon: FolderOpen, label: "Projects", color: "from-blue-500 to-blue-600" },
    { id: "about", icon: User, label: "About", color: "from-green-500 to-green-600" },
    { id: "resume", icon: FileText, label: "Resume", color: "from-purple-500 to-purple-600" },
    { id: "services", icon: Briefcase, label: "Services", color: "from-orange-500 to-orange-600" },
    { id: "contact", icon: Mail, label: "Contact", color: "from-pink-500 to-pink-600" },
    { id: "terminal", icon: Terminal, label: "Terminal", color: "from-gray-700 to-gray-800" },
  ]

  const getWindowState = (id: string) => {
    const window = windows.find((w) => w.id === id)
    return {
      isOpen: window?.isOpen || false,
      isMinimized: window?.isMinimized || false,
    }
  }

  return (
    <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-dock safe-area-inset-bottom">
      <div
        className={`
          bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl
          ${isMobile ? "p-2 mx-2" : "p-3"}
        `}
      >
        <div
          className={`
            flex items-center justify-center overflow-x-auto scrollbar-none
            ${isMobile ? "space-x-1 px-1" : "space-x-2"}
          `}
        >
          {dockItems.map((item) => {
            const { isOpen, isMinimized } = getWindowState(item.id)
            const Icon = item.icon

            return (
              <div key={item.id} className="relative group flex-shrink-0">
                <Button
                  variant="ghost"
                  size="lg"
                  className={`
                    ${isMobile ? "h-14 w-14 min-w-[56px]" : "h-16 w-16"}
                    rounded-xl transition-all duration-300 ease-out
                    hover:scale-110 hover:bg-white/20 active:scale-95
                    transform-gpu will-change-transform
                    ${isOpen && !isMinimized ? "bg-white/20 shadow-lg scale-105" : ""}
                    ${isMinimized ? "bg-yellow-500/30" : ""}
                    touch-manipulation
                  `}
                  onClick={() => onOpenWindow(item.id)}
                >
                  <div
                    className={`
                      ${isMobile ? "p-2" : "p-2.5"}
                      rounded-lg bg-gradient-to-br ${item.color} shadow-lg
                    `}
                  >
                    <Icon className={`${isMobile ? "h-6 w-6" : "h-8 w-8"} text-white drop-shadow-lg`} />
                  </div>
                </Button>

                {/* Active indicator */}
                {isOpen && !isMinimized && (
                  <div
                    className={`
                      absolute left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg animate-pulse
                      ${isMobile ? "-bottom-0.5 w-1.5 h-1.5" : "-bottom-1 w-2 h-2"}
                    `}
                  />
                )}

                {/* Minimized indicator */}
                {isMinimized && (
                  <div
                    className={`
                      absolute left-1/2 transform -translate-x-1/2 bg-yellow-400 rounded-full shadow-lg
                      ${isMobile ? "-bottom-0.5 w-1.5 h-1.5" : "-bottom-1 w-2 h-2"}
                    `}
                  />
                )}

                {/* Tooltip - Hidden on mobile */}
                {!isMobile && (
                  <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none scale-75 group-hover:scale-100 z-tooltip">
                    <div className="bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-xl backdrop-blur-sm">
                      {item.label}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90" />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
})
