'use client'

import { useRef, useState, useMemo, Suspense } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { Html, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export interface AgentData {
  id: number
  name: string
  role: string
  color: string
  description: string
  pose: 'scroll' | 'torch' | 'arms'
  modelPath?: string // Path to GLTF model if available
}

export const agents: AgentData[] = [
  { id: 1, name: 'Reasoning Core', role: 'Logical Analysis', color: '#4DC9F6', description: 'Cold logic. Lightning-fast deduction. No bias, just facts.', pose: 'scroll', modelPath: '/models/philosopher-1.glb' },
  { id: 2, name: 'Empathy', role: 'Human Understanding', color: '#A78BFA', description: 'Reads between the lines. Understands human nuance.', pose: 'arms', modelPath: '/models/philosopher-2.glb' },
  { id: 3, name: 'Neutrality', role: 'Unbiased Arbiter', color: '#C4BEB5', description: 'The center cannot hold bias. Pure objectivity.', pose: 'scroll', modelPath: '/models/philosopher-3.glb' },
  { id: 4, name: 'Mediation', role: 'Conflict Resolution', color: '#E8913A', description: 'Finds middle ground. Forges consensus.', pose: 'torch', modelPath: '/models/philosopher-4.glb' },
  { id: 5, name: 'Perspective', role: 'Alternative Views', color: '#10B981', description: 'Sees all angles. Challenges assumptions.', pose: 'scroll', modelPath: '/models/philosopher-5.glb' },
  { id: 6, name: 'Strategy', role: 'Tactical Thinking', color: '#C9A84C', description: 'Long-term vision. Plans three moves ahead.', pose: 'torch', modelPath: '/models/philosopher-6.glb' },
  { id: 7, name: 'Outcome', role: 'Result Analysis', color: '#EC4899', description: 'Evaluates consequences. Judges results.', pose: 'arms', modelPath: '/models/philosopher-7.glb' },
]

// Try to load GLTF model, fallback to silhouette
function PhilosopherWithFallback({ 
  agent, 
  isHovered 
}: { 
  agent: AgentData
  isHovered: boolean 
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [useFallback, setUseFallback] = useState(false)

  // Try to load GLTF model
  let gltf: any = null
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    gltf = useGLTF(agent.modelPath || '', true)
  } catch (e) {
    // Model not found, use fallback
  }

  useEffect(() => {
    if (!gltf && agent.modelPath) {
      setUseFallback(true)
    }
  }, [gltf, agent.modelPath])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5 + agent.id) * 0.05
    }
  })

  // If GLTF loaded successfully, use it
  if (gltf && !useFallback) {
    return (
      <group ref={groupRef}>
        <primitive 
          object={gltf.scene.clone()} 
          scale={0.5}
          rotation={[0, Math.PI, 0]}
        />
        {/* Rim light */}
        <pointLight
          position={[0, 0, -1]}
          color={agent.color}
          intensity={isHovered ? 2 : 0.5}
          distance={3}
          decay={2}
        />
      </group>
    )
  }

  // Fallback to procedural silhouette
  return (
    <group ref={groupRef}>
      <PhilosopherSilhouette color={agent.color} pose={agent.pose} isHovered={isHovered} />
    </group>
  )
}

// Procedural silhouette (fallback when no GLTF model)
function PhilosopherSilhouette({ 
  color, 
  pose, 
  isHovered 
}: { 
  color: string
  pose: string
  isHovered: boolean 
}) {
  return (
    <group>
      {/* Enhanced robed body with more detail */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.35, 0.45, 1.6, 12]} />
        <meshStandardMaterial color="#0A0A0F" roughness={0.95} />
      </mesh>

      {/* Hood/head */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#050508" roughness={1} />
      </mesh>

      {/* Shoulders */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.4, 0.35, 0.3, 12]} />
        <meshStandardMaterial color="#0A0A0F" roughness={0.95} />
      </mesh>

      {/* Pose-specific props */}
      {pose === 'scroll' && (
        <group position={[0.35, -0.1, 0.25]} rotation={[0, 0, -0.3]}>
          <mesh>
            <cylinderGeometry args={[0.04, 0.04, 0.5]} />
            <meshStandardMaterial color="#8B7355" />
          </mesh>
          {/* Glowing scroll text */}
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.2]} />
            <meshStandardMaterial color="#C9A84C" emissive="#C9A84C" emissiveIntensity={0.5} />
          </mesh>
        </group>
      )}

      {pose === 'torch' && (
        <group position={[0.4, 0.1, 0.2]}>
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.45]} />
            <meshStandardMaterial color="#5C4A3A" />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
          </mesh>
          {/* Flame glow */}
          <pointLight color={color} intensity={1} distance={2} decay={2} />
        </group>
      )}

      {pose === 'arms' && (
        <>
          <mesh position={[-0.4, -0.1, 0]} rotation={[0, 0, 0.6]}>
            <capsuleGeometry args={[0.05, 0.5]} />
            <meshStandardMaterial color="#0A0A0F" />
          </mesh>
          <mesh position={[0.4, -0.1, 0]} rotation={[0, 0, -0.6]}>
            <capsuleGeometry args={[0.05, 0.5]} />
            <meshStandardMaterial color="#0A0A0F" />
          </mesh>
        </>
      )}

      {/* Rim light plane */}
      <mesh position={[0, 0, -0.4]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.2, 2.2]} />
        <meshBasicMaterial color={color} transparent opacity={isHovered ? 0.35 : 0.15} side={THREE.DoubleSide} />
      </mesh>

      {/* Hover glow */}
      {isHovered && (
        <mesh>
          <sphereGeometry args={[0.9, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.08} />
        </mesh>
      )}
    </group>
  )
}

// Need useEffect import
import { useEffect } from 'react'

interface AgentPhilosopherProps {
  agent: AgentData
  position: [number, number, number]
  angle: number
  isHovered: boolean
  onHover: (id: number | null) => void
  onClick: (agent: AgentData) => void
}

function AgentPhilosopher({ 
  agent, 
  position, 
  angle,
  isHovered, 
  onHover,
  onClick
}: AgentPhilosopherProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current && !isHovered) {
      groupRef.current.rotation.y = -angle + Math.PI / 2
    }
  })

  return (
    <group 
      ref={groupRef}
      position={position}
      onPointerEnter={() => onHover(agent.id)}
      onPointerLeave={() => onHover(null)}
      onClick={() => onClick(agent)}
    >
      <Suspense fallback={<PhilosopherSilhouette color={agent.color} pose={agent.pose} isHovered={isHovered} />}>
        <PhilosopherWithFallback agent={agent} isHovered={isHovered} />
      </Suspense>

      {/* Ground shadow */}
      <mesh position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.6, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.5} />
      </mesh>

      {/* Hover tooltip */}
      {isHovered && (
        <Html distanceFactor={10} position={[0, 1.4, 0]}>
          <div className="bg-[#050508] border border-[#C9A84C] p-4 rounded-lg shadow-xl max-w-xs pointer-events-none">
            <h3 className="text-[#C9A84C] font-bold text-lg">{agent.name}</h3>
            <p className="text-[#4DC9F6] text-sm mb-2">{agent.role}</p>
            <p className="text-[#C4BEB5] text-sm">{agent.description}</p>
          </div>
        </Html>
      )}

      {/* Label */}
      <Html distanceFactor={15} position={[0, -1.7, 0]}>
        <div className="text-center pointer-events-none">
          <p className="text-[#C4BEB5] text-xs tracking-wider opacity-70">{agent.name}</p>
        </div>
      </Html>
    </group>
  )
}

// Central Oracle Fire with enhanced particles
function OracleFlame() {
  const flameRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  const particlesRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (flameRef.current) {
      const flicker = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.1 + Math.random() * 0.05
      flameRef.current.scale.setScalar(flicker)
    }
    if (lightRef.current) {
      lightRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 10) * 0.3
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  // Smoke particles
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(30 * 3)
    for (let i = 0; i < 30; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.8
      positions[i * 3 + 1] = Math.random() * 2 + 0.5
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.8
    }
    return positions
  }, [])

  return (
    <group>
      <pointLight ref={lightRef} position={[0, 1, 0]} color="#E8913A" intensity={2} distance={10} decay={2} />
      
      <mesh ref={flameRef} position={[0, 0.5, 0]}>
        <coneGeometry args={[0.3, 1, 8]} />
        <meshStandardMaterial color="#E8913A" emissive="#E8913A" emissiveIntensity={2} roughness={0.1} />
      </mesh>
      
      <mesh position={[0, 0.5, 0]} scale={0.6}>
        <coneGeometry args={[0.2, 0.8, 8]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={3} />
      </mesh>

      {/* Smoke particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={30} array={particlePositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#1A1A2E" size={0.15} transparent opacity={0.4} />
      </points>
    </group>
  )
}

// Connection wisps between philosophers
function ConnectionWisps({ hoveredAgent }: { hoveredAgent: number | null }) {
  const linesRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  const radius = 2.5
  const count = 7

  return (
    <group ref={linesRef}>
      {Array.from({ length: count }).map((_, i) => {
        const angle1 = (i / count) * Math.PI * 2
        const x1 = Math.cos(angle1) * radius
        const z1 = Math.sin(angle1) * radius

        const angle2 = ((i + 1) % count / count) * Math.PI * 2
        const x2 = Math.cos(angle2) * radius
        const z2 = Math.sin(angle2) * radius

        return (
          <mesh key={i} position={[(x1 + x2) / 2, 0, (z1 + z2) / 2]} rotation={[0, Math.atan2(z2 - z1, x2 - x1), Math.PI / 2]}>
            <cylinderGeometry args={[0.01, 0.01, radius * 1.3]} />
            <meshBasicMaterial color={hoveredAgent ? agents[hoveredAgent - 1]?.color : '#C9A84C'} transparent opacity={hoveredAgent ? 0.25 : 0.05} />
          </mesh>
        )
      })}
    </group>
  )
}

interface AgentRingProps {
  onAgentClick?: (agent: AgentData) => void
}

export default function AgentRing({ onAgentClick }: AgentRingProps) {
  const [hoveredAgent, setHoveredAgent] = useState<number | null>(null)
  const groupRef = useRef<THREE.Group>(null)

  const radius = 2.5
  const agentData = useMemo(() => {
    return agents.map((agent, i) => {
      const angle = (i / agents.length) * Math.PI * 2
      return {
        agent,
        position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius] as [number, number, number],
        angle,
      }
    })
  }, [])

  return (
    <group ref={groupRef}>
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4, 32]} />
        <meshStandardMaterial color="#1A1A2E" roughness={0.9} />
      </mesh>

      <mesh position={[0, -1.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.3, 2.5, 64]} />
        <meshStandardMaterial color="#C9A84C" roughness={0.8} />
      </mesh>

      <ConnectionWisps hoveredAgent={hoveredAgent} />
      <OracleFlame />

      {agentData.map(({ agent, position, angle }) => (
        <AgentPhilosopher
          key={agent.id}
          agent={agent}
          position={position}
          angle={angle}
          isHovered={hoveredAgent === agent.id}
          onHover={setHoveredAgent}
          onClick={onAgentClick || (() => {})}
        />
      ))}

      <ambientLight intensity={0.1} />
    </group>
  )
}

// Preload GLTF models
useGLTF.preload('/models/philosopher-1.glb')
useGLTF.preload('/models/philosopher-2.glb')
useGLTF.preload('/models/philosopher-3.glb')
useGLTF.preload('/models/philosopher-4.glb')
useGLTF.preload('/models/philosopher-5.glb')
useGLTF.preload('/models/philosopher-6.glb')
useGLTF.preload('/models/philosopher-7.glb')

// Cleanup GLTF cache on unmount
useEffect(() => {
  return () => {
    useGLTF.clear('/models/philosopher-1.glb')
    useGLTF.clear('/models/philosopher-2.glb')
    useGLTF.clear('/models/philosopher-3.glb')
    useGLTF.clear('/models/philosopher-4.glb')
    useGLTF.clear('/models/philosopher-5.glb')
    useGLTF.clear('/models/philosopher-6.glb')
    useGLTF.clear('/models/philosopher-7.glb')
  }
}, [])
