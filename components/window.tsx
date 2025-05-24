"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback, memo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { X, Minus, Square } from "lucide-react"

interface WindowProps {
  id: string
  title: string
  children: ReactNode
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
  isMaximized: boolean
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  onFocus: () => void
  onPositionChange: (position: { x: number; y: number }) => void
  onSizeChange: (size: { width: number; height: number }) => void
}

export const Window = memo(function Window({
  id,
  title,
  children,
  position,
  size,
  zIndex,
  isMaximized,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onPositionChange,
  onSizeChange,
}: WindowProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isSmallMobile: false,
  })
  const windowRef = useRef<HTMLDivElement>(null)

  // Enhanced screen size detection
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isMobile = width < 768
      const isTablet = width >= 768 && width < 1024
      const isSmallMobile = width < 640

      setScreenSize({ width, height, isMobile, isTablet, isSmallMobile })
    }

    updateScreenSize()
    window.addEventListener("resize", updateScreenSize)
    return () => window.removeEventListener("resize", updateScreenSize)
  }, [])

  // Calculate responsive window dimensions
  const getResponsiveWindowStyle = useCallback(() => {
    const { width: screenWidth, height: screenHeight, isMobile, isTablet, isSmallMobile } = screenSize

    if (isMobile || isMaximized) {
      // Account for welcome widget on mobile
      const topOffset = isMobile ? (isSmallMobile ? 80 : 120) : 40
      const bottomOffset = isMobile ? 88 : 140

      return {
        left: 0,
        top: topOffset,
        width: screenWidth,
        height: screenHeight - topOffset - (isMobile ? 56 : 80), // Account for dock
        borderRadius: 0,
      }
    }

    if (isTablet) {
      const maxWidth = Math.min(size.width, screenWidth - 40)
      const maxHeight = Math.min(size.height, screenHeight - 100)
      const constrainedX = Math.max(20, Math.min(position.x, screenWidth - maxWidth - 20))
      const constrainedY = Math.max(60, Math.min(position.y, screenHeight - maxHeight - 60))

      return {
        left: constrainedX,
        top: constrainedY,
        width: maxWidth,
        height: maxHeight,
        borderRadius: "0.75rem",
      }
    }

    // Desktop - use provided dimensions with constraints
    const maxWidth = Math.min(size.width, screenWidth - 100)
    const maxHeight = Math.min(size.height, screenHeight - 140)
    const constrainedX = Math.max(0, Math.min(position.x, screenWidth - maxWidth))
    const constrainedY = Math.max(40, Math.min(position.y, screenHeight - maxHeight))

    return {
      left: constrainedX,
      top: constrainedY,
      width: maxWidth,
      height: maxHeight,
      borderRadius: "0.75rem",
    }
  }, [screenSize, position, size, isMaximized])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (screenSize.isMobile) return

      if (e.target === e.currentTarget || (e.target as HTMLElement).closest(".window-header")) {
        e.preventDefault()
        onFocus()
        setIsDragging(true)
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        })
      }
    },
    [onFocus, position, screenSize.isMobile],
  )

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (screenSize.isMobile || isMaximized) return

      e.stopPropagation()
      e.preventDefault()
      setIsResizing(true)
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: size.width,
        height: size.height,
      })
    },
    [size, screenSize.isMobile, isMaximized],
  )

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!screenSize.isMobile) return

      const touch = e.touches[0]
      if (touch && (e.target === e.currentTarget || (e.target as HTMLElement).closest(".window-header"))) {
        onFocus()
      }
    },
    [onFocus, screenSize.isMobile],
  )

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized && !screenSize.isMobile) {
        const newX = e.clientX - dragStart.x
        const newY = Math.max(40, e.clientY - dragStart.y)

        const constrainedX = Math.max(0, Math.min(newX, screenSize.width - size.width))
        const constrainedY = Math.max(40, Math.min(newY, screenSize.height - size.height))

        onPositionChange({ x: constrainedX, y: constrainedY })
      }

      if (isResizing && !screenSize.isMobile) {
        const newWidth = Math.max(
          300,
          Math.min(resizeStart.width + (e.clientX - resizeStart.x), screenSize.width - position.x),
        )
        const newHeight = Math.max(
          200,
          Math.min(resizeStart.height + (e.clientY - resizeStart.y), screenSize.height - position.y),
        )
        onSizeChange({ width: newWidth, height: newHeight })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length > 0) {
        e.preventDefault()
      }
    }

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("touchend", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleMouseUp)
    }
  }, [
    isDragging,
    isResizing,
    dragStart,
    resizeStart,
    onPositionChange,
    onSizeChange,
    isMaximized,
    screenSize,
    size,
    position,
  ])

  const windowStyle = getResponsiveWindowStyle()

  // Responsive control button sizes
  const getControlButtonSize = () => {
    if (screenSize.isSmallMobile) return "h-4 w-4"
    if (screenSize.isMobile) return "h-5 w-5"
    return "h-3 w-3"
  }

  const getControlIconSize = () => {
    if (screenSize.isSmallMobile) return "h-2 w-2"
    if (screenSize.isMobile) return "h-2.5 w-2.5"
    return "h-2 w-2"
  }

  const controlButtonSize = getControlButtonSize()
  const controlIconSize = getControlIconSize()

  return (
    <div
      ref={windowRef}
      className={`
        absolute bg-white/95 backdrop-blur-md shadow-2xl border border-white/20 overflow-hidden
        transition-all duration-300 ease-out transform-gpu will-change-transform
        ${isDragging && !screenSize.isMobile ? "cursor-grabbing scale-[1.02]" : "cursor-default"}
        ${isResizing ? "select-none" : ""}
        ${screenSize.isMobile ? "touch-pan-y" : ""}
      `}
      style={{
        left: windowStyle.left,
        top: windowStyle.top,
        width: windowStyle.width,
        height: windowStyle.height,
        borderRadius: windowStyle.borderRadius,
        zIndex,
        maxWidth: "100vw",
        maxHeight: "100vh",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={(e) => {
        e.stopPropagation()
        onFocus()
      }}
    >
      {/* Window Header with responsive sizing */}
      <div
        className={`window-header flex items-center justify-between ${screenSize.isMobile ? "h-10" : "h-8 md:h-10"} bg-gradient-to-r from-gray-50/80 to-gray-100/80 border-b border-gray-200/50 px-2 md:px-4 cursor-grab active:cursor-grabbing backdrop-blur-sm`}
      >
        {/* Traffic Lights with responsive sizing */}
        <div
          className={`flex items-center ${screenSize.isMobile ? "space-x-2" : "space-x-1 md:space-x-2"} flex-shrink-0`}
        >
          <Button
            variant="ghost"
            size="sm"
            className={`${controlButtonSize} p-0 rounded-full bg-red-500 hover:bg-red-600 border border-red-600 transition-all duration-200 group touch-manipulation`}
            onClick={onClose}
          >
            <X className={`${controlIconSize} text-red-900 opacity-0 group-hover:opacity-100 transition-opacity`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`${controlButtonSize} p-0 rounded-full bg-yellow-500 hover:bg-yellow-600 border border-yellow-600 transition-all duration-200 group touch-manipulation`}
            onClick={onMinimize}
          >
            <Minus
              className={`${controlIconSize} text-yellow-900 opacity-0 group-hover:opacity-100 transition-opacity`}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`${controlButtonSize} p-0 rounded-full bg-green-500 hover:bg-green-600 border border-green-600 transition-all duration-200 group touch-manipulation`}
            onClick={onMaximize}
          >
            <Square
              className={`${controlIconSize} text-green-900 opacity-0 group-hover:opacity-100 transition-opacity`}
            />
          </Button>
        </div>

        {/* Window Title with responsive sizing */}
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 ${screenSize.isMobile ? "text-sm" : "text-xs md:text-sm"} font-semibold text-gray-700 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate max-w-[60%]`}
        >
          {title}
        </div>

        {/* Spacer for layout balance */}
        <div className={`${screenSize.isMobile ? "w-20" : "w-16 md:w-20"} flex-shrink-0`} />
      </div>

      {/* Window Content with responsive padding */}
      <div
        className={`h-full overflow-auto ${screenSize.isMobile ? "p-4" : "p-3 md:p-6"} pb-4 md:pb-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent`}
      >
        {children}
      </div>

      {/* Resize Handle - Hidden on mobile and when maximized */}
      {!screenSize.isMobile && !isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize group touch-manipulation"
          onMouseDown={handleResizeMouseDown}
        >
          <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-gray-400 group-hover:border-gray-600 transition-colors" />
        </div>
      )}
    </div>
  )
})
