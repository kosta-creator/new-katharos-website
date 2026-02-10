'use client'

import { useRef, useMemo, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface RainSystemProps {
  intensity?: number // 0-1, controls rain density
}

export default function RainSystem({ intensity = 0.5 }: RainSystemProps) {
  const rainRef = useRef<THREE.Points>(null)
  const lightningRef = useRef<THREE.PointLight>(null)
  const lastLightningTime = useRef(0)
  const isFlashing = useRef(false)
  
  // Rain particle count based on intensity
  const count = Math.floor(3000 * intensity)
  
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      // Spread rain across wide area
      positions[i * 3] = (Math.random() - 0.5) * 40 // x
      positions[i * 3 + 1] = Math.random() * 30 // y (start high)
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40 // z
      
      velocities[i] = 0.5 + Math.random() * 0.5 // fall speed
    }
    
    return { positions, velocities }
  }, [count])
  
  // Lightning flash
  const triggerLightning = useCallback(() => {
    if (!lightningRef.current || isFlashing.current) return
    
    isFlashing.current = true
    
    // Flash on
    lightningRef.current.intensity = 5
    lightningRef.current.color.setHex(0xFFFFFF)
    
    // Thunder sound (using Web Audio API)
    if (typeof window !== 'undefined') {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Create thunder rumble
      const oscillator = audioContext.createOscillator()
      const gain = audioContext.createGain()
      const filter = audioContext.createBiquadFilter()
      
      oscillator.type = 'sawtooth'
      oscillator.frequency.setValueAtTime(50, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(20, audioContext.currentTime + 2)
      
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(200, audioContext.currentTime)
      
      gain.gain.setValueAtTime(0.3, audioContext.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 3)
      
      oscillator.connect(filter)
      filter.connect(gain)
      gain.connect(audioContext.destination)
      
      oscillator.start()
      oscillator.stop(audioContext.currentTime + 3)
    }
    
    // Flash off
    setTimeout(() => {
      if (lightningRef.current) {
        lightningRef.current.intensity = 0
      }
      isFlashing.current = false
    }, 100)
    
    // Secondary flash
    setTimeout(() => {
      if (lightningRef.current) {
        lightningRef.current.intensity = 2
        setTimeout(() => {
          if (lightningRef.current) {
            lightningRef.current.intensity = 0
          }
        }, 50)
      }
    }, 150)
  }, [])
  
  useFrame((state) => {
    if (!rainRef.current) return
    
    const positions = rainRef.current.geometry.attributes.position.array as Float32Array
    
    // Update rain drops
    for (let i = 0; i < count; i++) {
      // Fall down
      positions[i * 3 + 1] -= velocities[i]
      
      // Slight wind drift
      positions[i * 3] += 0.02 // drift x
      positions[i * 3 + 2] += 0.01 // drift z
      
      // Reset if below ground
      if (positions[i * 3 + 1] < -10) {
        positions[i * 3 + 1] = 20 + Math.random() * 10
        positions[i * 3] = (Math.random() - 0.5) * 40
        positions[i * 3 + 2] = (Math.random() - 0.5) * 40
      }
    }
    
    rainRef.current.geometry.attributes.position.needsUpdate = true
    
    // Random lightning (every 8-15 seconds)
    const now = state.clock.elapsedTime
    if (now - lastLightningTime.current > 8 + Math.random() * 7) {
      triggerLightning()
      lastLightningTime.current = now
    }
  })
  
  return (
    <>
      {/* Rain particles */}
      <points ref={rainRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#8B9DC3"
          size={0.05}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Lightning light */}
      <pointLight
        ref={lightningRef}
        position={[0, 10, 0]}
        color="#FFFFFF"
        intensity={0}
        distance={50}
        decay={1}
      />
    </>
  )
}
