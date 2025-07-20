"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type SpeechRecognition from "speech-recognition"

interface VoiceCommand {
  phrases: string[]
  action: () => void
  description: string
}

interface UseVoiceControlProps {
  commands: VoiceCommand[]
  onCommandRecognized?: (command: string) => void
  onError?: (error: string) => void
}

export function useVoiceControl({ commands, onCommandRecognized, onError }: UseVoiceControlProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState("")
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        setIsSupported(true)
        const recognition = new SpeechRecognition()

        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = "en-US"
        recognition.maxAlternatives = 1

        recognition.onstart = () => {
          console.log("🎤 Voice recognition started")
          setIsListening(true)
          setTranscript("")
        }

        recognition.onresult = (event) => {
          let finalTranscript = ""
          let interimTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          const currentTranscript = finalTranscript || interimTranscript
          setTranscript(currentTranscript)

          if (finalTranscript) {
            console.log("🗣️ Final transcript:", finalTranscript)
            processCommand(finalTranscript.toLowerCase().trim())
          }
        }

        recognition.onerror = (event) => {
          console.error("❌ Speech recognition error:", event.error)
          setIsListening(false)

          let errorMessage = "Voice recognition error"
          switch (event.error) {
            case "no-speech":
              errorMessage = "No speech detected. Please try again."
              break
            case "audio-capture":
              errorMessage = "Microphone not accessible. Please check permissions."
              break
            case "not-allowed":
              errorMessage = "Microphone permission denied. Please enable microphone access."
              break
            case "network":
              errorMessage = "Network error. Please check your connection."
              break
            default:
              errorMessage = `Speech recognition error: ${event.error}`
          }

          onError?.(errorMessage)
        }

        recognition.onend = () => {
          console.log("🔇 Voice recognition ended")
          setIsListening(false)
        }

        recognitionRef.current = recognition
      } else {
        console.warn("⚠️ Speech recognition not supported in this browser")
        setIsSupported(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [onError])

  const processCommand = useCallback(
    (spokenText: string) => {
      console.log("🔍 Processing command:", spokenText)

      // Find matching command
      const matchedCommand = commands.find((command) =>
        command.phrases.some((phrase) => {
          const similarity = calculateSimilarity(spokenText, phrase.toLowerCase())
          console.log(`Comparing "${spokenText}" with "${phrase}": ${similarity}`)
          return similarity > 0.7 // 70% similarity threshold
        }),
      )

      if (matchedCommand) {
        console.log("✅ Command matched:", matchedCommand.description)
        matchedCommand.action()
        onCommandRecognized?.(spokenText)
      } else {
        console.log("❌ No command matched")
        onError?.(`Command "${spokenText}" not recognized. Try saying "help" for available commands.`)
      }
    },
    [commands, onCommandRecognized, onError],
  )

  // Calculate string similarity using Levenshtein distance
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1

    if (longer.length === 0) return 1.0

    const distance = levenshteinDistance(longer, shorter)
    return (longer.length - distance) / longer.length
  }

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = []

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        }
      }
    }

    return matrix[str2.length][str1.length]
  }

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start()

        // Auto-stop after 10 seconds
        timeoutRef.current = setTimeout(() => {
          if (recognitionRef.current && isListening) {
            recognitionRef.current.stop()
          }
        }, 10000)
      } catch (error) {
        console.error("Error starting recognition:", error)
        onError?.("Failed to start voice recognition")
      }
    }
  }, [isListening, onError])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isListening])

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}
