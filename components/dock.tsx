"use client"

import { Button } from "@/components/ui/button"
import { FolderOpen, User, FileText, Mail, Trash2 } from "lucide-react"

interface DockProps {
  onOpenWindow: (id: string) => void
  windows: Array<{ id: string; isOpen: boolean; isMinimized: boolean }>
}

export function Dock({ onOpenWindow, windows }: DockProps) {
  const dockItems = [
    { id: "projects", icon: FolderOpen, label: "Projects" },
    { id: "about", icon: User, label: "About" },
    { id: "resume", icon: FileText, label: "Resume" },
    { id: "contact", icon: Mail, label: "Contact" },
  ]

  const getWindowState = (id: string) => {
    const window = windows.find((w) => w.id === id)
    return {
      isOpen: window?.isOpen || false,
      isMinimized: window?.isMinimized || false,
    }
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 shadow-2xl">
        <div className="flex items-center space-x-1">
          {dockItems.map((item) => {
            const { isOpen, isMinimized } = getWindowState(item.id)
            const Icon = item.icon

            return (
              <div key={item.id} className="relative group">
                <Button
                  variant="ghost"
                  size="lg"
                  className={`
                    h-14 w-14 rounded-xl transition-all duration-200 ease-out
                    hover:scale-110 hover:bg-white/20 active:scale-95
                    ${isOpen && !isMinimized ? "bg-white/20 shadow-lg" : ""}
                    ${isMinimized ? "bg-yellow-500/30" : ""}
                  `}
                  onClick={() => onOpenWindow(item.id)}
                >
                  <Icon className="h-8 w-8 text-white drop-shadow-lg" />
                </Button>

                {/* Active indicator */}
                {isOpen && !isMinimized && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                )}

                {/* Minimized indicator */}
                {isMinimized && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full" />
                )}

                {/* Tooltip */}
                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">{item.label}</div>
                </div>
              </div>
            )
          })}

          {/* Separator */}
          <div className="w-px h-12 bg-white/20 mx-1" />

          {/* Trash */}
          <div className="relative group">
            <Button
              variant="ghost"
              size="lg"
              className="h-14 w-14 rounded-xl transition-all duration-200 ease-out hover:scale-110 hover:bg-white/20 active:scale-95"
            >
              <Trash2 className="h-8 w-8 text-white drop-shadow-lg" />
            </Button>

            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">Trash</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
