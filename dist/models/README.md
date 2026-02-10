# Adding 3D Models to Katharos

## Current Status
The site works with **procedural silhouettes** — basic shapes that represent philosophers.

To upgrade to **high-quality 3D models**:

## Step 1: Download Free Models

### Option A: Sketchfab (Recommended)
1. Go to https://sketchfab.com/search?q=ancient+greek+statue
2. Filter by: **Downloadable** + **CC Attribution** or **CC0**
3. Download 7 different models (GLB format preferred)
4. Good search terms:
   - "ancient greek philosopher"
   - "roman statue bust"
   - "classical sculpture"
   - "marble statue"

### Option B: Tripo3D (AI Generation)
1. Go to https://www.tripo3d.ai
2. Create free account
3. Use prompts like:
   ```
   "Ancient Greek philosopher, weathered marble statue, robed figure, holding scroll, dramatic lighting"
   "Greek oracle, mysterious figure, tattered robes, torch, stone temple"
   "Spartan elder, ancient warrior, weathered bronze, helmet"
   ```
4. Download generated GLB files

## Step 2: Place Models

Rename downloaded files to:
```
public/models/
├── philosopher-1.glb
├── philosopher-2.glb
├── philosopher-3.glb
├── philosopher-4.glb
├── philosopher-5.glb
├── philosopher-6.glb
└── philosopher-7.glb
```

## Step 3: Rebuild

```bash
cd katharos/my-app
npm run build
```

The code will automatically detect and use GLTF models. If a model is missing or fails to load, it falls back to the procedural silhouette.

## Step 4: Deploy

Upload the new `dist/` folder to AWS Amplify.

## Tips for 300 Oracle Aesthetic

When selecting/downloading models:
- **Dark/moody** — Avoid bright colors
- **Weathered/aged** — Stone, bronze, or marble textures
- **Robed figures** — Classical drapery
- **Props** — Scrolls, torches, staffs
- **Deformed/mysterious** — The 300 Oracle scene had deformed priests

## No Models? No Problem

The procedural silhouettes are already enhanced with:
- Detailed robe geometry
- Pose-specific props (scrolls, torches)
- Colored rim lighting
- Smoke particles
- Dynamic shadows

The site works great without external models!
