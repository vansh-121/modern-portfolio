"use client"

import { useState, useEffect } from "react"
import { BootLoader } from "@/components/boot-loader"
import { MenuBar } from "@/components/menu-bar"
import { Dock } from "@/components/dock"
import { Window } from "@/components/window"
import { ProjectsContent } from "@/components/projects-content"
import { AboutContent } from "@/components/about-content"
import { ResumeContent } from "@/components/resume-content"
import { ServicesContent } from "@/components/services-content"
import { ContactContent } from "@/components/contact-content"
import { ThreeBackground } from "@/components/three-background"
import { WelcomeWidget } from "@/components/welcome-widget"
import { TerminalContent } from "@/components/terminal-content"
import { GreetingWidget } from "@/components/greeting-widget"
import { MusicWidget } from "@/components/music-widget"
import { VoiceNotification } from "@/components/voice-notification"
import { useVoiceControl } from "@/hooks/use-voice-control"
import { createVoiceCommands } from "@/lib/voice-commands"
import { useTheme } from "next-themes"

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

interface Notification {
  id: string
  message: string
  type: "success" | "error" | "info"
}

export default function Portfolio() {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [windows, setWindows] = useState<WindowState[]>([])
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { setTheme } = useTheme()

  const [highestZIndex, setHighestZIndex] = useState(100)

  // Notification system
  const showNotification = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now().toString()
    setNotifications((prev) => [...prev, { id, message, type }])
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  // Window management functions
  function openWindow(id: string) {
    console.log("🪟 Opening window:", id)
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id ? { ...window, isOpen: true, isMinimized: false, zIndex: highestZIndex + 1 } : window,
      ),
    )
    setHighestZIndex((prev) => prev + 1)
  }

  // Voice control setup
  const voiceCommands = createVoiceCommands(openWindow, setTheme, showNotification)

  const voiceControl = useVoiceControl({
    commands: voiceCommands,
    onCommandRecognized: (command) => {
      console.log("🎤 Voice command recognized:", command)
      showNotification(`✅ Command "${command}" executed successfully!`, "success")
    },
    onError: (error) => {
      console.error("🚨 Voice control error:", error)
      showNotification(error, "error")
    },
  })

  // Enhanced device detection and responsive handling
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const mobile = width < 768
      const tablet = width >= 768 && width < 1024
      const newOrientation = width > height ? "landscape" : "portrait"

      setIsMobile(mobile)
      setIsTablet(tablet)
      setOrientation(newOrientation)

      const getResponsiveSize = (baseWidth: number, baseHeight: number) => {
        if (mobile) {
          return {
            width: width,
            height: height - (newOrientation === "landscape" ? 64 : 88),
          }
        } else if (tablet) {
          return {
            width: Math.min(baseWidth * 0.9, width - 50),
            height: Math.min(baseHeight * 0.9, height - 100),
          }
        } else {
          return {
            width: Math.min(baseWidth, width - 100),
            height: Math.min(baseHeight, height - 140),
          }
        }
      }

      const getResponsivePosition = (baseX: number, baseY: number) => {
        if (mobile) {
          return { x: 0, y: newOrientation === "landscape" ? 32 : 32 }
        } else if (tablet) {
          return {
            x: Math.min(baseX * 0.5, width - 400),
            y: Math.max(40, Math.min(baseY * 0.5, height - 300)),
          }
        } else {
          return {
            x: Math.min(baseX, width - 400),
            y: Math.max(40, Math.min(baseY, height - 300)),
          }
        }
      }

      setWindows([
        {
          id: "projects",
          title: "Projects",
          isOpen: false,
          isMinimized: false,
          isMaximized: mobile,
          position: getResponsivePosition(100, 100),
          size: getResponsiveSize(800, 600),
          zIndex: 100,
        },
        {
          id: "about",
          title: "About Me",
          isOpen: false,
          isMinimized: false,
          isMaximized: mobile,
          position: getResponsivePosition(150, 150),
          size: getResponsiveSize(700, 500),
          zIndex: 100,
        },
        {
          id: "resume",
          title: "Resume",
          isOpen: false,
          isMinimized: false,
          isMaximized: mobile,
          position: getResponsivePosition(200, 200),
          size: getResponsiveSize(600, 700),
          zIndex: 100,
        },
        {
          id: "services",
          title: "Services",
          isOpen: false,
          isMinimized: false,
          isMaximized: mobile,
          position: getResponsivePosition(250, 150),
          size: getResponsiveSize(900, 650),
          zIndex: 100,
        },
        {
          id: "contact",
          title: "Contact",
          isOpen: false,
          isMinimized: false,
          isMaximized: mobile,
          position: getResponsivePosition(300, 250),
          size: getResponsiveSize(500, 400),
          zIndex: 100,
        },
        {
          id: "terminal",
          title: "Terminal",
          isOpen: false,
          isMinimized: false,
          isMaximized: mobile,
          position: getResponsivePosition(350, 100),
          size: getResponsiveSize(700, 500),
          zIndex: 100,
        },
      ])
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)
    window.addEventListener("orientationchange", () => {
      setTimeout(checkDevice, 100)
    })

    return () => {
      window.removeEventListener("resize", checkDevice)
      window.removeEventListener("orientationchange", checkDevice)
    }
  }, [])

  // Boot sequence
  useEffect(() => {
    setIsLoading(true)
    setLoadingProgress(0)

    const isMobileDevice = window.innerWidth < 768
    const isTabletDevice = window.innerWidth >= 768 && window.innerWidth < 1024
    const minLoadingTime = isMobileDevice ? 6000 : isTabletDevice ? 5000 : 4500
    const startTime = Date.now()

    document.body.style.overflow = "hidden"
    document.body.style.pointerEvents = "none"
    document.body.style.userSelect = "none"

    const loadingSteps = [
      { progress: 0, delay: 800 },
      { progress: 5, delay: 500 },
      { progress: 15, delay: 700 },
      { progress: 30, delay: 600 },
      { progress: 50, delay: 500 },
      { progress: 70, delay: 400 },
      { progress: 85, delay: 300 },
      { progress: 95, delay: 1200 },
      { progress: 100, delay: 500 },
    ]

    let timeoutId: NodeJS.Timeout
    let stepIndex = 0

    const runLoadingSequence = () => {
      if (stepIndex < loadingSteps.length) {
        const step = loadingSteps[stepIndex]
        timeoutId = setTimeout(() => {
          setLoadingProgress(step.progress)
          stepIndex++
          runLoadingSequence()
        }, step.delay)
      } else {
        const elapsedTime = Date.now() - startTime
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime)

        timeoutId = setTimeout(() => {
          setLoadingProgress(100)
          setTimeout(() => {
            setIsLoading(false)
            document.body.style.overflow = "auto"
            document.body.style.pointerEvents = "auto"
            document.body.style.userSelect = "auto"

            // Show voice control welcome message
            if (voiceControl.isSupported) {
              setTimeout(() => {
                showNotification("🎤 Voice control ready! Click the microphone and say 'Hello' to test", "info")
              }, 2000)
            }
          }, 800)
        }, remainingTime)
      }
    }

    const initTimer = setTimeout(() => {
      runLoadingSequence()
    }, 200)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (initTimer) clearTimeout(initTimer)
      document.body.style.overflow = "auto"
      document.body.style.pointerEvents = "auto"
      document.body.style.userSelect = "auto"
    }
  }, [voiceControl.isSupported])

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
              position: window.isMaximized
                ? window.position
                : { x: 0, y: isMobile ? (orientation === "landscape" ? 32 : 32) : 40 },
              size: window.isMaximized
                ? window.size
                : {
                    width: window.innerWidth || (isMobile ? window.innerWidth : 1200),
                    height: (window.innerHeight || 800) - (isMobile ? (orientation === "landscape" ? 64 : 88) : 140),
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
    if (isMobile) return
    setWindows((prev) => prev.map((window) => (window.id === id ? { ...window, position } : window)))
  }

  const updateWindowSize = (id: string, size: { width: number; height: number }) => {
    if (isMobile) return
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
      case "services":
        return <ServicesContent />
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
      <ThreeBackground />

      {/* Voice Notifications */}
      {notifications.map((notification) => (
        <VoiceNotification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}

      <GreetingWidget />

      <div className="absolute bottom-20 md:bottom-24 right-4 md:right-8 w-72 md:w-80 max-w-xs z-10">
        <MusicWidget />
      </div>

      <MenuBar voiceControl={voiceControl} />

      <div
        className={`absolute inset-0 ${orientation === "landscape" && isMobile ? "top-8 bottom-12" : "top-8 bottom-14 md:bottom-20"}`}
      >
        {!(isMobile && orientation === "landscape") && <WelcomeWidget />}

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

      <Dock onOpenWindow={openWindow} windows={windows} />
    </div>
  )
}
