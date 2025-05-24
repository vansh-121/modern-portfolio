"use client"

import { useState, useEffect, useCallback } from "react"
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

interface ScreenSize {
  width: number
  height: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isSmallMobile: boolean
}

export default function Portfolio() {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isSmallMobile: false,
  })
  const [windows, setWindows] = useState<WindowState[]>([])
  const [highestZIndex, setHighestZIndex] = useState(1)

  // Enhanced screen size detection
  const updateScreenSize = useCallback(() => {
    const width = window.innerWidth
    const height = window.innerHeight
    const isMobile = width < 768
    const isTablet = width >= 768 && width < 1024
    const isDesktop = width >= 1024
    const isSmallMobile = width < 640

    setScreenSize({ width, height, isMobile, isTablet, isDesktop, isSmallMobile })
  }, [])

  // Calculate open windows for collision detection
  const openWindows = windows.filter((w) => w.isOpen && !w.isMinimized)
  const hasOpenWindows = openWindows.length > 0
  const openWindowsCount = openWindows.length

  // Initialize responsive window configurations
  const initializeWindows = useCallback(() => {
    const { width, height, isMobile, isTablet, isSmallMobile } = screenSize

    if (width === 0) return

    const getResponsiveSize = (baseWidth: number, baseHeight: number) => {
      if (isMobile) {
        // Account for welcome widget positioning
        const topOffset = hasOpenWindows ? 60 : isSmallMobile ? 80 : 120
        return {
          width: width,
          height: height - topOffset - 56, // Account for menu bar, welcome widget, and dock
        }
      }

      if (isTablet) {
        return {
          width: Math.min(baseWidth, width - 40),
          height: Math.min(baseHeight, height - 120),
        }
      }

      return {
        width: Math.min(baseWidth, width - 100),
        height: Math.min(baseHeight, height - 140),
      }
    }

    const getResponsivePosition = (baseX: number, baseY: number) => {
      if (isMobile) {
        const topOffset = hasOpenWindows ? 60 : isSmallMobile ? 80 : 120
        return { x: 0, y: topOffset }
      }

      if (isTablet) {
        // Avoid welcome widget area
        const leftOffset = hasOpenWindows ? 300 : 20
        return {
          x: Math.min(baseX + leftOffset, width - 400),
          y: Math.max(60, Math.min(baseY, height - 300)),
        }
      }

      // Desktop - avoid welcome widget area
      const leftOffset = hasOpenWindows ? 350 : 0
      return {
        x: Math.min(baseX + leftOffset, width - 400),
        y: Math.max(40, Math.min(baseY, height - 300)),
      }
    }

    const newWindows: WindowState[] = [
      {
        id: "projects",
        title: "Projects",
        isOpen: false,
        isMinimized: false,
        isMaximized: isMobile,
        position: getResponsivePosition(100, 100),
        size: getResponsiveSize(800, 600),
        zIndex: 1,
      },
      {
        id: "about",
        title: "About Me",
        isOpen: false,
        isMinimized: false,
        isMaximized: isMobile,
        position: getResponsivePosition(150, 150),
        size: getResponsiveSize(700, 500),
        zIndex: 1,
      },
      {
        id: "resume",
        title: "Resume",
        isOpen: false,
        isMinimized: false,
        isMaximized: isMobile,
        position: getResponsivePosition(200, 200),
        size: getResponsiveSize(600, 700),
        zIndex: 1,
      },
      {
        id: "contact",
        title: "Contact",
        isOpen: false,
        isMinimized: false,
        isMaximized: isMobile,
        position: getResponsivePosition(250, 250),
        size: getResponsiveSize(500, 400),
        zIndex: 1,
      },
      {
        id: "terminal",
        title: "Terminal",
        isOpen: false,
        isMinimized: false,
        isMaximized: isMobile,
        position: getResponsivePosition(300, 100),
        size: getResponsiveSize(700, 500),
        zIndex: 1,
      },
    ]

    setWindows(newWindows)
  }, [screenSize, hasOpenWindows])

  useEffect(() => {
    updateScreenSize()
    window.addEventListener("resize", updateScreenSize)
    return () => window.removeEventListener("resize", updateScreenSize)
  }, [updateScreenSize])

  useEffect(() => {
    initializeWindows()
  }, [initializeWindows])

  // Optimized boot loading simulation with better performance
  useEffect(() => {
    const isMobile = window.innerWidth < 768
    const isLowEnd =
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
      (navigator.deviceMemory && navigator.deviceMemory < 4)

    // Adaptive loading steps based on device capability
    const baseSteps = [
      { progress: 15, delay: 200 },
      { progress: 35, delay: 400 },
      { progress: 55, delay: 600 },
      { progress: 75, delay: 800 },
      { progress: 90, delay: 1000 },
      { progress: 100, delay: 1200 },
    ]

    const loadingSteps = baseSteps.map((step) => ({
      progress: step.progress,
      delay: isLowEnd ? step.delay * 0.7 : isMobile ? step.delay * 0.8 : step.delay,
    }))

    let timeoutId: NodeJS.Timeout
    let currentStep = 0

    const runLoadingSequence = () => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep]
        timeoutId = setTimeout(() => {
          setLoadingProgress(step.progress)
          currentStep++
          runLoadingSequence()
        }, step.delay)
      } else {
        // Final delay before showing desktop
        timeoutId = setTimeout(
          () => {
            setIsLoading(false)
          },
          isLowEnd ? 300 : isMobile ? 400 : 500,
        )
      }
    }

    runLoadingSequence()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  const openWindow = useCallback(
    (id: string) => {
      setWindows((prev) =>
        prev.map((window) =>
          window.id === id ? { ...window, isOpen: true, isMinimized: false, zIndex: highestZIndex + 1 } : window,
        ),
      )
      setHighestZIndex((prev) => prev + 1)
    },
    [highestZIndex],
  )

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.map((window) => (window.id === id ? { ...window, isOpen: false } : window)))
  }, [])

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.map((window) => (window.id === id ? { ...window, isMinimized: true } : window)))
  }, [])

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id
          ? {
              ...window,
              isMaximized: !window.isMaximized,
            }
          : window,
      ),
    )
  }, [])

  const focusWindow = useCallback(
    (id: string) => {
      setWindows((prev) =>
        prev.map((window) =>
          window.id === id ? { ...window, zIndex: highestZIndex + 1, isMinimized: false } : window,
        ),
      )
      setHighestZIndex((prev) => prev + 1)
    },
    [highestZIndex],
  )

  const updateWindowPosition = useCallback(
    (id: string, position: { x: number; y: number }) => {
      if (screenSize.isMobile) return
      setWindows((prev) => prev.map((window) => (window.id === id ? { ...window, position } : window)))
    },
    [screenSize.isMobile],
  )

  const updateWindowSize = useCallback(
    (id: string, size: { width: number; height: number }) => {
      if (screenSize.isMobile) return
      setWindows((prev) => prev.map((window) => (window.id === id ? { ...window, size } : window)))
    },
    [screenSize.isMobile],
  )

  const renderWindowContent = useCallback((id: string) => {
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
  }, [])

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
      <div
        className="absolute inset-0 z-10"
        style={{
          top: screenSize.isMobile ? "32px" : "32px", // Account for menu bar
          bottom: screenSize.isMobile ? "56px" : "80px", // Account for dock
        }}
      >
        {/* Welcome Widget with collision detection */}
        <WelcomeWidget hasOpenWindows={hasOpenWindows} openWindowsCount={openWindowsCount} />

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
