"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export interface VoiceCommand {
  command: string
  action: () => void
  description: string
}

export interface UseVoiceControlReturn {
  isListening: boolean
  isSupported: boolean
  transcript: string
  confidence: number
  startListening: () => void
  stopListening: () => void
  toggleListening: () => void
  error: string | null
}

export function useVoiceControl({
  commands,
  onCommandRecognized,
  onError,
}: {
  commands: VoiceCommand[]
  onCommandRecognized?: (cmd: string) => void
  onError?: (err: string) => void
}): UseVoiceControlReturn {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<any>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isInitializedRef = useRef(false)
  const isStartingRef = useRef(false)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === "undefined") return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      console.log("Speech Recognition not supported")
      setIsSupported(false)
      setError("Speech recognition not supported in this browser")
      return
    }

    console.log("Initializing Speech Recognition...")
    setIsSupported(true)
    setError(null)

    // Create new recognition instance
    const recognition = new SpeechRecognition()

    // Configure recognition
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = "en-US"
    recognition.maxAlternatives = 1

    // Event handlers
    recognition.onstart = () => {
      console.log("✅ Speech recognition started")
      setIsListening(true)
      setTranscript("")
      setConfidence(0)
      setError(null)
      isStartingRef.current = false
    }

    recognition.onresult = (event: any) => {
      console.log("📝 Speech result received", event)

      if (event.results && event.results.length > 0) {
        const result = event.results[event.results.length - 1]
        const spokenText = result[0].transcript.toLowerCase().trim()
        const confidenceScore = result[0].confidence || 0.8

        console.log(`🎤 "${spokenText}" (confidence: ${Math.round(confidenceScore * 100)}%)`)

        setTranscript(spokenText)
        setConfidence(confidenceScore)

        // Process final results only
        if (result.isFinal && spokenText.length > 0) {
          console.log("🔍 Processing final transcript:", spokenText)

          // Find matching command with flexible matching
          const matchedCommand = commands.find((cmd) => {
            const cmdWords = cmd.command.toLowerCase().split(" ")
            const spokenWords = spokenText.split(" ")

            // Exact match
            if (spokenText === cmd.command.toLowerCase()) return true

            // Contains match
            if (spokenText.includes(cmd.command.toLowerCase())) return true
            if (cmd.command.toLowerCase().includes(spokenText)) return true

            // Word overlap match (at least 50% of command words)
            const overlap = cmdWords.filter((word) => spokenWords.includes(word)).length
            return overlap >= Math.ceil(cmdWords.length * 0.5)
          })

          if (matchedCommand && confidenceScore > 0.3) {
            console.log("✅ Command matched:", matchedCommand.command)
            try {
              matchedCommand.action()
              onCommandRecognized?.(matchedCommand.command)
            } catch (err) {
              console.error("❌ Error executing command:", err)
              onError?.("Failed to execute command")
            }
          } else if (spokenText.length > 2) {
            console.log("❌ No command matched for:", spokenText)
            const suggestions = commands
              .slice(0, 3)
              .map((c) => `"${c.command}"`)
              .join(", ")
            onError?.(`Command "${spokenText}" not recognized. Try: ${suggestions}`)
          }
        }
      }
    }

    recognition.onerror = (event: any) => {
      console.error("❌ Speech recognition error:", event.error, event)

      setIsListening(false)
      isStartingRef.current = false

      let errorMessage = ""

      switch (event.error) {
        case "not-allowed":
          errorMessage = "🚫 Microphone access denied. Please allow microphone permissions."
          break
        case "no-speech":
          errorMessage = "🔇 No speech detected. Please speak clearly and try again."
          break
        case "aborted":
          errorMessage = "⏹️ Speech recognition was stopped. Click the microphone to try again."
          break
        case "audio-capture":
          errorMessage = "🎤 No microphone found. Please check your microphone."
          break
        case "network":
          errorMessage = "🌐 Network error. Please check your internet connection."
          break
        case "service-not-allowed":
          errorMessage = "🔒 Speech service not allowed. Please check browser settings."
          break
        default:
          errorMessage = `❌ Speech error: ${event.error}`
      }

      setError(errorMessage)
      onError?.(errorMessage)
    }

    recognition.onend = () => {
      console.log("🔚 Speech recognition ended")
      setIsListening(false)
      isStartingRef.current = false

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }

    recognitionRef.current = recognition
    isInitializedRef.current = true

    console.log("🎯 Speech Recognition initialized successfully")

    return () => {
      console.log("🧹 Cleaning up speech recognition")
      isInitializedRef.current = false
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (err) {
          console.log("Error during cleanup:", err)
        }
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [commands, onCommandRecognized, onError])

  const startListening = useCallback(async () => {
    console.log("🚀 Attempting to start listening...")

    if (!isInitializedRef.current || !recognitionRef.current) {
      console.error("❌ Recognition not initialized")
      setError("Speech recognition not ready. Please refresh the page.")
      return
    }

    if (isListening || isStartingRef.current) {
      console.log("⚠️ Already listening or starting")
      return
    }

    try {
      // Clear any previous errors
      setError(null)
      isStartingRef.current = true

      // Request microphone permission first
      console.log("🎤 Requesting microphone permission...")
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      console.log("✅ Microphone permission granted")

      // Stop the stream immediately (we just needed permission)
      stream.getTracks().forEach((track) => track.stop())

      // Small delay to ensure clean state
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Start recognition
      console.log("🎯 Starting speech recognition...")
      recognitionRef.current.start()

      // Set auto-stop timeout
      timeoutRef.current = setTimeout(() => {
        console.log("⏰ Auto-stopping recognition after 10 seconds")
        if (recognitionRef.current && isListening) {
          recognitionRef.current.stop()
        }
      }, 10000)
    } catch (error: any) {
      console.error("❌ Failed to start speech recognition:", error)
      isStartingRef.current = false

      let errorMessage = ""

      if (error.name === "NotAllowedError") {
        errorMessage = "🚫 Microphone access denied. Please allow microphone permissions and try again."
      } else if (error.name === "NotFoundError") {
        errorMessage = "🎤 No microphone found. Please connect a microphone and try again."
      } else if (error.name === "NotReadableError") {
        errorMessage = "🔒 Microphone is being used by another application."
      } else if (error.name === "InvalidStateError") {
        errorMessage = "⚠️ Speech recognition is already running. Please wait and try again."
      } else {
        errorMessage = `❌ Failed to start: ${error.message || error.name || "Unknown error"}`
      }

      setError(errorMessage)
      onError?.(errorMessage)
    }
  }, [isListening, onError])

  const stopListening = useCallback(() => {
    console.log("⏹️ Stopping speech recognition...")

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    if (recognitionRef.current && (isListening || isStartingRef.current)) {
      try {
        recognitionRef.current.stop()
      } catch (err) {
        console.log("Error stopping recognition:", err)
      }
    }

    isStartingRef.current = false
    setError(null)
  }, [isListening])

  const toggleListening = useCallback(() => {
    console.log("🔄 Toggling listening state. Current:", isListening)

    if (isListening || isStartingRef.current) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  return {
    isListening,
    isSupported,
    transcript,
    confidence,
    startListening,
    stopListening,
    toggleListening,
    error,
  }
}
