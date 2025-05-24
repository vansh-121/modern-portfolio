"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Thermometer, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WelcomeWidgetProps {
  hasOpenWindows?: boolean
  openWindowsCount?: number
}

export function WelcomeWidget({ hasOpenWindows = false, openWindowsCount = 0 }: WelcomeWidgetProps) {
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isSmallMobile: false,
  })

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setScreenSize({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isSmallMobile: width < 640,
      })
    }

    updateScreenSize()
    window.addEventListener("resize", updateScreenSize)
    return () => window.removeEventListener("resize", updateScreenSize)
  }, [])

  // Auto-collapse when windows are open on smaller screens
  useEffect(() => {
    if (hasOpenWindows && (screenSize.isMobile || screenSize.isTablet)) {
      setIsCollapsed(true)
    } else if (!hasOpenWindows) {
      setIsCollapsed(false)
    }
  }, [hasOpenWindows, screenSize.isMobile, screenSize.isTablet])

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
          weekday: screenSize.isSmallMobile ? "short" : screenSize.isMobile ? "short" : "long",
          year: screenSize.isSmallMobile ? undefined : "numeric",
          month: screenSize.isSmallMobile ? "short" : screenSize.isMobile ? "short" : "long",
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
  }, [screenSize])

  // Calculate responsive positioning with collision avoidance
  const getWidgetStyle = () => {
    const { isMobile, isTablet, isSmallMobile, width, height } = screenSize

    if (isSmallMobile) {
      return {
        top: hasOpenWindows ? "0.5rem" : "2.5rem",
        right: hasOpenWindows ? "0.5rem" : "auto",
        left: hasOpenWindows ? "auto" : "0.5rem",
        maxWidth: hasOpenWindows ? "200px" : "none",
        width: hasOpenWindows ? "auto" : "calc(100% - 1rem)",
        zIndex: hasOpenWindows ? 60 : 30, // Higher z-index when windows are open
      }
    }

    if (isMobile) {
      return {
        top: hasOpenWindows ? "0.5rem" : "2.5rem",
        right: hasOpenWindows ? "1rem" : "auto",
        left: hasOpenWindows ? "auto" : "1rem",
        maxWidth: hasOpenWindows ? "240px" : "none",
        width: hasOpenWindows ? "auto" : "calc(100% - 2rem)",
        zIndex: hasOpenWindows ? 60 : 30,
      }
    }

    if (isTablet) {
      return {
        top: hasOpenWindows ? "1rem" : "1rem",
        right: hasOpenWindows ? "1rem" : "auto",
        left: hasOpenWindows ? "auto" : "1rem",
        maxWidth: "280px",
        zIndex: hasOpenWindows ? 60 : 30,
      }
    }

    // Desktop positioning - move to top-right when windows are open
    return {
      top: "2rem",
      right: hasOpenWindows ? "2rem" : "auto",
      left: hasOpenWindows ? "auto" : "2rem",
      maxWidth: "320px",
      zIndex: hasOpenWindows ? 60 : 30,
    }
  }

  const widgetStyle = getWidgetStyle()

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div
      className={`
        absolute transition-all duration-500 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
        ${hasOpenWindows ? "shadow-2xl" : ""}
      `}
      style={widgetStyle}
    >
      <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white shadow-2xl overflow-hidden">
        {/* Collapsible Header */}
        {hasOpenWindows && (screenSize.isMobile || screenSize.isTablet) && (
          <div className="flex items-center justify-between p-2 border-b border-white/10">
            <span className="text-xs font-medium">Portfolio OS</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:bg-white/10"
              onClick={toggleCollapse}
            >
              {isCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
            </Button>
          </div>
        )}

        {/* Main Content */}
        <div
          className={`
            transition-all duration-300 ease-out overflow-hidden
            ${isCollapsed ? "max-h-0 opacity-0" : "max-h-96 opacity-100"}
          `}
        >
          <CardContent className={`${screenSize.isSmallMobile ? "p-2" : "p-3 md:p-6"} space-y-2 md:space-y-4`}>
            {/* Welcome Message */}
            <div>
              <h2 className={`${screenSize.isSmallMobile ? "text-sm" : "text-lg md:text-2xl"} font-bold mb-1`}>
                {screenSize.isSmallMobile ? "Welcome!" : "Welcome Back!"}
              </h2>
              <p className={`text-white/80 ${screenSize.isSmallMobile ? "text-xs" : "text-sm md:text-base"}`}>
                {screenSize.isSmallMobile
                  ? "Explore my work"
                  : hasOpenWindows
                    ? "Portfolio active"
                    : "Ready to explore my portfolio?"}
              </p>
            </div>

            {/* Date and Time */}
            <div className={`space-y-1 ${screenSize.isSmallMobile ? "" : "md:space-y-2"}`}>
              <div className="flex items-center gap-2">
                <Calendar
                  className={`${screenSize.isSmallMobile ? "w-3 h-3" : "w-3 h-3 md:w-4 md:h-4"} flex-shrink-0`}
                />
                <span className={`${screenSize.isSmallMobile ? "text-xs" : "text-xs md:text-sm"} truncate`}>
                  {currentDate}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className={`${screenSize.isSmallMobile ? "w-3 h-3" : "w-3 h-3 md:w-4 md:h-4"} flex-shrink-0`} />
                <span className={`${screenSize.isSmallMobile ? "text-xs" : "text-sm md:text-lg"} font-mono`}>
                  {currentTime}
                </span>
              </div>
            </div>

            {/* Quick Stats - Hidden when collapsed or on very small screens */}
            {!screenSize.isSmallMobile && !isCollapsed && (
              <div className="space-y-1 md:space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                  <span className="text-xs md:text-sm truncate">San Francisco, CA</span>
                </div>
                {!screenSize.isMobile && (
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                    <span className="text-xs md:text-sm">72°F - Sunny</span>
                  </div>
                )}
              </div>
            )}

            {/* Status with window count */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                <div
                  className={`${screenSize.isSmallMobile ? "w-1 h-1 mr-1" : "w-1.5 h-1.5 md:w-2 md:h-2 mr-1 md:mr-2"} bg-green-400 rounded-full animate-pulse flex-shrink-0`}
                />
                <span className="truncate">
                  {hasOpenWindows
                    ? `${openWindowsCount} window${openWindowsCount !== 1 ? "s" : ""} open`
                    : screenSize.isSmallMobile
                      ? "Available"
                      : "Available for Work"}
                </span>
              </Badge>
            </div>

            {/* Quick Actions */}
            {!isCollapsed && (
              <div
                className={`${screenSize.isSmallMobile ? "text-xs" : "text-xs"} text-white/60 pt-1 md:pt-2 border-t border-white/10`}
              >
                {hasOpenWindows
                  ? "Click to manage windows"
                  : screenSize.isSmallMobile
                    ? "Tap dock icons"
                    : "Click dock icons to explore my work"}
              </div>
            )}
          </CardContent>
        </div>

        {/* Compact Mode Indicator */}
        {isCollapsed && (
          <div className="p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs">{currentTime}</span>
            </div>
            {openWindowsCount > 0 && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                {openWindowsCount}
              </Badge>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
