"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface HelloAnimationPopupProps {
  isVisible: boolean
  onClose: () => void
}

const greetings = [
  { text: "Hello", language: "English", color: "from-blue-400 to-blue-600", shadow: "shadow-blue-500/50" },
  { text: "Hola", language: "Spanish", color: "from-red-400 to-red-600", shadow: "shadow-red-500/50" },
  { text: "Namaste", language: "Hindi", color: "from-orange-400 to-orange-600", shadow: "shadow-orange-500/50" },
  { text: "Bonjour", language: "French", color: "from-purple-400 to-purple-600", shadow: "shadow-purple-500/50" },
  { text: "こんにちは", language: "Japanese", color: "from-pink-400 to-pink-600", shadow: "shadow-pink-500/50" },
  { text: "Guten Tag", language: "German", color: "from-green-400 to-green-600", shadow: "shadow-green-500/50" },
  { text: "Ciao", language: "Italian", color: "from-yellow-400 to-yellow-600", shadow: "shadow-yellow-500/50" },
  { text: "Olá", language: "Portuguese", color: "from-cyan-400 to-cyan-600", shadow: "shadow-cyan-500/50" },
]

export function HelloAnimationPopup({ isVisible, onClose }: HelloAnimationPopupProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [animationPhase, setAnimationPhase] = useState<"enter" | "cycle" | "exit">("enter")
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    if (!isVisible) return

    // Generate random particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }))
    setParticles(newParticles)

    setCurrentIndex(0)
    setAnimationPhase("enter")

    // Enter animation
    const enterTimer = setTimeout(() => {
      setAnimationPhase("cycle")
    }, 1000)

    // Cycle through greetings
    const cycleTimer = setTimeout(() => {
      let index = 0
      const interval = setInterval(() => {
        index = (index + 1) % greetings.length
        setCurrentIndex(index)

        if (index === greetings.length - 1) {
          setTimeout(() => {
            setAnimationPhase("exit")
            setTimeout(onClose, 800)
          }, 1000)
          clearInterval(interval)
        }
      }, 800)

      return () => clearInterval(interval)
    }, 1500)

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(cycleTimer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  const currentGreeting = greetings[currentIndex]

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      {/* Dynamic backdrop with blur */}
      <div
        className={cn(
          "absolute inset-0 backdrop-blur-xl transition-all duration-1000",
          animationPhase === "enter"
            ? "bg-black/0 animate-in fade-in duration-1000"
            : animationPhase === "exit"
              ? "bg-black/0 animate-out fade-out duration-800"
              : "bg-black/30",
        )}
      />

      {/* Animated particles background */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: "3s",
            }}
          />
        ))}
      </div>

      {/* Main greeting container */}
      <div
        className={cn(
          "relative transition-all duration-1000 transform",
          animationPhase === "enter"
            ? "scale-0 opacity-0 rotate-180 animate-in zoom-in-0 fade-in spin-in-180 duration-1000"
            : animationPhase === "exit"
              ? "scale-0 opacity-0 -rotate-180 animate-out zoom-out-0 fade-out spin-out-180 duration-800"
              : "scale-100 opacity-100 rotate-0",
        )}
      >
        {/* Glowing background circle */}
        <div
          className={cn(
            "absolute inset-0 rounded-full blur-3xl transition-all duration-800",
            `bg-gradient-to-r ${currentGreeting.color}`,
            animationPhase === "cycle" ? "animate-pulse scale-150" : "scale-100",
          )}
          style={{
            width: "400px",
            height: "400px",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Main greeting card */}
        <div
          className={cn(
            "relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 transition-all duration-800 transform",
            currentGreeting.shadow,
            animationPhase === "cycle" ? "shadow-2xl scale-105" : "shadow-xl scale-100",
          )}
          style={{
            width: "350px",
            height: "250px",
          }}
        >
          {/* Animated gradient overlay */}
          <div
            className={cn(
              "absolute inset-0 rounded-3xl opacity-20 transition-all duration-800",
              `bg-gradient-to-br ${currentGreeting.color}`,
              animationPhase === "cycle" ? "animate-pulse" : "",
            )}
          />

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center space-y-6 p-8">
            {/* Main greeting text with enhanced animation */}
            <div
              key={`greeting-${currentIndex}`}
              className={cn(
                "text-5xl font-bold transition-all duration-700 transform",
                `bg-gradient-to-r ${currentGreeting.color} bg-clip-text text-transparent`,
                "animate-in zoom-in-50 fade-in slide-in-from-bottom-4 duration-700",
              )}
              style={{
                textShadow: "0 0 30px rgba(255,255,255,0.8)",
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontWeight: "800",
              }}
            >
              {currentGreeting.text}
            </div>

            {/* Language subtitle with slide animation */}
            <div
              key={`lang-${currentIndex}`}
              className="text-lg text-white/90 font-medium animate-in slide-in-from-bottom-2 fade-in duration-500 delay-200"
              style={{
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              }}
            >
              {currentGreeting.language}
            </div>

            {/* Enhanced progress dots */}
            <div className="flex space-x-3 mt-6">
              {greetings.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "rounded-full transition-all duration-500 transform",
                    index === currentIndex
                      ? "w-4 h-4 bg-white scale-125 shadow-lg animate-pulse"
                      : "w-3 h-3 bg-white/40 scale-100 hover:bg-white/60",
                  )}
                  style={{
                    boxShadow: index === currentIndex ? "0 0 15px rgba(255,255,255,0.8)" : "none",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Floating sparkles */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-bounce opacity-80"
                style={{
                  left: `${15 + i * 10}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: "2.5s",
                  boxShadow: "0 0 6px rgba(255,255,255,0.8)",
                }}
              />
            ))}
          </div>

          {/* Rotating border effect */}
          <div
            className={cn(
              "absolute inset-0 rounded-3xl transition-all duration-1000",
              `bg-gradient-to-r ${currentGreeting.color}`,
              animationPhase === "cycle" ? "animate-spin opacity-20" : "opacity-0",
            )}
            style={{
              background: `conic-gradient(from 0deg, transparent, ${currentGreeting.color.split(" ")[1]}, transparent)`,
              animationDuration: "3s",
            }}
          />
        </div>
      </div>

      {/* Ripple effect */}
      <div
        className={cn(
          "absolute rounded-full border-2 border-white/30 transition-all duration-2000",
          animationPhase === "cycle" ? "scale-300 opacity-0" : "scale-100 opacity-100",
        )}
        style={{
          width: "350px",
          height: "350px",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  )
}
