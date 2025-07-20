"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { SpeechRecognition } from "web-speech-api"

/**
 * VoiceCommand
 * ─────────────
 * command      – the phrase to match (lower-case)
 * action       – callback executed when phrase matches
 * description  – short help string
 */
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

/**
 * useVoiceControl
 * A thin wrapper around the native Web Speech API (no external package).
 */
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

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // ─── Initialise SpeechRecognition ─────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return

    const SpeechRecognitionCtor =
      // Safari (webkit) + other browsers
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognitionCtor) {
      setIsSupported(false)
      return
    }

    setIsSupported(true)
    const recognition: SpeechRecognition = new SpeechRecognitionCtor()
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
      const text = result[0].transcript.toLowerCase().trim()
      const conf = result[0].confidence
      setTranscript(text)
      setConfidence(conf)

      if (result.isFinal) {
        const match = commands.find((cmd) => text.includes(cmd.command) || cmd.command.includes(text))

        if (match && conf > 0.6) {
          match.action()
          onCommandRecognized?.(match.command)
        } else {
          onError?.(`Unrecognised command: "${text}"`)
        }

        stopListening()
      }
    }

    recognition.onerror = (e) => {
      onError?.(e.error)
      stopListening()
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      recognitionRef.current?.abort()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commands])

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return
    try {
      recognitionRef.current.start()
      timeoutRef.current = setTimeout(stopListening, 5000) // auto-stop
    } catch {
      /* ignored – .start() can throw if called too quickly */
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }, [])

  const toggleListening = useCallback(() => {
    isListening ? stopListening() : startListening()
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
