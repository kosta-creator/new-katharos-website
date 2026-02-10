'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Tablet {
  id: number
  text: string
  size: number
  x: number
  y: number
  z: number
  rotX: number
  rotY: number
  rotZ: number
  floatSpeed: number
  floatOffset: number
}

const GREEK_TEXTS = [
  'ΓΝΩΘΙ ΣΑΥΤΟΝ',
  'ΜΗΔΕΝ ΑΓΑΝ',
  'ΕΝ ΟΙΔΑ',
  'ΠΑΝΤΑ ΡΕΙ',
  'ΚΑΛΟΣ',
]

export default function FloatingTablets() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [tablets, setTablets] = useState<Tablet[]>([])
  const [time, setTime] = useState(0)
  const rafRef = useRef<number>()
  const isActiveRef = useRef(true)

  // Initialize tablets once
  useEffect(() => {
    const initialTablets: Tablet[] = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      text: GREEK_TEXTS[i % GREEK_TEXTS.length],
      size: 70 + Math.random() * 50,
      x: 8 + Math.random() * 84,
      y: 15 + Math.random() * 70,
      z: -150 - Math.random() * 200,
      rotX: Math.random() * 20 - 10,
      rotY: Math.random() * 40 - 20,
      rotZ: Math.random() * 10 - 5,
      floatSpeed: 0.4 + Math.random() * 0.4,
      floatOffset: Math.random() * Math.PI * 2,
    }))
    setTablets(initialTablets)
  }, [])

  // Animation loop
  useEffect(() => {
    isActiveRef.current = true
    
    const animate = () => {
      if (!isActiveRef.current) return
      setTime(t => t + 0.016)
      rafRef.current = requestAnimationFrame(animate)
    }
    
    rafRef.current = requestAnimationFrame(animate)
    
    return () => {
      isActiveRef.current = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // GSAP scroll effect
  useEffect(() => {
    if (tablets.length === 0) return
    
    const triggers: ScrollTrigger[] = []
    
    tablets.forEach((tablet) => {
      const el = document.querySelector(`[data-tablet-id="${tablet.id}"]`)
      if (!el) return
      
      const st = ScrollTrigger.create({
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
        onUpdate: (self) => {
          const zShift = self.progress * 150
          el.setAttribute('data-z-shift', String(zShift))
        }
      })
      triggers.push(st)
    })
    
    return () => {
      triggers.forEach(st => st.kill())
    }
  }, [tablets])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[15] overflow-hidden"
      style={{ perspective: '1200px' }}
      aria-hidden="true"
    >
      {tablets.map((tablet) => {
        const floatY = Math.sin(time * tablet.floatSpeed + tablet.floatOffset) * 12
        const floatRotY = Math.sin(time * 0.25 + tablet.floatOffset) * 4
        const zShift = parseFloat(document.querySelector(`[data-tablet-id="${tablet.id}"]`)?.getAttribute('data-z-shift') || '0')
        
        return (
          <div
            key={tablet.id}
            data-tablet-id={tablet.id}
            className="absolute flex items-center justify-center text-center p-3"
            style={{
              width: `${tablet.size}px`,
              height: `${tablet.size * 1.3}px`,
              left: `${tablet.x}%`,
              top: `${tablet.y}%`,
              background: 'linear-gradient(135deg, rgba(70,65,60,0.85) 0%, rgba(45,43,40,0.9) 100%)',
              border: '1px solid rgba(100,95,90,0.6)',
              borderRadius: '3px',
              fontFamily: 'Georgia, serif',
              fontSize: `${tablet.size * 0.13}px`,
              color: 'rgba(201,168,76,0.5)',
              transform: `
                translate3d(-50%, calc(-50% + ${floatY}px), ${tablet.z + zShift}px)
                rotateX(${tablet.rotX}deg)
                rotateY(${tablet.rotY + floatRotY}deg)
                rotateZ(${tablet.rotZ}deg)
              `,
              boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5), 0 8px 25px rgba(0,0,0,0.3)',
              willChange: 'transform',
              transformStyle: 'preserve-3d',
            }}
          >
            {tablet.text}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
