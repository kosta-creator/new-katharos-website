'use client'

import { useEffect, useRef } from 'react'

export default function RainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isActiveRef = useRef(true)

  useEffect(() => {
    isActiveRef.current = true
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      if (!isActiveRef.current) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Rain drops
    const drops: Array<{
      x: number
      y: number
      length: number
      speed: number
      opacity: number
    }> = []

    const dropCount = 150 // Number of rain drops

    // Initialize drops
    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: 10 + Math.random() * 20,
        speed: 15 + Math.random() * 10,
        opacity: 0.1 + Math.random() * 0.3,
      })
    }

    // Animation loop
    let animationId: number
    let frameCount = 0

    const animate = () => {
      if (!isActiveRef.current) return
      
      // Render every 2nd frame for performance
      frameCount++
      if (frameCount % 2 === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw each drop
        drops.forEach((drop) => {
          ctx.beginPath()
          ctx.moveTo(drop.x, drop.y)
          ctx.lineTo(drop.x - 1, drop.y + drop.length)
          ctx.strokeStyle = `rgba(174, 194, 224, ${drop.opacity})`
          ctx.lineWidth = 1
          ctx.stroke()

          // Move drop
          drop.y += drop.speed
          drop.x -= 0.5

          // Reset if off screen
          if (drop.y > canvas.height) {
            drop.y = -drop.length
            drop.x = Math.random() * canvas.width
          }
          if (drop.x < -10) {
            drop.x = canvas.width + 10
          }
        })
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      isActiveRef.current = false
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-20 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}
