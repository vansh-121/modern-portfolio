import type { VoiceCommand } from "@/hooks/use-voice-control"

export function createVoiceCommands(
  openWindow: (id: string) => void,
  setTheme: (theme: string) => void,
  showNotification: (message: string, type?: "success" | "error" | "info") => void,
): VoiceCommand[] {
  return [
    // Window commands
    {
      command: "open projects",
      action: () => openWindow("projects"),
      description: "Open the projects window",
    },
    {
      command: "show projects",
      action: () => openWindow("projects"),
      description: "Show the projects window",
    },
    {
      command: "projects",
      action: () => openWindow("projects"),
      description: "Open projects",
    },
    {
      command: "open about",
      action: () => openWindow("about"),
      description: "Open the about me window",
    },
    {
      command: "about me",
      action: () => openWindow("about"),
      description: "Show about me",
    },
    {
      command: "about",
      action: () => openWindow("about"),
      description: "Open about",
    },
    {
      command: "open resume",
      action: () => openWindow("resume"),
      description: "Open the resume window",
    },
    {
      command: "show resume",
      action: () => openWindow("resume"),
      description: "Show the resume",
    },
    {
      command: "resume",
      action: () => openWindow("resume"),
      description: "Open resume",
    },
    {
      command: "open services",
      action: () => openWindow("services"),
      description: "Open the services window",
    },
    {
      command: "services",
      action: () => openWindow("services"),
      description: "Show services",
    },
    {
      command: "open contact",
      action: () => openWindow("contact"),
      description: "Open the contact window",
    },
    {
      command: "contact me",
      action: () => openWindow("contact"),
      description: "Show contact information",
    },
    {
      command: "contact",
      action: () => openWindow("contact"),
      description: "Open contact",
    },
    {
      command: "open terminal",
      action: () => openWindow("terminal"),
      description: "Open the terminal window",
    },
    {
      command: "terminal",
      action: () => openWindow("terminal"),
      description: "Open terminal",
    },

    // Theme commands
    {
      command: "dark mode",
      action: () => {
        setTheme("dark")
        showNotification("Switched to dark mode", "success")
      },
      description: "Switch to dark theme",
    },
    {
      command: "light mode",
      action: () => {
        setTheme("light")
        showNotification("Switched to light mode", "success")
      },
      description: "Switch to light theme",
    },

    // Fun commands
    {
      command: "hello",
      action: () => showNotification("Hello! Voice control is working perfectly! 👋", "success"),
      description: "Say hello",
    },
    {
      command: "hi",
      action: () => showNotification("Hi there! Try saying 'open projects' or 'dark mode'", "info"),
      description: "Greeting",
    },
    {
      command: "help",
      action: () => showNotification("Try: 'open projects', 'about me', 'dark mode', 'contact'", "info"),
      description: "Show help",
    },
    {
      command: "surprise me",
      action: () => {
        const windows = ["projects", "about", "resume", "services", "contact", "terminal"]
        const randomWindow = windows[Math.floor(Math.random() * windows.length)]
        openWindow(randomWindow)
        showNotification(`Surprise! Opening ${randomWindow}`, "success")
      },
      description: "Open a random window",
    },
  ]
}
