"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Apple } from "lucide-react"

interface BootLoaderProps {
  progress: number
}

export function BootLoader({ progress }: BootLoaderProps) {
  const [showApple, setShowApple] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const [displayProgress, setDisplayProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isLowEnd, setIsLowEnd] = useState(false)
  const animationFrameRef = useRef<number>()
  const progressStartTimeRef = useRef<number>()

  // Enhanced device detection
  useEffect(() => {
    const detectDevice = () => {
      const isMobile = window.innerWidth < 768

      // Detect low-end devices
      const isLowEnd =
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
        (navigator.deviceMemory && navigator.deviceMemory < 4) ||
        (/Android.*Chrome\/[.0-9]*\s/.test(navigator.userAgent) && window.innerWidth < 768)

      setIsMobile(isMobile)
      setIsLowEnd(isLowEnd)
    }

    detectDevice()
    window.addEventListener("resize", detectDevice)
    return () => window.removeEventListener("resize", detectDevice)
  }, [])

  // High-performance progress animation with accurate synchronization
  const animateProgress = useCallback(
    (targetProgress: number) => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      const startProgress = animatedProgress
      const startTime = performance.now()
      progressStartTimeRef.current = startTime

      // Adaptive duration based on device capability
      const baseDuration = isLowEnd ? 150 : isMobile ? 200 : 300
      const progressDiff = Math.abs(targetProgress - startProgress)
      const duration = Math.max(100, baseDuration * (progressDiff / 100))

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progressRatio = Math.min(elapsed / duration, 1)

        // Smooth easing with better performance
        const easeOutQuart = 1 - Math.pow(1 - progressRatio, 4)
        const currentProgress = startProgress + (targetProgress - startProgress) * easeOutQuart

        setAnimatedProgress(currentProgress)

        // Synchronize display progress with visual progress
        const roundedProgress = Math.round(currentProgress)
        setDisplayProgress(roundedProgress)

        if (progressRatio < 1) {
          animationFrameRef.current = requestAnimationFrame(animate)
        } else {
          // Ensure final values are exactly correct
          setAnimatedProgress(targetProgress)
          setDisplayProgress(targetProgress)
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    },
    [animatedProgress, isMobile, isLowEnd],
  )

  // Trigger smooth progress animation when progress changes
  useEffect(() => {
    if (showProgress && progress !== animatedProgress) {
      animateProgress(progress)
    }
  }, [progress, showProgress, animateProgress, animatedProgress])

  // Optimized staggered entrance animations
  useEffect(() => {
    const appleDelay = isLowEnd ? 100 : isMobile ? 200 : 300
    const progressDelay = isLowEnd ? 400 : isMobile ? 600 : 800

    const timer1 = setTimeout(() => setShowApple(true), appleDelay)
    const timer2 = setTimeout(() => setShowProgress(true), progressDelay)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isMobile, isLowEnd])

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Optimized particle generation
  const particleCount = isLowEnd ? 5 : isMobile ? 8 : 15
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * (isLowEnd ? 1 : 2),
    duration: (isLowEnd ? 1.5 : 2) + Math.random() * (isLowEnd ? 1 : 2),
  }))

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Apple Logo with optimized animations */}
      <div
        className={`transition-all duration-1000 ease-out transform-gpu ${
          showApple ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
        style={{
          willChange: showApple ? "auto" : "transform, opacity",
          backfaceVisibility: "hidden",
        }}
      >
        <div className="relative">
          <Apple className="w-16 h-16 md:w-20 md:h-20 text-white fill-current drop-shadow-lg" />
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 w-16 h-16 md:w-20 md:h-20 rounded-lg opacity-20 blur-xl"
            style={{
              animation: showApple ? "pulse 2s ease-in-out infinite" : "none",
            }}
          />
        </div>
      </div>

      {/* Loading Text with responsive sizing */}
      <div
        className={`mt-6 md:mt-8 text-white text-base md:text-lg font-light transition-all duration-500 ${
          showApple ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ willChange: showApple ? "auto" : "transform, opacity" }}
      >
        Starting Portfolio...
      </div>

      {/* High-performance Progress Bar */}
      <div
        className={`mt-4 md:mt-6 w-48 md:w-64 transition-all duration-500 ${
          showProgress ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ willChange: showProgress ? "auto" : "transform, opacity" }}
      >
        <div className="w-full bg-gray-800 rounded-full h-1.5 md:h-2 overflow-hidden relative">
          {/* Background track */}
          <div className="absolute inset-0 bg-gray-800 rounded-full" />

          {/* Progress fill with synchronized animation */}
          <div
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 h-full rounded-full transition-all ease-out transform-gpu relative overflow-hidden"
            style={{
              width: `${animatedProgress}%`,
              transitionDuration: "0ms", // Use RAF animation instead of CSS transition
              willChange: animatedProgress < 100 ? "width" : "auto",
              backfaceVisibility: "hidden",
            }}
          >
            {/* Shimmer effect for visual appeal */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{
                animation:
                  animatedProgress > 0 && animatedProgress < 100 ? "shimmer 1.5s ease-in-out infinite" : "none",
                transform: "translateX(-100%)",
              }}
            />
          </div>
        </div>

        {/* Synchronized percentage display */}
        <div className="text-center text-gray-400 text-xs md:text-sm mt-2 font-mono tabular-nums">
          {displayProgress}%
        </div>
      </div>

      {/* Optimized Particles with reduced count on low-end devices */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-0.5 h-0.5 md:w-1 md:h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animation: `pulse ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Custom keyframes for shimmer effect */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}
