"use client"

import { useState, useEffect } from "react"
import { BootLoader } from "@/components/boot-loader"
import { Dock } from "@/components/dock"
import { MenuBar } from "@/components/menu-bar"
import { Window } from "@/components/window"
import { AboutContent } from "@/components/about-content"
import { ProjectsContent } from "@/components/projects-content"
import { ServicesContent } from "@/components/services-content"
import { ResumeContent } from "@/components/resume-content"
import { ContactContent } from "@/components/contact-content"
import { TerminalContent } from "@/components/terminal-content"
import { GreetingWidget } from "@/components/greeting-widget"
import { WelcomeWidget } from "@/components/welcome-widget"
import { MusicWidget } from "@/components/music-widget"
import { ThreeBackground } from "@/components/three-background"
import { CursorTrail } from "@/components/cursor-trail"
import { VoiceNotification } from "@/components/voice-notification"
import { useVoiceControl } from "@/hooks/use-voice-control"

export default function Home() {
  const [isBooted, setIsBooted] = useState(false)
  const [openWindows, setOpenWindows] = useState<string[]>([])
  const [activeWindow, setActiveWindow] = useState<string | null>(null)
  const voiceControl = useVoiceControl()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBooted(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const openWindow = (windowId: string) => {
    if (!openWindows.includes(windowId)) {
      setOpenWindows([...openWindows, windowId])
    }
    setActiveWindow(windowId)
  }

  const closeWindow = (windowId: string) => {
    setOpenWindows(openWindows.filter((id) => id !== windowId))
    if (activeWindow === windowId) {
      const remainingWindows = openWindows.filter((id) => id !== windowId)
      setActiveWindow(remainingWindows.length > 0 ? remainingWindows[remainingWindows.length - 1] : null)
    }
  }

  const handleNavigate = (section: string) => {
    openWindow(section)
  }

  const getWindowContent = (windowId: string) => {
    switch (windowId) {
      case "about":
        return <AboutContent />
      case "projects":
        return <ProjectsContent />
      case "services":
        return <ServicesContent />
      case "resume":
        return <ResumeContent />
      case "contact":
        return <ContactContent />
      case "terminal":
        return <TerminalContent />
      default:
        return <div>Content not found</div>
    }
  }

  const getWindowTitle = (windowId: string) => {
    switch (windowId) {
      case "about":
        return "About Me"
      case "projects":
        return "My Projects"
      case "services":
        return "Services"
      case "resume":
        return "Resume"
      case "contact":
        return "Contact"
      case "terminal":
        return "Terminal"
      default:
        return "Window"
    }
  }

  if (!isBooted) {
    return <BootLoader />
  }

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <ThreeBackground />
      <CursorTrail />

      <MenuBar voiceControl={voiceControl} onNavigate={handleNavigate} />

      <div className="pt-8 h-full flex flex-col">
        <div className="flex-1 relative">
          {/* Desktop Widgets */}
          <div className="absolute top-4 left-4 z-10">
            <GreetingWidget />
          </div>

          <div className="absolute top-4 right-4 z-10">
            <WelcomeWidget />
          </div>

          <div className="absolute bottom-20 right-4 z-10">
            <MusicWidget />
          </div>

          {/* Windows */}
          {openWindows.map((windowId, index) => (
            <Window
              key={windowId}
              title={getWindowTitle(windowId)}
              isActive={activeWindow === windowId}
              onClose={() => closeWindow(windowId)}
              onFocus={() => setActiveWindow(windowId)}
              initialPosition={{
                x: 100 + index * 30,
                y: 100 + index * 30,
              }}
            >
              {getWindowContent(windowId)}
            </Window>
          ))}
        </div>

        <Dock onOpenWindow={openWindow} openWindows={openWindows} />
      </div>

      <VoiceNotification voiceControl={voiceControl} />
    </div>
  )
}
