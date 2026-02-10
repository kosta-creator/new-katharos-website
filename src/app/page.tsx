'use client'

import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ParallaxSections from '@/components/ParallaxSections'
import RainCanvas from '@/components/RainCanvas'
import ThunderSystem from '@/components/ThunderSystem'
import AmbientAudio from '@/components/AmbientAudio'
import LoadingScreen from '@/components/LoadingScreen'
import Footer from '@/components/Footer'
import FallingRelics from '@/components/FallingRelics'
import CustomCursor from '@/components/CustomCursor'
import FloatingTablets from '@/components/FloatingTablets'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const lenisRef = useRef<Lenis | null>(null)

  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (isLoading) return

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

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000)
      })
    }
  }, [isLoading])

  // Preload images
  useEffect(() => {
    const images = [
      '/assets/images/hero.jpg',
      '/assets/images/climb.jpg',
      '/assets/images/oracle.jpg',
      '/assets/images/philosopher.jpg',
    ]

    let loadedCount = 0
    images.forEach((src) => {
      const img = new Image()
      img.onload = () => {
        loadedCount++
        if (loadedCount === images.length) {
          setTimeout(() => {
            setIsLoading(false)
            setTimeout(() => setIsReady(true), 100)
          }, 2000)
        }
      }
      img.onerror = () => {
        loadedCount++
        if (loadedCount === images.length) {
          setTimeout(() => {
            setIsLoading(false)
            setTimeout(() => setIsReady(true), 100)
          }, 2000)
        }
      }
      img.src = src
    })
  }, [])

  return (
    <>
      {isLoading && <LoadingScreen onLoaded={() => setIsLoading(false)} />}

      {/* Custom cursor */}
      {isReady && <CustomCursor />}

      {/* Falling relics on scroll */}
      {isReady && <FallingRelics />}

      {/* Floating 3D tablets */}
      {isReady && <FloatingTablets />}

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
