"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleDarkMode = () => {
    // Only toggle between light and dark, don't change the theme
    if (theme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggleDarkMode} className="h-6 w-6 p-0 hover:bg-white/10 text-white">
      {theme === "dark" ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
    </Button>
  )
}
