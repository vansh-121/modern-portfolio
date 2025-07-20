"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Palette } from "lucide-react"

const themes = [
  { name: "Cosmic", value: "cosmic", colors: ["#1a1a2e", "#16213e", "#0f3460"] },
  { name: "Matrix", value: "matrix", colors: ["#000000", "#001100", "#003300"] },
  { name: "Sunset", value: "sunset", colors: ["#ff6b6b", "#ffa500", "#ff1493"] },
  { name: "Ocean", value: "ocean", colors: ["#006994", "#0077be", "#4a90e2"] },
  { name: "Forest", value: "forest", colors: ["#2d5016", "#3d6b1a", "#4a7c1e"] },
  { name: "Neon", value: "neon", colors: ["#ff00ff", "#00ffff", "#ffff00"] },
  { name: "Retro", value: "retro", colors: ["#8b4513", "#cd853f", "#daa520"] },
  { name: "Arctic", value: "arctic", colors: ["#b0e0e6", "#87ceeb", "#4682b4"] },
]

export function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState("cosmic")
  const [isOpen, setIsOpen] = useState(false)

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme)
    setIsOpen(false)

    // Apply theme to CSS variables for background only
    const root = document.documentElement
    const selectedTheme = themes.find((t) => t.value === theme)

    if (selectedTheme) {
      root.style.setProperty("--theme-primary", selectedTheme.colors[0])
      root.style.setProperty("--theme-secondary", selectedTheme.colors[1])
      root.style.setProperty("--theme-accent", selectedTheme.colors[2])

      // Dispatch custom event for Three.js background
      window.dispatchEvent(
        new CustomEvent("themeChange", {
          detail: { theme: selectedTheme },
        }),
      )
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-white/10 text-white">
          <Palette className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 bg-black/90 backdrop-blur-md border-gray-700">
        <div className="grid grid-cols-2 gap-2">
          {themes.map((theme) => (
            <Button
              key={theme.value}
              variant={currentTheme === theme.value ? "default" : "ghost"}
              size="sm"
              onClick={() => handleThemeChange(theme.value)}
              className="flex items-center space-x-2 justify-start h-8"
            >
              <div className="flex space-x-1">
                {theme.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-3 h-3 rounded-full border border-gray-600"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-xs">{theme.name}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
