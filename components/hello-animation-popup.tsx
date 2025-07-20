"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HelloAnimationPopupProps {
  isVisible: boolean
  onClose: () => void
}

const GREETINGS = [
  { text: "Hello", color: "text-blue-600" },
  { text: "Hola", color: "text-rose-600" },
  { text: "Namaste", color: "text-emerald-600" },
  { text: "Bonjour", color: "text-fuchsia-600" },
  { text: "こんにちは", color: "text-indigo-600" },
  { text: "Hallo", color: "text-orange-600" },
  { text: "Ciao", color: "text-teal-600" },
  { text: "Olá", color: "text-yellow-500" },
]

export function HelloAnimationPopup({ isVisible, onClose }: HelloAnimationPopupProps) {
  const [index, setIndex] = useState(0)

  // Cycle through greetings every 1.2 s
  useEffect(() => {
    if (!isVisible) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % GREETINGS.length)
    }, 1200)
    return () => clearInterval(id)
  }, [isVisible])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="hello-popup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          {/* Close button */}
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            aria-label="Close greeting animation"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Animated greeting */}
          <motion.div
            key={index}
            initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: 15 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="text-5xl md:text-7xl font-bold select-none"
          >
            <span className={GREETINGS[index].color}>{GREETINGS[index].text}</span>
          </motion.div>

          {/* Progress dots */}
          <div className="absolute bottom-10 flex gap-2">
            {GREETINGS.map((_, i) => (
              <span key={i} className={`h-2 w-2 rounded-full ${i === index ? "bg-white" : "bg-white/30"}`} />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
