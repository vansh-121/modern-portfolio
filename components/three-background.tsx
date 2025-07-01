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
      depth: true,
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowEnd ? 1.5 : 2))
    renderer.shadowMap.enabled = false // Disable shadows for better performance

    // Enhanced floating particles system
    const particleCount = isLowEnd ? 150 : isMobile ? 250 : 400
    const geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const velocities = new Float32Array(particleCount * 3)
    const phases = new Float32Array(particleCount)

    const spread = isMobile ? 100 : 150

    for (let i = 0; i < particleCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * spread
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread

      // Velocities for floating effect
      velocities[i * 3] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.015
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02

      // Random phase for wave motion
      phases[i] = Math.random() * Math.PI * 2

      // Beautiful color palette inspired by vanshsethi.in
      const colorChoice = Math.random()
      let color
      if (colorChoice < 0.3) {
        // Bright blue
        color = new THREE.Color().setHSL(0.55, 0.8, 0.7)
      } else if (colorChoice < 0.6) {
        // Purple/violet
        color = new THREE.Color().setHSL(0.75, 0.7, 0.6)
      } else if (colorChoice < 0.8) {
        // Cyan/teal
        color = new THREE.Color().setHSL(0.5, 0.6, 0.7)
      } else {
        // Pink/magenta
        color = new THREE.Color().setHSL(0.85, 0.6, 0.7)
      }

      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      // Varied sizes for depth
      sizes[i] = Math.random() * 3 + 1
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("customColor", new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3))
    geometry.setAttribute("phase", new THREE.BufferAttribute(phases, 1))

    // Enhanced shader material with glow effects
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: `
      attribute float size;
      attribute vec3 customColor;
      attribute vec3 velocity;
      attribute float phase;
      varying vec3 vColor;
      varying float vAlpha;
      varying float vGlow;
      uniform float time;
      
      void main() {
        vColor = customColor;
        vec3 pos = position;
        
        // Floating animation with wave motion
        pos += velocity * time * 8.0;
        pos.y += sin(pos.x * 0.01 + time * 0.5 + phase) * 3.0;
        pos.x += cos(pos.z * 0.01 + time * 0.3 + phase) * 2.0;
        pos.z += sin(pos.y * 0.008 + time * 0.4 + phase) * 2.5;
        
        // Dynamic pulsing with individual phases
        float pulse = sin(time * 1.5 + phase + length(pos) * 0.01) * 0.5 + 0.5;
        vAlpha = 0.4 + pulse * 0.6;
        vGlow = pulse;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        float distance = length(mvPosition.xyz);
        gl_PointSize = size * (300.0 / distance) * (0.8 + pulse * 0.4);
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
        
        // Soft circular gradient
        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
        
        // Enhanced glow effect
        float glow = 1.0 - smoothstep(0.0, 0.8, dist);
        vec3 glowColor = vColor + vec3(0.3, 0.3, 0.5) * vGlow;
        
        // Final color with enhanced brightness
        vec3 finalColor = mix(vColor, glowColor, vGlow * 0.7);
        
        gl_FragColor = vec4(finalColor, alpha * vAlpha * 0.9);
      }
    `,
      transparent: true,
      blending: THREE.AdditiveBlending,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // Floating geometric shapes with gradient colors
    const shapes: THREE.Mesh[] = []
    const shapeCount = isLowEnd ? 4 : isMobile ? 6 : 10

    for (let i = 0; i < shapeCount; i++) {
      let shapeGeometry
      const shapeType = Math.random()

      if (shapeType < 0.4) {
        shapeGeometry = new THREE.BoxGeometry(2, 2, 2)
      } else if (shapeType < 0.7) {
        shapeGeometry = new THREE.OctahedronGeometry(1.5)
      } else {
        shapeGeometry = new THREE.TetrahedronGeometry(1.8)
      }

      // Gradient material colors
      const hue = (i / shapeCount) * 0.3 + 0.5 // Blue to purple range
      const shapeMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(hue, 0.7, 0.6),
        transparent: true,
        opacity: 0.15,
        wireframe: true,
        shininess: 100,
      })

      const mesh = new THREE.Mesh(shapeGeometry, shapeMaterial)
      mesh.position.set((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80)
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)

      scene.add(mesh)
      shapes.push(mesh)
    }

    // Enhanced lighting for better depth
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8)
    scene.add(ambientLight)

    const directionalLight1 = new THREE.DirectionalLight(0x4a90e2, 0.6)
    directionalLight1.position.set(10, 10, 5)
    scene.add(directionalLight1)

    const directionalLight2 = new THREE.DirectionalLight(0x9b59b6, 0.4)
    directionalLight2.position.set(-10, -10, -5)
    scene.add(directionalLight2)

    camera.position.z = 50

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

    // Smooth animation loop
    const animate = (currentTime: number) => {
      animationRef.current = requestAnimationFrame(animate)

      if (currentTime - lastTime < frameInterval) return
      lastTime = currentTime

      const time = currentTime * 0.001

      // Update particles
      if (material.uniforms) {
        material.uniforms.time.value = time
      }

      // Gentle rotation
      particles.rotation.y = time * 0.03
      particles.rotation.x = time * 0.02

      // Smooth shape animation
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.003
        shape.rotation.y += 0.004
        shape.rotation.z += 0.002
        shape.position.y += Math.sin(time * 0.4 + index) * 0.01
        shape.position.x += Math.cos(time * 0.3 + index) * 0.008
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
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      })

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
      if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshPhongMaterial) {
        object.material.opacity = isDark ? 0.2 : 0.15
      }
    })
  }, [theme])

  // Beautiful gradient backgrounds inspired by vanshsethi.in
  const backgroundGradient =
    theme === "dark"
      ? "radial-gradient(ellipse at top left, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #1a1a2e 75%, #000000 100%), linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)"
      : "radial-gradient(ellipse at top left, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%), linear-gradient(135deg, #a8edea 0%, #fed6e3 25%, #d299c2 50%, #fef9d7 75%, #667eea 100%)"

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 -z-10 transition-all duration-1000"
      style={{
        backgroundImage: backgroundGradient,
        backgroundSize: "400% 400%, 200% 200%",
        animation: "gradientShift 15s ease infinite",
      }}
    />
  )
}
