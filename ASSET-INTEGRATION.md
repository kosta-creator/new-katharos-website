# 3D Asset Integration Plan — Greek Philosophers

## Free Model Sources (CC0/Free License)

### 1. Sketchfab (Direct Download)
**Search terms:** "ancient greek statue", "philosopher bust", "roman statue"
**Recommended models:**
- https://sketchfab.com/3d-models/bust-of-a-philosopher-cc0
- https://sketchfab.com/3d-models/greek-statue-classical
- Filter: Downloadable + CC Attribution

### 2. Poly Pizza (Google Poly Archive)
**Search:** https://poly.pizza/search/statue
**Models available:** Low-poly statues, free to use

### 3. Tripo3D (AI Generation)
**Website:** https://www.tripo3d.ai
**Prompts for 300 Oracle aesthetic:**
```
"Ancient Greek philosopher, weathered marble statue, robed, holding scroll, dramatic lighting, dark background, chiaroscuro"

"Greek oracle figure, tattered robes, deformed, eerie, torch-lit, stone texture, ominous atmosphere"

"Spartan elder, ancient armor, weathered bronze, dramatic rim lighting, marble ruins"
```

## Download Locations

Place downloaded GLTF/GLB files in:
```
katharos/my-app/public/models/
├── philosopher-1.glb
├── philosopher-2.glb
├── philosopher-3.glb
├── philosopher-4.glb
├── philosopher-5.glb
├── philosopher-6.glb
└── philosopher-7.glb
```

## Code Integration

The `AgentRing.tsx` component now supports:
- `<PhilosopherModel />` — Uses GLTF models when available
- Fallback to `<PhilosopherSilhouette />` — Procedural shapes

## Post-Processing for 300 Aesthetic

Apply to all models:
1. **Dark material override** — Multiply textures by 0.3
2. **Colored rim light** — Each philosopher gets unique accent color
3. **Fog integration** — Fade into scene fog
4. **Emissive highlights** — Scrolls/torches glow

## Manual Steps Required

1. **Download 7 models** from Sketchfab (free tier)
2. **Convert to GLB** if needed (Sketchfab provides this)
3. **Place in public/models/** folder
4. **Update AgentRing.tsx** — Uncomment GLTF loading code
5. **Test** — Verify models load and render correctly

## Alternative: Procedural Enhancement

If no suitable models found, enhance current silhouettes:
- Add vertex displacement for cloth folds
- Multi-mesh robes (overlapping primitives)
- Animated torch flames
- Particle breath in cold air
- More detailed hands/props
