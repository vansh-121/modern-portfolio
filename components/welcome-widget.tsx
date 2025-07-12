"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, MapPin, Thermometer } from "lucide-react"

export function WelcomeWidget() {
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)
    return () => window.removeEventListener("resize", checkDevice)
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
          weekday: isMobile ? "short" : "long",
          year: "numeric",
          month: isMobile ? "short" : "long",
          day: "numeric",
        }),
      )
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)

    // Animate in after a delay
    const timer = setTimeout(() => setIsVisible(true), 500)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [isMobile])

  if (isMobile) {
    // Simplified mobile version
    return (
      <div
        className={`
          absolute top-4 left-4 right-4 transition-all duration-1000 ease-out z-widget safe-area-inset-top
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
        `}
      >
        <Card className="bg-white/15 backdrop-blur-md border-white/30 shadow-lg">
          <CardContent className="p-3">
            <div className="text-center">
              <div className="text-white font-bold text-sm macos-mono">{currentTime}</div>
              <div className="text-white/80 text-xs macos-text">{currentDate}</div>
              <Badge variant="secondary" className="mt-2 bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                Available for Work
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div
      className={`
        absolute top-8 left-8 transition-all duration-1000 ease-out z-widget
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
      `}
    >
      <Card className="window-glass shadow-2xl border-white/40 dark:border-white/20 hover:bg-white/20 dark:hover:bg-gray-900/40 transition-all duration-300">
        <CardContent className="p-6 space-y-4">
          {/* Welcome Message */}
          <div>
            <h2 className="text-lg lg:text-2xl font-bold mb-1 text-gray-900 dark:text-white macos-display">
              Welcome Back!
            </h2>
            <p className="text-gray-700 dark:text-gray-200 text-sm lg:text-base macos-text">
              Ready to explore my portfolio?
            </p>
          </div>

          {/* Date and Time */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-gray-800 dark:text-gray-100 macos-text">{currentDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-lg font-mono text-gray-900 dark:text-gray-50 macos-mono">{currentTime}</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm text-gray-800 dark:text-gray-100 macos-text">India</span>
            </div>
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm text-gray-800 dark:text-gray-100 macos-text">Perfect coding weather</span>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 border-green-300 dark:border-green-600 text-xs"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Available for Work
            </Badge>
          </div>

          {/* Quick Actions */}
          <div className="text-xs text-gray-600 dark:text-gray-300 pt-2 border-t border-gray-300 dark:border-gray-600 macos-text">
            Click dock icons to explore my work
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
