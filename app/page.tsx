"use client"

import { useState, useEffect } from "react"
import { BootLoader } from "@/components/boot-loader"
import { MenuBar } from "@/components/menu-bar"
import { Dock } from "@/components/dock"
import { Window } from "@/components/window"
import { ProjectsContent } from "@/components/projects-content"
import { AboutContent } from "@/components/about-content"
import { ResumeContent } from "@/components/resume-content"
import { ContactContent } from "@/components/contact-content"
import { ThreeBackground } from "@/components/three-background"
import { WelcomeWidget } from "@/components/welcome-widget"
import { TerminalContent } from "@/components/terminal-content"

interface WindowState {
  id: string
  title: string
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
}

export default function Portfolio() {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [windows, setWindows] = useState<WindowState[]>([
    {
      id: "projects",
      title: "Projects",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: { x: 100, y: 100 },
      size: { width: 800, height: 600 },
      zIndex: 1,
    },
    {
      id: "about",
      title: "About Me",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: { x: 150, y: 150 },
      size: { width: 700, height: 500 },
      zIndex: 1,
    },
    {
      id: "resume",
      title: "Resume",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: { x: 200, y: 200 },
      size: { width: 600, height: 700 },
      zIndex: 1,
    },
    {
      id: "contact",
      title: "Contact",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: { x: 250, y: 250 },
      size: { width: 500, height: 400 },
      zIndex: 1,
    },
    {
      id: "terminal",
      title: "Terminal",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: { x: 300, y: 100 },
      size: { width: 700, height: 500 },
      zIndex: 1,
    },
  ])

  const [highestZIndex, setHighestZIndex] = useState(1)

  // Boot loading simulation
  useEffect(() => {
    const loadingSteps = [
      { progress: 20, delay: 500 },
      { progress: 40, delay: 800 },
      { progress: 60, delay: 1000 },
      { progress: 80, delay: 1200 },
      { progress: 100, delay: 1500 },
    ]

    let timeoutId: NodeJS.Timeout

    const runLoadingSequence = async () => {
      for (const step of loadingSteps) {
        await new Promise((resolve) => {
          timeoutId = setTimeout(() => {
            setLoadingProgress(step.progress)
            resolve(void 0)
          }, step.delay)
        })
      }

      // Final delay before showing desktop
      timeoutId = setTimeout(() => {
        setIsLoading(false)
      }, 800)
    }

    runLoadingSequence()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  const openWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id ? { ...window, isOpen: true, isMinimized: false, zIndex: highestZIndex + 1 } : window,
      ),
    )
    setHighestZIndex((prev) => prev + 1)
  }

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.map((window) => (window.id === id ? { ...window, isOpen: false } : window)))
  }

  const minimizeWindow = (id: string) => {
    setWindows((prev) => prev.map((window) => (window.id === id ? { ...window, isMinimized: true } : window)))
  }

  const maximizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id
          ? {
              ...window,
              isMaximized: !window.isMaximized,
              position: window.isMaximized ? window.position : { x: 0, y: 40 },
              size: window.isMaximized
                ? window.size
                : {
                    width: typeof window !== "undefined" ? window.innerWidth || 1200 : 1200,
                    height: typeof window !== "undefined" ? (window.innerHeight || 800) - 140 : 660,
                  },
            }
          : window,
      ),
    )
  }

  const focusWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((window) => (window.id === id ? { ...window, zIndex: highestZIndex + 1, isMinimized: false } : window)),
    )
    setHighestZIndex((prev) => prev + 1)
  }

  const updateWindowPosition = (id: string, position: { x: number; y: number }) => {
    setWindows((prev) => prev.map((window) => (window.id === id ? { ...window, position } : window)))
  }

  const updateWindowSize = (id: string, size: { width: number; height: number }) => {
    setWindows((prev) => prev.map((window) => (window.id === id ? { ...window, size } : window)))
  }

  const renderWindowContent = (id: string) => {
    switch (id) {
      case "projects":
        return <ProjectsContent />
      case "about":
        return <AboutContent />
      case "resume":
        return <ResumeContent />
      case "contact":
        return <ContactContent />
      case "terminal":
        return <TerminalContent />
      default:
        return null
    }
  }

  if (isLoading) {
    return <BootLoader progress={loadingProgress} />
  }

  return (
    <div className="h-screen w-full overflow-hidden relative">
      {/* Three.js Background */}
      <ThreeBackground />

      {/* Menu Bar */}
      <MenuBar />

      {/* Desktop Area */}
      <div className="absolute inset-0 top-8 bottom-20">
        {/* Welcome Widget */}
        <WelcomeWidget />

        {/* Windows */}
        {windows.map(
          (window) =>
            window.isOpen &&
            !window.isMinimized && (
              <Window
                key={window.id}
                id={window.id}
                title={window.title}
                position={window.position}
                size={window.size}
                zIndex={window.zIndex}
                isMaximized={window.isMaximized}
                onClose={() => closeWindow(window.id)}
                onMinimize={() => minimizeWindow(window.id)}
                onMaximize={() => maximizeWindow(window.id)}
                onFocus={() => focusWindow(window.id)}
                onPositionChange={(position) => updateWindowPosition(window.id, position)}
                onSizeChange={(size) => updateWindowSize(window.id, size)}
              >
                {renderWindowContent(window.id)}
              </Window>
            ),
        )}
      </div>

      {/* Dock */}
      <Dock onOpenWindow={openWindow} windows={windows} />
    </div>
  )
}
