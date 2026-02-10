'use client'

import { AgentData } from './AgentRing'

interface PhilosopherPanelProps {
  agent: AgentData | null
  isOpen: boolean
  onClose: () => void
}

export default function PhilosopherPanel({ agent, isOpen, onClose }: PhilosopherPanelProps) {
  if (!isOpen || !agent) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="bg-[#050508] border-2 border-[#C9A84C] p-8 rounded-lg max-w-lg w-full relative"
        style={{ boxShadow: `0 0 40px ${agent.color}20` }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#C4BEB5] hover:text-[#C9A84C] transition-colors text-2xl"
        >
          ✕
        </button>

        {/* Glowing orb representing the philosopher */}
        <div className="flex justify-center mb-6">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ 
              background: `radial-gradient(circle, ${agent.color}40 0%, ${agent.color}10 50%, transparent 70%)`,
              boxShadow: `0 0 30px ${agent.color}60`
            }}
          >
            <span className="text-4xl">
              {agent.pose === 'scroll' ? '📜' : agent.pose === 'torch' ? '🔥' : '✋'}
            </span>
          </div>
        </div>

        {/* Name and role */}
        <h2 className="text-4xl font-bold text-[#C9A84C] text-center mb-2">
          {agent.name}
        </h2>
        <p className="text-center text-lg mb-6" style={{ color: agent.color }}>
          {agent.role}
        </p>

        {/* Description */}
        <p className="text-[#C4BEB5] text-lg text-center mb-8 leading-relaxed">
          {agent.description}
        </p>

        {/* Debate stage visualization */}
        <div className="border-t border-[#1A1A2E] pt-6">
          <h3 className="text-sm text-[#C9A84C] uppercase tracking-widest mb-4 text-center">
            In the Dojo
          </h3>
          <div className="flex justify-center gap-2">
            {['Position', 'Critique', 'Rebuttal', 'Synthesis'].map((stage, i) => (
              <div key={stage} className="text-center">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold mb-2 ${
                    i <= 2 ? 'bg-[#E8913A] text-[#050508]' : 'bg-[#1A1A2E] text-[#C4BEB5]'
                  }`}
                >
                  {i + 1}
                </div>
                <span className="text-xs text-[#C4BEB5]/70">{stage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={onClose}
          className="w-full mt-8 px-6 py-3 border border-[#C9A84C] text-[#C9A84C] rounded hover:bg-[#C9A84C] hover:text-[#050508] transition-colors"
        >
          Return to the Circle
        </button>
      </div>
    </div>
  )
}
