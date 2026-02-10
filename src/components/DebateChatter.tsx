'use client'

import { useEffect, useRef, useCallback } from 'react'

// Create synthetic debate chatter using Web Audio API
function createChatterSound(audioContext: AudioContext, frequency: number, duration: number) {
  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()
  const filter = audioContext.createBiquadFilter()
  
  // Multiple oscillators for vocal-like quality
  const osc2 = audioContext.createOscillator()
  const gain2 = audioContext.createGain()
  
  // Main voice
  oscillator.type = 'sawtooth'
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.8, audioContext.currentTime + duration * 0.8)
  
  // Formant filter (makes it sound vocal)
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(800, audioContext.currentTime)
  filter.Q.setValueAtTime(5, audioContext.currentTime)
  
  // Envelope
  gain.gain.setValueAtTime(0, audioContext.currentTime)
  gain.gain.linearRampToValueAtTime(0.03, audioContext.currentTime + 0.05)
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
  
  // Secondary voice (harmonic)
  osc2.type = 'sine'
  osc2.frequency.setValueAtTime(frequency * 1.5, audioContext.currentTime)
  gain2.gain.setValueAtTime(0, audioContext.currentTime)
  gain2.gain.linearRampToValueAtTime(0.02, audioContext.currentTime + 0.03)
  gain2.gain.exponentialRampToValueAtTime(0.005, audioContext.currentTime + duration)
  
  // Connect
  oscillator.connect(filter)
  filter.connect(gain)
  gain.connect(audioContext.destination)
  
  osc2.connect(gain2)
  gain2.connect(audioContext.destination)
  
  // Start/stop
  oscillator.start()
  osc2.start()
  oscillator.stop(audioContext.currentTime + duration)
  osc2.stop(audioContext.currentTime + duration)
}

// Different "phrases" for debate stages
const debatePhrases = [
  { freq: 150, duration: 0.4, pause: 0.3 }, // Short statement
  { freq: 120, duration: 0.6, pause: 0.2 }, // Longer argument
  { freq: 180, duration: 0.3, pause: 0.4 }, // Quick interjection
  { freq: 100, duration: 0.5, pause: 0.3 }, // Deep response
  { freq: 200, duration: 0.35, pause: 0.25 }, // High pitch counter
]

export function useDebateChatter() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const isActiveRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  
  const startChatter = useCallback(() => {
    if (typeof window === 'undefined') return
    
    // Initialize audio context
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    
    isActiveRef.current = true
    
    const scheduleNext = () => {
      if (!isActiveRef.current || !audioContextRef.current) return
      
      // Pick random phrase
      const phrase = debatePhrases[Math.floor(Math.random() * debatePhrases.length)]
      
      // Create chatter sound
      createChatterSound(
        audioContextRef.current,
        phrase.freq + (Math.random() - 0.5) * 40, // Slight variation
        phrase.duration
      )
      
      // Schedule next phrase (overlapping for busy debate feel)
      const nextDelay = phrase.pause * 1000 + Math.random() * 500
      timeoutRef.current = setTimeout(scheduleNext, nextDelay)
    }
    
    // Start multiple overlapping voices (7 philosophers debating)
    for (let i = 0; i < 3; i++) {
      setTimeout(scheduleNext, i * 200)
    }
  }, [])
  
  const stopChatter = useCallback(() => {
    isActiveRef.current = false
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])
  
  useEffect(() => {
    return () => {
      stopChatter()
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close()
      }
    }
  }, [stopChatter])
  
  return { startChatter, stopChatter }
}

// Component for Dojo section debate sounds
export default function DebateChatter() {
  const { startChatter, stopChatter } = useDebateChatter()
  
  useEffect(() => {
    // Use IntersectionObserver to detect when Dojo is visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startChatter()
          } else {
            stopChatter()
          }
        })
      },
      { threshold: 0.3 }
    )
    
    // Observe Dojo section
    const dojoSection = document.querySelector('.dojo-content')
    if (dojoSection) {
      observer.observe(dojoSection)
    }
    
    return () => {
      observer.disconnect()
      stopChatter()
    }
  }, [startChatter, stopChatter])
  
  return null // No visual component, just audio
}
