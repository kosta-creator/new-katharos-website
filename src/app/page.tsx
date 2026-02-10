'use client'

import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ParallaxSections from '@/components/ParallaxSections'
import RainCanvas from '@/components/RainCanvas'
import ThunderSystem from '@/components/ThunderSystem'
import AmbientAudio from '@/components/AmbientAudio'
import Footer from '@/components/Footer'
import FallingRelics from '@/components/FallingRelics'
import CustomCursor from '@/components/CustomCursor'
import FloatingTablets from '@/components/FloatingTablets'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const lenisRef = useRef<Lenis | null>(null)

  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (!isLoaded) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
    }
  }, [isLoaded])

  // Simple load check
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Custom cursor */}
      <CustomCursor />

      {/* Falling relics on scroll */}
      <FallingRelics />

      {/* Floating 3D tablets */}
      <FloatingTablets />

      {/* Rain overlay */}
      <RainCanvas />

      {/* Thunder system */}
      <ThunderSystem />

      {/* Ambient audio */}
      <AmbientAudio />

      <main className="relative bg-[#050508] cursor-none">
        <ParallaxSections />
        <Footer />
      </main>

      {/* Atmospheric grain */}
      <div className="fixed inset-0 pointer-events-none z-50 grain-overlay opacity-30" />
    </>
  )
}
