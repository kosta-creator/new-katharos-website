'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// Audio context for Web Audio API
let audioContext: AudioContext | null = null

export default function AmbientAudio() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true) // Start muted, let user enable
  const oscillatorsRef = useRef<OscillatorNode[]>([])
  const gainNodesRef = useRef<GainNode[]>([])
  const windGainRef = useRef<GainNode | null>(null)
  const fireGainRef = useRef<GainNode | null>(null)
  
  // Initialize audio on first user interaction (browser policy)
  const initAudio = useCallback(() => {
    if (audioContext) return
    
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // 1. Deep drone (temple ambiance)
      const droneOsc = audioContext.createOscillator()
      const droneGain = audioContext.createGain()
      droneOsc.type = 'sine'
      droneOsc.frequency.value = 60 // Low frequency
      droneGain.gain.value = 0.05
      droneOsc.connect(droneGain)
      droneGain.connect(audioContext.destination)
      droneOsc.start()
      
      oscillatorsRef.current.push(droneOsc)
      gainNodesRef.current.push(droneGain)
      
      // 2. Wind noise (using filtered white noise)
      const bufferSize = 2 * audioContext.sampleRate
      const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
      }
      
      const whiteNoise = audioContext.createBufferSource()
      whiteNoise.buffer = noiseBuffer
      whiteNoise.loop = true
      
      const windFilter = audioContext.createBiquadFilter()
      windFilter.type = 'lowpass'
      windFilter.frequency.value = 400
      
      windGainRef.current = audioContext.createGain()
      windGainRef.current.gain.value = 0.03
      
      whiteNoise.connect(windFilter)
      windFilter.connect(windGainRef.current)
      windGainRef.current.connect(audioContext.destination)
      whiteNoise.start()
      
      // 3. Fire crackle (occasional pops)
      const createCrackle = () => {
        if (!audioContext || isMuted) return
        
        const crackle = audioContext.createOscillator()
        const crackleGain = audioContext.createGain()
        
        crackle.type = 'sawtooth'
        crackle.frequency.value = 100 + Math.random() * 200
        
        crackleGain.gain.setValueAtTime(0.02, audioContext.currentTime)
        crackleGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1)
        
        crackle.connect(crackleGain)
        crackleGain.connect(audioContext.destination)
        
        crackle.start()
        crackle.stop(audioContext.currentTime + 0.1)
        
        // Schedule next crackle
        setTimeout(createCrackle, 500 + Math.random() * 2000)
      }
      
      fireGainRef.current = audioContext.createGain()
      fireGainRef.current.gain.value = 1
      createCrackle()
      
      setIsPlaying(true)
      setIsMuted(false)
    } catch (e) {
      console.error('Audio init failed:', e)
    }
  }, [isMuted])
  
  // Start audio on first interaction
  useEffect(() => {
    const handleInteraction = () => {
      if (!isPlaying) {
        initAudio()
      }
    }
    
    window.addEventListener('click', handleInteraction, { once: true })
    window.addEventListener('scroll', handleInteraction, { once: true })
    window.addEventListener('touchstart', handleInteraction, { once: true })
    
    return () => {
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('scroll', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
    }
  }, [initAudio, isPlaying])
  
  // Adjust volume based on scroll (wind gets louder as we climb)
  useEffect(() => {
    if (!windGainRef.current || !audioContext) return
    
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      // Wind gets louder as we scroll up
      if (windGainRef.current) {
        windGainRef.current.gain.setTargetAtTime(
          0.02 + scrollPercent * 0.04,
          audioContext.currentTime,
          0.5
        )
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Toggle mute
  const toggleMute = () => {
    if (!audioContext) return
    
    const newMuted = !isMuted
    setIsMuted(newMuted)
    
    gainNodesRef.current.forEach(gain => {
      gain.gain.setTargetAtTime(newMuted ? 0 : 0.05, audioContext.currentTime, 0.3)
    })
    
    if (windGainRef.current) {
      windGainRef.current.gain.setTargetAtTime(newMuted ? 0 : 0.03, audioContext.currentTime, 0.3)
    }
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleMute}
        className="w-12 h-12 rounded-full bg-[#1A1A2E] border border-[#C9A84C] flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#050508] transition-all"
        title={isMuted ? 'Unmute temple sounds' : 'Mute'}
      >
        {isMuted ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>
    </div>
  )
}
