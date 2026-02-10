'use client'

import { useState } from 'react'
import { submitEmail } from '@/lib/email'
import { trackEmailSubmit } from '@/lib/analytics'

export default function EmailModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const result = await submitEmail(email)
    trackEmailSubmit(result.success)
    setMessage(result.message)
    setSubmitted(true)
    setIsLoading(false)
    
    setTimeout(() => {
      onClose()
      setSubmitted(false)
      setEmail('')
      setMessage('')
    }, 3000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1A1A2E] border border-[#C9A84C] p-8 rounded-lg max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#C4BEB5] hover:text-[#C9A84C] transition-colors"
        >
          ✕
        </button>

        {!submitted ? (
          <>
            <h2 className="text-3xl font-bold text-[#C9A84C] mb-4">
              Seek the Truth
            </h2>
            <p className="text-[#C4BEB5] mb-6">
              Join the beta. Be among the first to experience purity from chaos.
            </p>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 bg-[#050508] border border-[#C9A84C] rounded text-[#C4BEB5] placeholder-[#C4BEB5]/50 focus:outline-none focus:border-[#E8913A] mb-4"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-[#E8913A] text-[#050508] font-bold rounded hover:bg-[#C9A84C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Summoning...' : 'Enter the Dojo'}
              </button>
            </form>
            <p className="text-xs text-[#C4BEB5]/50 mt-4 text-center">
              No spam. Pure truth only.
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🔥</div>
            <h3 className="text-2xl font-bold text-[#C9A84C] mb-2">
              {message || 'Welcome to the Temple'}
            </h3>
            <p className="text-[#C4BEB5]">
              The oracles have received your request.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
