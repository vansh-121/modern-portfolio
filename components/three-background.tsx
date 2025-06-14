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

    // Enhanced particle system with coding-themed elements
    const particleCount = isLowEnd ? 300 : isMobile ? 500 : 1000
    const geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const velocities = new Float32Array(particleCount * 3)

    const spread = isMobile ? 60 : 100

    for (let i = 0; i < particleCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * spread
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread

      // Velocities for floating effect
      velocities[i * 3] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02

      // Tech-inspired color palette
      const colorChoice = Math.random()
      let color
      if (colorChoice < 0.3) {
        // Blue tech colors
        color = new THREE.Color().setHSL(0.6, 0.8, 0.7)
      } else if (colorChoice < 0.6) {
        // Purple/violet
        color = new THREE.Color().setHSL(0.75, 0.8, 0.6)
      } else {
        // Cyan/teal
        color = new THREE.Color().setHSL(0.5, 0.8, 0.6)
      }
      
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      // Varied sizes
      sizes[i] = Math.random() * 3 + 1
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("customColor", new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3))

    // Enhanced shader material with pulsing effect
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
          
          // Floating animation with individual velocities
          pos += velocity * time * 10.0;
          
          // Wave motion
          pos.y += sin(pos.x * 0.01 + time * 0.8) * 3.0;
          pos.x += cos(pos.z * 0.01 + time * 0.6) * 2.0;
          pos.z += sin(pos.y * 0.01 + time * 0.7) * 2.5;
          
          // Pulsing effect
          float pulse = sin(time * 2.0 + length(pos) * 0.01) * 0.5 + 0.5;
          vAlpha = 0.6 + pulse * 0.4;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z) * (0.8 + pulse * 0.4);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          
          // Add glow effect
          float glow = 1.0 - smoothstep(0.0, 0.7, distanceToCenter);
          vec3 finalColor = vColor + glow * 0.3;
          
          gl_FragColor = vec4(finalColor, alpha * vAlpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // Add floating geometric shapes representing tech skills
    const shapes: THREE.Mesh[] = []
    const shapeCount = isLowEnd ? 5 : isMobile ? 8 : 12

    for (let i = 0; i < shapeCount; i++) {
      let shapeGeometry
      const shapeType = Math.random()
      
      if (shapeType < 0.3) {
        // Cubes for structured thinking
        shapeGeometry = new THREE.BoxGeometry(2, 2, 2)
      } else if (shapeType < 0.6) {
        // Octahedrons for creativity
        shapeGeometry = new THREE.OctahedronGeometry(1.5)
      } else {
        // Torus for continuous learning
        shapeGeometry = new THREE.TorusGeometry(1.2, 0.4, 8, 16)
      }

      const shapeMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.8, 0.6),
        transparent: true,
        opacity: 0.15,
        wireframe: Math.random() > 0.5,
        shininess: 100,
      })

      const mesh = new THREE.Mesh(shapeGeometry, shapeMaterial)
      mesh.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50
      )
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )

      mesh.castShadow = true
      mesh.receiveShadow = true

      scene.add(mesh)
      shapes.push(mesh)
    }

    // Add ambient and directional lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    scene.add(directionalLight)

    // Add point lights for dynamic lighting
    const pointLight1 = new THREE.PointLight(0x00ffff, 0.5, 50)
    pointLight1.position.set(20, 20, 20)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xff00ff, 0.5, 50)
    pointLight2.position.set(-20, -20, 20)
    scene.add(pointLight2)

    camera.position.z = 35

    return { scene, camera, renderer, particles, shapes, material, pointLight1, pointLight2 }
  }, [])

  useEffect(() => {
    const sceneData = initializeScene()
    if (!sceneData || !mountRef.current) return

    const { scene, camera, renderer, particles, shapes, material, pointLight1, pointLight2 } = sceneData

    sceneRef.current = scene
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Animation variables
    let lastTime = 0
    const targetFPS = window.innerWidth < 768 ? 30 : 60
    const frameInterval = 1000 / targetFPS

    // Enhanced animation loop
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
      particles.rotation.y = time * 0.05
      particles.rotation.x = time * 0.02

      // Animate shapes with more dynamic movement
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.005 + index * 0.001
        shape.rotation.y += 0.008 + index * 0.001
        shape.rotation.z += 0.003 + index * 0.0005
        
        // Floating motion
        shape.position.y += Math.sin(time * 0.5 + index) * 0.01
        shape.position.x += Math.cos(time * 0.3 + index) * 0.008
      })

      // Animate point lights
      pointLight1.position.x = Math.sin(time * 0.5) * 30
      pointLight1.position.y = Math.cos(time * 0.3) * 20
      
      pointLight2.position.x = Math.cos(time * 0.4) * 25
      pointLight2.position.z = Math.sin(time * 0.6) * 30

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
        object.material.opacity = isDark ? 0.2 : 0.1
      }
    })
  }, [theme])

  const backgroundGradient =
    theme === "dark"
      ? "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)"
      : "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)"

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 -z-10 transition-colors duration-1000"
      style={{ background: backgroundGradient }}
    />
  )
}