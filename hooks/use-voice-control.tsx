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

  // Check browser support
  useEffect(() => {
    if (typeof window === "undefined") return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      console.log("❌ Speech Recognition not supported")
      setIsSupported(false)
      setError("Speech recognition not supported in this browser")
      return
    }

    console.log("✅ Speech Recognition supported")
    setIsSupported(true)
    setError(null)

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (e) {
          console.log("Cleanup error:", e)
        }
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const startListening = useCallback(async () => {
    console.log("🎤 Starting voice recognition...")

    if (!isSupported) {
      console.log("❌ Speech recognition not supported")
      return
    }

    if (isListening) {
      console.log("⚠️ Already listening")
      return
    }

    try {
      // Request microphone permission
      console.log("🔐 Requesting microphone permission...")
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      console.log("✅ Microphone permission granted")

      // Stop the stream immediately
      stream.getTracks().forEach((track) => track.stop())

      // Create fresh recognition instance
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = "en-US"
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        console.log("🎯 Recognition started")
        setIsListening(true)
        setTranscript("")
        setConfidence(0)
        setError(null)
      }

      recognition.onresult = (event: any) => {
        console.log("📝 Got speech result")

        if (event.results && event.results.length > 0) {
          const result = event.results[event.results.length - 1]
          const text = result[0].transcript.toLowerCase().trim()
          const conf = result[0].confidence || 0.8

          console.log(`🗣️ "${text}" (${Math.round(conf * 100)}%)`)

          setTranscript(text)
          setConfidence(conf)

          if (result.isFinal && text.length > 0) {
            console.log("🔍 Processing final result:", text)

            // Find matching command
            const match = commands.find((cmd) => {
              const cmdLower = cmd.command.toLowerCase()
              return text.includes(cmdLower) || cmdLower.includes(text)
            })

            if (match) {
              console.log("✅ Command matched:", match.command)
              try {
                match.action()
                onCommandRecognized?.(match.command)
              } catch (err) {
                console.error("❌ Command execution error:", err)
              }
            } else {
              console.log("❌ No command matched")
              onError?.(`Command "${text}" not recognized. Try: hello, open projects, about me`)
            }
          }
        }
      }

      recognition.onerror = (event: any) => {
        console.error("❌ Speech error:", event.error)
        setIsListening(false)

        let errorMsg = ""
        switch (event.error) {
          case "not-allowed":
            errorMsg = "Microphone access denied"
            break
          case "no-speech":
            errorMsg = "No speech detected"
            break
          case "aborted":
            errorMsg = "Recognition aborted"
            break
          default:
            errorMsg = `Speech error: ${event.error}`
        }

        setError(errorMsg)
        onError?.(errorMsg)
      }

      recognition.onend = () => {
        console.log("🔚 Recognition ended")
        setIsListening(false)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }

      recognitionRef.current = recognition

      // Start recognition
      console.log("🚀 Starting recognition...")
      recognition.start()

      // Auto-stop after 8 seconds
      timeoutRef.current = setTimeout(() => {
        console.log("⏰ Auto-stopping recognition")
        if (recognition) {
          recognition.stop()
        }
      }, 8000)
    } catch (error: any) {
      console.error("❌ Failed to start:", error)
      setIsListening(false)

      let errorMsg = ""
      if (error.name === "NotAllowedError") {
        errorMsg = "Microphone access denied"
      } else if (error.name === "NotFoundError") {
        errorMsg = "No microphone found"
      } else {
        errorMsg = `Failed to start: ${error.message}`
      }

      setError(errorMsg)
      onError?.(errorMsg)
    }
  }, [isSupported, isListening, commands, onCommandRecognized, onError])

  const stopListening = useCallback(() => {
    console.log("⏹️ Stopping recognition...")

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) {
        console.log("Stop error:", e)
      }
    }

    setIsListening(false)
    setError(null)
  }, [])

  const toggleListening = useCallback(() => {
    console.log("🔄 Toggle listening, current:", isListening)
    if (isListening) {
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
