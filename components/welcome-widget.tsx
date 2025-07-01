"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Thermometer } from "lucide-react"

export function WelcomeWidget() {
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")
  const [isVisible, setIsVisible] = useState(false)
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

  // Hide on mobile landscape to save space
  if (isMobile && orientation === "landscape") {
    return null
  }

  return (
    <div
      className={`
        absolute top-2 md:top-4 lg:top-8 left-2 md:left-4 lg:left-8 transition-all duration-1000 ease-out
        hidden sm:block z-5
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
        ${isMobile ? "scale-90" : "scale-100"}
      `}
    >
      <Card className="window-glass shadow-2xl border-white/40 dark:border-white/20 glow-blue">
        <CardContent className="p-2 md:p-4 lg:p-6 space-y-1 md:space-y-2 lg:space-y-4">
          {/* Welcome Message */}
          <div>
            <h2 className="text-sm md:text-lg lg:text-2xl font-bold mb-1 text-gray-900 dark:text-white text-shadow-light dark:text-shadow-dark">
              Welcome Back!
            </h2>
            <p className="text-gray-700 dark:text-gray-200 text-xs md:text-sm lg:text-base text-shadow-light dark:text-shadow-dark">
              Ready to explore my portfolio?
            </p>
          </div>

          {/* Date and Time */}
          <div className="space-y-1 md:space-y-2">
            <div className="flex items-center gap-1 md:gap-2">
              <Calendar className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-4 lg:h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs md:text-sm text-gray-800 dark:text-gray-100 text-shadow-light dark:text-shadow-dark">
                {currentDate}
              </span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <Clock className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-4 lg:h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs md:text-base lg:text-lg font-mono text-gray-900 dark:text-gray-50 text-shadow-light dark:text-shadow-dark">
                {currentTime}
              </span>
            </div>
          </div>

          {/* Quick Stats - Hidden on small screens */}
          <div className="space-y-1 md:space-y-2 hidden lg:block">
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 lg:w-4 lg:h-4 text-green-600 dark:text-green-400" />
              <span className="text-xs lg:text-sm text-gray-800 dark:text-gray-100 text-shadow-light dark:text-shadow-dark">
                India
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Thermometer className="w-3 h-3 lg:w-4 lg:h-4 text-orange-600 dark:text-orange-400" />
              <span className="text-xs lg:text-sm text-gray-800 dark:text-gray-100 text-shadow-light dark:text-shadow-dark">
                Perfect coding weather
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1 md:gap-2">
            <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 border-green-300 dark:border-green-600 text-xs glow-blue">
              <div className="w-1 h-1 md:w-1.5 md:h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full mr-1 md:mr-2 animate-pulse" />
              Available for Work
            </Badge>
          </div>

          {/* Quick Actions */}
          <div className="text-xs text-gray-600 dark:text-gray-300 pt-1 md:pt-2 border-t border-gray-300 dark:border-gray-600 text-shadow-light dark:text-shadow-dark">
            Click dock icons to explore my work
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
