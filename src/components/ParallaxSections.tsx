'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import EmailModal from '@/components/EmailModal'
import { trackCTAClick } from '@/lib/analytics'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ParallaxSections() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero parallax with 3D depth
      gsap.to('.parallax-hero', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })

      // Hero title animation on load
      gsap.fromTo('.hero-title', 
        { y: 100, opacity: 0, rotateX: -20 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1.5, ease: 'power3.out', delay: 0.5 }
      )

      gsap.fromTo('.hero-subtitle', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.8 }
      )

      gsap.fromTo('.hero-desc', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 1.1 }
      )

      // Climb section parallax
      gsap.to('.parallax-climb', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: '.climb-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })

      // Problem text reveal with 3D
      gsap.fromTo('.problem-line-1', 
        { y: 80, opacity: 0, rotateY: -15 },
        {
          y: 0, opacity: 1, rotateY: 0, duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.problem-line-1',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo('.problem-line-2', 
        { y: 80, opacity: 0, rotateY: 15 },
        {
          y: 0, opacity: 1, rotateY: 0, duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.problem-line-2',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo('.problem-desc', 
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.problem-desc',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Oracle section parallax with scale
      gsap.to('.parallax-oracle', {
        yPercent: 15,
        scale: 1.1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.oracle-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })

      // Dojo title 3D reveal
      gsap.fromTo('.dojo-title', 
        { y: 100, opacity: 0, rotateX: -30, scale: 0.9 },
        {
          y: 0, opacity: 1, rotateX: 0, scale: 1, duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.dojo-title',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Agent cards 3D stagger with perspective
      gsap.fromTo('.agent-card', 
        { y: 60, opacity: 0, rotateY: -20, z: -50 },
        {
          y: 0, opacity: 1, rotateY: 0, z: 0, duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.agent-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // CTA section reveal
      gsap.fromTo('.cta-title', 
        { y: 80, opacity: 0, rotateX: -20 },
        {
          y: 0, opacity: 1, rotateX: 0, duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo('.cta-button', 
        { y: 40, opacity: 0, scale: 0.9, rotateX: -10 },
        {
          y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.cta-button',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
    <div ref={containerRef} className="relative" style={{ perspective: '1200px' }}>
      {/* Hero Section - Full viewport with parallax image */}
      <section className="hero-section relative h-screen overflow-hidden">
        {/* Parallax background image */}
        <div className="parallax-hero absolute inset-0 w-full h-[130%] -top-[15%]">
          <img
            src="/assets/images/hero.png"
            alt="Ancient temple"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50" />
          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-[#050508]" />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050508] to-transparent" />
        </div>

        {/* Content with 3D transform */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4" style={{ transformStyle: 'preserve-3d' }}>
          <h1 className="hero-title text-6xl md:text-9xl font-bold tracking-tighter text-[#C9A84C] text-center" style={{ transform: 'translateZ(50px)' }}>
            KATHAROΣ
          </h1>
          <p className="hero-subtitle mt-6 text-xl md:text-2xl text-[#C4BEB5] tracking-widest uppercase text-center" style={{ transform: 'translateZ(30px)' }}>
            Truth as a Service
          </p>
          <p className="hero-desc mt-4 text-[#C4BEB5]/70 max-w-xl text-center text-lg" style={{ transform: 'translateZ(20px)' }}>
            Experience purity from chaos. Multi-agent AI debate forging truth through conflict.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[#C4BEB5] text-sm tracking-widest uppercase z-10">
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs opacity-70">Enter the temple</span>
            <div className="w-px h-12 bg-gradient-to-b from-[#C4BEB5] to-transparent animate-pulse" />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="climb-section relative min-h-screen overflow-hidden">
        <div className="parallax-climb absolute inset-0 w-full h-[120%] -top-[10%]">
          <img
            src="/assets/images/climb.png"
            alt="The climb"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#050508]/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-transparent to-[#050508]" />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-24" style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}>
          <div className="max-w-4xl text-center">
            <h2 className="problem-line-1 text-5xl md:text-7xl font-bold text-[#C4BEB5] mb-6" style={{ transform: 'translateZ(40px)' }}>
              AI doesn&apos;t disagree.
            </h2>
            <p className="problem-line-2 text-3xl md:text-5xl font-bold text-[#E8913A] mb-8" style={{ transform: 'translateZ(60px)' }}>
              It appeases.
            </p>
            <p className="problem-desc text-lg md:text-xl text-[#C4BEB5]/70 max-w-2xl mx-auto leading-relaxed">
              Current AI systems are designed to please, not to challenge. They echo your biases, 
              avoid difficult truths, and tell you what you want to hear. In a world of infinite 
              information, we&apos;ve lost the ability to disagree productively.
            </p>
          </div>
        </div>
      </section>

      {/* Oracle Section */}
      <section className="oracle-section relative min-h-screen overflow-hidden">
        <div className="parallax-oracle absolute inset-0 w-full h-[120%] -top-[10%]">
          <img
            src="/assets/images/oracle.png"
            alt="The Oracle"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#050508]/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-transparent to-[#050508]" />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-24" style={{ perspective: '1200px' }}>
          <div className="max-w-5xl text-center" style={{ transformStyle: 'preserve-3d' }}>
            <h2 className="dojo-title text-5xl md:text-7xl font-bold text-[#C9A84C] mb-4" style={{ transform: 'translateZ(60px)' }}>
              The Socratic Dojo
            </h2>
            <p className="text-2xl md:text-3xl text-[#C4BEB5] mb-12" style={{ transform: 'translateZ(30px)' }}>
              Seven minds. One truth.
            </p>

            {/* Philosopher grid with 3D cards */}
            <div className="agent-grid grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12" style={{ transformStyle: 'preserve-3d' }}>
              {[
                { name: 'Reasoning', color: '#4DC9F6' },
                { name: 'Empathy', color: '#A78BFA' },
                { name: 'Neutrality', color: '#C4BEB5' },
                { name: 'Mediation', color: '#E8913A' },
                { name: 'Perspective', color: '#10B981' },
                { name: 'Strategy', color: '#C9A84C' },
                { name: 'Outcome', color: '#EC4899' },
                { name: 'Synthesis', color: '#E8913A' },
              ].map((agent, i) => (
                <div
                  key={agent.name}
                  className="agent-card p-4 border border-[#C9A84C]/30 rounded-lg bg-[#050508]/50 backdrop-blur-sm hover:bg-[#1A1A2E]/80 transition-all duration-300 cursor-pointer group"
                  style={{ 
                    transform: `translateZ(${20 + (i % 4) * 10}px)`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full mx-auto mb-2 transition-transform duration-300 group-hover:scale-150"
                    style={{ backgroundColor: agent.color, boxShadow: `0 0 10px ${agent.color}` }}
                  />
                  <p className="text-[#C4BEB5] text-sm">{agent.name}</p>
                </div>
              ))}
            </div>

            <p className="text-lg text-[#C4BEB5]/70 max-w-2xl mx-auto" style={{ transform: 'translateZ(20px)' }}>
              Our multi-agent debate system forces diverse AI perspectives to collide, 
              producing transparent, bias-free consensus through structured Socratic dialogue.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section relative min-h-screen flex items-center justify-center px-4 py-24 bg-[#050508]" style={{ perspective: '1000px' }}>
        <div className="max-w-3xl text-center" style={{ transformStyle: 'preserve-3d' }}>
          <h2 className="cta-title text-5xl md:text-7xl font-bold text-[#C9A84C] mb-6" style={{ transform: 'translateZ(50px)' }}>
            Seek the truth.
          </h2>
          <p className="text-xl text-[#C4BEB5] mb-8 max-w-xl mx-auto" style={{ transform: 'translateZ(30px)' }}>
            Join the beta. Be among the first to experience purity from chaos. 
            The temple doors are opening.
          </p>
          <button
            onClick={() => {
              trackCTAClick()
              setIsEmailModalOpen(true)
            }}
            className="cta-button px-12 py-5 bg-[#E8913A] text-[#050508] font-bold text-xl rounded hover:bg-[#C9A84C] transition-all transform hover:scale-105 hover:translate-z-10"
            style={{ transform: 'translateZ(40px)' }}
          >
            Enter the Dojo
          </button>
          <p className="mt-8 text-sm text-[#C4BEB5]/50">
            Limited beta access. Pure truth only.
          </p>
        </div>
      </section>
    </div>

    <EmailModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} />
    </>
  )
}
