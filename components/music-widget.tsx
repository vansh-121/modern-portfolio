"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart } from "lucide-react"
import { useTheme } from "next-themes"

export function MusicWidget() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(183) // 3:03 in seconds
  const [volume, setVolume] = useState(60)
  const [isLiked, setIsLiked] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  useEffect(() => {
    audioRef.current = new Audio("/assets/audio/sample-track.mp3")
    audioRef.current.volume = volume / 100

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    } else {
      audioRef.current.play().catch((e) => {
        console.log("Playback prevented due to browser restrictions. Click play again.")
      })

      progressInterval.current = setInterval(() => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime)

          if (audioRef.current.currentTime >= duration) {
            setIsPlaying(false)
            setCurrentTime(0)
            audioRef.current.currentTime = 0
            clearInterval(progressInterval.current as NodeJS.Timeout)
          }
        }
      }, 1000)
    }

    setIsPlaying(!isPlaying)
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }

  const handleProgressChange = (value: number[]) => {
    const newTime = value[0]
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card
      className={`
        w-full mx-auto backdrop-blur-sm shadow-lg transition-all duration-300
        ${isMobile ? "max-w-xs bg-white/20 border-white/30" : "max-w-xs bg-white/15 border-white/20"}
        ${isDark ? "hover:bg-gray-900/40" : "hover:bg-white/25"}
      `}
      style={{ zIndex: 20 }} // Lower z-index than windows
    >
      <CardContent className={isMobile ? "p-3" : "p-3"}>
        <div className="flex items-center gap-3">
          <div
            className={`
              rounded-md overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500/80 to-purple-600/80
              ${isMobile ? "w-10 h-10" : "w-10 h-10"}
            `}
          >
            <div
              className="w-full h-full flex items-center justify-center text-white font-bold macos-text"
              style={{
                fontSize: isMobile ? "12px" : "14px",
              }}
            >
              VS
            </div>
          </div>

          <div className="flex-grow min-w-0">
            <h3
              className={`
                font-medium truncate macos-text
                ${isMobile ? "text-sm" : "text-sm"}
                ${isDark ? "text-white/90" : "text-gray-900/90"}
              `}
            >
              Coding Vibes
            </h3>
            <p
              className={`
                truncate macos-text
                ${isMobile ? "text-xs" : "text-xs"}
                ${isDark ? "text-gray-300/70" : "text-gray-600/70"}
              `}
            >
              Vansh Sethi
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className={`
              rounded-full touch-manipulation
              ${isMobile ? "w-8 h-8 min-w-[32px] min-h-[32px]" : "w-6 h-6"}
              ${isLiked ? "text-red-500/80" : isDark ? "text-gray-400/60" : "text-gray-500/60"}
              hover:${isDark ? "text-gray-300" : "text-gray-700"}
            `}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={isLiked ? "fill-red-500/80" : ""} size={isMobile ? 14 : 14} />
          </Button>
        </div>

        <div className={isMobile ? "mt-3" : "mt-3"}>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`macos-mono ${isDark ? "text-gray-400/70" : "text-gray-500/70"}`}>
              {formatTime(currentTime)}
            </span>
            <span className={`macos-mono ${isDark ? "text-gray-400/70" : "text-gray-500/70"}`}>
              {formatTime(duration)}
            </span>
          </div>

          <Slider
            value={[currentTime]}
            min={0}
            max={duration}
            step={1}
            onValueChange={handleProgressChange}
            className="my-2 opacity-80"
          />

          <div className={`flex items-center justify-center gap-4 ${isMobile ? "mt-2" : "mt-2"}`}>
            <Button
              variant="ghost"
              size="icon"
              className={`
                rounded-full touch-manipulation
                ${isMobile ? "w-8 h-8 min-w-[32px] min-h-[32px]" : "w-6 h-6"}
                ${isDark ? "text-gray-400/60 hover:text-gray-300" : "text-gray-500/60 hover:text-gray-700"}
              `}
            >
              <SkipBack size={isMobile ? 16 : 14} />
            </Button>

            <Button
              onClick={togglePlay}
              className={`
                rounded-full shadow-md touch-manipulation
                ${isMobile ? "w-10 h-10 min-w-[40px] min-h-[40px]" : "w-8 h-8"}
                ${isDark ? "bg-white/90 text-gray-900 hover:bg-white" : "bg-gray-900/90 text-white hover:bg-gray-900"}
              `}
            >
              {isPlaying ? <Pause size={isMobile ? 18 : 16} /> : <Play size={isMobile ? 18 : 16} className="ml-0.5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={`
                rounded-full touch-manipulation
                ${isMobile ? "w-8 h-8 min-w-[32px] min-h-[32px]" : "w-6 h-6"}
                ${isDark ? "text-gray-400/60 hover:text-gray-300" : "text-gray-500/60 hover:text-gray-700"}
              `}
            >
              <SkipForward size={isMobile ? 16 : 14} />
            </Button>
          </div>

          {!isMobile && (
            <div className="flex items-center gap-2 mt-3 opacity-70">
              <Volume2 size={12} className={isDark ? "text-gray-400" : "text-gray-500"} />
              <Slider value={[volume]} min={0} max={100} step={1} onValueChange={handleVolumeChange} className="w-16" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
