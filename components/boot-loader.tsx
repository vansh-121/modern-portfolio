"use client"

import { useEffect, useState, useRef } from "react"

interface BootLoaderProps {
  progress: number
}

export function BootLoader({ progress }: BootLoaderProps) {
  const [showApple, setShowApple] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const mountRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  // Prevent any scrolling or interaction during boot
  useEffect(() => {
    document.documentElement.style.overflow = "hidden"
    document.body.style.overflow = "hidden"
    document.body.style.height = "100vh"
    document.body.style.position = "fixed"
    document.body.style.width = "100%"

    return () => {
      document.documentElement.style.overflow = "auto"
      document.body.style.overflow = "auto"
      document.body.style.height = "auto"
      document.body.style.position = "static"
      document.body.style.width = "auto"
    }
  }, [])

  // Simple background gradient
  useEffect(() => {
    // Staggered animations with proper timing for authentic boot experience
    const timer1 = setTimeout(() => setShowApple(true), 800)
    const timer2 = setTimeout(() => setShowProgress(true), 2000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  // Update progress bar width
  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${progress}%`
    }
  }, [progress])

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Pure black background - authentic to macOS */}

      {/* Apple Logo - clean, minimal, white */}
      <div className={`transition-opacity duration-1000 ${showApple ? "opacity-100" : "opacity-0"}`}>
        {/* Custom SVG Apple logo for more authentic look */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 170 170"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          <path
            d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.2-2.12-9.96-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.93 0.21-9.84-1.96-14.75-6.52-3.13-2.73-7.05-7.41-11.73-14.04-5.03-7.08-9.17-15.29-12.41-24.65-3.47-10.11-5.21-19.9-5.21-29.38 0-10.86 2.35-20.22 7.04-28.07 3.69-6.29 8.6-11.27 14.75-14.96 6.15-3.69 12.79-5.57 19.95-5.78 3.91 0 9.05 1.21 15.43 3.59 6.36 2.39 10.45 3.6 12.24 3.6 1.34 0 5.88-1.42 13.57-4.24 7.29-2.62 13.44-3.7 18.48-3.27 13.65 1.1 23.91 6.47 30.72 16.14-12.21 7.4-18.22 17.74-18.05 31 0.16 10.33 3.85 18.94 11.07 25.77 3.3 3.13 6.98 5.54 11.07 7.26-0.89 2.57-1.83 5.04-2.82 7.4zM119.11 7.24c0 8.1-2.96 15.67-8.86 22.67-7.12 8.32-15.73 13.13-25.07 12.38-0.12-0.97-0.19-1.99-0.19-3.07 0-7.78 3.39-16.1 9.4-22.91 3-3.45 6.82-6.31 11.45-8.6 4.62-2.25 8.99-3.5 13.1-3.71 0.12 1.08 0.17 2.17 0.17 3.24z"
            fill="white"
          />
        </svg>
      </div>

      {/* Progress Bar - authentic macOS style */}
      <div className={`mt-8 transition-opacity duration-1000 ${showProgress ? "opacity-100" : "opacity-0"}`}>
        <div className="w-56 h-0.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full bg-white rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
