"use client"

import type React from "react"

import { useState, useRef, useEffect, type ReactNode } from "react"
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

export function Window({
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
  const windowRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest(".window-header")) {
      onFocus()
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    })
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        onPositionChange({
          x: e.clientX - dragStart.x,
          y: Math.max(40, e.clientY - dragStart.y), // Prevent dragging above menu bar
        })
      }

      if (isResizing) {
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
  }, [isDragging, isResizing, dragStart, resizeStart, position, size, onPositionChange, onSizeChange, isMaximized])

  return (
    <div
      ref={windowRef}
      className={`
        absolute bg-white/95 backdrop-blur-md rounded-lg shadow-2xl border border-white/20 overflow-hidden
        transition-all duration-200 ease-out
        ${isDragging ? "cursor-grabbing" : "cursor-default"}
      `}
      style={{
        left: isMaximized ? 0 : position.x,
        top: isMaximized ? 40 : position.y,
        width: isMaximized ? "100vw" : size.width,
        height: isMaximized ? "calc(100vh - 140px)" : size.height,
        zIndex,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Window Header */}
      <div className="window-header flex items-center justify-between h-8 bg-gray-100/50 border-b border-gray-200/50 px-3 cursor-grab active:cursor-grabbing">
        {/* Traffic Lights */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-3 w-3 p-0 rounded-full bg-red-500 hover:bg-red-600 border border-red-600"
            onClick={onClose}
          >
            <X className="h-2 w-2 text-red-900 opacity-0 hover:opacity-100" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-3 w-3 p-0 rounded-full bg-yellow-500 hover:bg-yellow-600 border border-yellow-600"
            onClick={onMinimize}
          >
            <Minus className="h-2 w-2 text-yellow-900 opacity-0 hover:opacity-100" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-3 w-3 p-0 rounded-full bg-green-500 hover:bg-green-600 border border-green-600"
            onClick={onMaximize}
          >
            <Square className="h-2 w-2 text-green-900 opacity-0 hover:opacity-100" />
          </Button>
        </div>

        {/* Window Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-700">{title}</div>
      </div>

      {/* Window Content */}
      <div className="h-full overflow-auto p-6 pb-8">{children}</div>

      {/* Resize Handle */}
      {!isMaximized && (
        <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" onMouseDown={handleResizeMouseDown}>
          <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-gray-400" />
        </div>
      )}
    </div>
  )
}
