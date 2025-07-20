"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Palette, Check } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const themes = [
  {
    id: "cosmic",
    name: "Cosmic",
    description: "Space-like with nebula colors",
    colors: ["#1a1a2e", "#16213e", "#0f3460"],
    icon: "🌌",
  },
  {
    id: "retro",
    name: "Retro Wave",
    description: "80s synthwave aesthetic",
    colors: ["#ff006e", "#8338ec", "#3a86ff"],
    icon: "🌈",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, professional look",
    colors: ["#f8fafc", "#e2e8f0", "#cbd5e1"],
    icon: "⚪",
  },
  {
    id: "hacker",
    name: "Matrix",
    description: "Green terminal hacker style",
    colors: ["#001100", "#003300", "#004400"],
    icon: "💚",
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm gradient colors",
    colors: ["#ff7b7b", "#ff9500", "#ffdd59"],
    icon: "🌅",
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Deep blue ocean vibes",
    colors: ["#0077be", "#00a8cc", "#40e0d0"],
    icon: "🌊",
  },
]

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const currentTheme = themes.find((t) => t.id === theme) || themes[0]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs hover:bg-white/10 transition-colors">
          <Palette className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">{currentTheme.name}</span>
          <span className="sm:hidden">{currentTheme.icon}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-black/90 border-gray-700">
        <div className="p-2">
          <h3 className="text-sm font-medium text-white mb-2">Choose Theme</h3>
          <div className="space-y-1">
            {themes.map((themeOption) => (
              <DropdownMenuItem
                key={themeOption.id}
                onClick={() => setTheme(themeOption.id)}
                className="flex items-center justify-between p-2 rounded cursor-pointer hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{themeOption.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-white">{themeOption.name}</div>
                    <div className="text-xs text-gray-400">{themeOption.description}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {themeOption.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-3 h-3 rounded-full border border-gray-600"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  {theme === themeOption.id && <Check className="h-4 w-4 text-green-400" />}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
