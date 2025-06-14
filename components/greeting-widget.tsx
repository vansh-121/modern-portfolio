"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

export function GreetingWidget() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl px-4 text-center z-0 pointer-events-none">
      <div className="mb-16 md:mb-20">
        {/* Main greeting with enhanced contrast */}
        <div className="relative">
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 tracking-tight leading-tight ${
              isDark 
                ? "text-white drop-shadow-2xl" 
                : "text-gray-900"
            }`}
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.03em",
              textShadow: isDark 
                ? "0 0 30px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.6)" 
                : "0 4px 20px rgba(255,255,255,0.8), 0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <span className={`${
              isDark 
                ? "bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent" 
                : "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
            }`}>
              Hey, I'm Vansh Sethi
            </span>
          </h1>
          
          {/* Animated underline */}
          <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 md:w-48 h-1 rounded-full ${
            isDark 
              ? "bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400" 
              : "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"
          } opacity-70`}></div>
        </div>

        {/* Enhanced subtitle */}
        <div className="space-y-3 mt-8">
          <p
            className={`text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto font-medium ${
              isDark 
                ? "text-gray-200 drop-shadow-lg" 
                : "text-gray-700"
            }`}
            style={{
              fontFamily: "var(--font-system)",
              fontWeight: 500,
              textShadow: isDark 
                ? "0 2px 10px rgba(0,0,0,0.5)" 
                : "0 2px 10px rgba(255,255,255,0.8)",
            }}
          >
            Full Stack Developer & UI/UX Designer
          </p>
          
          {/* Tech stack badges with better contrast */}
          <div className="flex flex-wrap justify-center gap-2 mt-6 opacity-90">
            {["React", "Next.js", "Node.js", "TypeScript", "Python", "AWS"].map((tech, index) => (
              <span
                key={tech}
                className={`px-3 py-1.5 text-xs md:text-sm rounded-full border font-medium ${
                  isDark 
                    ? "bg-gray-800/80 border-gray-600/50 text-gray-200 shadow-lg" 
                    : "bg-white/90 border-gray-300/60 text-gray-700 shadow-md"
                } backdrop-blur-sm transition-all duration-300 hover:scale-105`}
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animation: "fadeInUp 0.8s ease-out forwards",
                  opacity: 0,
                  textShadow: isDark 
                    ? "0 1px 3px rgba(0,0,0,0.3)" 
                    : "0 1px 3px rgba(255,255,255,0.8)",
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Call to action with better visibility */}
          <p
            className={`text-sm md:text-base mt-6 italic font-medium ${
              isDark 
                ? "text-gray-300" 
                : "text-gray-600"
            }`}
            style={{
              textShadow: isDark 
                ? "0 1px 5px rgba(0,0,0,0.4)" 
                : "0 1px 5px rgba(255,255,255,0.8)",
            }}
          >
            Building digital experiences that make a difference
          </p>
        </div>
      </div>
    </div>
  )
}