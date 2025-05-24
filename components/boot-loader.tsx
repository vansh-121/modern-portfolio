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
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Detect device capabilities
    const isMobile = window.innerWidth < 768
    const isLowEnd = navigator.hardwareConcurrency <= 4 || isMobile

    // Scene setup with space theme
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x000011, 50, 200)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isLowEnd,
      powerPreference: "high-performance",
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowEnd ? 1.5 : 2))
    renderer.setClearColor(0x000011, 1)

    sceneRef.current = scene
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Create starfield
    const starCount = isMobile ? 800 : 1500
    const starGeometry = new THREE.BufferGeometry()
    const starPositions = new Float32Array(starCount * 3)
    const starColors = new Float32Array(starCount * 3)
    const starSizes = new Float32Array(starCount)

    for (let i = 0; i < starCount; i++) {
      // Create spherical distribution of stars
      const radius = 100 + Math.random() * 100
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      starPositions[i * 3 + 2] = radius * Math.cos(phi)

      // Star colors - blues, purples, whites
      const colorType = Math.random()
      let color
      if (colorType < 0.3) {
        color = new THREE.Color(0.8, 0.9, 1.0) // Blue-white
      } else if (colorType < 0.6) {
        color = new THREE.Color(0.9, 0.8, 1.0) // Purple-white
      } else {
        color = new THREE.Color(1.0, 1.0, 1.0) // Pure white
      }

      starColors[i * 3] = color.r
      starColors[i * 3 + 1] = color.g
      starColors[i * 3 + 2] = color.b

      starSizes[i] = Math.random() * 2 + 0.5
    }

    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3))
    starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3))
    starGeometry.setAttribute("size", new THREE.BufferAttribute(starSizes, 1))

    const starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          vec3 pos = position;
          
          // Subtle twinkling effect
          float twinkle = sin(time * 2.0 + pos.x * 0.01) * 0.3 + 0.7;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * twinkle * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      vertexColors: true,
    })

    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    // Create planets/celestial bodies
    const planetCount = isMobile ? 3 : 5
    const planets: THREE.Mesh[] = []

    for (let i = 0; i < planetCount; i++) {
      const planetGeometry = new THREE.SphereGeometry(2 + Math.random() * 3, 16, 16)

      // Planet materials with space colors
      const planetMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.6 + Math.random() * 0.4, 0.7, 0.5),
        transparent: true,
        opacity: 0.8,
        wireframe: Math.random() > 0.5,
      })

      const planet = new THREE.Mesh(planetGeometry, planetMaterial)

      // Position planets in orbit-like positions
      const distance = 30 + i * 15
      const angle = (i / planetCount) * Math.PI * 2
      planet.position.set(Math.cos(angle) * distance, (Math.random() - 0.5) * 20, Math.sin(angle) * distance)

      scene.add(planet)
      planets.push(planet)
    }

    // Create cosmic dust/nebula particles
    const dustCount = isMobile ? 200 : 400
    const dustGeometry = new THREE.BufferGeometry()
    const dustPositions = new Float32Array(dustCount * 3)
    const dustColors = new Float32Array(dustCount * 3)

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 150
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 150
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 150

      // Nebula colors - purples, blues, magentas
      const hue = 0.7 + Math.random() * 0.3
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6)
      dustColors[i * 3] = color.r
      dustColors[i * 3 + 1] = color.g
      dustColors[i * 3 + 2] = color.b
    }

    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3))
    dustGeometry.setAttribute("color", new THREE.BufferAttribute(dustColors, 3))

    const dustMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.5 : 1.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    })

    const dust = new THREE.Points(dustGeometry, dustMaterial)
    scene.add(dust)

    // Create asteroid belt
    const asteroidCount = isMobile ? 15 : 25
    const asteroids: THREE.Mesh[] = []

    for (let i = 0; i < asteroidCount; i++) {
      const asteroidGeometry = new THREE.DodecahedronGeometry(0.5 + Math.random() * 1.5)
      const asteroidMaterial = new THREE.MeshBasicMaterial({
        color: 0x444444,
        wireframe: true,
        transparent: true,
        opacity: 0.7,
      })

      const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial)

      // Position in belt formation
      const beltRadius = 60 + Math.random() * 20
      const beltAngle = (i / asteroidCount) * Math.PI * 2
      asteroid.position.set(
        Math.cos(beltAngle) * beltRadius,
        (Math.random() - 0.5) * 5,
        Math.sin(beltAngle) * beltRadius,
      )

      asteroid.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)

      scene.add(asteroid)
      asteroids.push(asteroid)
    }

    // Create shooting stars
    const shootingStars: THREE.Mesh[] = []
    const shootingStarCount = isMobile ? 2 : 4

    for (let i = 0; i < shootingStarCount; i++) {
      const trailGeometry = new THREE.CylinderGeometry(0.02, 0.1, 5, 8)
      const trailMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8,
        emissive: 0x004444,
      })

      const shootingStar = new THREE.Mesh(trailGeometry, trailMaterial)
      shootingStar.position.set((Math.random() - 0.5) * 200, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200)
      shootingStar.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)

      scene.add(shootingStar)
      shootingStars.push(shootingStar)
    }

    camera.position.z = 30

    // Animation loop
    const startTime = Date.now()
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      const elapsed = (Date.now() - startTime) / 1000

      // Update star twinkling
      if (starMaterial.uniforms) {
        starMaterial.uniforms.time.value = elapsed
      }

      // Rotate starfield slowly
      stars.rotation.y = elapsed * 0.02
      stars.rotation.x = elapsed * 0.01

      // Animate planets in orbit
      planets.forEach((planet, index) => {
        const orbitSpeed = 0.1 + index * 0.02
        const orbitRadius = 30 + index * 15
        const angle = elapsed * orbitSpeed + (index / planets.length) * Math.PI * 2

        planet.position.x = Math.cos(angle) * orbitRadius
        planet.position.z = Math.sin(angle) * orbitRadius

        // Rotate planets
        planet.rotation.x += 0.01
        planet.rotation.y += 0.02
      })

      // Animate cosmic dust
      const dustPositions = dust.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < dustCount; i++) {
        dustPositions[i * 3] += Math.sin(elapsed + i) * 0.01
        dustPositions[i * 3 + 1] += Math.cos(elapsed + i) * 0.01
        dustPositions[i * 3 + 2] += Math.sin(elapsed * 0.5 + i) * 0.005
      }
      dust.geometry.attributes.position.needsUpdate = true

      // Animate asteroids
      asteroids.forEach((asteroid, index) => {
        const beltSpeed = 0.05 + index * 0.01
        const beltRadius = 60 + (index % 3) * 10
        const angle = elapsed * beltSpeed + (index / asteroids.length) * Math.PI * 2

        asteroid.position.x = Math.cos(angle) * beltRadius
        asteroid.position.z = Math.sin(angle) * beltRadius

        asteroid.rotation.x += 0.02
        asteroid.rotation.y += 0.01
        asteroid.rotation.z += 0.015
      })

      // Animate shooting stars
      shootingStars.forEach((star, index) => {
        const speed = 2 + index * 0.5
        star.position.x -= speed
        star.position.y -= speed * 0.3

        // Reset position when off screen
        if (star.position.x < -100) {
          star.position.x = 100
          star.position.y = (Math.random() - 0.5) * 100
          star.position.z = (Math.random() - 0.5) * 200
        }

        star.rotation.z += 0.1
      })

      // Camera movement - gentle floating in space
      camera.position.x = Math.sin(elapsed * 0.1) * 5
      camera.position.y = Math.cos(elapsed * 0.15) * 3
      camera.lookAt(0, 0, 0)

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

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement)
      }

      // Dispose resources
      starGeometry.dispose()
      starMaterial.dispose()
      dustGeometry.dispose()
      dustMaterial.dispose()

      planets.forEach((planet) => {
        planet.geometry.dispose()
        if (planet.material instanceof THREE.Material) {
          planet.material.dispose()
        }
      })

      asteroids.forEach((asteroid) => {
        asteroid.geometry.dispose()
        if (asteroid.material instanceof THREE.Material) {
          asteroid.material.dispose()
        }
      })

      shootingStars.forEach((star) => {
        star.geometry.dispose()
        if (star.material instanceof THREE.Material) {
          star.material.dispose()
        }
      })

      renderer.dispose()
    }
  }, [])

  useEffect(() => {
    // Staggered animations
    const timer1 = setTimeout(() => setShowApple(true), 500)
    const timer2 = setTimeout(() => setShowText(true), 1000)
    const timer3 = setTimeout(() => setShowProgress(true), 1500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-black flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* 3D Space Background */}
      <div ref={mountRef} className="absolute inset-0 -z-10" />

      {/* Cosmic Apple Logo */}
      <div
        className={`relative transition-all duration-1500 ease-out transform-gpu ${
          showApple ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-75 rotate-6"
        }`}
      >
        {/* Outer cosmic glow */}
        <div className="absolute inset-0 -m-16">
          <div className="w-32 h-32 md:w-40 md:h-40 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-20 blur-3xl animate-pulse" />
        </div>

        {/* Middle energy ring */}
        <div className="absolute inset-0 -m-8">
          <div
            className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full opacity-40 blur-2xl animate-pulse"
            style={{ animationDelay: "0.5s", animationDuration: "2s" }}
          />
        </div>

        {/* Inner stellar core */}
        <div className="absolute inset-0 -m-4">
          <div
            className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-r from-white via-cyan-300 to-blue-400 rounded-full opacity-60 blur-xl animate-pulse"
            style={{ animationDelay: "1s", animationDuration: "1.5s" }}
          />
        </div>

        {/* Main Apple Logo */}
        <div className="relative z-10">
          <Apple className="w-16 h-16 md:w-24 md:h-24 text-white fill-current drop-shadow-2xl animate-pulse" />

          {/* Holographic overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/30 via-transparent to-purple-300/30 w-16 h-16 md:w-24 md:h-24 rounded-2xl blur-sm" />
        </div>

        {/* Orbiting cosmic particles */}
        <div className="absolute inset-0 w-16 h-16 md:w-24 md:h-24">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 md:w-2 md:h-2 rounded-full"
              style={{
                background: `hsl(${200 + i * 20}, 80%, 70%)`,
                animation: `cosmicOrbit 4s linear infinite`,
                animationDelay: `${i * 0.5}s`,
                transformOrigin: "32px 32px",
                boxShadow: `0 0 10px hsl(${200 + i * 20}, 80%, 70%)`,
              }}
            />
          ))}
        </div>

        {/* Energy rings */}
        <div className="absolute inset-0 w-16 h-16 md:w-24 md:h-24">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 border border-cyan-400/30 rounded-full animate-ping"
              style={{
                animationDelay: `${i * 0.7}s`,
                animationDuration: "3s",
                transform: `scale(${1 + i * 0.5})`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Cosmic Loading Text */}
      <div
        className={`mt-8 md:mt-12 text-white transition-all duration-1000 transform-gpu ${
          showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="relative text-center">
          <h1 className="text-lg md:text-2xl font-light mb-2">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent font-medium">
              Initializing Portfolio OS
            </span>
          </h1>
          <p className="text-sm md:text-base text-blue-200/80">Connecting to the digital cosmos...</p>
          <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/10 via-blue-400/10 to-purple-400/10 blur-xl -z-10" />
        </div>
      </div>

      {/* Futuristic Progress Bar */}
      <div
        className={`mt-6 md:mt-8 w-80 md:w-96 transition-all duration-1000 transform-gpu ${
          showProgress ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
        }`}
      >
        {/* Progress container with cosmic styling */}
        <div className="relative">
          {/* Outer glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 rounded-full blur-sm" />

          {/* Progress track */}
          <div className="relative w-full bg-gray-900/60 rounded-full h-3 md:h-4 backdrop-blur-sm border border-cyan-500/30 shadow-2xl overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-pulse" />

            {/* Progress bar with cosmic gradient */}
            <div
              className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #00f5ff, #0080ff, #8000ff, #ff00ff)",
                backgroundSize: "200% 100%",
                animation: "cosmicFlow 3s ease-in-out infinite",
                boxShadow: "0 0 20px rgba(0, 245, 255, 0.5)",
              }}
            >
              {/* Energy pulse effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 animate-energyPulse" />

              {/* Particle trail */}
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-ping" />
            </div>
          </div>

          {/* Progress glow effect */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-full blur-lg transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress text with cosmic styling */}
        <div className="text-center mt-4 md:mt-6">
          <div className="text-white/90 text-base md:text-lg font-mono tracking-wider">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent font-bold text-xl md:text-2xl">
              {progress}%
            </span>
            <span className="text-blue-200/70 ml-3 text-sm md:text-base">LOADING</span>
          </div>

          {/* Status indicators */}
          <div className="flex justify-center mt-3 space-x-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: `hsl(${180 + i * 30}, 80%, 60%)`,
                  animationDelay: `${i * 0.3}s`,
                  boxShadow: `0 0 10px hsl(${180 + i * 30}, 80%, 60%)`,
                }}
              />
            ))}
          </div>

          {/* System status */}
          <div className="text-xs md:text-sm text-cyan-300/60 mt-2 font-mono">[ QUANTUM PROCESSORS ONLINE ]</div>
        </div>
      </div>

      {/* Floating cosmic elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-cosmicFloat"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              background: `hsl(${200 + Math.random() * 100}, 80%, 70%)`,
              boxShadow: `0 0 20px hsl(${200 + Math.random() * 100}, 80%, 70%)`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes cosmicOrbit {
          from {
            transform: rotate(0deg) translateX(50px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(50px) rotate(-360deg);
          }
        }
        
        @keyframes cosmicFlow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes energyPulse {
          0% {
            transform: translateX(-100%) skewX(-12deg);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
            opacity: 0;
          }
        }
        
        @keyframes cosmicFloat {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-30px) translateX(20px) rotate(90deg);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-10px) translateX(-15px) rotate(180deg);
            opacity: 0.6;
          }
          75% {
            transform: translateY(-40px) translateX(10px) rotate(270deg);
            opacity: 0.9;
          }
        }
        
        .animate-energyPulse {
          animation: energyPulse 2s ease-in-out infinite;
        }
        
        .animate-cosmicFloat {
          animation: cosmicFloat 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
