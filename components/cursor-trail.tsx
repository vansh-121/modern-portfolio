"use client"

import { useEffect, useRef, useState } from "react"

interface TrailPoint {
  x: number
  y: number
  opacity: number
  size: number
  hue: number
}

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const trailPoints = useRef<TrailPoint[]>([])
  const animationRef = useRef<number>()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    let mouseX = 0
    let mouseY = 0
    let hue = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      setIsVisible(true)

      // Add new trail point
      trailPoints.current.push({
        x: mouseX,
        y: mouseY,
        opacity: 1,
        size: Math.random() * 8 + 4,
        hue: hue,
      })

      // Limit trail length
      if (trailPoints.current.length > 20) {
        trailPoints.current.shift()
      }

      hue += 2
      if (hue > 360) hue = 0
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw trail points
      trailPoints.current = trailPoints.current.filter((point) => {
        point.opacity -= 0.05
        point.size *= 0.98

        if (point.opacity > 0) {
          ctx.save()
          ctx.globalAlpha = point.opacity
          ctx.fillStyle = `hsl(${point.hue}, 70%, 60%)`
          ctx.shadowBlur = 20
          ctx.shadowColor = `hsl(${point.hue}, 70%, 60%)`

          ctx.beginPath()
          ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()

          return true
        }
        return false
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)
    animate()

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    />
  )
}
