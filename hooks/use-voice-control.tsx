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

  const recognitionRef = useRef<any>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isStartingRef = useRef(false)

  // Initialize SpeechRecognition
  useEffect(() => {
    if (typeof window === "undefined") return

    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognitionCtor) {
      setIsSupported(false)
      return
    }

    setIsSupported(true)
    const recognition = new SpeechRecognitionCtor()

    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = "en-US"
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      console.log("Voice recognition started")
      setIsListening(true)
      setTranscript("")
      setConfidence(0)
      isStartingRef.current = false
    }

    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1]
      const text = result[0].transcript.toLowerCase().trim()
      const conf = result[0].confidence || 0.8

      setTranscript(text)
      setConfidence(conf)

      if (result.isFinal && text.length > 0) {
        console.log("Final transcript:", text)

        // Find matching command
        const match = commands.find((cmd) => {
          const cmdLower = cmd.command.toLowerCase()
          return (
            text.includes(cmdLower) ||
            cmdLower.includes(text) ||
            text.split(" ").some((word) => cmdLower.includes(word))
          )
        })

        if (match && conf > 0.5) {
          console.log("Command matched:", match.command)
          match.action()
          onCommandRecognized?.(match.command)
        } else if (text.length > 1) {
          onError?.(
            `Command "${text}" not recognized. Try: ${commands
              .slice(0, 3)
              .map((c) => c.command)
              .join(", ")}`,
          )
        }
      }
    }

    recognition.onerror = (event: any) => {
      console.log("Speech recognition error:", event.error)
      setIsListening(false)
      isStartingRef.current = false

      switch (event.error) {
        case "not-allowed":
          onError?.("Microphone access denied. Please allow microphone permissions.")
          break
        case "no-speech":
          onError?.("No speech detected. Try speaking louder.")
          break
        case "aborted":
          // Don't show error for aborted - this is usually intentional
          break
        case "network":
          onError?.("Network error. Check your internet connection.")
          break
        default:
          onError?.(`Voice recognition error: ${event.error}`)
      }
    }

    recognition.onend = () => {
      console.log("Voice recognition ended")
      setIsListening(false)
      isStartingRef.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [commands, onCommandRecognized, onError])

  const startListening = useCallback(async () => {
    if (!recognitionRef.current || isListening || isStartingRef.current) return

    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true })

      isStartingRef.current = true
      recognitionRef.current.start()

      // Auto-stop after 8 seconds
      timeoutRef.current = setTimeout(() => {
        if (recognitionRef.current && isListening) {
          recognitionRef.current.stop()
        }
      }, 8000)
    } catch (error: any) {
      isStartingRef.current = false
      if (error.name === "NotAllowedError") {
        onError?.("Microphone access denied. Please allow microphone permissions and try again.")
      } else {
        onError?.("Could not access microphone. Please check your settings.")
      }
    }
  }, [isListening, onError])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && (isListening || isStartingRef.current)) {
      recognitionRef.current.stop()
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    isStartingRef.current = false
  }, [isListening])

  const toggleListening = useCallback(() => {
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
  }
}
