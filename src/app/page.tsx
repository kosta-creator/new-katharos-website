'use client'

import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ParallaxSections from '@/components/ParallaxSections'
import RainCanvas from '@/components/RainCanvas'
import ThunderSystem from '@/components/ThunderSystem'
import Footer from '@/components/Footer'
import FallingRelics from '@/components/FallingRelics'
import CustomCursor from '@/components/CustomCursor'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Home() {
  const [isReady, setIsReady] = useState(false)
  const lenisRef = useRef<Lenis | null>(null)

  // Start immediately, no delay
  useEffect(() => {
    setIsReady(true)
  }, [])

  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (!isReady) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    return () => {
      lenis.destroy()
    }
  }, [isReady])

  return (
    <>
      <CustomCursor />
      <FallingRelics />
      <RainCanvas />
      <ThunderSystem />
      
      <main className="relative bg-[#050508] cursor-none">
        <ParallaxSections />
        <Footer />
      </main>
      
      <div className="fixed inset-0 pointer-events-none z-50 grain-overlay opacity-30" />
    </>
  )
}
