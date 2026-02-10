'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface CursorState {
  x: number
  y: number
  isHovering: boolean
  isVisible: boolean
}

export default function CustomCursor() {
  const [cursor, setCursor] = useState<CursorState>({
    x: 0,
    y: 0,
    isHovering: false,
    isVisible: false,
  })
  const [isMobile, setIsMobile] = useState(true)
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>()
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Check if mobile on mount
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches)
    }
    checkMobile()
    
    // Also check on resize
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) return

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY }
      setCursor(prev => ({ ...prev, isVisible: true }))
    }

    const handleMouseEnter = () => setCursor(prev => ({ ...prev, isVisible: true }))
    const handleMouseLeave = () => setCursor(prev => ({ ...prev, isVisible: false }))

    // Smooth animation loop
    const animate = () => {
      // Lerp for smooth follow
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.15
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.15

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${currentRef.current.x}px, ${currentRef.current.y}px) translate(-50%, -50%)`
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${targetRef.current.x}px, ${targetRef.current.y}px) translate(-50%, -50%)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    // Hover detection using event delegation
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = target.closest('a, button, [role="button"], input, textarea, .interactive')
      setCursor(prev => ({ ...prev, isHovering: !!isInteractive }))
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseover', handleElementHover, { passive: true })
    document.body.addEventListener('mouseenter', handleMouseEnter)
    document.body.addEventListener('mouseleave', handleMouseLeave)
    
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleElementHover)
      document.body.removeEventListener('mouseenter', handleMouseEnter)
      document.body.removeEventListener('mouseleave', handleMouseLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isMobile])

  if (isMobile) return null

  return (
    <>
      {/* Outer ring - follows with lag */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-300 ${
          cursor.isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: cursor.isHovering ? '50px' : '36px',
          height: cursor.isHovering ? '50px' : '36px',
          border: '1px solid rgba(201, 168, 76, 0.5)',
          borderRadius: '50%',
          transition: 'width 0.2s ease, height 0.2s ease, opacity 0.3s',
        }}
      />
      {/* Inner dot - follows immediately */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-300 ${
          cursor.isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: cursor.isHovering ? '6px' : '4px',
          height: cursor.isHovering ? '6px' : '4px',
          backgroundColor: '#C9A84C',
          borderRadius: '50%',
          boxShadow: '0 0 8px rgba(201, 168, 76, 0.8)',
          transition: 'width 0.15s, height 0.15s',
        }}
      />
    </>
  )
}
