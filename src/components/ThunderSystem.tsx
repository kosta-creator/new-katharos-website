'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

interface Flash {
  id: number
  opacity: number
  isSecondary: boolean
}

export default function ThunderSystem() {
  const [flashes, setFlashes] = useState<Flash[]>([])
  const lastThunderTime = useRef(Date.now())
  const audioContextRef = useRef<AudioContext | null>(null)
  const isActiveRef = useRef(true)
  const flashIdRef = useRef(0)

  const createThunderSound = useCallback(() => {
    if (typeof window === 'undefined') return

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }

      const ctx = audioContextRef.current
      
      // Resume if suspended (browser policy)
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const bufferSize = ctx.sampleRate * 2.5
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)

      let lastOut = 0
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        data[i] = (lastOut + (0.02 * white)) / 1.02
        lastOut = data[i]
        data[i] *= 3
      }

      const noise = ctx.createBufferSource()
      noise.buffer = buffer

      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 180
      filter.Q.value = 0.5

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.25, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.5)

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      noise.start()
      noise.stop(ctx.currentTime + 2.5)
    } catch (err) {
      console.warn('Audio error:', err)
    }
  }, [])

  const triggerLightning = useCallback(() => {
    if (!isActiveRef.current) return
    
    const id = flashIdRef.current++
    
    // Primary flash
    setFlashes(prev => [...prev, { id, opacity: 0.8, isSecondary: false }])
    createThunderSound()
    
    // Fade primary
    setTimeout(() => {
      setFlashes(prev => prev.filter(f => f.id !== id))
    }, 150)
    
    // Secondary flash
    setTimeout(() => {
      if (!isActiveRef.current) return
      const id2 = flashIdRef.current++
      setFlashes(prev => [...prev, { id: id2, opacity: 0.35, isSecondary: true }])
      
      setTimeout(() => {
        setFlashes(prev => prev.filter(f => f.id !== id2))
      }, 100)
    }, 120)
    
    lastThunderTime.current = Date.now()
  }, [createThunderSound])

  useEffect(() => {
    isActiveRef.current = true
    
    const interval = setInterval(() => {
      const now = Date.now()
      const elapsed = now - lastThunderTime.current
      const nextThunderDelay = 8000 + Math.random() * 15000
      
      if (elapsed > nextThunderDelay) {
        triggerLightning()
      }
    }, 1000)

    return () => {
      isActiveRef.current = false
      clearInterval(interval)
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {})
      }
    }
  }, [triggerLightning])

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {flashes.map(flash => (
        <div
          key={flash.id}
          className="absolute inset-0 bg-white"
          style={{
            opacity: flash.opacity,
            transition: flash.isSecondary ? 'opacity 50ms' : 'opacity 100ms',
          }}
        />
      ))}
    </div>
  )
}
