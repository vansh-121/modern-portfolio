export interface VoiceCommand {
  command: string
  action: () => void
  description: string
  aliases?: string[]
}

export function createVoiceCommands(
  openWindow: (id: string) => void,
  setTheme: (theme: string) => void,
  showNotification: (message: string) => void,
): VoiceCommand[] {
  return [
    // Window commands
    {
      command: "open projects",
      action: () => openWindow("projects"),
      description: "Open the projects window",
      aliases: ["show projects", "projects", "my work"],
    },
    {
      command: "open about",
      action: () => openWindow("about"),
      description: "Open the about me window",
      aliases: ["show about", "about me", "who are you"],
    },
    {
      command: "open resume",
      action: () => openWindow("resume"),
      description: "Open the resume window",
      aliases: ["show resume", "cv", "curriculum"],
    },
    {
      command: "open services",
      action: () => openWindow("services"),
      description: "Open the services window",
      aliases: ["show services", "what do you do"],
    },
    {
      command: "open contact",
      action: () => openWindow("contact"),
      description: "Open the contact window",
      aliases: ["show contact", "contact me", "get in touch"],
    },
    {
      command: "open terminal",
      action: () => openWindow("terminal"),
      description: "Open the terminal window",
      aliases: ["show terminal", "command line", "console"],
    },

    // Theme commands
    {
      command: "dark mode",
      action: () => setTheme("dark"),
      description: "Switch to dark theme",
      aliases: ["dark theme", "night mode"],
    },
    {
      command: "light mode",
      action: () => setTheme("light"),
      description: "Switch to light theme",
      aliases: ["light theme", "day mode"],
    },

    // Fun commands
    {
      command: "hello",
      action: () => showNotification("Hello! Welcome to my portfolio!"),
      description: "Say hello",
      aliases: ["hi", "hey", "greetings"],
    },
    {
      command: "help",
      action: () => showNotification("Try saying: Open projects, Dark mode, Hello, or About me"),
      description: "Show available commands",
      aliases: ["what can you do", "commands"],
    },
    {
      command: "surprise me",
      action: () => {
        const windows = ["projects", "about", "resume", "services", "contact", "terminal"]
        const randomWindow = windows[Math.floor(Math.random() * windows.length)]
        openWindow(randomWindow)
        showNotification(`Surprise! Opening ${randomWindow}`)
      },
      description: "Open a random window",
      aliases: ["random", "pick something"],
    },
  ]
}

export function findCommand(transcript: string, commands: VoiceCommand[]): VoiceCommand | null {
  const normalizedTranscript = transcript.toLowerCase().trim()

  return (
    commands.find((cmd) => {
      // Check main command
      if (normalizedTranscript.includes(cmd.command.toLowerCase())) {
        return true
      }

      // Check aliases
      if (cmd.aliases) {
        return cmd.aliases.some(
          (alias) =>
            normalizedTranscript.includes(alias.toLowerCase()) || alias.toLowerCase().includes(normalizedTranscript),
        )
      }

      return false
    }) || null
  )
}
