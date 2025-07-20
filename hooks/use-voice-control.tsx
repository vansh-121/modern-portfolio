"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { VoiceCommand } from "@/lib/voice-commands"
import SpeechRecognition from "speech-recognition"

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

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Check browser support
  useEffect(() => {
    const supported = !!SpeechRecognition
    setIsSupported(supported)

    console.log("🎤 Speech recognition supported:", supported)

    if (!supported) {
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

  // Start listening function
  const startListening = useCallback(() => {
    if (!isSupported) {
      console.log("❌ Cannot start - not supported")
      return
    }

    if (isListening) {
      console.log("⚠️ Already listening")
      return
    }

    try {
      console.log("🎤 Starting voice recognition...")

      const recognition = new SpeechRecognition()

      // Configure recognition
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = "en-US"
      recognition.maxAlternatives = 1

      // Event handlers
      recognition.onstart = () => {
        console.log("🎤 Recognition started")
        setIsListening(true)
        setError(null)
        setTranscript("")
        setConfidence(0)
      }

      recognition.onresult = (event) => {
        console.log("📝 Recognition result event:", event)

        let finalTranscript = ""
        let interimTranscript = ""
        let maxConfidence = 0

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          const transcript = result[0].transcript
          const confidence = result[0].confidence || 0

          if (result.isFinal) {
            finalTranscript += transcript
            maxConfidence = Math.max(maxConfidence, confidence)
          } else {
            interimTranscript += transcript
          }
        }

        const currentTranscript = finalTranscript || interimTranscript
        setTranscript(currentTranscript)
        setConfidence(maxConfidence || 0.5)

        console.log("📝 Transcript:", currentTranscript, "Confidence:", maxConfidence)

        // Process final results
        if (finalTranscript) {
          const matchingCommand = findMatchingCommand(finalTranscript)
          if (matchingCommand) {
            console.log("🎯 Executing command:", finalTranscript)
            matchingCommand.action()
            onCommandRecognized?.(finalTranscript)
          } else {
            console.log("❓ No command found for:", finalTranscript)
            onError?.(`No command found for: "${finalTranscript}"`)
          }
        }
      }

      recognition.onerror = (event) => {
        console.error("🚨 Recognition error:", event.error)
        let errorMessage = "Voice recognition error"

        switch (event.error) {
          case "not-allowed":
            errorMessage = "Microphone access denied. Please allow microphone permissions."
            break
          case "no-speech":
            errorMessage = "No speech detected. Please try again."
            break
          case "network":
            errorMessage = "Network error. Please check your connection."
            break
          case "aborted":
            errorMessage = "Recognition was aborted."
            break
          default:
            errorMessage = `Recognition error: ${event.error}`
        }

        setError(errorMessage)
        onError?.(errorMessage)
        setIsListening(false)
      }

      recognition.onend = () => {
        console.log("🎤 Recognition ended")
        setIsListening(false)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }

      // Start recognition
      recognition.start()
      recognitionRef.current = recognition

      // Auto-stop after 10 seconds
      timeoutRef.current = setTimeout(() => {
        if (recognitionRef.current && isListening) {
          console.log("⏰ Auto-stopping recognition after timeout")
          recognitionRef.current.stop()
        }
      }, 10000)
    } catch (err) {
      console.error("🚨 Failed to start recognition:", err)
      setError("Failed to start voice recognition")
      onError?.("Failed to start voice recognition")
      setIsListening(false)
    }
  }, [isSupported, isListening, findMatchingCommand, onCommandRecognized, onError])

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
