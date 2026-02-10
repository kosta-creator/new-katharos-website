'use client'

import { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function CameraController() {
  const { camera } = useThree()
  
  useEffect(() => {
    // Store initial position
    const initialZ = camera.position.z
    const initialY = camera.position.y
    
    // Hero section: Camera pushes in slightly
    gsap.to(camera.position, {
      z: initialZ - 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.climb-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    })
    
    // Camera tilts slightly as we scroll (looking up at the climb)
    gsap.to(camera.rotation, {
      x: -0.1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.climb-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    })
    
    // Problem section: Camera continues forward
    gsap.to(camera.position, {
      z: initialZ - 2,
      y: initialY + 0.5,
      ease: 'none',
      scrollTrigger: {
        trigger: '.problem-content',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    })
    
    // Dojo section: Camera rises up to see the circle
    gsap.to(camera.position, {
      z: 4, // Pull back to see full ring
      y: 2, // Rise up
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.dojo-content',
        start: 'top 80%',
        end: 'center center',
        scrub: 1,
      },
    })
    
    // CTA section: Camera settles
    gsap.to(camera.position, {
      z: 5,
      y: 0,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: '.climb-section:last-of-type',
        start: 'top bottom',
        end: 'center center',
        scrub: 1,
      },
    })
    
    return () => {
      // Kill only our ScrollTriggers
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === '.climb-section' || 
            st.vars.trigger === '.problem-content' ||
            st.vars.trigger === '.dojo-content') {
          st.kill()
        }
      })
    }
  }, [camera])
  
  return null
}
