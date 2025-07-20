"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { VoiceCommand } from "@/lib/voice-commands"

interface UseVoiceControlOptions {
  commands: VoiceCommand[]
  onCommandRecognized?: (command: string) => void
  onError?: (error: string) => void
}

export interface UseVoiceControlReturn {
  isListening: boolean
  isSupported: boolean
  transcript: string
  confidence: number
  error: string | null
  toggleListening: () => void
  startListening: () => void
  stopListening: () => void
}

export function useVoiceControl({
  commands,
  onCommandRecognized,
  onError,
}: UseVoiceControlOptions): UseVoiceControlReturn {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<any>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Check browser support
  useEffect(() => {
    const Speech =
      typeof window !== "undefined"
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : undefined

    setIsSupported(!!Speech)
    if (!Speech) {
      setError("Speech recognition not supported in this browser")
    }
  }, [])

  // Command matching function
  const findMatchingCommand = useCallback(
    (text: string): VoiceCommand | null => {
      const normalizedText = text.toLowerCase().trim()
      console.log("🔍 Looking for command match:", normalizedText)

      for (const command of commands) {
        for (const pattern of command.patterns) {
          if (normalizedText.includes(pattern.toLowerCase())) {
            console.log("✅ Found matching command:", pattern)
            return command
          }
        }
      }

      console.log("❌ No matching command found")
      return null
    },
    [commands],
  )

  // Initialize speech recognition
  const initializeRecognition = useCallback(() => {
    if (!isSupported) return null

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"
    recognition.maxAlternatives = 3

    recognition.onstart = () => {
      console.log("🎤 Voice recognition started")
      setIsListening(true)
    }

    recognition.onend = () => {
      console.log("🎤 Voice recognition ended")
      setIsListening(false)
      recognitionRef.current = null
    }

    recognition.onerror = (event) => {
      console.error("🚨 Speech recognition error:", event.error)
      setIsListening(false)
      recognitionRef.current = null

      let errorMessage = "Voice recognition failed"
      switch (event.error) {
        case "no-speech":
          errorMessage = "No speech detected. Please try again."
          break
        case "audio-capture":
          errorMessage = "Microphone not accessible. Please check permissions."
          break
        case "not-allowed":
          errorMessage = "Microphone permission denied. Please allow access."
          break
        case "network":
          errorMessage = "Network error. Please check your connection."
          break
        default:
          errorMessage = `Voice recognition error: ${event.error}`
      }

      onError?.(errorMessage)
    }

    recognition.onresult = (event) => {
      const results = Array.from(event.results)
      const transcript = results
        .map((result) => result[0].transcript)
        .join("")
        .toLowerCase()
        .trim()

      console.log("🎤 Heard:", transcript)

      // Find matching command
      const matchedCommand = commands.find((command) =>
        command.patterns.some((pattern) => transcript.includes(pattern.toLowerCase())),
      )

      if (matchedCommand) {
        console.log("✅ Command matched:", matchedCommand.description)
        matchedCommand.action()
        onCommandRecognized?.(transcript)
      } else {
        console.log("❌ No command matched for:", transcript)
        onError?.(`Command "${transcript}" not recognized`)
      }
    }

    return recognition
  }, [isSupported, commands, onCommandRecognized, onError])

  // Start listening function
  const startListening = useCallback(async () => {
    if (!isSupported) {
      onError?.("Speech recognition not supported in this browser")
      return
    }

    if (isListening) {
      console.log("Already listening...")
      return
    }

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true })

      // Stop any existing recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }

      // Create new recognition instance
      const recognition = initializeRecognition()
      if (recognition) {
        recognitionRef.current = recognition
        recognition.start()
      }
    } catch (error) {
      console.error("Microphone access error:", error)
      onError?.("Microphone access denied. Please allow microphone permissions.")
    }
  }, [isSupported, isListening, initializeRecognition, onError])

  // Stop listening function
  const stopListening = useCallback(() => {
    console.log("🛑 Stopping voice recognition...")

    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    setIsListening(false)
  }, [])

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Add spacebar activation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only activate on spacebar if not typing in an input
      if (
        event.code === "Space" &&
        !isListening &&
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLTextAreaElement)
      ) {
        event.preventDefault()
        console.log("⌨️ Spacebar pressed - starting voice control")
        startListening()
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      // Stop on spacebar release
      if (event.code === "Space" && isListening) {
        event.preventDefault()
        console.log("⌨️ Spacebar released - stopping voice control")
        stopListening()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [isListening, startListening, stopListening])

  return {
    isListening,
    isSupported,
    transcript,
    confidence,
    error,
    toggleListening,
    startListening,
    stopListening,
  }
}
