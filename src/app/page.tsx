'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const climbRef = useRef<HTMLDivElement>(null);
  const dojoRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parallax effects
    const ctx = gsap.context(() => {
      // Hero parallax
      gsap.to('.hero-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Title reveal
      gsap.fromTo(
        '.hero-title',
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: 'power4.out',
        }
      );

      // Climb section parallax
      gsap.to('.climb-bg', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: climbRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Problem text stagger
      gsap.fromTo(
        '.problem-line',
        { opacity: 0, y: 50, rotateX: -45 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          stagger: 0.3,
          scrollTrigger: {
            trigger: climbRef.current,
            start: 'top 60%',
          },
        }
      );

      // Dojo Oracle chamber reveal
      gsap.fromTo(
        '.oracle-chamber',
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 2,
          scrollTrigger: {
            trigger: dojoRef.current,
            start: 'top 70%',
          },
        }
      );

      // Agent cards 3D reveal
      gsap.fromTo(
        '.agent-card',
        { 
          opacity: 0, 
          rotateY: -90, 
          z: -500 
        },
        {
          opacity: 1,
          rotateY: 0,
          z: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: '.agent-grid',
            start: 'top 65%',
          },
        }
      );

      // CTA zoom effect
      gsap.fromTo(
        '.cta-content',
        { scale: 0.6, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 2,
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 60%',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="relative bg-[#050508] text-[#C4BEB5] overflow-hidden">
      {/* Film Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-20 mix-blend-overlay grain-overlay" />
      
      {/* Vignette */}
      <div className="fixed inset-0 pointer-events-none z-40" style={{
        boxShadow: 'inset 0 0 200px 80px rgba(0,0,0,0.9)'
      }} />

      {/* HERO SECTION - The Mountain Base */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <div className="hero-bg absolute inset-0 w-full h-[130%] -top-[15%]">
          <img
            src="./assets/images/30050.jpg"
            alt="Mountain temple"
            className="w-full h-full object-cover"
            style={{ filter: 'saturate(0.3) contrast(1.4) brightness(0.5)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-transparent to-[#050508]" />
        </div>

        {/* Torch Light Effect */}
        <div className="torch-light absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30 mix-blend-screen pointer-events-none animate-flicker"
          style={{
            background: 'radial-gradient(circle, rgba(232,145,58,0.4) 0%, rgba(139,115,85,0.2) 40%, transparent 70%)'
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <h1 className="hero-title text-8xl md:text-[12rem] font-bold tracking-tighter text-[#C9A84C] text-center chiseled-text">
            KATHAROΣ
          </h1>
          <p className="mt-8 text-2xl md:text-3xl text-[#C4BEB5] tracking-widest uppercase opacity-80">
            Truth as a Service
          </p>
          <p className="mt-6 text-lg text-[#C4BEB5]/60 max-w-2xl text-center">
            Experience purity from chaos. Seven minds debate to forge truth through sacred conflict.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-[#C4BEB5]/40 text-sm tracking-widest uppercase z-10">
          <div className="flex flex-col items-center gap-4">
            <span className="text-xs">Begin the ascent</span>
            <div className="w-[1px] h-16 bg-gradient-to-b from-[#C9A84C] to-transparent animate-pulse" />
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION - The Climb */}
      <section ref={climbRef} className="relative min-h-screen overflow-hidden py-32">
        {/* Background */}
        <div className="climb-bg absolute inset-0 w-full h-[120%] -top-[10%]">
          <img
            src="./assets/images/leonidis climb 1.jpeg"
            alt="The climb"
            className="w-full h-full object-cover"
            style={{ filter: 'saturate(0.2) contrast(1.5) brightness(0.4)' }}
          />
          <div className="absolute inset-0 bg-[#050508]/80" />
        </div>

        {/* Fog Layer */}
        <div className="absolute inset-0 opacity-60 pointer-events-none">
          <div className="fog-layer animate-float" />
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4" style={{ perspective: '1500px' }}>
          <div className="max-w-5xl text-center">
            <h2 className="problem-line text-6xl md:text-8xl font-bold text-[#C4BEB5] mb-8">
              AI doesn't disagree.
            </h2>
            <p className="problem-line text-4xl md:text-6xl font-bold text-[#E8913A] mb-12">
              It appeases.
            </p>
            <p className="problem-line text-xl md:text-2xl text-[#C4BEB5]/70 max-w-3xl mx-auto leading-relaxed">
              Current AI systems echo your biases. They avoid uncomfortable truths. They tell you what you want to hear. 
              In the age of infinite information, we've lost the ability to productively disagree.
            </p>
          </div>
        </div>
      </section>

      {/* DOJO SECTION - The Oracle Chamber */}
      <section ref={dojoRef} className="relative min-h-screen overflow-hidden py-32">
        {/* Background */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="./assets/images/Ephors.webp"
            alt="Oracle chamber"
            className="w-full h-full object-cover"
            style={{ filter: 'saturate(0.25) contrast(1.6) brightness(0.3)' }}
          />
          <div className="absolute inset-0 bg-[#050508]/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-transparent to-[#050508]" />
        </div>

        {/* Central Fire Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20 mix-blend-screen pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(232,145,58,0.6) 0%, rgba(201,168,76,0.3) 30%, transparent 60%)'
          }}
        />

        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="oracle-chamber max-w-6xl text-center" style={{ transformStyle: 'preserve-3d' }}>
            <h2 className="text-6xl md:text-8xl font-bold text-[#C9A84C] mb-6 chiseled-text">
              The Socratic Dojo
            </h2>
            <p className="text-3xl md:text-4xl text-[#C4BEB5] mb-16">
              Seven minds. One truth.
            </p>

            {/* 7 Agent Cards */}
            <div className="agent-grid grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16" style={{ transformStyle: 'preserve-3d' }}>
              {[
                { name: 'Reasoning', color: '#4DC9F6' },
                { name: 'Empathy', color: '#A78BFA' },
                { name: 'Neutrality', color: '#C4BEB5' },
                { name: 'Mediation', color: '#E8913A' },
                { name: 'Perspective', color: '#10B981' },
                { name: 'Strategy', color: '#C9A84C' },
                { name: 'Outcome', color: '#EC4899' },
              ].map((agent, i) => (
                <div
                  key={agent.name}
                  className="agent-card p-6 border-2 border-[#C9A84C]/30 rounded-lg bg-[#0a0a0a]/60 backdrop-blur-sm 
                             hover:bg-[#1A1A2E]/80 hover:border-[#C9A84C] hover:scale-110 transition-all duration-500 cursor-pointer group"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `translateZ(${(i + 1) * 20}px)`
                  }}
                >
                  <div 
                    className="w-4 h-4 rounded-full mx-auto mb-3 transition-all duration-300 group-hover:scale-150 group-hover:animate-pulse"
                    style={{
                      backgroundColor: agent.color,
                      boxShadow: `0 0 20px ${agent.color}, 0 0 40px ${agent.color}50`
                    }}
                  />
                  <p className="text-[#C4BEB5] text-base font-medium tracking-wide">{agent.name}</p>
                </div>
              ))}
            </div>

            <p className="text-xl text-[#C4BEB5]/70 max-w-3xl mx-auto leading-relaxed">
              Our multi-agent debate system forces diverse AI perspectives to collide. Through structured Socratic dialogue, 
              conflict becomes clarity. Bias dissolves. Truth emerges—transparent and verifiable.
            </p>
          </div>
        </div>
      </section>

      {/* CTA SECTION - The Summit */}
      <section ref={ctaRef} className="relative min-h-screen flex items-center justify-center px-4 py-32">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="./assets/images/55837_bp.jpg"
            alt="Summit"
            className="w-full h-full object-cover"
            style={{ filter: 'saturate(0.2) contrast(1.5) brightness(0.35)' }}
          />
          <div className="absolute inset-0 bg-[#050508]/80" />
        </div>

        {/* Content */}
        <div className="cta-content relative z-10 max-w-4xl text-center" style={{ transformStyle: 'preserve-3d' }}>
          <h2 className="text-6xl md:text-8xl font-bold text-[#C9A84C] mb-8 chiseled-text">
            Seek the truth.
          </h2>
          <p className="text-2xl text-[#C4BEB5] mb-12 max-w-2xl mx-auto">
            Join the beta. Be among the first to experience purity from chaos. The temple doors are opening.
          </p>
          <button 
            className="px-16 py-6 bg-[#E8913A] text-[#050508] font-bold text-2xl rounded-lg 
                       hover:bg-[#C9A84C] hover:scale-110 hover:shadow-2xl
                       transition-all duration-300 transform"
            style={{
              boxShadow: '0 0 40px rgba(232,145,58,0.5), 0 10px 30px rgba(0,0,0,0.8)'
            }}
          >
            Enter the Dojo
          </button>
          <p className="mt-8 text-sm text-[#C4BEB5]/50">Limited beta access. Pure truth only.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-[#050508] border-t border-[#1A1A2E] py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-[#C9A84C] mb-4">KATHAROΣ</h3>
          <p className="text-[#C4BEB5]/70 text-sm mb-8">
            Truth as a Service. Multi-agent AI debate forging consensus through conflict.
          </p>
          <div className="border-t border-[#1A1A2E] pt-8">
            <p className="text-[#C4BEB5]/50 text-sm">© 2026 Katharos Systems. Purity from chaos.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
