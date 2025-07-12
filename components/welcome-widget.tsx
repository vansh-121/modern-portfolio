"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, MapPin, Thermometer } from "lucide-react"

export function WelcomeWidget() {
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")
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
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      )
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  if (isMobile) {
    // Simplified mobile version
    return (
      <div className="absolute top-4 left-4 right-4 z-10">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
          <CardContent className="p-3">
            <div className="text-center">
              <div className="text-white font-bold text-sm">{currentTime}</div>
              <div className="text-white/80 text-xs">{currentDate}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="absolute top-8 left-8 z-10">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Time and Date */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-white font-bold text-2xl font-mono">{currentTime}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="text-white/90 text-sm">{currentDate}</span>
              </div>
            </div>

            {/* Quick Info */}
            <div className="space-y-2 border-t border-white/20 pt-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-400" />
                <span className="text-white/80 text-sm">India</span>
                <Badge variant="secondary" className="ml-auto bg-green-500/20 text-green-300 border-green-500/30">
                  Available
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-orange-400" />
                <span className="text-white/80 text-sm">Portfolio OS</span>
                <Badge variant="secondary" className="ml-auto bg-blue-500/20 text-blue-300 border-blue-500/30">
                  v2.0
                </Badge>
              </div>
            </div>

            {/* Status */}
            <div className="text-center pt-2 border-t border-white/20">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 text-xs font-medium">System Online</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
