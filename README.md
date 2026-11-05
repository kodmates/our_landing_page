# Kodmates — 3D Digital Software Ecosystem Hero

A cinematic, interactive 3D hero ecosystem built for Kodmates with **Blender 5.2 LTS**, **Draco-compressed glTF/GLB**, and **React Three Fiber (`@react-three/fiber` & `@react-three/drei`)**.

---

## 1. Scene Architecture (Blueprint Specification)

The 3D hero model is structured under a clean hierarchy matching the canonical design specification:

* **Core (`collection: Core`):**
  * `CoreBody`: Dark graphite metallic sphere (radius = 2.0).
  * `CoreGrid`: Gold wireframe network icosphere with idle rotation.
  * `CoreBands`: Concentric orbital network rings around the core.
  * `CoreRecess` & `CoreK`: Recessed aperture on the front (-Y) with gold double bezels and a glowing 3D "K" emblem.
  * `CoreGlow`: Warm point light illuminating the internal emblem.
* **Modules (`collection: Modules`):**
  * Six rounded-cube hardware modules floating around the core with gold bezels and dark inset screens:
    1. **Web:** Upper-left with wireframe globe icon.
    2. **Android:** Top with native Android head and antennae.
    3. **Cloud:** Upper-right with volumetric cloud puffs.
    4. **API:** Lower-right with 3D `</>` brackets icon.
    5. **Database:** Lower-left with stacked cylindrical disks.
    6. **Business:** Front-bottom with tiered 3D bar chart.
* **Connections (`collection: Connections`):**
  * Single restrained gold Bézier curves connecting each module to the central core.
  * Gold data pulse spheres traversing each curve with scripted phase offsets.
  * Glowing connection nodes at the module terminals.
* **Orbits (`collection: Orbits`):**
  * 3 angled thin gold orbital rings rotating at differing velocities.
  * 90 scattered glowing data node icospheres.
* **Platform (`collection: Platform`):**
  * Stepped 3-tier dark metallic circular base with glowing gold ring trim.
* **Backdrop (`collection: Backdrop`):**
  * Ground plane and atmospheric displaced mountain horizon (isolated from web GLB exports).

---

## 2. Running in Blender (4.2+ / 5.x LTS)

### Option A: GUI (Scripting Workspace)
1. Open Blender (4.2+ or 5.2.1 LTS).
2. Go to the **Scripting** tab.
3. Click **Text > Open** and select `kodmates_hero.py`.
4. Press **Run Script** (`Alt + P`).
5. In the 3D Viewport, press `Z` and choose **Material Preview** or **Rendered**.

### Option B: Headless Command Line (CLI)
Execute via PowerShell:
```powershell
& "D:\Blender5\blender.exe" -b -P kodmates_hero.py
```
This automatically builds the scene, runs Draco compression, exports `blender/export/kodmates_hero.glb`, and syncs it to `public/assets/kodmates_hero.glb`.

---

## 3. Exporting the Optimized GLB

The export pipeline is built directly into `kodmates_hero.py`:
* **Output Path:** `blender/export/kodmates_hero.glb` (and copied to `public/assets/kodmates_hero.glb`).
* **Format:** Binary `.glb` with Draco mesh compression enabled.
* **Modifiers:** Fully applied.
* **File Size:** ~0.30 MB (well below the 2–8 MB budget for instant web load).
* **Backdrop Exclusion:** Mountains and ground are automatically excluded from the web bundle to keep the model lightweight and transparent.

---

## 4. React Three Fiber Integration

The React component is located at `src/components/HeroScene.jsx`:

### Importing as a React Component:
```jsx
import React from 'react';
import HeroScene from './components/HeroScene.jsx';

export default function MyPage() {
  return (
    <div className="hero-right-col">
      <HeroScene />
    </div>
  );
}
```

### Mounting into Vanilla DOM Containers:
If your project uses a lightweight SPA router or vanilla shell:
```javascript
import { mountHeroScene } from './components/HeroSceneMount.jsx';

const container = document.getElementById('hero-3d-wrapper');
const sceneInstance = mountHeroScene(container);

// To unmount:
// sceneInstance.destroy();
```

---

## 5. Website Interactive Features

1. **Draco Preloading & Suspense:** `useGLTF.preload('/assets/kodmates_hero.glb')` begins downloading the asset immediately. `Suspense` displays a branded gold loader during initialization.
2. **Idle Rotations:** Smooth, continuous rotation of the network grid and orbital rings at ~0.06–0.12 rad/s.
3. **Pointer Parallax:** Interactive tracking of cursor coordinates with smooth dampening (`lerp`).
4. **Module Hover:** Interactive raycasting boosts emissive intensity from 1.0 to 3.0 and smoothly scales the hovered module to 1.08x.
5. **Data Pulses:** Floating energy nodes cycle rhythmically between the core and domain modules.
6. **Accessibility (`prefers-reduced-motion`):** Automatically detects accessibility settings and disables motion while preserving pristine framing.
7. **Mobile Optimization:** Automatically scales down DPR to 1.5 and widens camera FOV on viewports under 768px.

---

## 6. Development & Verification

Run the local Vite development server:
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser to verify the interactive 3D hero.
