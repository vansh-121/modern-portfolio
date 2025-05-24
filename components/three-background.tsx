"use client"

import { useEffect, useRef, useMemo, useState } from "react"
import { useTheme } from "next-themes"
import * as THREE from "three"

export function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const frameRef = useRef<number>()
  const { theme } = useTheme()
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    isMobile: false,
    isLowEnd: false,
    pixelRatio: 1,
    maxParticles: 800,
  })

  // Detect device capabilities
  useEffect(() => {
    const detectCapabilities = () => {
      const isMobile = window.innerWidth < 768
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)

      // Detect low-end devices
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      const isLowEnd =
        !gl ||
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
        (navigator.deviceMemory && navigator.deviceMemory < 4)

      // Adjust particle count based on device
      let maxParticles = 800
      if (isMobile) maxParticles = isLowEnd ? 200 : 400
      else if (isLowEnd) maxParticles = 500

      setDeviceCapabilities({
        isMobile,
        isLowEnd,
        pixelRatio,
        maxParticles,
      })
    }

    detectCapabilities()
    window.addEventListener("resize", detectCapabilities)
    return () => window.removeEventListener("resize", detectCapabilities)
  }, [])

  const { scene, camera, renderer, particles, mousePosition, shapes } = useMemo(() => {
    if (typeof window === "undefined")
      return { scene: null, camera: null, renderer: null, particles: null, mousePosition: null, shapes: null }

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !deviceCapabilities.isMobile, // Disable antialiasing on mobile for performance
      powerPreference: deviceCapabilities.isMobile ? "low-power" : "high-performance",
    })

    // Mouse position for interaction
    const mousePosition = { x: 0, y: 0 }

    // Particle system with responsive count
    const particleCount = deviceCapabilities.maxParticles
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100

      // Gradient colors from blue to purple to pink
      const color = new THREE.Color()
      color.setHSL(0.6 + Math.random() * 0.3, 0.8, 0.6)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      sizes[i] = Math.random() * 2 + 1
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("customColor", new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        mouse: { value: new THREE.Vector2() },
        isDark: { value: 0 },
        isMobile: { value: deviceCapabilities.isMobile ? 1 : 0 },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 customColor;
        varying vec3 vColor;
        uniform float time;
        uniform vec2 mouse;
        uniform float isMobile;
        
        void main() {
          vColor = customColor;
          vec3 pos = position;
          
          // Reduced animation intensity on mobile
          float animationIntensity = isMobile > 0.5 ? 0.5 : 1.0;
          
          // Wave animation
          pos.y += sin(pos.x * 0.01 + time) * 5.0 * animationIntensity;
          pos.x += cos(pos.z * 0.01 + time) * 3.0 * animationIntensity;
          
          // Mouse interaction (reduced on mobile)
          vec2 mouseInfluence = mouse * 10.0 * animationIntensity;
          pos.xy += mouseInfluence * 0.1;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        uniform float isDark;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          vec3 finalColor = mix(vColor, vColor * 0.5, isDark);
          gl_FragColor = vec4(finalColor, alpha * (0.8 + isDark * 0.2));
        }
      `,
      transparent: true,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // Floating geometric shapes (fewer on mobile)
    const shapes = []
    const shapeCount = deviceCapabilities.isMobile ? 5 : deviceCapabilities.isLowEnd ? 8 : 15

    for (let i = 0; i < shapeCount; i++) {
      const geometryShape = Math.random() > 0.5 ? new THREE.BoxGeometry(2, 2, 2) : new THREE.OctahedronGeometry(1.5)

      const materialShape = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.6 + Math.random() * 0.3, 0.8, 0.6),
        transparent: true,
        opacity: deviceCapabilities.isMobile ? 0.05 : 0.1,
        wireframe: true,
      })

      const mesh = new THREE.Mesh(geometryShape, materialShape)
      mesh.position.set((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80)
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)

      scene.add(mesh)
      shapes.push(mesh)
    }

    camera.position.z = 50

    return { scene, camera, renderer, particles, mousePosition, shapes }
  }, [deviceCapabilities])

  useEffect(() => {
    if (!mountRef.current || !scene || !camera || !renderer) return

    // Setup renderer with responsive settings
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(deviceCapabilities.pixelRatio)

    // Performance optimizations for mobile
    if (deviceCapabilities.isMobile) {
      renderer.shadowMap.enabled = false
      renderer.antialias = false
    }

    mountRef.current.appendChild(renderer.domElement)

    sceneRef.current = scene
    rendererRef.current = renderer

    // Mouse move handler (throttled on mobile)
    let mouseMoveTimeout: NodeJS.Timeout
    const handleMouseMove = (event: MouseEvent) => {
      if (deviceCapabilities.isMobile) {
        // Throttle mouse events on mobile
        if (mouseMoveTimeout) return
        mouseMoveTimeout = setTimeout(() => {
          mouseMoveTimeout = null as any
        }, 16) // ~60fps
      }

      mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1
      mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    // Touch handler for mobile
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0]
        mousePosition.x = (touch.clientX / window.innerWidth) * 2 - 1
        mousePosition.y = -(touch.clientY / window.innerHeight) * 2 + 1
      }
    }

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, deviceCapabilities.isMobile ? 1.5 : 2))
    }

    // Event listeners
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("touchmove", handleTouchMove, { passive: true })
    window.addEventListener("resize", handleResize)

    // Animation loop with performance monitoring
    let lastTime = 0
    const targetFPS = deviceCapabilities.isMobile ? 30 : 60
    const frameInterval = 1000 / targetFPS

    const animate = (currentTime: number) => {
      frameRef.current = requestAnimationFrame(animate)

      // Frame rate limiting for mobile
      if (currentTime - lastTime < frameInterval) return
      lastTime = currentTime

      const time = currentTime * 0.001
      const isDark = theme === "dark" ? 1 : 0

      // Update shader uniforms
      if (particles && particles.material instanceof THREE.ShaderMaterial) {
        particles.material.uniforms.time.value = time
        particles.material.uniforms.mouse.value.set(mousePosition.x, mousePosition.y)
        particles.material.uniforms.isDark.value = isDark
        particles.material.uniforms.isMobile.value = deviceCapabilities.isMobile ? 1 : 0
      }

      // Rotate particles (slower on mobile)
      const rotationSpeed = deviceCapabilities.isMobile ? 0.05 : 0.1
      particles.rotation.y = time * rotationSpeed
      particles.rotation.x = time * (rotationSpeed * 0.5)

      // Animate geometric shapes (reduced on mobile)
      if (shapes) {
        shapes.forEach((shape, index) => {
          const speed = deviceCapabilities.isMobile ? 0.005 : 0.01
          shape.rotation.x += speed
          shape.rotation.y += speed
          shape.position.y += Math.sin(time + index) * (deviceCapabilities.isMobile ? 0.01 : 0.02)

          // Update opacity based on theme
          if (shape.material instanceof THREE.MeshBasicMaterial) {
            const baseOpacity = deviceCapabilities.isMobile ? 0.05 : 0.1
            shape.material.opacity = theme === "dark" ? baseOpacity * 1.5 : baseOpacity
          }
        })
      }

      renderer.render(scene, camera)
    }

    animate(0)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("resize", handleResize)

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }

      // Cleanup Three.js resources
      scene.clear()
      renderer.dispose()

      // Dispose geometries and materials
      if (particles) {
        particles.geometry.dispose()
        if (particles.material instanceof THREE.Material) {
          particles.material.dispose()
        }
      }

      shapes?.forEach((shape) => {
        shape.geometry.dispose()
        if (shape.material instanceof THREE.Material) {
          shape.material.dispose()
        }
      })
    }
  }, [scene, camera, renderer, particles, mousePosition, shapes, theme, deviceCapabilities])

  // Responsive background gradient
  const backgroundGradient = useMemo(() => {
    const baseGradient =
      theme === "dark"
        ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"

    return baseGradient
  }, [theme])

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 -z-10 transition-all duration-500"
      style={{
        background: backgroundGradient,
        willChange: "transform", // Optimize for animations
        backfaceVisibility: "hidden", // Prevent flickering
      }}
    />
  )
}
