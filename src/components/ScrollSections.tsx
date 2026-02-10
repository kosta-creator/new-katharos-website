'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AgentRing, { AgentData, agents } from '@/components/AgentRing'
import PhilosopherPanel from '@/components/PhilosopherPanel'
import EmailModal from '@/components/EmailModal'
import { trackPhilosopherClick, trackCTAClick } from '@/lib/analytics'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ScrollSections() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const problemRef = useRef<HTMLDivElement>(null)
  const dojoRef = useRef<HTMLDivElement>(null)
  const [showDojo3D, setShowDojo3D] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<AgentData | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

  useEffect(() => {
    // Hero parallax
    gsap.to('.hero-title', {
      yPercent: 50,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })

    // Problem section reveal
    gsap.fromTo(
      '.problem-content',
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: problemRef.current,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    // Dojo section reveal + 3D activation
    const dojoTrigger = ScrollTrigger.create({
      trigger: dojoRef.current,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => setShowDojo3D(true),
      onLeave: () => setShowDojo3D(false),
      onEnterBack: () => setShowDojo3D(true),
      onLeaveBack: () => setShowDojo3D(false),
    })

    gsap.fromTo(
      '.dojo-content',
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: dojoRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    return () => {
      dojoTrigger.kill()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  const handleAgentClick = (agent: AgentData) => {
    trackPhilosopherClick(agent.name)
    setSelectedAgent(agent)
    setIsPanelOpen(true)
  }

  const handleClosePanel = () => {
    setIsPanelOpen(false)
    setTimeout(() => setSelectedAgent(null), 300)
  }

  return (
    <>
      <div ref={containerRef} className="relative z-10">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="climb-section relative h-screen flex items-center justify-center"
        >
          <div className="hero-title text-center pointer-events-none">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-[#C9A84C]">
              KATHAROΣ
            </h1>
            <p className="mt-4 text-lg md:text-xl text-[#C4BEB5] tracking-widest uppercase">
              Truth as a Service
            </p>
          </div>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#C4BEB5] text-sm tracking-widest uppercase opacity-50">
            <div className="flex flex-col items-center gap-2">
              <span>Scroll to climb</span>
              <div className="w-px h-8 bg-[#C4BEB5] animate-pulse" />
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section
          ref={problemRef}
          className="climb-section min-h-screen flex items-center justify-center px-4"
        >
          <div className="problem-content max-w-4xl text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-[#C4BEB5] mb-6">
              AI doesn&apos;t disagree.
            </h2>
            <p className="text-2xl md:text-4xl font-bold text-[#E8913A]">
              It appeases.
            </p>
            <p className="mt-8 text-lg text-[#C4BEB5] opacity-70 max-w-2xl mx-auto">
              Current AI systems are designed to please, not to challenge. 
              They agree with you, echo your biases, and avoid difficult truths.
            </p>
          </div>
        </section>

        {/* Dojo Section */}
        <section
          ref={dojoRef}
          className="climb-section min-h-screen relative flex flex-col items-center justify-center px-4"
        >
          <div className="absolute inset-0 z-0">
            {showDojo3D && (
              <Canvas
                camera={{ position: [0, 3, 6], fov: 50 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
              >
                <Suspense fallback={null}>
                  <AgentRing onAgentClick={handleAgentClick} />
                </Suspense>
              </Canvas>
            )}
          </div>

          <div className="dojo-content relative z-10 max-w-5xl text-center mt-96">
            <h2 className="text-4xl md:text-6xl font-bold text-[#C9A84C] mb-4">
              The Socratic Dojo
            </h2>
            <p className="text-xl md:text-2xl text-[#C4BEB5] mb-8">
              Seven minds. One truth.
            </p>
            
            <p className="text-lg text-[#C4BEB5] opacity-70 max-w-2xl mx-auto">
              Our multi-agent debate system forces diverse AI perspectives to collide, 
              producing transparent, bias-free consensus.
            </p>

            <p className="mt-8 text-sm text-[#C9A84C] tracking-widest uppercase opacity-60">
              Click a philosopher to learn their role
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="climb-section min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-bold text-[#C9A84C] mb-6">
              Seek the truth.
            </h2>
            <p className="text-xl text-[#C4BEB5] mb-12">
              Join the beta. Experience purity from chaos.
            </p>
            <button 
              onClick={() => {
                trackCTAClick()
                setIsEmailModalOpen(true)
              }}
              className="px-8 py-4 bg-[#E8913A] text-[#050508] font-bold text-lg rounded hover:bg-[#C9A84C] transition-colors"
            >
              Enter the Dojo
            </button>
          </div>
        </section>
      </div>

      {/* Philosopher Detail Panel */}
      <PhilosopherPanel 
        agent={selectedAgent}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
      />

      {/* Email Capture Modal */}
      <EmailModal 
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
    </>
  )
}
