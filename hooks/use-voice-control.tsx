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
  const isInitializingRef = useRef(false)

  // Check browser support and initialize
  useEffect(() => {
    if (typeof window === "undefined") return

    // Check for Speech Recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      console.log("Speech Recognition not supported in this browser")
      setIsSupported(false)
      setError("Speech recognition not supported in this browser")
      return
    }

    console.log("Speech Recognition is supported")
    setIsSupported(true)
    setError(null)

    // Create recognition instance
    const recognition = new SpeechRecognition()

    // Configure recognition settings
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = "en-US"
    recognition.maxAlternatives = 1

    // Event handlers
    recognition.onstart = () => {
      console.log("Speech recognition started successfully")
      setIsListening(true)
      setTranscript("")
      setConfidence(0)
      setError(null)
      isInitializingRef.current = false
    }

    recognition.onresult = (event: any) => {
      console.log("Speech recognition result received")

      if (event.results && event.results.length > 0) {
        const result = event.results[event.results.length - 1]
        const transcript = result[0].transcript.toLowerCase().trim()
        const confidence = result[0].confidence || 0.8

        console.log("Transcript:", transcript, "Confidence:", confidence)

        setTranscript(transcript)
        setConfidence(confidence)

        // Process final results
        if (result.isFinal && transcript.length > 0) {
          console.log("Processing final transcript:", transcript)

          // Find matching command
          const matchedCommand = commands.find((cmd) => {
            const cmdLower = cmd.command.toLowerCase()
            return (
              transcript.includes(cmdLower) ||
              cmdLower.includes(transcript) ||
              transcript.split(" ").some((word) => cmdLower.includes(word) && word.length > 2)
            )
          })

          if (matchedCommand && confidence > 0.4) {
            console.log("Command matched:", matchedCommand.command)
            try {
              matchedCommand.action()
              onCommandRecognized?.(matchedCommand.command)
            } catch (err) {
              console.error("Error executing command:", err)
            }
          } else if (transcript.length > 2) {
            const errorMsg = `Command "${transcript}" not recognized. Try: ${commands
              .slice(0, 3)
              .map((c) => c.command)
              .join(", ")}`
            console.log(errorMsg)
            onError?.(errorMsg)
          }
        }
      }
    }

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error, event)

      setIsListening(false)
      isInitializingRef.current = false

      let errorMessage = ""

      switch (event.error) {
        case "not-allowed":
          errorMessage = "Microphone access denied. Please allow microphone permissions in your browser settings."
          break
        case "no-speech":
          errorMessage = "No speech detected. Please try speaking more clearly."
          break
        case "aborted":
          errorMessage = "Speech recognition was aborted. Please try again."
          break
        case "audio-capture":
          errorMessage = "No microphone found. Please check your microphone connection."
          break
        case "network":
          errorMessage = "Network error occurred. Please check your internet connection."
          break
        case "service-not-allowed":
          errorMessage = "Speech recognition service not allowed. Please check browser permissions."
          break
        default:
          errorMessage = `Speech recognition error: ${event.error}`
      }

      setError(errorMessage)
      onError?.(errorMessage)
    }

    recognition.onend = () => {
      console.log("Speech recognition ended")
      setIsListening(false)
      isInitializingRef.current = false

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }

    recognitionRef.current = recognition

    return () => {
      console.log("Cleaning up speech recognition")
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (err) {
          console.log("Error aborting recognition:", err)
        }
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [commands, onCommandRecognized, onError])

  const startListening = useCallback(async () => {
    console.log("Attempting to start listening...")

    if (!recognitionRef.current) {
      console.error("Recognition not initialized")
      setError("Speech recognition not initialized")
      return
    }

    if (isListening || isInitializingRef.current) {
      console.log("Already listening or initializing")
      return
    }

    try {
      // Clear any previous errors
      setError(null)

      // Request microphone permission explicitly
      console.log("Requesting microphone permission...")
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      console.log("Microphone permission granted")

      // Stop the stream immediately as we just needed permission
      stream.getTracks().forEach((track) => track.stop())

      // Set initializing flag
      isInitializingRef.current = true

      // Start recognition
      console.log("Starting speech recognition...")
      recognitionRef.current.start()

      // Set timeout to auto-stop after 10 seconds
      timeoutRef.current = setTimeout(() => {
        console.log("Auto-stopping recognition after timeout")
        if (recognitionRef.current && isListening) {
          recognitionRef.current.stop()
        }
      }, 10000)
    } catch (error: any) {
      console.error("Error starting speech recognition:", error)
      isInitializingRef.current = false

      let errorMessage = ""

      if (error.name === "NotAllowedError") {
        errorMessage = "Microphone access denied. Please allow microphone permissions and try again."
      } else if (error.name === "NotFoundError") {
        errorMessage = "No microphone found. Please connect a microphone and try again."
      } else if (error.name === "NotReadableError") {
        errorMessage = "Microphone is being used by another application. Please close other apps and try again."
      } else {
        errorMessage = `Failed to access microphone: ${error.message || error.name || "Unknown error"}`
      }

      setError(errorMessage)
      onError?.(errorMessage)
    }
  }, [isListening, onError])

  const stopListening = useCallback(() => {
    console.log("Stopping speech recognition...")

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    if (recognitionRef.current && (isListening || isInitializingRef.current)) {
      try {
        recognitionRef.current.stop()
      } catch (err) {
        console.log("Error stopping recognition:", err)
      }
    }

    isInitializingRef.current = false
    setError(null)
  }, [isListening])

  const toggleListening = useCallback(() => {
    console.log("Toggling listening state. Current:", isListening)

    if (isListening || isInitializingRef.current) {
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
