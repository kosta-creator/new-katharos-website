'use client'

import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'

interface Relic {
  element: HTMLDivElement
  y: number
  rotation: number
  velocity: number
  rotationSpeed: number
  opacity: number
  rotX: number
  rotY: number
}

const MAX_RELICS = 12
const SPAWN_THRESHOLD = 12

export default function FallingRelics() {
  const containerRef = useRef<HTMLDivElement>(null)
  const relicsRef = useRef<Relic[]>([])
  const lastScrollY = useRef(0)
  const scrollVelocity = useRef(0)
  const frameRef = useRef<number>()
  const isActiveRef = useRef(true)
  const spawnCooldown = useRef(0)

  const createRelic = useCallback((): Relic | null => {
    const container = containerRef.current
    if (!container) return null
    if (relicsRef.current.length >= MAX_RELICS) return null

    try {
      // Create 3D cube container
      const cube = document.createElement('div')
      const size = 20 + Math.random() * 25
      const startX = 5 + Math.random() * 90
      
      cube.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${startX}vw;
        top: -60px;
        transform-style: preserve-3d;
        pointer-events: none;
        will-change: transform;
      `

      // Stone colors
      const colors = [
        ['rgba(80,75,70,0.85)', 'rgba(60,58,55,0.9)'],
        ['rgba(70,68,65,0.8)', 'rgba(50,48,45,0.85)'],
        ['rgba(90,85,80,0.75)', 'rgba(70,68,65,0.8)'],
      ]
      const [frontColor, sideColor] = colors[Math.floor(Math.random() * colors.length)]

      // Create 6 faces of cube
      const faces = [
        { transform: `translateZ(${size/2}px)`, bg: frontColor },
        { transform: `rotateY(180deg) translateZ(${size/2}px)`, bg: sideColor },
        { transform: `rotateY(90deg) translateZ(${size/2}px)`, bg: sideColor },
        { transform: `rotateY(-90deg) translateZ(${size/2}px)`, bg: sideColor },
        { transform: `rotateX(90deg) translateZ(${size/2}px)`, bg: sideColor },
        { transform: `rotateX(-90deg) translateZ(${size/2}px)`, bg: sideColor },
      ]

      faces.forEach(({ transform, bg }) => {
        const face = document.createElement('div')
        face.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: ${bg};
          transform: ${transform};
          border: 1px solid rgba(100,95,90,0.5);
          box-shadow: inset 0 0 10px rgba(0,0,0,0.3);
        `
        cube.appendChild(face)
      })
      
      container.appendChild(cube)
      
      return {
        element: cube,
        y: -60,
        rotation: Math.random() * 360,
        velocity: 4 + Math.random() * 6,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 1,
        rotX: Math.random() * 360,
        rotY: Math.random() * 360,
      }
    } catch (err) {
      console.warn('Failed to create relic:', err)
      return null
    }
  }, [])

  useEffect(() => {
    isActiveRef.current = true
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      if (!isActiveRef.current) return
      
      const currentScrollY = window.scrollY
      const velocity = Math.abs(currentScrollY - lastScrollY.current)
      scrollVelocity.current = velocity
      lastScrollY.current = currentScrollY
      
      if (velocity > SPAWN_THRESHOLD && 
          relicsRef.current.length < MAX_RELICS && 
          spawnCooldown.current <= 0) {
        
        const spawnCount = Math.min(2, Math.floor(velocity / 25))
        for (let i = 0; i < spawnCount; i++) {
          const relic = createRelic()
          if (relic) {
            relicsRef.current.push(relic)
          }
        }
        spawnCooldown.current = 5
      }
      
      if (spawnCooldown.current > 0) {
        spawnCooldown.current--
      }
    }

    let frameCount = 0
    const animate = () => {
      if (!isActiveRef.current) return
      
      frameCount++
      
      if (frameCount % 2 === 0) {
        const windowHeight = window.innerHeight
        
        relicsRef.current = relicsRef.current.filter((relic) => {
          try {
            relic.y += relic.velocity
            relic.rotX += relic.rotationSpeed
            relic.rotY += relic.rotationSpeed * 0.7
            
            if (relic.y > windowHeight - 100) {
              relic.opacity -= 0.02
            }
            
            if (relic.opacity > 0) {
              relic.element.style.transform = `
                translateY(${relic.y}px)
                rotateX(${relic.rotX}deg)
                rotateY(${relic.rotY}deg)
              `
              relic.element.style.opacity = String(Math.max(0, relic.opacity))
            }
            
            if (relic.y > windowHeight + 50 || relic.opacity <= 0) {
              relic.element.remove()
              return false
            }
            
            return true
          } catch (err) {
            try { relic.element.remove() } catch {}
            return false
          }
        })
      }
      
      frameRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    frameRef.current = requestAnimationFrame(animate)

    return () => {
      isActiveRef.current = false
      window.removeEventListener('scroll', handleScroll)
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      relicsRef.current.forEach((relic) => {
        try { relic.element.remove() } catch {}
      })
      relicsRef.current = []
    }
  }, [createRelic])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[25] overflow-hidden"
      style={{ perspective: '800px' }}
      aria-hidden="true"
    />
  )
}
