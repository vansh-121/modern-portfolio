"use client"

import { useEffect, useRef, useCallback } from "react"
import { useTheme } from "next-themes"
import * as THREE from "three"

export function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationRef = useRef<number | null>(null)
  const { theme } = useTheme()

  const initializeScene = useCallback(() => {
    if (!mountRef.current) return null

    // Detect device capabilities
    const isMobile = window.innerWidth < 768
    const isLowEnd = navigator.hardwareConcurrency <= 4 || isMobile

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isLowEnd,
      powerPreference: "high-performance",
      stencil: false,
      depth: false,
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowEnd ? 1.5 : 2))

    // Optimize renderer settings
    renderer.shadowMap.enabled = false
    renderer.physicallyCorrectLights = false

    // Particle system with adaptive count
    const particleCount = isLowEnd ? 200 : isMobile ? 400 : 800
    const geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    const spread = isMobile ? 50 : 80

    for (let i = 0; i < particleCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * spread
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread

      // Color
      const hue = 0.6 + Math.random() * 0.3
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      // Size
      sizes[i] = Math.random() * 2 + 1
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("customColor", new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))

    // Fixed shader material with proper attribute names
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 customColor;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = customColor;
          vec3 pos = position;
          
          // Simple wave animation
          pos.y += sin(pos.x * 0.02 + time * 0.5) * 2.0;
          pos.x += cos(pos.z * 0.02 + time * 0.5) * 1.5;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `,
      transparent: true,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // Add fewer geometric shapes for low-end devices
    const shapeCount = isLowEnd ? 3 : isMobile ? 5 : 8
    const shapes: THREE.Mesh[] = []

    for (let i = 0; i < shapeCount; i++) {
      const shapeGeometry = Math.random() > 0.5 ? new THREE.BoxGeometry(1, 1, 1) : new THREE.OctahedronGeometry(0.8)

      const shapeMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.6 + Math.random() * 0.3, 0.8, 0.6),
        transparent: true,
        opacity: 0.1,
        wireframe: true,
      })

      const mesh = new THREE.Mesh(shapeGeometry, shapeMaterial)
      mesh.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40)
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)

      scene.add(mesh)
      shapes.push(mesh)
    }

    camera.position.z = 30

    return { scene, camera, renderer, particles, shapes, material }
  }, [])

  useEffect(() => {
    const sceneData = initializeScene()
    if (!sceneData || !mountRef.current) return

    const { scene, camera, renderer, particles, shapes, material } = sceneData

    sceneRef.current = scene
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Animation variables
    let lastTime = 0
    const targetFPS = window.innerWidth < 768 ? 30 : 60
    const frameInterval = 1000 / targetFPS

    // Optimized animation loop
    const animate = (currentTime: number) => {
      animationRef.current = requestAnimationFrame(animate)

      // Frame rate limiting
      if (currentTime - lastTime < frameInterval) return
      lastTime = currentTime

      const time = currentTime * 0.001

      // Update particles
      if (material.uniforms) {
        material.uniforms.time.value = time
      }

      // Rotate particle system
      particles.rotation.y = time * 0.1
      particles.rotation.x = time * 0.05

      // Animate shapes with reduced frequency for performance
      const animationStep = window.innerWidth < 768 ? 2 : 1
      shapes.forEach((shape, index) => {
        if (index % animationStep === 0) {
          shape.rotation.x += 0.008
          shape.rotation.y += 0.008
          shape.position.y += Math.sin(time + index) * 0.008
        }
      })

      renderer.render(scene, camera)
    }

    // Handle resize
    const handleResize = () => {
      if (!camera || !renderer) return

      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize, { passive: true })

    // Start animation
    animate(0)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement)
      }

      // Dispose of Three.js resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      })

      // Dispose geometry and material
      particles.geometry.dispose()
      if (particles.material instanceof THREE.Material) {
        particles.material.dispose()
      }

      renderer.dispose()
    }
  }, [initializeScene])

  // Update theme
  useEffect(() => {
    if (!sceneRef.current) return

    const isDark = theme === "dark"
    sceneRef.current.traverse((object) => {
      if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshBasicMaterial) {
        object.material.opacity = isDark ? 0.15 : 0.08
      }
    })
  }, [theme])

  const backgroundGradient =
    theme === "dark"
      ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
      : "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)"

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 -z-10 transition-colors duration-500"
      style={{ background: backgroundGradient }}
    />
  )
}
