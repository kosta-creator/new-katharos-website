'use client'

import { useRef, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Interactive ripple effect when clicking in the scene
export function useRippleEffect() {
  const { scene } = useThree()
  const ripplesRef = useRef<Array<{
    mesh: THREE.Mesh
    startTime: number
    position: THREE.Vector3
  }>>([])
  
  const createRipple = useCallback((position: THREE.Vector3) => {
    const geometry = new THREE.RingGeometry(0.1, 0.2, 32)
    const material = new THREE.MeshBasicMaterial({
      color: '#C9A84C',
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    })
    
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.copy(position)
    mesh.rotation.x = -Math.PI / 2
    mesh.position.y = 0.1
    
    scene.add(mesh)
    
    ripplesRef.current.push({
      mesh,
      startTime: Date.now(),
      position: position.clone(),
    })
  }, [scene])
  
  useFrame(() => {
    const now = Date.now()
    
    ripplesRef.current = ripplesRef.current.filter((ripple) => {
      const age = (now - ripple.startTime) / 1000 // seconds
      
      if (age > 1.5) {
        // Remove old ripple
        scene.remove(ripple.mesh)
        ripple.mesh.geometry.dispose()
        ;(ripple.mesh.material as THREE.Material).dispose()
        return false
      }
      
      // Animate ripple
      const scale = 1 + age * 5
      ripple.mesh.scale.setScalar(scale)
      ;(ripple.mesh.material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - age / 1.5)
      
      return true
    })
  })
  
  return { createRipple }
}

// Spark effect when hovering over philosophers
export function SparkEffect({ position, color, active }: { 
  position: [number, number, number]
  color: string
  active: boolean 
}) {
  const particlesRef = useRef<THREE.Points>(null)
  const count = 20
  
  const positions = useRef(new Float32Array(count * 3))
  const velocities = useRef(new Float32Array(count * 3))
  
  // Initialize particles
  for (let i = 0; i < count; i++) {
    positions.current[i * 3] = position[0]
    positions.current[i * 3 + 1] = position[1]
    positions.current[i * 3 + 2] = position[2]
    
    velocities.current[i * 3] = (Math.random() - 0.5) * 0.1
    velocities.current[i * 3 + 1] = Math.random() * 0.1
    velocities.current[i * 3 + 2] = (Math.random() - 0.5) * 0.1
  }
  
  useFrame(() => {
    if (!particlesRef.current || !active) return
    
    const pos = particlesRef.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < count; i++) {
      // Update position
      pos[i * 3] += velocities.current[i * 3]
      pos[i * 3 + 1] += velocities.current[i * 3 + 1]
      pos[i * 3 + 2] += velocities.current[i * 3 + 2]
      
      // Reset if too far
      const dx = pos[i * 3] - position[0]
      const dy = pos[i * 3 + 1] - position[1]
      const dz = pos[i * 3 + 2] - position[2]
      
      if (Math.sqrt(dx * dx + dy * dy + dz * dz) > 2) {
        pos[i * 3] = position[0]
        pos[i * 3 + 1] = position[1]
        pos[i * 3 + 2] = position[2]
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })
  
  if (!active) return null
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.1}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Energy beam connecting philosophers during debate
export function EnergyBeam({ 
  start, 
  end, 
  active 
}: { 
  start: [number, number, number]
  end: [number, number, number]
  active: boolean 
}) {
  const beamRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (!beamRef.current || !active) return
    
    // Pulsing effect
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.3
    beamRef.current.scale.y = pulse
  })
  
  if (!active) return null
  
  const direction = new THREE.Vector3(end[0] - start[0], end[1] - start[1], end[2] - start[2])
  const length = direction.length()
  const midPoint = new THREE.Vector3((start[0] + end[0]) / 2, (start[1] + end[1]) / 2, (start[2] + end[2]) / 2)
  
  return (
    <mesh ref={beamRef} position={midPoint}>
      <cylinderGeometry args={[0.02, 0.02, length]} />
      <meshBasicMaterial color="#C9A84C" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
    </mesh>
  )
}
