"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface HelloAnimationPopupProps {
  isVisible: boolean
  onClose: () => void
}

const greetings = [
  { text: "Hello", language: "English", color: "text-blue-400" },
  { text: "Hola", language: "Spanish", color: "text-red-400" },
  { text: "Namaste", language: "Hindi", color: "text-orange-400" },
  { text: "Bonjour", language: "French", color: "text-purple-400" },
  { text: "Konnichiwa", language: "Japanese", color: "text-pink-400" },
  { text: "Guten Tag", language: "German", color: "text-green-400" },
  { text: "Ciao", language: "Italian", color: "text-yellow-400" },
  { text: "Olá", language: "Portuguese", color: "text-cyan-400" },
]

export function HelloAnimationPopup({ isVisible, onClose }: HelloAnimationPopupProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [animationPhase, setAnimationPhase] = useState<"enter" | "cycle" | "exit">("enter")

  useEffect(() => {
    if (!isVisible) return

    setCurrentIndex(0)
    setAnimationPhase("enter")

    // Enter animation
    const enterTimer = setTimeout(() => {
      setAnimationPhase("cycle")
    }, 800)

    // Cycle through greetings
    const cycleTimer = setTimeout(() => {
      let index = 0
      const interval = setInterval(() => {
        index = (index + 1) % greetings.length
        setCurrentIndex(index)

        if (index === greetings.length - 1) {
          setTimeout(() => {
            setAnimationPhase("exit")
            setTimeout(onClose, 600)
          }, 800)
          clearInterval(interval)
        }
      }, 600)

      return () => clearInterval(interval)
    }, 1000)

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(cycleTimer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  const currentGreeting = greetings[currentIndex]

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500",
          animationPhase === "enter"
            ? "opacity-0 animate-in fade-in"
            : animationPhase === "exit"
              ? "opacity-0 animate-out fade-out"
              : "opacity-100",
        )}
      />

      {/* Main popup */}
      <div
        className={cn(
          "relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl transition-all duration-700 transform",
          animationPhase === "enter"
            ? "scale-50 opacity-0 animate-in zoom-in-50 fade-in slide-in-from-bottom-10"
            : animationPhase === "exit"
              ? "scale-75 opacity-0 animate-out zoom-out-75 fade-out slide-out-to-top-10"
              : "scale-100 opacity-100",
        )}
        style={{
          width: "320px",
          height: "200px",
        }}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center space-y-4 p-8">
          {/* Main greeting text */}
          <div
            key={currentIndex}
            className={cn(
              "text-4xl font-bold transition-all duration-500 transform animate-in zoom-in-50 fade-in",
              currentGreeting.color,
            )}
            style={{
              textShadow: "0 0 20px rgba(255,255,255,0.5)",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {currentGreeting.text}
          </div>

          {/* Language subtitle */}
          <div
            key={`lang-${currentIndex}`}
            className="text-sm text-white/70 font-medium animate-in slide-in-from-bottom-2 fade-in duration-300"
          >
            {currentGreeting.language}
          </div>

          {/* Animated dots indicator */}
          <div className="flex space-x-2 mt-4">
            {greetings.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === currentIndex ? "bg-white scale-125 shadow-lg" : "bg-white/30 scale-100",
                )}
              />
            ))}
          </div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full animate-bounce"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: "2s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
