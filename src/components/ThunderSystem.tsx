'use client'

import { useEffect, useRef, useCallback } from 'react'

export default function ThunderSystem() {
  const containerRef = useRef<HTMLDivElement>(null)
  const lastThunderTime = useRef(0)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Create thunder sound using Web Audio API
  const createThunderSound = useCallback(() => {
    if (typeof window === 'undefined') return

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const ctx = audioContextRef.current

    // Create thunder rumble
    const bufferSize = ctx.sampleRate * 3 // 3 seconds
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)

    // Fill with brown noise (deeper than white noise)
    let lastOut = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      data[i] = (lastOut + (0.02 * white)) / 1.02
      lastOut = data[i]
      data[i] *= 3.5 // Gain
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    // Lowpass filter for rumble effect
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 200

    // Gain for envelope
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 3)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    noise.start()
    noise.stop(ctx.currentTime + 3)
  }, [])

  const triggerLightning = useCallback(() => {
    if (!containerRef.current) return

    // Create flash element
    const flash = document.createElement('div')
    flash.className = 'fixed inset-0 bg-white z-40 pointer-events-none'
    flash.style.opacity = '0.8'
    containerRef.current.appendChild(flash)

    // Play thunder sound
    createThunderSound()

    // Fade out quickly
    setTimeout(() => {
      flash.style.transition = 'opacity 100ms'
      flash.style.opacity = '0'
      setTimeout(() => flash.remove(), 100)
    }, 50)

    // Secondary flash
    setTimeout(() => {
      const flash2 = document.createElement('div')
      flash2.className = 'fixed inset-0 bg-white z-40 pointer-events-none'
      flash2.style.opacity = '0.4'
      containerRef.current?.appendChild(flash2)
      
      setTimeout(() => {
        flash2.style.transition = 'opacity 50ms'
        flash2.style.opacity = '0'
        setTimeout(() => flash2.remove(), 50)
      }, 50)
    }, 100)
  }, [createThunderSound])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      // Random interval between 8-20 seconds
      if (now - lastThunderTime.current > 8000 + Math.random() * 12000) {
        triggerLightning()
        lastThunderTime.current = now
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [triggerLightning])

  return <div ref={containerRef} />
}
