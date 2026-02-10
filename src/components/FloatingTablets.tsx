'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface FloatingTablet {
  element: HTMLDivElement
  x: number
  y: number
  z: number
  rotX: number
  rotY: number
  rotZ: number
  floatSpeed: number
  floatOffset: number
}

export default function FloatingTablets() {
  const containerRef = useRef<HTMLDivElement>(null)
  const tabletsRef = useRef<FloatingTablet[]>([])
  const frameRef = useRef<number>()
  const timeRef = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const tablets: FloatingTablet[] = []
    const tabletCount = 5

    // Create 3D stone tablets
    for (let i = 0; i < tabletCount; i++) {
      const element = document.createElement('div')
      
      // Greek text fragments
      const greekTexts = [
        'ΓΝΩΘΙ ΣΑΥΤΟΝ',
        'ΜΗΔΕΝ ΑΓΑΝ',
        'ΕΝ ΟΙΔΑ ΟΤΙ ΟΥΔΕΝ ΟΙΔΑ',
        'ΠΑΝΤΑ ΡΕΙ',
        'ΚΑΛΟΣ ΚΑΓΑΘΟΣ',
      ]
      
      const size = 80 + Math.random() * 60
      const x = 10 + Math.random() * 80
      const y = 20 + Math.random() * 60
      
      element.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size * 1.3}px;
        left: ${x}%;
        top: ${y}%;
        background: linear-gradient(135deg, rgba(80,75,70,0.9) 0%, rgba(50,48,45,0.95) 100%);
        border: 2px solid rgba(100,95,90,0.8);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: serif;
        font-size: ${size * 0.15}px;
        color: rgba(201,168,76,0.6);
        text-align: center;
        padding: 10px;
        transform-style: preserve-3d;
        box-shadow: 
          inset 0 0 20px rgba(0,0,0,0.5),
          0 10px 30px rgba(0,0,0,0.4);
        pointer-events: none;
        will-change: transform;
      `
      
      element.textContent = greekTexts[i % greekTexts.length]
      
      // Add chiseled texture overlay
      const texture = document.createElement('div')
      texture.style.cssText = `
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
          90deg,
          transparent,
          transparent 2px,
          rgba(0,0,0,0.1) 2px,
          rgba(0,0,0,0.1) 4px
        );
        pointer-events: none;
      `
      element.appendChild(texture)
      
      container.appendChild(element)
      
      tablets.push({
        element,
        x: parseFloat(element.style.left),
        y: parseFloat(element.style.top),
        z: -100 - Math.random() * 200,
        rotX: Math.random() * 20 - 10,
        rotY: Math.random() * 30 - 15,
        rotZ: Math.random() * 10 - 5,
        floatSpeed: 0.5 + Math.random() * 0.5,
        floatOffset: Math.random() * Math.PI * 2,
      })
    }

    tabletsRef.current = tablets

    // Animate
    const animate = () => {
      timeRef.current += 0.016
      
      tablets.forEach((tablet) => {
        const floatY = Math.sin(timeRef.current * tablet.floatSpeed + tablet.floatOffset) * 15
        const floatRotY = Math.sin(timeRef.current * 0.3 + tablet.floatOffset) * 5
        
        tablet.element.style.transform = `
          translate3d(-50%, -50%, ${tablet.z}px)
          translateY(${floatY}px)
          rotateX(${tablet.rotX}deg)
          rotateY(${tablet.rotY + floatRotY}deg)
          rotateZ(${tablet.rotZ}deg)
        `
      })
      
      frameRef.current = requestAnimationFrame(animate)
    }

    // Scroll-based 3D shift
    gsap.to(tablets.map(t => t.element), {
      z: (i) => tablets[i].z + 100,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
      },
    })

    animate()

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      tablets.forEach(t => t.element.remove())
      tabletsRef.current = []
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[15]"
      style={{ 
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      aria-hidden="true"
    />
  )
}
