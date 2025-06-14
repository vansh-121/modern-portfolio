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
        {/* Main greeting with enhanced styling */}
        <div className="relative">
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            } tracking-tight leading-tight`}
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.03em",
              textShadow: isDark 
                ? "0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(147, 51, 234, 0.3)" 
                : "0 4px 20px rgba(0,0,0,0.1), 0 0 30px rgba(59, 130, 246, 0.2)",
            }}
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              Hey, I'm Vansh Sethi
            </span>
          </h1>
          
          {/* Animated underline */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 md:w-48 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 rounded-full opacity-60 animate-pulse"></div>
        </div>

        {/* Enhanced subtitle with typing effect */}
        <div className="space-y-2 mt-6">
          <p
            className={`text-lg md:text-xl lg:text-2xl ${
              isDark ? "text-gray-300" : "text-gray-600"
            } max-w-2xl mx-auto font-medium`}
            style={{
              fontFamily: "var(--font-system)",
              fontWeight: 400,
            }}
          >
            Full Stack Developer & UI/UX Designer
          </p>
          
          {/* Tech stack badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-4 opacity-80">
            {["React", "Next.js", "Node.js", "TypeScript", "Python", "AWS"].map((tech, index) => (
              <span
                key={tech}
                className={`px-3 py-1 text-xs md:text-sm rounded-full border ${
                  isDark 
                    ? "bg-white/10 border-white/20 text-white/80" 
                    : "bg-black/10 border-black/20 text-black/70"
                } backdrop-blur-sm`}
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                  opacity: 0,
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Call to action */}
          <p
            className={`text-sm md:text-base ${
              isDark ? "text-gray-400" : "text-gray-500"
            } mt-4 italic`}
          >
            Building digital experiences that make a difference
          </p>
        </div>
      </div>
    </div>
  )
}