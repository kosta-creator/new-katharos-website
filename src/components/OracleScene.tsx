'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import InstancedParticles from './InstancedParticles'
import RainSystem from './RainSystem'
import CameraController from './CameraController'

interface OracleSceneProps {
  particleCount?: number
}

export default function OracleScene({ particleCount = 2000 }: OracleSceneProps) {
  const fogRef = useRef<THREE.Fog>(null)
  
  // Memoize colors
  const backgroundColor = useMemo(() => new THREE.Color('#050508'), [])
  const fogColor = useMemo(() => new THREE.Color('#1A1A2E'), [])

  // Cleanup
  useEffect(() => {
    return () => {
      backgroundColor.dispose()
      fogColor.dispose()
    }
  }, [backgroundColor, fogColor])

  return (
    <>
      {/* Dark background - 300 Oracle midnight */}
      <color attach="background" args={['#050508']} />
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#1A1A2E', 3, 30]} />
      
      {/* Ambient light */}
      <ambientLight intensity={0.05} />
      
      {/* Torch light */}
      <pointLight 
        position={[0, -5, 2]} 
        color="#E8913A" 
        intensity={2} 
        distance={20}
        decay={2}
      />
      
      {/* Rim light */}
      <pointLight 
        position={[-5, 5, -5]} 
        color="#4DC9F6" 
        intensity={0.5}
        distance={30}
      />

      {/* Rain and lightning */}
      <RainSystem intensity={0.7} />

      {/* Ember particles */}
      <InstancedParticles count={particleCount} />
      
      {/* Camera controller for scroll movement */}
      <CameraController />
    </>
  )
}
