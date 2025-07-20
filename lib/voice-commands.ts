export interface VoiceCommand {
  phrases: string[]
  action: () => void
  description: string
}

export function createVoiceCommands(
  openWindow: (id: string) => void,
  setTheme: (theme: string) => void,
  showNotification: (message: string, type?: "success" | "error" | "info") => void,
): VoiceCommand[] {
  return [
    // Greetings
    {
      phrases: ["hello", "hi", "hey", "greetings"],
      action: () => showNotification("Hello! Welcome to my interactive portfolio! 👋", "success"),
      description: "Greet the AI assistant",
    },

    // Navigation
    {
      phrases: ["open projects", "show projects", "projects"],
      action: () => {
        openWindow("projects")
        showNotification("Opening Projects window", "success")
      },
      description: "Open the projects window",
    },
    {
      phrases: ["open about", "about me", "about"],
      action: () => {
        openWindow("about")
        showNotification("Opening About window", "success")
      },
      description: "Open the about window",
    },
    {
      phrases: ["open resume", "show resume", "resume"],
      action: () => {
        openWindow("resume")
        showNotification("Opening Resume window", "success")
      },
      description: "Open the resume window",
    },
    {
      phrases: ["open services", "show services", "services"],
      action: () => {
        openWindow("services")
        showNotification("Opening Services window", "success")
      },
      description: "Open the services window",
    },
    {
      phrases: ["open contact", "contact me", "contact"],
      action: () => {
        openWindow("contact")
        showNotification("Opening Contact window", "success")
      },
      description: "Open the contact window",
    },
    {
      phrases: ["open terminal", "show terminal", "terminal"],
      action: () => {
        openWindow("terminal")
        showNotification("Opening Terminal window", "success")
      },
      description: "Open the terminal window",
    },

    // Theme Commands
    {
      phrases: ["cosmic theme", "space theme", "cosmic mode"],
      action: () => {
        setTheme("cosmic")
        showNotification("🌌 Cosmic theme activated!", "success")
      },
      description: "Switch to cosmic theme",
    },
    {
      phrases: ["retro theme", "synthwave theme", "retro mode"],
      action: () => {
        setTheme("retro")
        showNotification("🌈 Retro wave theme activated!", "success")
      },
      description: "Switch to retro theme",
    },
    {
      phrases: ["minimal theme", "clean theme", "minimal mode"],
      action: () => {
        setTheme("minimal")
        showNotification("⚪ Minimal theme activated!", "success")
      },
      description: "Switch to minimal theme",
    },
    {
      phrases: ["matrix theme", "hacker theme", "green theme", "matrix mode"],
      action: () => {
        setTheme("hacker")
        showNotification("💚 Matrix theme activated! Welcome to the Matrix!", "success")
      },
      description: "Switch to matrix/hacker theme",
    },
    {
      phrases: ["sunset theme", "warm theme", "sunset mode"],
      action: () => {
        setTheme("sunset")
        showNotification("🌅 Sunset theme activated!", "success")
      },
      description: "Switch to sunset theme",
    },
    {
      phrases: ["ocean theme", "blue theme", "ocean mode"],
      action: () => {
        setTheme("ocean")
        showNotification("🌊 Ocean theme activated!", "success")
      },
      description: "Switch to ocean theme",
    },

    // Fun Commands
    {
      phrases: ["surprise me", "random surprise", "easter egg"],
      action: () => {
        const surprises = [
          "🎉 Here's a virtual high-five! ✋",
          "🦄 A wild unicorn appeared! It grants you +10 coding skills!",
          "🎭 *Confetti falls from the sky* 🎊",
          "🔮 The magic 8-ball says: 'Your next project will be amazing!'",
          "🚀 Launching surprise rocket... 3... 2... 1... 🌟",
          "🍪 Here's a virtual cookie for being awesome!",
        ]
        const surprise = surprises[Math.floor(Math.random() * surprises.length)]
        showNotification(surprise, "success")
      },
      description: "Get a random surprise",
    },
    {
      phrases: ["tell me a joke", "joke", "make me laugh"],
      action: () => {
        const jokes = [
          "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
          "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡",
          "Why do Java developers wear glasses? Because they can't C# 👓",
          "What's a programmer's favorite hangout place? Foo Bar! 🍺",
        ]
        const joke = jokes[Math.floor(Math.random() * jokes.length)]
        showNotification(joke, "success")
      },
      description: "Tell a programming joke",
    },
    {
      phrases: ["create explosion", "particle explosion", "boom"],
      action: () => {
        // Trigger particle explosion at center of screen
        const event = new MouseEvent("click", {
          clientX: window.innerWidth / 2,
          clientY: window.innerHeight / 2,
        })
        window.dispatchEvent(event)
        showNotification("💥 Particle explosion created!", "success")
      },
      description: "Create a particle explosion",
    },

    // System Commands
    {
      phrases: ["dark mode", "dark theme"],
      action: () => {
        setTheme("dark")
        showNotification("🌙 Dark mode activated!", "success")
      },
      description: "Switch to dark mode",
    },
    {
      phrases: ["light mode", "light theme"],
      action: () => {
        setTheme("light")
        showNotification("☀️ Light mode activated!", "success")
      },
      description: "Switch to light mode",
    },
    {
      phrases: ["full screen", "fullscreen", "maximize"],
      action: () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen()
          showNotification("📺 Entered fullscreen mode!", "success")
        } else {
          document.exitFullscreen()
          showNotification("📱 Exited fullscreen mode!", "success")
        }
      },
      description: "Toggle fullscreen mode",
    },
    {
      phrases: ["refresh page", "reload", "refresh"],
      action: () => {
        showNotification("🔄 Refreshing page...", "info")
        setTimeout(() => window.location.reload(), 1000)
      },
      description: "Refresh the page",
    },

    // Social Commands
    {
      phrases: ["open github", "github", "show github"],
      action: () => {
        window.open("https://github.com", "_blank")
        showNotification("🐙 Opening GitHub in new tab!", "success")
      },
      description: "Open GitHub profile",
    },
    {
      phrases: ["open linkedin", "linkedin", "show linkedin"],
      action: () => {
        window.open("https://linkedin.com", "_blank")
        showNotification("💼 Opening LinkedIn in new tab!", "success")
      },
      description: "Open LinkedIn profile",
    },
    {
      phrases: ["open twitter", "twitter", "show twitter"],
      action: () => {
        window.open("https://twitter.com", "_blank")
        showNotification("🐦 Opening Twitter in new tab!", "success")
      },
      description: "Open Twitter profile",
    },

    // Terminal Commands
    {
      phrases: ["run matrix", "matrix command", "enter matrix"],
      action: () => {
        openWindow("terminal")
        setTheme("hacker")
        showNotification("🔴 Matrix mode activated! Terminal opened!", "success")
        // Simulate typing matrix command
        setTimeout(() => {
          const event = new CustomEvent("terminal-command", { detail: "matrix" })
          window.dispatchEvent(event)
        }, 1000)
      },
      description: "Run matrix command in terminal",
    },
    {
      phrases: ["check weather", "weather", "show weather"],
      action: () => {
        openWindow("terminal")
        showNotification("🌤️ Opening terminal to check weather!", "success")
        setTimeout(() => {
          const event = new CustomEvent("terminal-command", { detail: "weather" })
          window.dispatchEvent(event)
        }, 1000)
      },
      description: "Check weather in terminal",
    },

    // Help
    {
      phrases: ["help", "what can you do", "commands"],
      action: () => {
        showNotification(
          "🎤 Try saying: 'hello', 'open projects', 'cosmic theme', 'surprise me', 'tell me a joke'",
          "info",
        )
      },
      description: "Show available voice commands",
    },
  ]
}
