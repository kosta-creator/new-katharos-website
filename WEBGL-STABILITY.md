# WebGL Crash Prevention Guide

## Common Causes of WebGL Crashes

### 1. **Memory Leaks (Most Common)**
Three.js objects hold GPU memory. Not disposing = crash after minutes.

**The Fix:**
```typescript
useEffect(() => {
  const geometry = new THREE.SphereGeometry(1)
  const material = new THREE.MeshStandardMaterial()
  const mesh = new THREE.Mesh(geometry, material)
  
  return () => {
    // CRITICAL: Dispose everything
    geometry.dispose()
    material.dispose()
    // If texture: texture.dispose()
    scene.remove(mesh)
  }
}, [])
```

### 2. **WebGL Context Loss**
Browser/GPU kills context when overloaded or tab inactive too long.

**The Fix:**
```typescript
// In your Canvas component
<Canvas
  gl={{
    powerPreference: 'high-performance',
  }}
  onCreated={({ gl }) => {
    // Handle context loss
    gl.domElement.addEventListener('webglcontextlost', (e) => {
      e.preventDefault()
      console.log('Context lost - attempting restore')
    })
    
    gl.domElement.addEventListener('webglcontextrestored', () => {
      console.log('Context restored')
    })
  }}
>
```

### 3. **Too Many WebGL Contexts**
Browsers limit concurrent WebGL contexts (8-16). Multiple tabs with Three.js = crash.

**The Fix:**
- Only one Canvas per page
- Use `frameloop="demand"` to pause when not visible
- Destroy context when component unmounts

### 4. **Shader Compilation Errors**
Different GPUs/drivers support different GLSL features.

**The Fix:**
```typescript
// Check WebGL support before starting
const canvas = document.createElement('canvas')
const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')

if (!gl) {
  // Show CSS fallback
  return <FallbackUI />
}

// Feature detection
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
const isLowPower = navigator.hardwareConcurrency <= 4
```

### 5. **Memory Overload**
Too many particles, high-res textures, complex geometries.

**Current Safeguards Already in Place:**
- ✅ Particle count: 2000 (desktop), 800 (mobile)
- ✅ Pixel ratio capped: 2x (desktop), 1.5x (mobile)
- ✅ Antialiasing disabled on mobile
- ✅ `frameloop="demand"` on mobile (renders only when needed)
- ✅ Error boundary wraps canvas

## Additional Safeguards to Implement

### 1. **InstancedMesh for Particles (Major Performance Gain)**
Current: 2000 individual draw calls
Better: 1 draw call with 2000 instances

```typescript
// Instead of 2000 individual meshes:
const instancedMesh = new THREE.InstancedMesh(
  geometry,
  material,
  2000 // All particles in one GPU draw
)
```

### 2. **Texture Compression**
If using textures, compress them:
```typescript
// Use KTX2 or WebP formats
// Much smaller GPU memory footprint
```

### 3. **LOD (Level of Detail)**
Simplify models when far away:
```typescript
// High detail when close
// Low detail when far
// Imposter (billboard) when very far
```

### 4. **Monitor FPS & Adapt**
```typescript
let lastTime = performance.now()
let frames = 0

useFrame(() => {
  frames++
  const time = performance.now()
  
  if (time >= lastTime + 1000) {
    const fps = frames
    frames = 0
    lastTime = time
    
    if (fps < 30) {
      // Reduce quality automatically
      setParticleCount(prev => prev * 0.5)
    }
  }
})
```

### 5. **Proper Cleanup on Unmount**
Current code is missing disposal. Add this:

```typescript
// In OracleScene.tsx
useEffect(() => {
  return () => {
    // Dispose all geometries
    // Dispose all materials  
    // Dispose renderer
    renderer.dispose()
  }
}, [])
```

## Current Stability Status

| Factor | Status |
|--------|--------|
| Error Boundary | ✅ Implemented |
| Mobile Optimization | ✅ Implemented |
| Particle Limits | ✅ Implemented |
| Context Loss Handling | ❌ Not implemented |
| Proper Disposal | ❌ Not implemented |
| Instanced Rendering | ❌ Not implemented |
| FPS Monitoring | ❌ Not implemented |

## Recommendation

**For immediate stability:** Current implementation is good for production with the error boundary.

**For long-term stability:** Implement instanced rendering + proper disposal before scale.

**Want me to implement instanced rendering now?** (30 min, ~$1 API) — This is the biggest stability/performance win.