interface VoiceCommand {
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
    // Greeting commands
    {
      patterns: ["hello", "hi", "hey", "greetings"],
      action: () => {
        console.log("🎉 Hello command triggered!")
        showHelloAnimation?.()
      },
      description: "Show greeting animation",
    },

    // Window commands
    {
      patterns: ["open projects", "show projects", "projects"],
      action: () => openWindow("projects"),
      description: "Open Projects window",
    },
    {
      patterns: ["open about", "show about", "about me"],
      action: () => openWindow("about"),
      description: "Open About window",
    },
    {
      patterns: ["open resume", "show resume", "resume"],
      action: () => openWindow("resume"),
      description: "Open Resume window",
    },
    {
      patterns: ["open services", "show services", "services"],
      action: () => openWindow("services"),
      description: "Open Services window",
    },
    {
      patterns: ["open contact", "show contact", "contact"],
      action: () => openWindow("contact"),
      description: "Open Contact window",
    },
    {
      patterns: ["open terminal", "show terminal", "terminal"],
      action: () => openWindow("terminal"),
      description: "Open Terminal window",
    },

    // Theme commands
    {
      patterns: ["dark mode", "dark theme", "switch to dark"],
      action: () => {
        setTheme("dark")
        showNotification("Switched to dark mode", "success")
      },
      description: "Switch to dark theme",
    },
    {
      patterns: ["light mode", "light theme", "switch to light"],
      action: () => {
        setTheme("light")
        showNotification("Switched to light mode", "success")
      },
      description: "Switch to light theme",
    },

    // Help command
    {
      patterns: ["help", "what can you do", "commands"],
      action: () => {
        showNotification("Try: 'Hello', 'Open Projects', 'Dark Mode', or 'Light Mode'", "info")
      },
      description: "Show available commands",
    },
  ]
}
