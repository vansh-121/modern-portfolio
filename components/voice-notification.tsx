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
    }, 4000)

    return () => clearTimeout(timer)
  }, [onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  }

  const colors = {
    success: "bg-green-600/90 border-green-500",
    error: "bg-red-600/90 border-red-500",
    info: "bg-blue-600/90 border-blue-500",
  }

  const Icon = icons[type]

  return (
    <div
      className={cn(
        "fixed top-20 right-4 z-50 transition-all duration-300 transform max-w-sm",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
      )}
    >
      <div
        className={cn(
          "flex items-start space-x-3 px-4 py-3 rounded-lg backdrop-blur-md border shadow-lg text-white",
          colors[type],
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium leading-relaxed">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="text-white/70 hover:text-white transition-colors"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
