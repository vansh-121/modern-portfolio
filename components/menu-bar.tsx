"use client"

import { useState, useEffect } from "react"
import { Apple, Wifi, Battery, Volume2 } from "lucide-react"
import { VoiceControlIndicator } from "@/components/voice-control-indicator"
import type { UseVoiceControlReturn } from "@/hooks/use-voice-control"

interface MenuBarProps {
  onBoldClick: () => void
  onItalicClick: () => void
  onUnderlineClick: () => void
  onAlignLeftClick: () => void
  onAlignCenterClick: () => void
  onAlignRightClick: () => void
  onOrderedListClick: () => void
  onUnorderedListClick: () => void
  onCodeClick: () => void
  onImageClick: () => void
  onLinkClick: () => void
  onQuoteClick: () => void
  onSeparatorClick: () => void
  onRedoClick: () => void
  onUndoClick: () => void
  onDownloadClick: () => void
  onCopyClick: () => void
  onTrashClick: () => void
  onAddClick: () => void
  onTextClick: () => void
  onHeading1Click: () => void
  onHeading2Click: () => void
  onHeading3Click: () => void
  onHeading4Click: () => void
  onHeading5Click: () => void
  onHeading6Click: () => void
  voiceControl?: UseVoiceControlReturn
}

export function MenuBar({
  onBoldClick,
  onItalicClick,
  onUnderlineClick,
  onAlignLeftClick,
  onAlignCenterClick,
  onAlignRightClick,
  onOrderedListClick,
  onUnorderedListClick,
  onCodeClick,
  onImageClick,
  onLinkClick,
  onQuoteClick,
  onSeparatorClick,
  onRedoClick,
  onUndoClick,
  onDownloadClick,
  onCopyClick,
  onTrashClick,
  onAddClick,
  onTextClick,
  onHeading1Click,
  onHeading2Click,
  onHeading3Click,
  onHeading4Click,
  onHeading5Click,
  onHeading6Click,
  voiceControl,
}: MenuBarProps) {
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      setCurrentTime(timeString)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-8 bg-black/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 text-white text-sm z-50">
      {/* Left side - Apple menu */}
      <div className="flex items-center space-x-4">
        <Apple className="h-4 w-4" />
        <span className="text-xs font-medium">Portfolio</span>
      </div>

      {/* Right side - System indicators */}
      <div className="flex items-center space-x-3">
        {/* Voice Control Indicator */}
        {voiceControl && <VoiceControlIndicator voiceControl={voiceControl} />}

        {/* System icons */}
        <Volume2 className="h-4 w-4 opacity-70" />
        <Wifi className="h-4 w-4 opacity-70" />
        <Battery className="h-4 w-4 opacity-70" />

        {/* Time */}
        <span className="text-xs font-medium tabular-nums">{currentTime}</span>
      </div>
    </div>
  )
}
