import type { VoiceCommand } from "@/hooks/use-voice-control"

/**
 * createVoiceCommands
 * Returns an array of command mappings used by the voice hook.
 */
export function createVoiceCommands(
  openWindow: (id: string) => void,
  setTheme: (theme: string) => void,
  notify: (msg: string, type?: "success" | "error" | "info") => void,
): VoiceCommand[] {
  return [
    {
      command: "open projects",
      description: "Open projects window",
      action: () => openWindow("projects"),
    },
    {
      command: "show about",
      description: "Open about me window",
      action: () => openWindow("about"),
    },
    {
      command: "open resume",
      description: "Open resume window",
      action: () => openWindow("resume"),
    },
    {
      command: "show services",
      description: "Open services window",
      action: () => openWindow("services"),
    },
    {
      command: "contact me",
      description: "Open contact window",
      action: () => openWindow("contact"),
    },
    {
      command: "open terminal",
      description: "Open terminal window",
      action: () => openWindow("terminal"),
    },
    {
      command: "dark mode",
      description: "Enable dark theme",
      action: () => setTheme("dark"),
    },
    {
      command: "light mode",
      description: "Enable light theme",
      action: () => setTheme("light"),
    },
    {
      command: "hello",
      description: "Friendly greeting",
      action: () => notify("Hello there! 👋", "info"),
    },
    {
      command: "help",
      description: "List available voice commands",
      action: () =>
        notify("Try: open projects, show about, open resume, light mode, dark mode, contact me, open terminal", "info"),
    },
    {
      command: "surprise me",
      description: "Opens a random window",
      action: () => {
        const ids = ["projects", "about", "resume", "services", "contact", "terminal"]
        openWindow(ids[Math.floor(Math.random() * ids.length)])
      },
    },
  ]
}
