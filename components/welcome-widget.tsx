"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Thermometer } from "lucide-react"

export function WelcomeWidget() {
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")
  const [isVisible, setIsVisible] = useState(false)

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
          weekday: "long",
          year: "numeric",
          month: "long",
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
  }, [])

  return (
    <div
      className={`
        absolute top-4 md:top-8 left-4 md:left-8 transition-all duration-1000 ease-out
        hidden sm:block
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
      `}
    >
      <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white shadow-2xl">
        <CardContent className="p-3 md:p-6 space-y-2 md:space-y-4">
          {/* Welcome Message */}
          <div>
            <h2 className="text-lg md:text-2xl font-bold mb-1">Welcome Back!</h2>
            <p className="text-white/80 text-sm md:text-base">Ready to explore my portfolio?</p>
          </div>

          {/* Date and Time */}
          <div className="space-y-1 md:space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm">{currentDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-sm md:text-lg font-mono">{currentTime}</span>
            </div>
          </div>

          {/* Quick Stats - Hidden on small tablets */}
          <div className="space-y-1 md:space-y-2 hidden md:block">
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm">San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-2">
              <Thermometer className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm">72°F - Sunny</span>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full mr-1 md:mr-2 animate-pulse" />
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
