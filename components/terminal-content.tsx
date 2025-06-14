"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, Star, GitFork } from "lucide-react"

interface Command {
  input: string
  output: string | React.JSX.Element
  timestamp: Date
}

export function TerminalContent() {
  const [commands, setCommands] = useState<Command[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const githubProjects = [
    {
      name: "modern-portfolio",
      description: "macOS-inspired portfolio with Three.js animations",
      url: "https://github.com/vansh-121/modern-portfolio",
      demo: "https://vanshsethi.netlify.app/",
      stars: 45,
      forks: 12,
      language: "TypeScript",
      status: "🟢 Live",
    },
    {
      name: "ecommerce-platform",
      description: "Full-stack e-commerce with React & Node.js",
      url: "https://github.com/vansh-121/ecommerce-platform",
      demo: "https://ecommerce-demo.vercel.app",
      stars: 32,
      forks: 8,
      language: "JavaScript",
      status: "🟢 Live",
    },
    {
      name: "task-manager-app",
      description: "Real-time collaborative task management",
      url: "https://github.com/vansh-121/task-manager",
      demo: "https://taskmanager-demo.vercel.app",
      stars: 28,
      forks: 6,
      language: "React",
      status: "🟢 Live",
    },
    {
      name: "weather-dashboard",
      description: "Beautiful weather app with maps integration",
      url: "https://github.com/vansh-121/weather-dashboard",
      demo: "https://weather-demo.vercel.app",
      stars: 19,
      forks: 4,
      language: "Vue.js",
      status: "🟢 Live",
    },
  ]

  const skills = {
    frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js", "Three.js"],
    backend: ["Node.js", "Python", "PostgreSQL", "MongoDB", "Express", "FastAPI"],
    tools: ["Git", "Docker", "AWS", "Vercel", "Figma", "VS Code"],
    mobile: ["React Native", "Flutter", "Expo"],
  }

  const asciiArt = `
    ╔══════════════════════════════════════╗
    ║           VANSH SETHI - DEV          ║
    ║                                      ║
    ║    ██╗   ██╗███████╗                 ║
    ║    ██║   ██║██╔════╝                 ║
    ║    ██║   ██║███████╗                 ║
    ║    ╚██╗ ██╔╝╚════██║                 ║
    ║     ╚████╔╝ ███████║                 ║
    ║      ╚═══╝  ╚══════╝                 ║
    ║                                      ║
    ║    Full Stack Developer & Designer   ║
    ╚══════════════════════════════════════╝
  `

  const typeWriter = useCallback(async (text: string, delay = 50) => {
    setIsTyping(true)
    for (let i = 0; i <= text.length; i++) {
      setCurrentInput(text.slice(0, i))
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
    setIsTyping(false)
  }, [])

  const executeCommand = useCallback((input: string) => {
    const cmd = input.toLowerCase().trim()
    let output: string | React.JSX.Element = ""

    switch (cmd) {
      case "help":
        output = (
          <div className="space-y-1">
            <div className="text-green-400 font-bold">Available Commands:</div>
            <div className="ml-2 md:ml-4 space-y-1 text-xs md:text-sm">
              <div>
                <span className="text-blue-400">help</span> - Show this help message
              </div>
              <div>
                <span className="text-blue-400">whoami</span> - Display user information
              </div>
              <div>
                <span className="text-blue-400">projects</span> - List GitHub projects
              </div>
              <div>
                <span className="text-blue-400">skills</span> - Show technical skills
              </div>
              <div>
                <span className="text-blue-400">contact</span> - Display contact information
              </div>
              <div>
                <span className="text-blue-400">ascii</span> - Show ASCII art
              </div>
              <div>
                <span className="text-blue-400">neofetch</span> - System information
              </div>
              <div>
                <span className="text-blue-400">cat [file]</span> - Display file contents
              </div>
              <div>
                <span className="text-blue-400">ls</span> - List directory contents
              </div>
              <div>
                <span className="text-blue-400">clear</span> - Clear terminal
              </div>
              <div>
                <span className="text-blue-400">social</span> - Show social links
              </div>
            </div>
          </div>
        )
        break

      case "whoami":
        output = (
          <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
            <div className="text-green-400 font-bold">Vansh Sethi</div>
            <div>🚀 Full Stack Developer & UI/UX Designer</div>
            <div>📍 India</div>
            <div>💼 3+ years experience in web development</div>
            <div>🎯 Passionate about creating amazing user experiences</div>
            <div>🌟 Available for new opportunities</div>
            <div>🔗 Portfolio: https://vanshsethi.netlify.app/</div>
          </div>
        )
        break

      case "projects":
        output = (
          <div className="space-y-2 md:space-y-3">
            <div className="text-green-400 font-bold text-sm md:text-base">🚀 GitHub Projects:</div>
            {githubProjects.map((project, index) => (
              <div key={index} className="border border-gray-600 rounded p-2 md:p-3 space-y-1 md:space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 md:gap-2">
                  <div className="text-blue-400 font-bold text-sm md:text-base">{project.name}</div>
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {project.language}
                    </Badge>
                    <span className="text-xs">{project.status}</span>
                  </div>
                </div>
                <div className="text-gray-300 text-xs md:text-sm">{project.description}</div>
                <div className="flex flex-wrap items-center space-x-2 md:space-x-4 text-xs md:text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="w-2.5 h-2.5 md:w-3 md:h-3" />
                    <span>{project.stars}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GitFork className="w-2.5 h-2.5 md:w-3 md:h-3" />
                    <span>{project.forks}</span>
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-blue-400 hover:text-blue-300 text-xs"
                    onClick={() => window.open(project.url, "_blank")}
                  >
                    <Github className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" />
                    Code
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-green-400 hover:text-green-300 text-xs"
                    onClick={() => window.open(project.demo, "_blank")}
                  >
                    <ExternalLink className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" />
                    Demo
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )
        break

      case "skills":
        output = (
          <div className="space-y-2 md:space-y-3">
            <div className="text-green-400 font-bold text-sm md:text-base">💻 Technical Skills:</div>
            {Object.entries(skills).map(([category, skillList]) => (
              <div key={category}>
                <div className="text-blue-400 font-semibold capitalize text-sm md:text-base">{category}:</div>
                <div className="ml-2 md:ml-4 flex flex-wrap gap-1 md:gap-2 mt-1">
                  {skillList.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
        break

      case "contact":
        output = (
          <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
            <div className="text-green-400 font-bold">📧 Contact Information:</div>
            <div>Email: vanshsethi121@gmail.com</div>
            <div>LinkedIn: linkedin.com/in/vansh-sethi-vs/</div>
            <div>GitHub: github.com/vansh-121</div>
            <div>Portfolio: vanshsethi.netlify.app</div>
            <div>Location: India</div>
          </div>
        )
        break

      case "social":
        output = (
          <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
            <div className="text-green-400 font-bold">🌐 Social Links:</div>
            <div>🔗 Portfolio: https://vanshsethi.netlify.app/</div>
            <div>💼 LinkedIn: https://www.linkedin.com/in/vansh-sethi-vs/</div>
            <div>🐙 GitHub: https://github.com/vansh-121</div>
            <div>📧 Email: vanshsethi121@gmail.com</div>
          </div>
        )
        break

      case "ascii":
        output = <pre className="text-blue-400 text-xs leading-tight overflow-x-auto">{asciiArt}</pre>
        break

      case "neofetch":
        output = (
          <div className="space-y-1 text-xs md:text-sm">
            <div className="text-green-400 font-bold">System Information:</div>
            <div>OS: Portfolio OS (macOS inspired)</div>
            <div>Shell: zsh 5.8.1</div>
            <div>Terminal: Portfolio Terminal</div>
            <div>Developer: Vansh Sethi</div>
            <div>Stack: React, Next.js, TypeScript, Three.js</div>
            <div>Uptime: {Math.floor(Date.now() / 1000 / 60)} minutes</div>
            <div>Theme: {document.documentElement.classList.contains("dark") ? "Dark" : "Light"}</div>
          </div>
        )
        break

      case "ls":
        output = (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm">
            <div className="text-blue-400">projects/</div>
            <div className="text-blue-400">about/</div>
            <div className="text-blue-400">resume/</div>
            <div className="text-blue-400">contact/</div>
            <div className="text-green-400">README.md</div>
            <div className="text-green-400">package.json</div>
          </div>
        )
        break

      case "cat readme.md":
      case "cat readme":
        output = (
          <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
            <div className="text-green-400 font-bold"># Vansh Sethi - Portfolio</div>
            <div>Welcome to my interactive portfolio!</div>
            <div>This is a macOS-inspired portfolio built with:</div>
            <div className="ml-2 md:ml-4">- Next.js & React</div>
            <div className="ml-2 md:ml-4">- Three.js for 3D animations</div>
            <div className="ml-2 md:ml-4">- Tailwind CSS for styling</div>
            <div className="ml-2 md:ml-4">- TypeScript for type safety</div>
            <div className="mt-1 md:mt-2">Type 'help' for available commands.</div>
            <div className="mt-1 md:mt-2">Visit: https://vanshsethi.netlify.app/</div>
          </div>
        )
        break

      case "clear":
        setCommands([])
        return

      case "":
        break

      default:
        output = `Command not found: ${input}. Type 'help' for available commands.`
    }

    if (input.trim()) {
      setCommands((prev) => [
        ...prev,
        {
          input,
          output,
          timestamp: new Date(),
        },
      ])
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeCommand(currentInput)
    setCurrentInput("")
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [commands])

  useEffect(() => {
    // Welcome message
    setTimeout(() => {
      setCommands([
        {
          input: "",
          output: (
            <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <div className="text-green-400 font-bold">Welcome to Vansh's Portfolio Terminal v2.0</div>
              <div>Type 'help' to see available commands.</div>
              <div>Type 'projects' to see my GitHub repositories.</div>
              <div>Type 'social' to see my social links.</div>
            </div>
          ),
          timestamp: new Date(),
        },
      ])
    }, 500)

    // Auto-demo
    setTimeout(() => {
      typeWriter("help")
    }, 2000)
  }, [typeWriter])

  return (
    <div className="h-full bg-black text-green-400 font-mono text-xs md:text-sm flex flex-col">
      {/* Terminal Header */}
      <div className="bg-gray-800 px-2 md:px-4 py-1 md:py-2 text-white text-xs flex items-center justify-between">
        <div>Terminal — vansh@portfolio — 80×24</div>
        <div className="flex space-x-1 md:space-x-2">
          <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></div>
          <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className="flex-1 p-2 md:p-4 overflow-y-auto space-y-1 md:space-y-2"
        onClick={() => inputRef.current?.focus()}
      >
        {commands.map((command, index) => (
          <div key={index} className="space-y-1">
            {command.input && (
              <div className="flex items-center space-x-1 md:space-x-2 flex-wrap">
                <span className="text-blue-400 text-xs md:text-sm">vansh@portfolio</span>
                <span className="text-white">:</span>
                <span className="text-purple-400">~</span>
                <span className="text-white">$</span>
                <span className="text-green-400 break-all">{command.input}</span>
              </div>
            )}
            {command.output && <div className="ml-2 md:ml-4 text-gray-300">{command.output}</div>}
          </div>
        ))}

        {/* Current Input Line */}
        <form onSubmit={handleSubmit} className="flex items-center space-x-1 md:space-x-2 flex-wrap">
          <span className="text-blue-400 text-xs md:text-sm">vansh@portfolio</span>
          <span className="text-white">:</span>
          <span className="text-purple-400">~</span>
          <span className="text-white">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            className="flex-1 min-w-0 bg-transparent outline-none text-green-400 text-xs md:text-sm"
            autoFocus
            spellCheck={false}
          />
          {isTyping && <span className="animate-pulse">|</span>}
        </form>
      </div>
    </div>
  )
}