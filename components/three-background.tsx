"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { useTheme } from "next-themes"
import dynamic from "next/dynamic"

// Dynamically import Three.js to avoid SSR issues
const ThreeBackgroundClient = dynamic(() => Promise.resolve(ThreeBackgroundComponent), {
  ssr: false,
  loading: () => <div className="fixed inset-0 -z-10" />,
})

function ThreeBackgroundComponent() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<any>(null)
  const rendererRef = useRef<any>(null)
  const animationRef = useRef<number | null>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const cursorParticlesRef = useRef<any[]>([])
  const { theme } = useTheme()
  const [isClient, setIsClient] = useState(false)
  const [THREE, setTHREE] = useState<any>(null)

  // Mouse tracking for interactive particles
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      }
    }

    const handleClick = (event: MouseEvent) => {
      // Create particle explosion on click
      if (THREE && sceneRef.current) {
        createParticleExplosion(event.clientX, event.clientY)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("click", handleClick)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("click", handleClick)
    }
  }, [THREE])

  const createParticleExplosion = (x: number, y: number) => {
    if (!THREE || !sceneRef.current) return

    const particleCount = 20
    const particles = []

    for (let i = 0; i < particleCount; i++) {
      const geometry = new THREE.SphereGeometry(0.1, 8, 8)
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
        transparent: true,
        opacity: 0.8,
      })

      const particle = new THREE.Mesh(geometry, material)

      // Convert screen coordinates to world coordinates
      const worldX = (x / window.innerWidth) * 2 - 1
      const worldY = -(y / window.innerHeight) * 2 + 1

      particle.position.set(worldX * 50, worldY * 50, (Math.random() - 0.5) * 20)

      // Random velocity
      particle.userData = {
        velocity: new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2),
        life: 1.0,
      }

      sceneRef.current.add(particle)
      particles.push(particle)
    }

    // Animate explosion particles
    const animateExplosion = () => {
      particles.forEach((particle, index) => {
        if (particle.userData.life <= 0) {
          sceneRef.current.remove(particle)
          particles.splice(index, 1)
          return
        }

        particle.position.add(particle.userData.velocity)
        particle.userData.velocity.multiplyScalar(0.98) // Friction
        particle.userData.life -= 0.02
        particle.material.opacity = particle.userData.life
        particle.scale.setScalar(particle.userData.life)
      })

      if (particles.length > 0) {
        requestAnimationFrame(animateExplosion)
      }
    }

    animateExplosion()
  }

  // Enhanced scene initialization with cursor-following particles
  const initializeScene = useCallback(() => {
    if (!mountRef.current || !THREE || !isClient) {
      console.log("Prerequisites not met for Three.js initialization")
      return null
    }

    try {
      console.log("Initializing enhanced Three.js scene...")

      const isMobile = window.innerWidth < 768
      const isLowEnd = navigator.hardwareConcurrency <= 4 || isMobile

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isLowEnd,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      })

      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowEnd ? 1.5 : 2))

      // Main particle system (existing code)
      const particleCount = isLowEnd ? 200 : isMobile ? 350 : 500
      const geometry = new THREE.BufferGeometry()

      const positions = new Float32Array(particleCount * 3)
      const colors = new Float32Array(particleCount * 3)
      const sizes = new Float32Array(particleCount)
      const velocities = new Float32Array(particleCount * 3)
      const phases = new Float32Array(particleCount)

      const spread = isMobile ? 120 : 180

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * spread
        positions[i * 3 + 1] = (Math.random() - 0.5) * spread
        positions[i * 3 + 2] = (Math.random() - 0.5) * spread

        velocities[i * 3] = (Math.random() - 0.5) * 0.03
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.025

        phases[i] = Math.random() * Math.PI * 2

        // Theme-based colors
        const colorChoice = Math.random()
        let color
        if (theme === "hacker") {
          color = new THREE.Color().setHSL(0.33, 0.9, 0.5 + Math.random() * 0.3)
        } else if (theme === "retro") {
          color = new THREE.Color().setHSL(0.8 + Math.random() * 0.2, 0.8, 0.6)
        } else if (theme === "sunset") {
          color = new THREE.Color().setHSL(0.1 + Math.random() * 0.2, 0.8, 0.6)
        } else {
          // Cosmic theme (default)
          if (colorChoice < 0.25) {
            color = new THREE.Color().setHSL(0.6, 0.9, 0.7)
          } else if (colorChoice < 0.5) {
            color = new THREE.Color().setHSL(0.75, 0.8, 0.6)
          } else if (colorChoice < 0.75) {
            color = new THREE.Color().setHSL(0.5, 0.7, 0.8)
          } else {
            color = new THREE.Color().setHSL(0.9, 0.7, 0.7)
          }
        }

        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        sizes[i] = Math.random() * 4 + 0.5
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute("customColor", new THREE.BufferAttribute(colors, 3))
      geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))

      // Enhanced shader with cursor interaction
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          mouse: { value: new THREE.Vector2() },
          pixelRatio: { value: renderer.getPixelRatio() },
        },
        vertexShader: `
          attribute float size;
          attribute vec3 customColor;
          varying vec3 vColor;
          varying float vAlpha;
          varying float vGlow;
          uniform float time;
          uniform vec2 mouse;
          
          void main() {
            vColor = customColor;
            vec3 pos = position;
            
            // Cursor attraction effect
            vec2 mouseInfluence = mouse * 50.0;
            float distanceToMouse = length(pos.xy - mouseInfluence);
            float attraction = 1.0 / (1.0 + distanceToMouse * 0.1);
            
            pos.xy += normalize(mouseInfluence - pos.xy) * attraction * 5.0;
            
            // Enhanced floating animation
            pos.y += sin(pos.x * 0.008 + time * 0.6) * 4.0;
            pos.x += cos(pos.z * 0.01 + time * 0.4) * 3.0;
            pos.z += sin(pos.y * 0.006 + time * 0.5) * 3.5;
            
            // Dynamic pulsing
            float pulse = sin(time * 2.0 + length(pos) * 0.008) * 0.5 + 0.5;
            vAlpha = 0.3 + pulse * 0.7 + attraction * 0.3;
            vGlow = pulse + attraction;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            float distance = length(mvPosition.xyz);
            gl_PointSize = size * (400.0 / distance) * (0.7 + pulse * 0.6 + attraction * 0.5);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          varying float vGlow;
          
          void main() {
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            
            float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
            float glow = 1.0 - smoothstep(0.0, 0.9, dist);
            vec3 glowColor = vColor + vec3(0.4, 0.4, 0.6) * vGlow;
            
            float core = 1.0 - smoothstep(0.0, 0.2, dist);
            vec3 coreColor = vec3(1.0, 1.0, 1.0) * core * 0.8;
            
            vec3 finalColor = mix(vColor, glowColor + coreColor, vGlow * 0.8);
            
            gl_FragColor = vec4(finalColor, alpha * vAlpha * 0.95);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
      })

      const particles = new THREE.Points(geometry, material)
      scene.add(particles)

      // Cursor-following particles
      const cursorParticleCount = isMobile ? 5 : 10
      const cursorParticles = []

      for (let i = 0; i < cursorParticleCount; i++) {
        const cursorGeometry = new THREE.SphereGeometry(0.2, 8, 8)
        const cursorMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(0.6 + i * 0.1, 0.8, 0.6),
          transparent: true,
          opacity: 0.6,
        })

        const cursorParticle = new THREE.Mesh(cursorGeometry, cursorMaterial)
        cursorParticle.userData = {
          targetX: 0,
          targetY: 0,
          delay: i * 0.1,
        }

        scene.add(cursorParticle)
        cursorParticles.push(cursorParticle)
      }

      cursorParticlesRef.current = cursorParticles

      // Rest of the existing scene setup (lights, shapes, etc.)
      const ambientLight = new THREE.AmbientLight(0x404080, 0.6)
      scene.add(ambientLight)

      const directionalLight1 = new THREE.DirectionalLight(0x4a90e2, 0.8)
      directionalLight1.position.set(15, 15, 10)
      scene.add(directionalLight1)

      camera.position.z = 60

      console.log("Enhanced Three.js scene initialized successfully")
      return { scene, camera, renderer, particles, material, cursorParticles }
    } catch (error) {
      console.error("Error initializing Three.js scene:", error)
      return null
    }
  }, [THREE, isClient, theme])

  // Rest of the existing useEffect code with enhanced animation loop
  useEffect(() => {
    if (!THREE || !isClient) return

    const sceneData = initializeScene()
    if (!sceneData || !mountRef.current) return

    const { scene, camera, renderer, particles, material, cursorParticles } = sceneData

    sceneRef.current = scene
    rendererRef.current = renderer

    try {
      mountRef.current.appendChild(renderer.domElement)
    } catch (error) {
      console.error("Error adding renderer to DOM:", error)
      return
    }

    let lastTime = 0
    const targetFPS = window.innerWidth < 768 ? 30 : 60
    const frameInterval = 1000 / targetFPS

    const animate = (currentTime) => {
      animationRef.current = requestAnimationFrame(animate)

      if (currentTime - lastTime < frameInterval) return
      lastTime = currentTime

      const time = currentTime * 0.001

      // Update main particles
      if (material.uniforms) {
        material.uniforms.time.value = time
        material.uniforms.mouse.value.set(mouseRef.current.x, mouseRef.current.y)
      }

      // Update cursor-following particles
      cursorParticles.forEach((particle, index) => {
        const targetX = mouseRef.current.x * 30
        const targetY = mouseRef.current.y * 30

        particle.position.x += (targetX - particle.position.x) * 0.1
        particle.position.y += (targetY - particle.position.y) * 0.1
        particle.position.z = Math.sin(time + index) * 5

        // Gentle rotation
        particle.rotation.x += 0.01
        particle.rotation.y += 0.02
      })

      particles.rotation.y = time * 0.15
      particles.rotation.x = Math.sin(time * 0.5) * 0.2

      camera.position.x = Math.sin(time * 0.2) * 3
      camera.position.y = Math.cos(time * 0.25) * 2.5
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }

    const handleResize = () => {
      if (!camera || !renderer) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize, { passive: true })
    animate(0)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement)
      }

      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose()
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      })

      particles.geometry.dispose()
      if (particles.material) {
        particles.material.dispose()
      }

      renderer.dispose()
    }
  }, [initializeScene, THREE, isClient])

  // Update theme
  useEffect(() => {
    if (!sceneRef.current || !THREE) return

    const isDark = theme === "dark"
    sceneRef.current.traverse((object) => {
      if (object.material && object.material.opacity !== undefined) {
        object.material.opacity = isDark ? 0.15 : 0.12
      }
    })
  }, [theme, THREE])

  // Rest of the existing component code...
  const backgroundGradient = getThemeGradient(theme)

  if (!isClient) {
    return (
      <div
        className="fixed inset-0 -z-10 transition-all duration-1000"
        style={{
          backgroundImage: backgroundGradient,
          backgroundSize: "400% 400%",
          animation: "gradientShift 20s ease infinite",
        }}
      />
    )
  }

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 -z-10 transition-all duration-1000 cursor-none"
      style={{
        backgroundImage: backgroundGradient,
        backgroundSize: "400% 400%",
        animation: "gradientShift 20s ease infinite",
      }}
    />
  )
}

// Helper function for theme-based gradients
function getThemeGradient(theme: string) {
  switch (theme) {
    case "hacker":
      return "radial-gradient(ellipse at center, #001100 0%, #003300 25%, #004400 50%, #002200 75%, #000000 100%)"
    case "retro":
      return "radial-gradient(ellipse at center, #ff006e 0%, #8338ec 25%, #3a86ff 50%, #06ffa5 75%, #000000 100%)"
    case "minimal":
      return "radial-gradient(ellipse at center, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 75%, #475569 100%)"
    case "sunset":
      return "radial-gradient(ellipse at center, #ff7b7b 0%, #ff9500 25%, #ffdd59 50%, #ff6b6b 75%, #000000 100%)"
    case "ocean":
      return "radial-gradient(ellipse at center, #0077be 0%, #00a8cc 25%, #40e0d0 50%, #1e40af 75%, #000000 100%)"
    default: // cosmic
      return "radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #1a1a2e 75%, #000000 100%)"
  }
}

export function ThreeBackground() {
  return <ThreeBackgroundClient />
}
