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
      action: () => {
        console.log("Voice command: open projects")
        openWindow("projects")
      },
      description: "Open the projects window",
    },
    {
      command: "show projects",
      action: () => {
        console.log("Voice command: show projects")
        openWindow("projects")
      },
      description: "Show the projects window",
    },
    {
      command: "projects",
      action: () => {
        console.log("Voice command: projects")
        openWindow("projects")
      },
      description: "Open projects",
    },
    {
      command: "open about",
      action: () => {
        console.log("Voice command: open about")
        openWindow("about")
      },
      description: "Open the about me window",
    },
    {
      command: "about me",
      action: () => {
        console.log("Voice command: about me")
        openWindow("about")
      },
      description: "Show about me",
    },
    {
      command: "about",
      action: () => {
        console.log("Voice command: about")
        openWindow("about")
      },
      description: "Open about",
    },
    {
      command: "open resume",
      action: () => {
        console.log("Voice command: open resume")
        openWindow("resume")
      },
      description: "Open the resume window",
    },
    {
      command: "show resume",
      action: () => {
        console.log("Voice command: show resume")
        openWindow("resume")
      },
      description: "Show the resume",
    },
    {
      command: "resume",
      action: () => {
        console.log("Voice command: resume")
        openWindow("resume")
      },
      description: "Open resume",
    },
    {
      command: "open services",
      action: () => {
        console.log("Voice command: open services")
        openWindow("services")
      },
      description: "Open the services window",
    },
    {
      command: "services",
      action: () => {
        console.log("Voice command: services")
        openWindow("services")
      },
      description: "Show services",
    },
    {
      command: "open contact",
      action: () => {
        console.log("Voice command: open contact")
        openWindow("contact")
      },
      description: "Open the contact window",
    },
    {
      command: "contact me",
      action: () => {
        console.log("Voice command: contact me")
        openWindow("contact")
      },
      description: "Show contact information",
    },
    {
      command: "contact",
      action: () => {
        console.log("Voice command: contact")
        openWindow("contact")
      },
      description: "Open contact",
    },
    {
      command: "open terminal",
      action: () => {
        console.log("Voice command: open terminal")
        openWindow("terminal")
      },
      description: "Open the terminal window",
    },
    {
      command: "terminal",
      action: () => {
        console.log("Voice command: terminal")
        openWindow("terminal")
      },
      description: "Open terminal",
    },

    // Theme commands
    {
      command: "dark mode",
      action: () => {
        console.log("Voice command: dark mode")
        setTheme("dark")
        showNotification("Switched to dark mode", "success")
      },
      description: "Switch to dark theme",
    },
    {
      command: "light mode",
      action: () => {
        console.log("Voice command: light mode")
        setTheme("light")
        showNotification("Switched to light mode", "success")
      },
      description: "Switch to light theme",
    },

    // Fun commands
    {
      command: "hello",
      action: () => {
        console.log("Voice command: hello")
        showNotification("Hello! Voice control is working perfectly! 👋", "success")
      },
      description: "Say hello",
    },
    {
      command: "hi",
      action: () => {
        console.log("Voice command: hi")
        showNotification("Hi there! Try saying 'open projects' or 'dark mode'", "info")
      },
      description: "Greeting",
    },
    {
      command: "help",
      action: () => {
        console.log("Voice command: help")
        showNotification("Try: 'open projects', 'about me', 'dark mode', 'contact'", "info")
      },
      description: "Show help",
    },
    {
      command: "surprise me",
      action: () => {
        console.log("Voice command: surprise me")
        const windows = ["projects", "about", "resume", "services", "contact", "terminal"]
        const randomWindow = windows[Math.floor(Math.random() * windows.length)]
        openWindow(randomWindow)
        showNotification(`Surprise! Opening ${randomWindow}`, "success")
      },
      description: "Open a random window",
    },
  ]
}
