"use client"

import { useState, useEffect } from "react"
import { CheckCircle, AlertCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoiceNotificationProps {
  message: string
  type: "success" | "error" | "info"
  onClose: () => void
}

export function VoiceNotification({ message, type, onClose }: VoiceNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const config = {
    success: {
      icon: CheckCircle,
      className: "bg-green-600/95 border-green-500 text-white shadow-lg shadow-green-500/20",
    },
    error: {
      icon: AlertCircle,
      className: "bg-red-600/95 border-red-500 text-white shadow-lg shadow-red-500/20",
    },
    info: {
      icon: Info,
      className: "bg-blue-600/95 border-blue-500 text-white shadow-lg shadow-blue-500/20",
    },
  }

  const { icon: Icon, className } = config[type]

  return (
    <div
      className={cn(
        "fixed top-16 right-4 z-50 transition-all duration-300 transform max-w-sm",
        isVisible ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95",
      )}
    >
      <div className={cn("flex items-start space-x-3 px-4 py-3 rounded-lg backdrop-blur-md border", className)}>
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-relaxed break-words">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="text-white/70 hover:text-white transition-colors flex-shrink-0"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
