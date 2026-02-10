'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Custom shader for instanced particles
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  
  attribute vec3 aOffset;
  attribute float aSize;
  attribute float aSpeed;
  attribute vec3 aColor;
  attribute float aPhase;
  
  varying vec3 vColor;
  varying float vAlpha;
  
  void main() {
    vColor = aColor;
    
    // Instance position + vertex position
    vec3 pos = position * aSize + aOffset;
    
    // Float upward with time
    float yOffset = mod(uTime * aSpeed + aPhase, 20.0) - 10.0;
    pos.y += yOffset;
    
    // Sine wave drift
    pos.x += sin(uTime * 0.5 + aPhase) * 0.3;
    pos.z += cos(uTime * 0.3 + aPhase) * 0.3;
    
    // Mouse interaction
    vec2 mouseInfluence = (uMouse - pos.xy) * 0.1;
    float dist = length(mouseInfluence);
    if (dist < 2.0) {
      pos.xy += mouseInfluence * (2.0 - dist) * 0.5;
    }
    
    // Fade based on height
    vAlpha = 1.0 - smoothstep(5.0, 10.0, pos.y + 5.0);
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation
    gl_PointSize = aSize * (100.0 / -mvPosition.z);
  }
`

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  
  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    
    if (dist > 0.5) discard;
    
    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    glow = pow(glow, 1.5);
    
    gl_FragColor = vec4(vColor, vAlpha * glow);
  }
`

interface InstancedParticlesProps {
  count?: number
}

export default function InstancedParticles({ count = 2000 }: InstancedParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  
  // Track mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Generate instance data
  const { geometry, material } = useMemo(() => {
    // Base geometry for each particle (a simple point)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3))
    
    // Instance attributes
    const offsets = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const speeds = new Float32Array(count)
    const colors = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    
    // Color palette (300 Oracle)
    const palette = [
      new THREE.Color('#E8913A'),
      new THREE.Color('#C9A84C'),
      new THREE.Color('#8B7355'),
      new THREE.Color('#E8E4DF'),
      new THREE.Color('#4DC9F6'),
    ]
    
    for (let i = 0; i < count; i++) {
      // Position in volume
      offsets[i * 3] = (Math.random() - 0.5) * 20
      offsets[i * 3 + 1] = (Math.random() - 0.5) * 20
      offsets[i * 3 + 2] = (Math.random() - 0.5) * 10
      
      sizes[i] = Math.random() * 3 + 1
      speeds[i] = Math.random() * 0.5 + 0.2
      phases[i] = Math.random() * Math.PI * 2
      
      const color = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    
    geo.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offsets, 3))
    geo.setAttribute('aSize', new THREE.InstancedBufferAttribute(sizes, 1))
    geo.setAttribute('aSpeed', new THREE.InstancedBufferAttribute(speeds, 1))
    geo.setAttribute('aColor', new THREE.InstancedBufferAttribute(colors, 3))
    geo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1))
    
    // Shader material
    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    
    return { geometry: geo, material: mat }
  }, [count])

  // Animation loop
  useFrame((state) => {
    if (material) {
      material.uniforms.uTime.value = state.clock.elapsedTime
      material.uniforms.uMouse.value.set(
        mouseRef.current.x * 10,
        mouseRef.current.y * 10
      )
    }
  })

  // Cleanup on unmount - CRITICAL for stability
  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
    />
  )
}
