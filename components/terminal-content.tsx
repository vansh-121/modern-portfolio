"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface TerminalLine {
  id: string
  type: "input" | "output" | "error" | "system"
  content: string
  timestamp: Date
}

const ASCII_ART = {
  matrix: [
    "01001000 01100101 01101100 01101100 01101111",
    "01010111 01101111 01110010 01101100 01100100",
    "01001101 01100001 01110100 01110010 01101001",
    "01111000 00100000 01001101 01101111 01100100",
    "01100101 00100000 01000001 01100011 01110100",
    "01101001 01110110 01100001 01110100 01100101",
    "01100100 00100001 00100000 01000101 01101110",
    "01110100 01100101 01110010 00100000 01110100",
    "01101000 01100101 00100000 01001101 01100001",
    "01110100 01110010 01101001 01111000 00101110",
  ],
  logo: [
    "    ____             __  ____      ___      ",
    "   / __ \\____  _____/ /_/ __/___  / (_)___  ",
    "  / /_/ / __ \\/ ___/ __/ /_/ __ \\/ / / __ \\ ",
    " / ____/ /_/ / /  / /_/ __/ /_/ / / / /_/ / ",
    "/_/    \\____/_/   \\__/_/  \\____/_/_/\\____/  ",
    "                                           ",
    "Welcome to the Interactive Portfolio Terminal",
  ],
}

const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡",
  "Why do Java developers wear glasses? Because they can't C# 👓",
  "What's a programmer's favorite hangout place? Foo Bar! 🍺",
  "Why did the programmer quit his job? He didn't get arrays! 📊",
]

const FACTS = [
  "The first computer bug was an actual bug - a moth trapped in a Harvard Mark II computer in 1947! 🦋",
  "The term 'debugging' was coined by Admiral Grace Hopper! 👩‍💻",
  "JavaScript was created in just 10 days by Brendan Eich in 1995! ⚡",
  "The first 1GB hard drive cost $40,000 in 1980! 💰",
  "Python is named after Monty Python's Flying Circus! 🐍",
]

export function TerminalContent() {
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isMatrixMode, setIsMatrixMode] = useState(false)
  const [matrixInterval, setMatrixInterval] = useState<NodeJS.Timeout | null>(null)
  const [gameState, setGameState] = useState<any>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { setTheme } = useTheme()

  // Auto-focus input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Scroll to bottom when new lines are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  // Initialize terminal
  useEffect(() => {
    addLine("system", ASCII_ART.logo.join("\n"))
    addLine("system", "Type 'help' to see available commands")
    addLine("system", "Try 'matrix', 'weather', 'github', or 'surprise'!")
  }, [])

  const addLine = (type: TerminalLine["type"], content: string) => {
    const newLine: TerminalLine = {
      id: Date.now().toString() + Math.random(),
      type,
      content,
      timestamp: new Date(),
    }
    setLines((prev) => [...prev, newLine])
  }

  const executeCommand = async (command: string) => {
    const cmd = command.toLowerCase().trim()
    addLine("input", `$ ${command}`)

    // Add to history
    if (command.trim()) {
      setCommandHistory((prev) => [...prev, command])
    }

    switch (cmd) {
      case "help":
        addLine("output", "Available commands:")
        addLine("output", "  help          - Show this help message")
        addLine("output", "  clear         - Clear terminal")
        addLine("output", "  matrix        - Enter the Matrix")
        addLine("output", "  weather       - Get weather info")
        addLine("output", "  spotify       - Show now playing")
        addLine("output", "  github        - Show GitHub activity")
        addLine("output", "  snake         - Play Snake game")
        addLine("output", "  tetris        - Play Tetris")
        addLine("output", "  joke          - Tell a programming joke")
        addLine("output", "  fact          - Share a tech fact")
        addLine("output", "  surprise      - Random surprise")
        addLine("output", "  hack          - Activate hacker mode")
        addLine("output", "  konami        - Try the Konami code")
        addLine("output", "  whoami        - About this terminal")
        addLine("output", "  date          - Show current date/time")
        addLine("output", "  theme <name>  - Change theme (cosmic, retro, minimal, hacker, sunset)")
        break

      case "clear":
        setLines([])
        break

      case "matrix":
        setIsMatrixMode(true)
        setTheme("hacker")
        addLine("system", "🔴 ENTERING THE MATRIX...")
        addLine("output", ASCII_ART.matrix.join("\n"))
        addLine("system", "Matrix mode activated! Theme changed to hacker.")

        // Start matrix animation
        let matrixCount = 0
        const interval = setInterval(() => {
          const randomBinary = Array.from({ length: 50 }, () => (Math.random() > 0.5 ? "1" : "0")).join("")
          addLine("system", `${randomBinary}`)
          matrixCount++
          if (matrixCount > 10) {
            clearInterval(interval)
            addLine("system", "Matrix sequence complete. Welcome to the real world.")
            setIsMatrixMode(false)
          }
        }, 200)
        setMatrixInterval(interval)
        break

      case "weather":
        addLine("system", "🌤️ Fetching weather data...")
        setTimeout(() => {
          addLine("output", "📍 Current Weather:")
          addLine("output", "Location: San Francisco, CA")
          addLine("output", "Temperature: 72°F (22°C)")
          addLine("output", "Condition: Partly Cloudy")
          addLine("output", "Humidity: 65%")
          addLine("output", "Wind: 8 mph NW")
          addLine("system", "💡 Tip: This is demo data. Connect to a weather API for real data!")
        }, 1000)
        break

      case "spotify":
        addLine("system", "🎵 Checking Spotify...")
        setTimeout(() => {
          addLine("output", "🎧 Now Playing:")
          addLine("output", "Track: Synthwave Dreams")
          addLine("output", "Artist: Neon Nights")
          addLine("output", "Album: Digital Horizons")
          addLine("output", "Duration: 3:42 / 4:15")
          addLine("output", "🔊 ████████░░ 80%")
          addLine("system", "💡 Connect to Spotify API for real playback data!")
        }, 800)
        break

      case "github":
        addLine("system", "📊 Fetching GitHub activity...")
        setTimeout(() => {
          addLine("output", "🐙 Recent GitHub Activity:")
          addLine("output", "📝 Pushed to portfolio-v2 (2 hours ago)")
          addLine("output", "⭐ Starred react-three-fiber (5 hours ago)")
          addLine("output", "🔀 Merged PR #42 in awesome-project (1 day ago)")
          addLine("output", "📦 Created new repo: ai-terminal (2 days ago)")
          addLine("output", "🐛 Fixed issue #123 in web-app (3 days ago)")
          addLine("system", "💡 Connect to GitHub API for real activity data!")
        }, 1200)
        break

      case "snake":
        addLine("system", "🐍 Initializing Snake Game...")
        addLine("output", "┌─────────────────────┐")
        addLine("output", "│ 🐍 SNAKE GAME      │")
        addLine("output", "│                     │")
        addLine("output", "│   ●●●○              │")
        addLine("output", "│                     │")
        addLine("output", "│         🍎          │")
        addLine("output", "│                     │")
        addLine("output", "└─────────────────────┘")
        addLine("output", "Use WASD keys to move!")
        addLine("system", "🎮 Game ready! (This is a demo - implement full game logic)")
        break

      case "tetris":
        addLine("system", "🧩 Loading Tetris...")
        addLine("output", "┌─────────────┐")
        addLine("output", "│ 🧩 TETRIS   │")
        addLine("output", "│             │")
        addLine("output", "│      ██     │")
        addLine("output", "│      ██     │")
        addLine("output", "│             │")
        addLine("output", "│ ██████████  │")
        addLine("output", "└─────────────┘")
        addLine("output", "Score: 1337")
        addLine("system", "🎮 Game loaded! (Demo mode)")
        break

      case "joke":
        const randomJoke = JOKES[Math.floor(Math.random() * JOKES.length)]
        addLine("output", `😄 ${randomJoke}`)
        break

      case "fact":
        const randomFact = FACTS[Math.floor(Math.random() * FACTS.length)]
        addLine("output", `🤓 ${randomFact}`)
        break

      case "surprise":
        const surprises = [
          "🎉 You found an easter egg! Here's a cookie: 🍪",
          "✨ *Sparkles appear around your cursor*",
          "🦄 A wild unicorn appears! It grants you +10 coding skills!",
          "🎭 The terminal is now in party mode! 🎊",
          "🔮 The magic 8-ball says: 'Your code will compile on the first try!'",
          "🚀 Launching surprise rocket... 3... 2... 1... 🌟",
        ]
        const surprise = surprises[Math.floor(Math.random() * surprises.length)]
        addLine("system", surprise)
        break

      case "hack":
        setTheme("hacker")
        addLine("system", "🔴 HACKER MODE ACTIVATED")
        addLine("output", "Access granted...")
        addLine("output", "Bypassing firewall... ████████████ 100%")
        addLine("output", "Decrypting mainframe... ████████████ 100%")
        addLine("output", "Welcome, Neo. 😎")
        break

      case "konami":
        addLine("system", "🎮 Konami Code detected!")
        addLine("output", "↑ ↑ ↓ ↓ ← → ← → B A")
        addLine("system", "🎊 30 extra lives granted!")
        addLine("system", "🔓 Secret developer mode unlocked!")
        break

      case "whoami":
        addLine("output", "🤖 Interactive Portfolio Terminal v2.0")
        addLine("output", "Built with React, TypeScript, and Three.js")
        addLine("output", "Features: Voice control, 3D graphics, games")
        addLine("output", "Created by: Your Friendly Developer")
        break

      case "date":
        addLine("output", new Date().toString())
        break

      default:
        if (cmd.startsWith("theme ")) {
          const themeName = cmd.split(" ")[1]
          const validThemes = ["cosmic", "retro", "minimal", "hacker", "sunset", "ocean"]

          if (validThemes.includes(themeName)) {
            setTheme(themeName)
            addLine("system", `🎨 Theme changed to: ${themeName}`)
          } else {
            addLine("error", `❌ Invalid theme. Available: ${validThemes.join(", ")}`)
          }
        } else if (cmd.includes("sudo")) {
          addLine("error", "❌ Nice try! But this isn't a real terminal 😏")
        } else if (cmd.includes("rm -rf")) {
          addLine("error", "🚨 DANGER: Command blocked for safety!")
          addLine("system", "😅 Don't worry, your files are safe!")
        } else {
          addLine("error", `❌ Command not found: ${command}`)
          addLine("system", "💡 Type 'help' to see available commands")
        }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (currentInput.trim()) {
        executeCommand(currentInput)
      }
      setCurrentInput("")
      setHistoryIndex(-1)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1)
        if (newIndex === commandHistory.length - 1) {
          setHistoryIndex(-1)
          setCurrentInput("")
        } else {
          setHistoryIndex(newIndex)
          setCurrentInput(commandHistory[newIndex])
        }
      }
    }
  }

  const getLineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "input":
        return "text-green-400"
      case "output":
        return "text-blue-300"
      case "error":
        return "text-red-400"
      case "system":
        return "text-yellow-300"
      default:
        return "text-gray-300"
    }
  }

  return (
    <div className="h-full bg-black text-green-400 font-mono text-sm overflow-hidden flex flex-col">
      <div ref={terminalRef} className="flex-1 overflow-y-auto p-4 space-y-1" onClick={() => inputRef.current?.focus()}>
        {lines.map((line) => (
          <div key={line.id} className={`whitespace-pre-wrap ${getLineColor(line.type)}`}>
            {line.content}
          </div>
        ))}

        <div className="flex items-center">
          <span className="text-green-400 mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-green-400 caret-green-400"
            placeholder="Type a command..."
            autoComplete="off"
            spellCheck={false}
          />
          <span className="animate-pulse text-green-400">█</span>
        </div>
      </div>

      <div className="border-t border-gray-700 p-2 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>Interactive Terminal v2.0</span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  )
}
