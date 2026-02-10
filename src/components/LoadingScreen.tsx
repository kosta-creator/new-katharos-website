'use client'

import { useEffect, useState } from 'react'

export default function LoadingScreen({ onLoaded }: { onLoaded: () => void }) {
  const [progress, setProgress] = useState(0)
  const [lightning, setLightning] = useState(false)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onLoaded, 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    // Random lightning strikes
    const lightningInterval = setInterval(() => {
      setLightning(true)
      setTimeout(() => setLightning(false), 100)
    }, 1500)

    return () => {
      clearInterval(interval)
      clearInterval(lightningInterval)
    }
  }, [onLoaded])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050508] transition-opacity duration-500 ${
        progress >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Lightning flash */}
      <div
        className={`absolute inset-0 bg-white transition-opacity duration-75 ${
          lightning ? 'opacity-20' : 'opacity-0'
        }`}
      />

      {/* Logo */}
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-[#C9A84C] mb-8">
        KATHAROΣ
      </h1>

      {/* Loading bar container */}
      <div className="w-64 h-1 bg-[#1A1A2E] rounded overflow-hidden">
        <div
          className="h-full bg-[#E8913A] transition-all duration-300 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Loading text */}
      <p className="mt-4 text-[#C4BEB5] text-sm tracking-widest uppercase opacity-50">
        {progress < 30 && 'Summoning oracles...'}
        {progress >= 30 && progress < 60 && 'Igniting debate fires...'}
        {progress >= 60 && progress < 90 && 'Purifying truth...'}
        {progress >= 90 && 'Entering the temple...'}
      </p>
    </div>
  )
}
