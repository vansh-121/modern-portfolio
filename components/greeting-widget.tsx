"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

export function GreetingWidget() {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
    }

    setMounted(true)
    checkDevice()
    window.addEventListener("resize", checkDevice)
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  if (!mounted) return null

  return (
    <div
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center z-0 pointer-events-none ${
        isMobile ? "px-4 max-w-sm" : "max-w-4xl px-4"
      }`}
    >
      <div className={isMobile ? "mb-8" : "mb-16 md:mb-20"}>
        {/* Main greeting with glassmorphism background */}
        <div className="relative">
          {/* Glassmorphism container for light theme */}
          {!isDark && !isMobile && (
            <div
              className="absolute inset-0 -m-8 rounded-3xl backdrop-blur-md border border-white/30"
              style={{
                background: "rgba(255, 255, 255, 0.25)",
                boxShadow: "0 8px 32px rgba(102, 126, 234, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
              }}
            />
          )}

          <h1
            className={`relative font-bold mb-4 tracking-tight leading-tight ${
              isMobile ? "text-2xl sm:text-3xl" : "text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
            }`}
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.03em",
            }}
          >
            {isDark ? (
              <span
                className="bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-lg"
                style={{
                  textShadow:
                    "0 0 40px rgba(102, 126, 234, 0.6), 0 0 80px rgba(118, 75, 162, 0.4), 0 4px 20px rgba(0,0,0,0.8)",
                }}
              >
                Hey, I'm Vansh Sethi
              </span>
            ) : (
              <span
                className="relative inline-block text-white font-black"
                style={{
                  textShadow:
                    "0 4px 20px rgba(102, 126, 234, 0.8), 0 2px 10px rgba(118, 75, 162, 0.6), 0 8px 40px rgba(0, 0, 0, 0.3)",
                  filter: "drop-shadow(0 0 20px rgba(102, 126, 234, 0.5))",
                }}
              >
                Hey, I'm Vansh Sethi
              </span>
            )}
          </h1>

          {/* Animated underline with glow */}
          <div
            className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1.5 rounded-full animate-pulse ${
              isMobile ? "w-20" : "w-32 md:w-48"
            } ${
              isDark
                ? "bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400"
                : "bg-gradient-to-r from-white via-blue-200 to-purple-200"
            }`}
            style={{
              boxShadow: isDark
                ? "0 0 20px rgba(102, 126, 234, 0.5)"
                : "0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(102, 126, 234, 0.4)",
            }}
          />
        </div>

        {/* Enhanced subtitle */}
        <div className={`relative space-y-3 ${isMobile ? "mt-6" : "mt-8"}`}>
          <p
            className={`max-w-2xl mx-auto font-bold ${isMobile ? "text-sm" : "text-lg md:text-xl lg:text-2xl"} ${
              isDark ? "text-gray-100" : "text-white"
            }`}
            style={{
              fontFamily: "var(--font-system)",
              textShadow: isDark
                ? "0 2px 15px rgba(0,0,0,0.7), 0 0 30px rgba(102, 126, 234, 0.3)"
                : "0 2px 15px rgba(102, 126, 234, 0.7), 0 4px 30px rgba(118, 75, 162, 0.5), 0 1px 5px rgba(0, 0, 0, 0.3)",
            }}
          >
            Full Stack Developer & UI/UX Designer
          </p>

          {/* Tech stack badges with glassmorphism */}
          <div className={`flex flex-wrap justify-center opacity-95 ${isMobile ? "gap-2 mt-4" : "gap-3 mt-8"}`}>
            {["React", "Next.js", "Node.js", "TypeScript", "Python", "AWS"].map((tech, index) => (
              <span
                key={tech}
                className={`rounded-full font-semibold backdrop-blur-md transition-all duration-300 hover:scale-105 hover:rotate-1 ${
                  isMobile ? "px-2 py-1 text-xs" : "px-4 py-2 text-xs md:text-sm"
                } ${
                  isDark
                    ? "bg-gray-900/80 border border-gray-600/60 text-gray-100"
                    : "text-white border border-white/40"
                }`}
                style={{
                  animationDelay: `${index * 0.15}s`,
                  animation: "fadeInUp 0.8s ease-out forwards",
                  opacity: 0,
                  background: isDark ? undefined : "rgba(255, 255, 255, 0.2)",
                  textShadow: isDark
                    ? "0 1px 5px rgba(0,0,0,0.5)"
                    : "0 2px 8px rgba(102, 126, 234, 0.6), 0 1px 3px rgba(0, 0, 0, 0.3)",
                  boxShadow: isDark
                    ? "0 4px 20px rgba(102, 126, 234, 0.2), 0 8px 40px rgba(118, 75, 162, 0.1)"
                    : "0 4px 20px rgba(255, 255, 255, 0.3), 0 8px 40px rgba(102, 126, 234, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Call to action with enhanced styling */}
          <div className={isMobile ? "mt-4" : "mt-8"}>
            <p
              className={`italic font-semibold ${
                isMobile ? "text-xs" : "text-sm md:text-base"
              } ${isDark ? "text-gray-200" : "text-white"}`}
              style={{
                textShadow: isDark
                  ? "0 2px 10px rgba(0,0,0,0.6), 0 0 20px rgba(102, 126, 234, 0.3)"
                  : "0 2px 10px rgba(102, 126, 234, 0.6), 0 4px 20px rgba(118, 75, 162, 0.4), 0 1px 3px rgba(0, 0, 0, 0.3)",
              }}
            >
              ✨ Building digital experiences that make a difference ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
