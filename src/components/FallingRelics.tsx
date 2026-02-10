'use client'

import { useEffect, useRef, useCallback } from 'react'

interface Relic {
  id: number
  x: number
  y: number
  rotX: number
  rotY: number
  rotZ: number
  velocity: number
  rotSpeedX: number
  rotSpeedY: number
  rotSpeedZ: number
  opacity: number
  size: number
  color: string
}

const MAX_RELICS = 10
const SPAWN_THRESHOLD = 15
const COLORS = [
  ['rgba(75,72,68,0.8)', 'rgba(55,52,48,0.85)'],
  ['rgba(65,62,58,0.75)', 'rgba(45,42,38,0.8)'],
  ['rgba(85,82,78,0.7)', 'rgba(65,62,58,0.75)'],
]

export default function FallingRelics() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const relicsRef = useRef<Relic[]>([])
  const lastScrollY = useRef(0)
  const scrollVelocity = useRef(0)
  const rafRef = useRef<number>()
  const isActiveRef = useRef(true)
  const spawnCooldown = useRef(0)
  const idCounter = useRef(0)

  const spawnRelic = useCallback(() => {
    if (relicsRef.current.length >= MAX_RELICS) return null

    const size = 18 + Math.random() * 22
    const colorPair = COLORS[Math.floor(Math.random() * COLORS.length)]
    
    return {
      id: idCounter.current++,
      x: 5 + Math.random() * 90,
      y: -50,
      rotX: Math.random() * 360,
      rotY: Math.random() * 360,
      rotZ: Math.random() * 360,
      velocity: 4 + Math.random() * 5,
      rotSpeedX: (Math.random() - 0.5) * 6,
      rotSpeedY: (Math.random() - 0.5) * 6,
      rotSpeedZ: (Math.random() - 0.5) * 4,
      opacity: 1,
      size,
      color: colorPair[0],
    }
  }, [])

  useEffect(() => {
    isActiveRef.current = true
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const handleScroll = () => {
      if (!isActiveRef.current) return
      
      const currentY = window.scrollY
      const velocity = Math.abs(currentY - lastScrollY.current)
      scrollVelocity.current = velocity
      lastScrollY.current = currentY
      
      if (velocity > SPAWN_THRESHOLD && 
          relicsRef.current.length < MAX_RELICS && 
          spawnCooldown.current <= 0) {
        
        const count = Math.min(2, Math.floor(velocity / 25))
        for (let i = 0; i < count; i++) {
          const relic = spawnRelic()
          if (relic) relicsRef.current.push(relic)
        }
        spawnCooldown.current = 4
      }
      
      if (spawnCooldown.current > 0) spawnCooldown.current--
    }

    const drawCube = (r: Relic) => {
      const s = r.size
      const x = (r.x / 100) * canvas.width
      const y = r.y
      
      ctx.save()
      ctx.translate(x, y)
      ctx.globalAlpha = r.opacity
      
      // Simple 2D representation of falling stone
      ctx.fillStyle = r.color
      ctx.beginPath()
      ctx.moveTo(-s/2, -s/2)
      ctx.lineTo(s/2, -s/2)
      ctx.lineTo(s/2 * 0.8, s/2 * 0.3)
      ctx.lineTo(-s/2 * 0.8, s/2 * 0.3)
      ctx.closePath()
      ctx.fill()
      
      // Side face
      ctx.fillStyle = 'rgba(45,42,38,0.9)'
      ctx.beginPath()
      ctx.moveTo(s/2, -s/2)
      ctx.lineTo(s/2 * 0.8, s/2 * 0.3)
      ctx.lineTo(s/2 * 0.8, s/2)
      ctx.lineTo(s/2, s/2 * 0.3)
      ctx.closePath()
      ctx.fill()
      
      // Edge highlight
      ctx.strokeStyle = 'rgba(100,95,90,0.4)'
      ctx.lineWidth = 1
      ctx.stroke()
      
      ctx.restore()
    }

    let frameCount = 0
    const animate = () => {
      if (!isActiveRef.current) return
      frameCount++
      
      // Render at 30fps
      if (frameCount % 2 === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        relicsRef.current = relicsRef.current.filter(r => {
          r.y += r.velocity
          r.rotX += r.rotSpeedX
          r.rotY += r.rotSpeedY
          r.rotZ += r.rotSpeedZ
          
          if (r.y > canvas.height - 100) {
            r.opacity -= 0.025
          }
          
          if (r.opacity > 0) {
            drawCube(r)
          }
          
          return r.y < canvas.height + 50 && r.opacity > 0
        })
      }
      
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      isActiveRef.current = false
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      relicsRef.current = []
    }
  }, [spawnRelic])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[25]"
      style={{ opacity: 0.9 }}
      aria-hidden="true"
    />
  )
}
