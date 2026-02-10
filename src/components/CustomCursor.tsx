'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only on desktop
    if (window.matchMedia('(pointer: coarse)').matches) return

    const cursor = cursorRef.current
    const cursorDot = cursorDotRef.current
    if (!cursor || !cursorDot) return

    let mouseX = 0
    let mouseY = 0

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      setIsVisible(true)

      // Fast dot follows immediately
      gsap.to(cursorDot, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: 'power2.out',
      })

      // Outer ring follows with lag
      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.5,
        ease: 'power3.out',
      })
    }

    const onMouseEnter = () => setIsVisible(true)
    const onMouseLeave = () => setIsVisible(false)

    // Detect hover on interactive elements
    const onElementMouseEnter = () => setIsHovering(true)
    const onElementMouseLeave = () => setIsHovering(false)

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.body.addEventListener('mouseenter', onMouseEnter)
    document.body.addEventListener('mouseleave', onMouseLeave)

    // Add hover detection to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea')
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', onElementMouseEnter)
      el.addEventListener('mouseleave', onElementMouseLeave)
    })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.body.removeEventListener('mouseenter', onMouseEnter)
      document.body.removeEventListener('mouseleave', onMouseLeave)
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', onElementMouseEnter)
        el.removeEventListener('mouseleave', onElementMouseLeave)
      })
    }
  }, [])

  // Hide on mobile
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <>
      {/* Outer ring */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: isHovering ? '60px' : '40px',
          height: isHovering ? '60px' : '40px',
          border: '1px solid rgba(201, 168, 76, 0.6)',
          borderRadius: '50%',
          transition: 'width 0.3s, height 0.3s, opacity 0.3s',
        }}
      />
      {/* Inner dot */}
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: isHovering ? '8px' : '6px',
          height: isHovering ? '8px' : '6px',
          backgroundColor: '#C9A84C',
          borderRadius: '50%',
          transition: 'width 0.2s, height 0.2s',
          boxShadow: '0 0 10px rgba(201, 168, 76, 0.8)',
        }}
      />
    </>
  )
}
