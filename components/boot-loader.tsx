"use client"

import { useEffect, useState, useRef } from "react"
import { Apple } from "lucide-react"
import * as THREE from "three"

interface BootLoaderProps {
  progress: number
}

export function BootLoader({ progress }: BootLoaderProps) {
  const [showApple, setShowApple] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [showText, setShowText] = useState(false)
  const [bootMessages, setBootMessages] = useState<string[]>([])
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationRef = useRef<number | null>(null)

  // macOS boot messages
  const macOSBootMessages = [
    "Checking system integrity...",
    "Loading kernel extensions...",
    "Initializing hardware drivers...",
    "Starting system services...",
    "Mounting file systems...",
    "Loading user interface...",
    "Preparing desktop environment...",
    "Portfolio OS ready",
  ]

  useEffect(() => {
    // Prevent any scrolling or interaction
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

  // Update boot messages based on progress
  useEffect(() => {
    const messageIndex = Math.floor((progress / 100) * macOSBootMessages.length)
    if (messageIndex > 0 && messageIndex <= macOSBootMessages.length) {
      setBootMessages(macOSBootMessages.slice(0, messageIndex))
    }
  }, [progress])

  useEffect(() => {
    if (!mountRef.current) return

    // Detect device capabilities
    const isMobile = window.innerWidth < 768
    const isLowEnd = navigator.hardwareConcurrency <= 4 || isMobile

    // Scene setup with darker, more minimal theme
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x000000, 50, 200)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isLowEnd,
      powerPreference: "high-performance",
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowEnd ? 1.5 : 2))
    renderer.setClearColor(0x000000, 1)

    sceneRef.current = scene
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Minimal starfield for macOS aesthetic
    const starCount = isMobile ? 300 : 600
    const starGeometry = new THREE.BufferGeometry()
    const starPositions = new Float32Array(starCount * 3)
    const starColors = new Float32Array(starCount * 3)

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 200
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 200
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 200

      // White/blue stars only for clean macOS look
      const brightness = 0.8 + Math.random() * 0.2
      starColors[i * 3] = brightness
      starColors[i * 3 + 1] = brightness
      starColors[i * 3 + 2] = brightness
    }

    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3))
    starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3))

    const starMaterial = new THREE.PointsMaterial({
      size: isMobile ? 1 : 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    })

    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    camera.position.z = 30

    // Minimal animation
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      stars.rotation.y += 0.0005
      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement)
      }
      starGeometry.dispose()
      starMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  useEffect(() => {
    // Staggered animations with proper timing
    const timer1 = setTimeout(() => setShowApple(true), 1000)
    const timer2 = setTimeout(() => setShowText(true), 1800)
    const timer3 = setTimeout(() => setShowProgress(true), 2500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 overflow-hidden macos-boot">
      {/* 3D Background */}
      <div ref={mountRef} className="absolute inset-0 -z-10" />

      {/* macOS-style Apple Logo */}
      <div
        className={`relative transition-all duration-2000 ease-out ${
          showApple ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        {/* Subtle glow */}
        <div className="absolute inset-0 -m-8">
          <div className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-white/10 rounded-full blur-2xl" />
        </div>

        {/* Apple Logo */}
        <div className="relative z-10">
          <Apple className="w-20 h-20 md:w-28 md:h-28 text-white fill-current" />
        </div>
      </div>

      {/* macOS-style Loading Text */}
      <div
        className={`mt-12 md:mt-16 text-white transition-all duration-1500 ${
          showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-light mb-4 macos-display">Portfolio OS</h1>

          {/* Boot Messages */}
          <div className="h-16 md:h-20 flex flex-col justify-end">
            {bootMessages.slice(-2).map((message, index) => (
              <p
                key={index}
                className={`text-xs md:text-sm text-gray-400 transition-opacity duration-500 macos-text ${
                  index === bootMessages.slice(-2).length - 1 ? "opacity-100" : "opacity-60"
                }`}
              >
                {message}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* macOS-style Progress Bar */}
      <div
        className={`mt-8 md:mt-12 w-72 md:w-80 transition-all duration-1500 ${
          showProgress ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Progress Bar Container */}
        <div className="relative">
          {/* Track */}
          <div className="w-full bg-gray-800 rounded-full h-1 md:h-1.5 overflow-hidden">
            {/* Progress Fill */}
            <div
              className="h-full bg-white rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Progress Text */}
          <div className="text-center mt-4">
            <span className="text-white text-sm md:text-base font-light macos-text">
              {progress < 100 ? `Loading... ${progress}%` : "Starting up..."}
            </span>
          </div>
        </div>
      </div>

      {/* Minimal floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
