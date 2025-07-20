import type { VoiceCommand } from "@/hooks/use-voice-control"

export function createVoiceCommands(
  openWindow: (id: string) => void,
  setTheme: (theme: string) => void,
  showNotification: (message: string, type?: "success" | "error" | "info") => void,
): VoiceCommand[] {
  return [
    // Test command
    {
      command: "hello",
      action: () => {
        console.log("Voice command executed: hello")
        showNotification("Hello! Voice control is working! 🎤", "success")
      },
      description: "Test voice recognition",
    },
    {
      command: "hi",
      action: () => {
        console.log("Voice command executed: hi")
        showNotification("Hi there! Voice control is active!", "success")
      },
      description: "Greeting command",
    },

    // Window commands - Projects
    {
      command: "open projects",
      action: () => {
        console.log("Voice command executed: open projects")
        openWindow("projects")
        showNotification("Opening projects", "success")
      },
      description: "Open projects window",
    },
    {
      command: "projects",
      action: () => {
        console.log("Voice command executed: projects")
        openWindow("projects")
        showNotification("Opening projects", "success")
      },
      description: "Open projects",
    },
    {
      command: "show projects",
      action: () => {
        console.log("Voice command executed: show projects")
        openWindow("projects")
        showNotification("Showing projects", "success")
      },
      description: "Show projects",
    },

    // Window commands - About
    {
      command: "about me",
      action: () => {
        console.log("Voice command executed: about me")
        openWindow("about")
        showNotification("Opening about section", "success")
      },
      description: "Open about section",
    },
    {
      command: "about",
      action: () => {
        console.log("Voice command executed: about")
        openWindow("about")
        showNotification("Opening about section", "success")
      },
      description: "Open about",
    },
    {
      command: "open about",
      action: () => {
        console.log("Voice command executed: open about")
        openWindow("about")
        showNotification("Opening about section", "success")
      },
      description: "Open about window",
    },

    // Window commands - Resume
    {
      command: "resume",
      action: () => {
        console.log("Voice command executed: resume")
        openWindow("resume")
        showNotification("Opening resume", "success")
      },
      description: "Open resume",
    },
    {
      command: "open resume",
      action: () => {
        console.log("Voice command executed: open resume")
        openWindow("resume")
        showNotification("Opening resume", "success")
      },
      description: "Open resume window",
    },

    // Window commands - Services
    {
      command: "services",
      action: () => {
        console.log("Voice command executed: services")
        openWindow("services")
        showNotification("Opening services", "success")
      },
      description: "Open services",
    },
    {
      command: "open services",
      action: () => {
        console.log("Voice command executed: open services")
        openWindow("services")
        showNotification("Opening services", "success")
      },
      description: "Open services window",
    },

    // Window commands - Contact
    {
      command: "contact",
      action: () => {
        console.log("Voice command executed: contact")
        openWindow("contact")
        showNotification("Opening contact", "success")
      },
      description: "Open contact",
    },
    {
      command: "contact me",
      action: () => {
        console.log("Voice command executed: contact me")
        openWindow("contact")
        showNotification("Opening contact", "success")
      },
      description: "Open contact window",
    },
    {
      command: "open contact",
      action: () => {
        console.log("Voice command executed: open contact")
        openWindow("contact")
        showNotification("Opening contact", "success")
      },
      description: "Open contact window",
    },

    // Window commands - Terminal
    {
      command: "terminal",
      action: () => {
        console.log("Voice command executed: terminal")
        openWindow("terminal")
        showNotification("Opening terminal", "success")
      },
      description: "Open terminal",
    },
    {
      command: "open terminal",
      action: () => {
        console.log("Voice command executed: open terminal")
        openWindow("terminal")
        showNotification("Opening terminal", "success")
      },
      description: "Open terminal window",
    },

    // Theme commands
    {
      command: "dark mode",
      action: () => {
        console.log("Voice command executed: dark mode")
        setTheme("dark")
        showNotification("Switched to dark mode", "success")
      },
      description: "Enable dark theme",
    },
    {
      command: "light mode",
      action: () => {
        console.log("Voice command executed: light mode")
        setTheme("light")
        showNotification("Switched to light mode", "success")
      },
      description: "Enable light theme",
    },

    // Utility commands
    {
      command: "help",
      action: () => {
        console.log("Voice command executed: help")
        showNotification("Available commands: hello, open projects, about me, dark mode, contact", "info")
      },
      description: "Show help",
    },
    {
      command: "surprise me",
      action: () => {
        console.log("Voice command executed: surprise me")
        const windows = ["projects", "about", "resume", "services", "contact", "terminal"]
        const randomWindow = windows[Math.floor(Math.random() * windows.length)]
        openWindow(randomWindow)
        showNotification(`Surprise! Opening ${randomWindow}`, "success")
      },
      description: "Open random window",
    },
  ]
}
