"use client"

import { useEffect, useState } from "react"
import { Apple } from "lucide-react"

interface BootLoaderProps {
  progress: number
}

export function BootLoader({ progress }: BootLoaderProps) {
  const [showApple, setShowApple] = useState(false)
  const [showProgress, setShowProgress] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setShowApple(true), 300)
    const timer2 = setTimeout(() => setShowProgress(true), 1000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      {/* Apple Logo */}
      <div
        className={`transition-all duration-1000 ease-out ${
          showApple ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
      >
        <div className="relative">
          <Apple className="w-20 h-20 text-white fill-current" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 w-20 h-20 rounded-lg opacity-20 blur-xl" />
        </div>
      </div>

      {/* Loading Text */}
      <div
        className={`mt-8 text-white text-lg font-light transition-all duration-500 ${
          showApple ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        Starting Portfolio...
      </div>

      {/* Progress Bar */}
      <div
        className={`mt-6 w-64 transition-all duration-500 ${
          showProgress ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="w-full bg-gray-800 rounded-full h-1">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-1 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-center text-gray-400 text-sm mt-2">{progress}%</div>
      </div>

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
