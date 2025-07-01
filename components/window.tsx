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
  const [isMobile, setIsMobile] = useState(false)
  const windowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isMobile) return // Disable dragging on mobile

      if (e.target === e.currentTarget || (e.target as HTMLElement).closest(".window-header")) {
        onFocus()
        setIsDragging(true)
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        })
      }
    },
    [onFocus, position, isMobile],
  )

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isMobile) return // Disable resizing on mobile

      e.stopPropagation()
      setIsResizing(true)
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: size.width,
        height: size.height,
      })
    },
    [size, isMobile],
  )

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized && !isMobile) {
        onPositionChange({
          x: e.clientX - dragStart.x,
          y: Math.max(40, e.clientY - dragStart.y),
        })
      }

      if (isResizing && !isMobile) {
        const newWidth = Math.max(300, resizeStart.width + (e.clientX - resizeStart.x))
        const newHeight = Math.max(200, resizeStart.height + (e.clientY - resizeStart.y))
        onSizeChange({ width: newWidth, height: newHeight })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isResizing, dragStart, resizeStart, onPositionChange, onSizeChange, isMaximized, isMobile])

  // Mobile windows are always maximized
  const effectivelyMaximized = isMaximized || isMobile

  return (
    <div
      ref={windowRef}
      className={`
        absolute bg-white/95 backdrop-blur-md rounded-none md:rounded-xl shadow-2xl border border-white/20 overflow-hidden
        transition-all duration-300 ease-out transform-gpu will-change-transform
        ${isDragging && !isMobile ? "cursor-grabbing scale-105" : "cursor-default"}
        ${isResizing ? "select-none" : ""}
      `}
      style={{
        left: effectivelyMaximized ? 0 : position.x,
        top: effectivelyMaximized ? (isMobile ? 32 : 40) : position.y,
        width: effectivelyMaximized ? "100vw" : size.width,
        height: effectivelyMaximized ? (isMobile ? "calc(100vh - 88px)" : "calc(100vh - 140px)") : size.height,
        zIndex: Math.max(10, zIndex), // Ensure windows are always above background elements
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Window Header - Smaller buttons on mobile */}
      <div className="window-header flex items-center justify-between h-7 md:h-10 bg-gradient-to-r from-gray-50/80 to-gray-100/80 border-b border-gray-200/50 px-2 md:px-4 cursor-grab active:cursor-grabbing backdrop-blur-sm">
        {/* Traffic Lights - Smaller on mobile */}
        <div className="flex items-center space-x-1 md:space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-2 w-2 md:h-3 md:w-3 p-0 rounded-full bg-red-500 hover:bg-red-600 border border-red-600 transition-all duration-200 group"
            onClick={onClose}
          >
            <X className="h-1 w-1 md:h-2 md:w-2 text-red-900 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-2 w-2 md:h-3 md:w-3 p-0 rounded-full bg-yellow-500 hover:bg-yellow-600 border border-yellow-600 transition-all duration-200 group"
            onClick={onMinimize}
          >
            <Minus className="h-1 w-1 md:h-2 md:w-2 text-yellow-900 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-2 w-2 md:h-3 md:w-3 p-0 rounded-full bg-green-500 hover:bg-green-600 border border-green-600 transition-all duration-200 group"
            onClick={onMaximize}
          >
            <Square className="h-1 w-1 md:h-2 md:w-2 text-green-900 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>

        {/* Window Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-xs md:text-sm font-semibold text-gray-700 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {title}
        </div>
      </div>

      {/* Window Content */}
      <div className="h-full overflow-auto p-3 md:p-6 pb-4 md:pb-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {children}
      </div>

      {/* Resize Handle - Hidden on mobile */}
      {!effectivelyMaximized && !isMobile && (
        <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize group" onMouseDown={handleResizeMouseDown}>
          <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-gray-400 group-hover:border-gray-600 transition-colors" />
        </div>
      )}
    </div>
  )
})
