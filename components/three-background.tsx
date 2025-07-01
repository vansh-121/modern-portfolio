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
    renderer.shadowMap.enabled = false

    // Enhanced floating particles system with space-like movement
    const particleCount = isLowEnd ? 200 : isMobile ? 350 : 500
    const geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const velocities = new Float32Array(particleCount * 3)
    const phases = new Float32Array(particleCount)
    const orbitalRadius = new Float32Array(particleCount)
    const orbitalSpeed = new Float32Array(particleCount)

    const spread = isMobile ? 120 : 180

    for (let i = 0; i < particleCount; i++) {
      // Position in 3D space
      positions[i * 3] = (Math.random() - 0.5) * spread
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread

      // Space-like velocities with orbital motion
      velocities[i * 3] = (Math.random() - 0.5) * 0.03
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.025

      // Orbital parameters for space-like rotation
      orbitalRadius[i] = Math.random() * 30 + 10
      orbitalSpeed[i] = (Math.random() - 0.5) * 0.02

      // Random phase for wave motion
      phases[i] = Math.random() * Math.PI * 2

      // Enhanced cosmic color palette
      const colorChoice = Math.random()
      let color
      if (colorChoice < 0.25) {
        // Deep space blue
        color = new THREE.Color().setHSL(0.6, 0.9, 0.7)
      } else if (colorChoice < 0.5) {
        // Nebula purple
        color = new THREE.Color().setHSL(0.75, 0.8, 0.6)
      } else if (colorChoice < 0.75) {
        // Cosmic cyan
        color = new THREE.Color().setHSL(0.5, 0.7, 0.8)
      } else {
        // Stellar pink
        color = new THREE.Color().setHSL(0.9, 0.7, 0.7)
      }

      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      // Varied sizes for depth and star-like appearance
      sizes[i] = Math.random() * 4 + 0.5
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("customColor", new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3))
    geometry.setAttribute("phase", new THREE.BufferAttribute(phases, 1))
    geometry.setAttribute("orbitalRadius", new THREE.BufferAttribute(orbitalRadius, 1))
    geometry.setAttribute("orbitalSpeed", new THREE.BufferAttribute(orbitalSpeed, 1))

    // Enhanced shader material with cosmic effects
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
        attribute float orbitalRadius;
        attribute float orbitalSpeed;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vGlow;
        uniform float time;
        
        void main() {
          vColor = customColor;
          vec3 pos = position;
          
          // Faster space-like orbital motion
          float orbitalAngle = time * orbitalSpeed * 2.0 + phase;  // Added * 2.0
          pos.x += cos(orbitalAngle) * orbitalRadius * 0.3;
          pos.z += sin(orbitalAngle) * orbitalRadius * 0.3;
          
          // Floating animation with complex wave motion
          pos += velocity * time * 12.0;
          pos.y += sin(pos.x * 0.008 + time * 0.6 + phase) * 4.0;
          pos.x += cos(pos.z * 0.01 + time * 0.4 + phase) * 3.0;
          pos.z += sin(pos.y * 0.006 + time * 0.5 + phase) * 3.5;
          
          // Faster galactic rotation effect
          float galaxyRotation = time * 0.25;  // Increased from 0.1
          float cosRot = cos(galaxyRotation);
          float sinRot = sin(galaxyRotation);
          float newX = pos.x * cosRot - pos.z * sinRot;
          float newZ = pos.x * sinRot + pos.z * cosRot;
          pos.x = newX;
          pos.z = newZ;
          
          // Dynamic pulsing like distant stars
          float pulse = sin(time * 2.0 + phase + length(pos) * 0.008) * 0.5 + 0.5;
          float twinkle = sin(time * 3.0 + phase * 2.0) * 0.3 + 0.7;
          vAlpha = 0.3 + pulse * 0.7;
          vGlow = pulse * twinkle;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          float distance = length(mvPosition.xyz);
          gl_PointSize = size * (400.0 / distance) * (0.7 + pulse * 0.6);
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
          
          // Star-like appearance
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          
          // Enhanced cosmic glow
          float glow = 1.0 - smoothstep(0.0, 0.9, dist);
          vec3 glowColor = vColor + vec3(0.4, 0.4, 0.6) * vGlow;
          
          // Stellar core effect
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

    // Enhanced floating geometric shapes with space-like rotation
    const shapes: THREE.Mesh[] = []
    const shapeCount = isLowEnd ? 6 : isMobile ? 8 : 12
    const shapeData: Array<{
      mesh: THREE.Mesh
      rotationSpeed: THREE.Vector3
      orbitalSpeed: number
      orbitalRadius: number
      initialPosition: THREE.Vector3
    }> = []

    for (let i = 0; i < shapeCount; i++) {
      let shapeGeometry
      const shapeType = Math.random()

      if (shapeType < 0.3) {
        shapeGeometry = new THREE.BoxGeometry(2.5, 2.5, 2.5)
      } else if (shapeType < 0.6) {
        shapeGeometry = new THREE.OctahedronGeometry(2)
      } else if (shapeType < 0.8) {
        shapeGeometry = new THREE.TetrahedronGeometry(2.2)
      } else {
        shapeGeometry = new THREE.IcosahedronGeometry(1.8)
      }

      // Cosmic gradient colors
      const hue = (i / shapeCount) * 0.4 + 0.5 // Blue to purple to pink range
      const shapeMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(hue, 0.8, 0.6),
        transparent: true,
        opacity: 0.12,
        wireframe: true,
        shininess: 150,
      })

      const mesh = new THREE.Mesh(shapeGeometry, shapeMaterial)
      const initialPos = new THREE.Vector3(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
      )

      mesh.position.copy(initialPos)
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)

      scene.add(mesh)
      shapes.push(mesh)

      // Store shape data for complex animations
      shapeData.push({
        mesh,
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.06, // Increased from 0.02
          (Math.random() - 0.5) * 0.08, // Increased from 0.025
          (Math.random() - 0.5) * 0.06, // Increased from 0.02
        ),
        orbitalSpeed: (Math.random() - 0.5) * 0.03, // Increased from 0.01
        orbitalRadius: Math.random() * 20 + 15,
        initialPosition: initialPos.clone(),
      })
    }

    // Enhanced cosmic lighting
    const ambientLight = new THREE.AmbientLight(0x404080, 0.6)
    scene.add(ambientLight)

    const directionalLight1 = new THREE.DirectionalLight(0x4a90e2, 0.8)
    directionalLight1.position.set(15, 15, 10)
    scene.add(directionalLight1)

    const directionalLight2 = new THREE.DirectionalLight(0x9b59b6, 0.6)
    directionalLight2.position.set(-15, -10, -15)
    scene.add(directionalLight2)

    const directionalLight3 = new THREE.DirectionalLight(0x50c8e8, 0.4)
    directionalLight3.position.set(0, 20, -10)
    scene.add(directionalLight3)

    camera.position.z = 60

    return { scene, camera, renderer, particles, shapes, material, shapeData }
  }, [])

  useEffect(() => {
    const sceneData = initializeScene()
    if (!sceneData || !mountRef.current) return

    const { scene, camera, renderer, particles, shapes, material, shapeData } = sceneData

    sceneRef.current = scene
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Animation variables
    let lastTime = 0
    const targetFPS = window.innerWidth < 768 ? 30 : 60
    const frameInterval = 1000 / targetFPS

    // Enhanced space-like animation loop
    const animate = (currentTime: number) => {
      animationRef.current = requestAnimationFrame(animate)

      if (currentTime - lastTime < frameInterval) return
      lastTime = currentTime

      const time = currentTime * 0.001

      // Update particles with space-like motion
      if (material.uniforms) {
        material.uniforms.time.value = time
      }

      // Faster galactic rotation of particle system
      particles.rotation.y = time * 0.15 // Increased from 0.05
      particles.rotation.x = Math.sin(time * 0.5) * 0.2 // Increased oscillation
      particles.rotation.z = Math.cos(time * 0.4) * 0.12 // Increased rotation

      // Complex shape animations with orbital motion
      shapeData.forEach((data, index) => {
        const { mesh, rotationSpeed, orbitalSpeed, orbitalRadius, initialPosition } = data

        // Individual rotation
        mesh.rotation.x += rotationSpeed.x
        mesh.rotation.y += rotationSpeed.y
        mesh.rotation.z += rotationSpeed.z

        // Orbital motion around initial position
        const orbitalAngle = time * orbitalSpeed + index
        mesh.position.x = initialPosition.x + Math.cos(orbitalAngle) * orbitalRadius * 0.3
        mesh.position.y = initialPosition.y + Math.sin(time * 0.4 + index) * 8
        mesh.position.z = initialPosition.z + Math.sin(orbitalAngle) * orbitalRadius * 0.3

        // Gentle floating motion
        mesh.position.y += Math.sin(time * 0.6 + index * 0.5) * 0.02
        mesh.position.x += Math.cos(time * 0.4 + index * 0.3) * 0.015
      })

      // Enhanced camera movement for more immersion
      camera.position.x = Math.sin(time * 0.2) * 3 // Increased from 0.1 and 2
      camera.position.y = Math.cos(time * 0.25) * 2.5 // Increased from 0.15 and 1.5
      camera.lookAt(0, 0, 0)

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
        object.material.opacity = isDark ? 0.15 : 0.12
      }
    })
  }, [theme])

  // Enhanced cosmic gradient backgrounds
  const backgroundGradient =
    theme === "dark"
      ? "radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #1a1a2e 75%, #000000 100%)"
      : "radial-gradient(ellipse at top left, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%), linear-gradient(135deg, #a8edea 0%, #fed6e3 25%, #d299c2 50%, #fef9d7 75%, #667eea 100%)"

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 -z-10 transition-all duration-1000"
      style={{
        backgroundImage: backgroundGradient,
        backgroundSize: "400% 400%, 200% 200%",
        animation: "gradientShift 20s ease infinite",
      }}
    />
  )
}
