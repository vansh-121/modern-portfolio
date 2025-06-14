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
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // Enhanced particle system with subtle colors
    const particleCount = isLowEnd ? 200 : isMobile ? 350 : 600
    const geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const velocities = new Float32Array(particleCount * 3)

    const spread = isMobile ? 80 : 120

    for (let i = 0; i < particleCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * spread
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread

      // Velocities for floating effect
      velocities[i * 3] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01

      // Subtle color palette that works with both themes
      const colorChoice = Math.random()
      let color
      if (colorChoice < 0.4) {
        // Soft blue
        color = new THREE.Color().setHSL(0.6, 0.3, 0.7)
      } else if (colorChoice < 0.7) {
        // Soft purple
        color = new THREE.Color().setHSL(0.75, 0.3, 0.6)
      } else {
        // Soft white/gray
        color = new THREE.Color().setHSL(0, 0, 0.8)
      }
      
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      // Smaller, more subtle sizes
      sizes[i] = Math.random() * 2 + 0.5
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("customColor", new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3))

    // Subtle shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 customColor;
        attribute vec3 velocity;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float time;
        
        void main() {
          vColor = customColor;
          vec3 pos = position;
          
          // Gentle floating animation
          pos += velocity * time * 5.0;
          
          // Subtle wave motion
          pos.y += sin(pos.x * 0.005 + time * 0.3) * 1.5;
          pos.x += cos(pos.z * 0.005 + time * 0.2) * 1.0;
          
          // Gentle pulsing
          float pulse = sin(time * 1.0 + length(pos) * 0.005) * 0.3 + 0.7;
          vAlpha = 0.3 + pulse * 0.2;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (200.0 / -mvPosition.z) * pulse;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          
          // Soft glow
          float glow = 1.0 - smoothstep(0.0, 0.8, distanceToCenter);
          vec3 finalColor = vColor + glow * 0.1;
          
          gl_FragColor = vec4(finalColor, alpha * vAlpha * 0.6);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // Fewer, more subtle geometric shapes
    const shapes: THREE.Mesh[] = []
    const shapeCount = isLowEnd ? 3 : isMobile ? 5 : 8

    for (let i = 0; i < shapeCount; i++) {
      let shapeGeometry
      const shapeType = Math.random()
      
      if (shapeType < 0.5) {
        shapeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)
      } else {
        shapeGeometry = new THREE.OctahedronGeometry(1)
      }

      const shapeMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.6 + Math.random() * 0.1, 0.2, 0.7),
        transparent: true,
        opacity: 0.08,
        wireframe: true,
        shininess: 30,
      })

      const mesh = new THREE.Mesh(shapeGeometry, shapeMaterial)
      mesh.position.set(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60
      )
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )

      scene.add(mesh)
      shapes.push(mesh)
    }

    // Soft ambient lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4)
    directionalLight.position.set(10, 10, 5)
    scene.add(directionalLight)

    camera.position.z = 40

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

    // Gentle animation loop
    const animate = (currentTime: number) => {
      animationRef.current = requestAnimationFrame(animate)

      if (currentTime - lastTime < frameInterval) return
      lastTime = currentTime

      const time = currentTime * 0.001

      // Update particles
      if (material.uniforms) {
        material.uniforms.time.value = time
      }

      // Slow rotation
      particles.rotation.y = time * 0.02
      particles.rotation.x = time * 0.01

      // Gentle shape animation
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.002
        shape.rotation.y += 0.003
        shape.position.y += Math.sin(time * 0.3 + index) * 0.005
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
        object.material.opacity = isDark ? 0.12 : 0.06
      }
    })
  }, [theme])

  // Much more subtle and elegant background gradients
  const backgroundGradient =
    theme === "dark"
      ? "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%)"
      : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 30%, #cbd5e1 60%, #94a3b8 100%)"

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 -z-10 transition-all duration-1000"
      style={{ background: backgroundGradient }}
    />
  )
}