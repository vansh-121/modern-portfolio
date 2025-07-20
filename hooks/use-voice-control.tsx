"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import SpeechRecognition from "speech-recognition"

interface VoiceCommand {
  command: string
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
  const [confidence, setConfidence] = useState(0)
  const recognitionRef = useRef<any | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Check if speech recognition is supported
    setIsSupported(!!SpeechRecognition)

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = "en-US"
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setIsListening(true)
        setTranscript("")
        setConfidence(0)
      }

      recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1]
        const transcript = result[0].transcript.toLowerCase().trim()
        const confidence = result[0].confidence

        setTranscript(transcript)
        setConfidence(confidence)

        if (result.isFinal) {
          // Find matching command
          const matchedCommand = commands.find(
            (cmd) => transcript.includes(cmd.command.toLowerCase()) || cmd.command.toLowerCase().includes(transcript),
          )

          if (matchedCommand && confidence > 0.7) {
            matchedCommand.action()
            onCommandRecognized?.(matchedCommand.command)
          } else if (transcript.length > 0) {
            onError?.(`Command "${transcript}" not recognized`)
          }

          setIsListening(false)
        }
      }

      recognition.onerror = (event) => {
        setIsListening(false)
        onError?.(event.error)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [commands, onCommandRecognized, onError])

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start()
        // Auto-stop after 5 seconds
        timeoutRef.current = setTimeout(() => {
          stopListening()
        }, 5000)
      } catch (error) {
        onError?.("Failed to start voice recognition")
      }
    }
  }, [isListening, onError])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [isListening])

  const toggleListening = useCallback(() => {
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
  }
}
