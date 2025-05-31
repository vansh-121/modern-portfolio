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
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-4 text-center z-10">
      <div className="mb-16 md:mb-20">
        <h1
          className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 ${
            isDark ? "text-white" : "text-gray-900"
          } tracking-tight`}
          style={{
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.03em",
            textShadow: isDark ? "0 4px 12px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          Hey, I'm Vansh Sethi
        </h1>
        <p
          className={`text-base md:text-lg lg:text-xl ${isDark ? "text-gray-300" : "text-gray-600"} max-w-lg mx-auto`}
          style={{
            fontFamily: "var(--font-system)",
            fontWeight: 300,
          }}
        >
          Full Stack Developer & Designer
        </p>
      </div>
    </div>
  )
}
