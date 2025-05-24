"use client"

import { useEffect, useRef, useMemo } from "react"
import { useTheme } from "next-themes"
import * as THREE from "three"

export function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const frameRef = useRef<number>()
  const { theme } = useTheme()

  const { scene, camera, renderer, particles, mousePosition } = useMemo(() => {
    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    // Mouse position for interaction
    const mousePosition = { x: 0, y: 0 }

    // Particle system
    const particleCount = 800
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
      },
      vertexShader: `
        attribute float size;
        attribute vec3 customColor;
        varying vec3 vColor;
        uniform float time;
        uniform vec2 mouse;
        
        void main() {
          vColor = customColor;
          vec3 pos = position;
          
          // Wave animation
          pos.y += sin(pos.x * 0.01 + time) * 5.0;
          pos.x += cos(pos.z * 0.01 + time) * 3.0;
          
          // Mouse interaction
          vec2 mouseInfluence = mouse * 10.0;
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

    // Floating geometric shapes
    const shapes = []
    for (let i = 0; i < 15; i++) {
      const geometryShape = Math.random() > 0.5 ? new THREE.BoxGeometry(2, 2, 2) : new THREE.OctahedronGeometry(1.5)

      const materialShape = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.6 + Math.random() * 0.3, 0.8, 0.6),
        transparent: true,
        opacity: 0.1,
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
  }, [])

  useEffect(() => {
    if (!mountRef.current) return

    // Setup renderer
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mountRef.current.appendChild(renderer.domElement)

    sceneRef.current = scene
    rendererRef.current = renderer

    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1
      mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", handleResize)

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)

      const time = Date.now() * 0.001
      const isDark = theme === "dark" ? 1 : 0

      // Update shader uniforms
      if (particles.material instanceof THREE.ShaderMaterial) {
        particles.material.uniforms.time.value = time
        particles.material.uniforms.mouse.value.set(mousePosition.x, mousePosition.y)
        particles.material.uniforms.isDark.value = isDark
      }

      // Rotate particles
      particles.rotation.y = time * 0.1
      particles.rotation.x = time * 0.05

      // Animate geometric shapes
      scene.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh && child !== particles) {
          child.rotation.x += 0.01
          child.rotation.y += 0.01
          child.position.y += Math.sin(time + index) * 0.02

          // Update opacity based on theme
          if (child.material instanceof THREE.MeshBasicMaterial) {
            child.material.opacity = theme === "dark" ? 0.15 : 0.1
          }
        }
      })

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
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
    }
  }, [scene, camera, renderer, particles, mousePosition, theme])

  const backgroundGradient =
    theme === "dark"
      ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 -z-10 transition-all duration-500"
      style={{ background: backgroundGradient }}
    />
  )
}
