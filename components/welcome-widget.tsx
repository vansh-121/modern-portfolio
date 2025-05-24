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
        hidden sm:block
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
        ${isMobile ? "scale-90" : "scale-100"}
      `}
    >
      <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white shadow-2xl">
        <CardContent className="p-2 md:p-4 lg:p-6 space-y-1 md:space-y-2 lg:space-y-4">
          {/* Welcome Message */}
          <div>
            <h2 className="text-sm md:text-lg lg:text-2xl font-bold mb-1">Welcome Back!</h2>
            <p className="text-white/80 text-xs md:text-sm lg:text-base">Ready to explore my portfolio?</p>
          </div>

          {/* Date and Time */}
          <div className="space-y-1 md:space-y-2">
            <div className="flex items-center gap-1 md:gap-2">
              <Calendar className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-4 lg:h-4" />
              <span className="text-xs md:text-sm">{currentDate}</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <Clock className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-4 lg:h-4" />
              <span className="text-xs md:text-base lg:text-lg font-mono">{currentTime}</span>
            </div>
          </div>

          {/* Quick Stats - Hidden on small screens */}
          <div className="space-y-1 md:space-y-2 hidden lg:block">
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs lg:text-sm">San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-2">
              <Thermometer className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs lg:text-sm">72°F - Sunny</span>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1 md:gap-2">
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
              <div className="w-1 h-1 md:w-1.5 md:h-1.5 lg:w-2 lg:h-2 bg-green-400 rounded-full mr-1 md:mr-2 animate-pulse" />
              Available for Work
            </Badge>
          </div>

          {/* Quick Actions */}
          <div className="text-xs text-white/60 pt-1 md:pt-2 border-t border-white/10">
            Click dock icons to explore my work
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
