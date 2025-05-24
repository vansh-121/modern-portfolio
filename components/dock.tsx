"use client"

import { memo } from "react"
import { Button } from "@/components/ui/button"
import { FolderOpen, User, FileText, Mail, Trash2, Terminal } from "lucide-react"

interface DockProps {
  onOpenWindow: (id: string) => void
  windows: Array<{ id: string; isOpen: boolean; isMinimized: boolean }>
}

export const Dock = memo(function Dock({ onOpenWindow, windows }: DockProps) {
  const dockItems = [
    { id: "projects", icon: FolderOpen, label: "Projects", color: "from-blue-500 to-blue-600" },
    { id: "about", icon: User, label: "About", color: "from-green-500 to-green-600" },
    { id: "resume", icon: FileText, label: "Resume", color: "from-purple-500 to-purple-600" },
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
    <div className="fixed bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-2 md:p-3 border border-white/20 shadow-2xl">
        <div className="flex items-center space-x-1 md:space-x-2 overflow-x-auto scrollbar-none">
          {dockItems.map((item) => {
            const { isOpen, isMinimized } = getWindowState(item.id)
            const Icon = item.icon

            return (
              <div key={item.id} className="relative group flex-shrink-0">
                <Button
                  variant="ghost"
                  size="lg"
                  className={`
                    h-12 w-12 md:h-16 md:w-16 rounded-lg md:rounded-xl transition-all duration-300 ease-out
                    hover:scale-110 md:hover:scale-125 hover:bg-white/20 active:scale-95
                    transform-gpu will-change-transform
                    ${isOpen && !isMinimized ? "bg-white/20 shadow-lg scale-105 md:scale-110" : ""}
                    ${isMinimized ? "bg-yellow-500/30" : ""}
                  `}
                  onClick={() => onOpenWindow(item.id)}
                >
                  <div className={`p-1.5 md:p-2 rounded-md md:rounded-lg bg-gradient-to-br ${item.color} shadow-lg`}>
                    <Icon className="h-5 w-5 md:h-8 md:w-8 text-white drop-shadow-lg" />
                  </div>
                </Button>

                {/* Active indicator */}
                {isOpen && !isMinimized && (
                  <div className="absolute -bottom-0.5 md:-bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full shadow-lg animate-pulse" />
                )}

                {/* Minimized indicator */}
                {isMinimized && (
                  <div className="absolute -bottom-0.5 md:-bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-400 rounded-full shadow-lg" />
                )}

                {/* Tooltip - Hidden on mobile */}
                <div className="hidden md:block absolute bottom-16 md:bottom-20 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none scale-75 group-hover:scale-100">
                  <div className="bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-xl backdrop-blur-sm">
                    {item.label}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90" />
                  </div>
                </div>
              </div>
            )
          })}

          {/* Separator */}
          <div className="w-px h-10 md:h-14 bg-white/20 mx-1 md:mx-2 flex-shrink-0" />

          {/* Trash */}
          <div className="relative group flex-shrink-0">
            <Button
              variant="ghost"
              size="lg"
              className="h-12 w-12 md:h-16 md:w-16 rounded-lg md:rounded-xl transition-all duration-300 ease-out hover:scale-110 md:hover:scale-125 hover:bg-white/20 active:scale-95"
            >
              <div className="p-1.5 md:p-2 rounded-md md:rounded-lg bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
                <Trash2 className="h-5 w-5 md:h-8 md:w-8 text-white drop-shadow-lg" />
              </div>
            </Button>

            <div className="hidden md:block absolute bottom-16 md:bottom-20 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none scale-75 group-hover:scale-100">
              <div className="bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-xl backdrop-blur-sm">
                Trash
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
