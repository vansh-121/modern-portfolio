import type { VoiceCommand } from "@/hooks/use-voice-control"

export function createVoiceCommands(
  openWindow: (id: string) => void,
  setTheme: (theme: string) => void,
  showNotification: (message: string, type?: "success" | "error" | "info") => void,
): VoiceCommand[] {
  return [
    {
      command: "hello",
      action: () => {
        console.log("🎉 Hello command executed!")
        showNotification("Hello! Voice control is working! 🎤", "success")
      },
      description: "Test command",
    },
    {
      command: "hi",
      action: () => {
        console.log("👋 Hi command executed!")
        showNotification("Hi there! Voice is active!", "success")
      },
      description: "Greeting",
    },
    {
      command: "open projects",
      action: () => {
        console.log("📁 Opening projects")
        openWindow("projects")
        showNotification("Opening projects", "success")
      },
      description: "Open projects",
    },
    {
      command: "projects",
      action: () => {
        console.log("📁 Projects command")
        openWindow("projects")
        showNotification("Showing projects", "success")
      },
      description: "Show projects",
    },
    {
      command: "about me",
      action: () => {
        console.log("👤 About me command")
        openWindow("about")
        showNotification("Opening about", "success")
      },
      description: "About section",
    },
    {
      command: "about",
      action: () => {
        console.log("👤 About command")
        openWindow("about")
        showNotification("Showing about", "success")
      },
      description: "About",
    },
    {
      command: "dark mode",
      action: () => {
        console.log("🌙 Dark mode command")
        setTheme("dark")
        showNotification("Dark mode enabled", "success")
      },
      description: "Dark theme",
    },
    {
      command: "light mode",
      action: () => {
        console.log("☀️ Light mode command")
        setTheme("light")
        showNotification("Light mode enabled", "success")
      },
      description: "Light theme",
    },
    {
      command: "contact",
      action: () => {
        console.log("📞 Contact command")
        openWindow("contact")
        showNotification("Opening contact", "success")
      },
      description: "Contact info",
    },
    {
      command: "help",
      action: () => {
        console.log("❓ Help command")
        showNotification("Available: hello, open projects, about me, dark mode", "info")
      },
      description: "Show help",
    },
  ]
}
