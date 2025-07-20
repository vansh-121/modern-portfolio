export interface VoiceCommand {
  patterns: string[]
  action: () => void
  description: string
}

export function createVoiceCommands(
  openWindow: (id: string) => void,
  setTheme: (theme: string) => void,
  showNotification: (message: string, type?: "success" | "error" | "info") => void,
  showHelloAnimation?: () => void,
): VoiceCommand[] {
  return [
    {
      patterns: ["hello", "hi", "hey", "greetings"],
      action: () => {
        console.log("🎉 Hello command triggered!")
        if (showHelloAnimation) {
          showHelloAnimation()
        } else {
          showNotification("👋 Hello there! Voice control is working!", "success")
        }
      },
      description: "Test greeting command",
    },
    {
      patterns: ["open projects", "show projects", "projects"],
      action: () => {
        console.log("📁 Opening projects...")
        openWindow("projects")
        showNotification("📁 Opening Projects window", "success")
      },
      description: "Open projects window",
    },
    {
      patterns: ["about me", "about", "who are you"],
      action: () => {
        console.log("👤 Opening about...")
        openWindow("about")
        showNotification("👤 Opening About Me window", "success")
      },
      description: "Open about window",
    },
    {
      patterns: ["resume", "cv", "curriculum"],
      action: () => {
        console.log("📄 Opening resume...")
        openWindow("resume")
        showNotification("📄 Opening Resume window", "success")
      },
      description: "Open resume window",
    },
    {
      patterns: ["services", "what do you do", "skills"],
      action: () => {
        console.log("⚡ Opening services...")
        openWindow("services")
        showNotification("⚡ Opening Services window", "success")
      },
      description: "Open services window",
    },
    {
      patterns: ["contact", "contact me", "get in touch"],
      action: () => {
        console.log("📞 Opening contact...")
        openWindow("contact")
        showNotification("📞 Opening Contact window", "success")
      },
      description: "Open contact window",
    },
    {
      patterns: ["terminal", "console", "command line"],
      action: () => {
        console.log("💻 Opening terminal...")
        openWindow("terminal")
        showNotification("💻 Opening Terminal window", "success")
      },
      description: "Open terminal window",
    },
    {
      patterns: ["dark mode", "dark theme", "switch theme"],
      action: () => {
        console.log("🌙 Toggling theme...")
        setTheme("dark")
        showNotification("🌙 Switched to dark mode", "success")
      },
      description: "Switch to dark mode",
    },
    {
      patterns: ["light mode", "light theme", "bright mode"],
      action: () => {
        console.log("☀️ Toggling theme...")
        setTheme("light")
        showNotification("☀️ Switched to light mode", "success")
      },
      description: "Switch to light mode",
    },
  ]
}
