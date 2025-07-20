"use client"

import { useState, useEffect } from "react"
import { CheckCircle, AlertCircle, Mic } from "lucide-react"
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
      setTimeout(onClose, 300) // Wait for animation to complete
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Mic,
  }

  const colors = {
    success: "bg-green-500/90 border-green-400",
    error: "bg-red-500/90 border-red-400",
    info: "bg-blue-500/90 border-blue-400",
  }

  const Icon = icons[type]

  return (
    <div
      className={cn(
        "fixed top-16 right-4 z-50 transition-all duration-300 transform",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
      )}
    >
      <div
        className={cn(
          "flex items-center space-x-3 px-4 py-3 rounded-lg backdrop-blur-md border shadow-lg text-white max-w-sm",
          colors[type],
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  )
}
