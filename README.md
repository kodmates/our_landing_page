# Kodmates — Enterprise Digital Product Studio

> **Building Digital Systems for the Real World.**  
> High-performance web applications, native Android software, and cloud infrastructure engineered for operational resilience.

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-000000?style=flat&logo=three.js&logoColor=white)](https://threejs.org/)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)

---

## 🌟 Key Highlights

- **Interactive 3D Digital Ecosystem**: Cinematic 3D hero scene built with Blender 5.x LTS and rendered in the browser using React Three Fiber (`@react-three/fiber`), Three.js, and `@react-three/drei`.
- **Theme-Reactive 3D Lighting**: The 3D scene dynamically adapts its ambient lighting, exposure, specular highlights, and contact shadows between Dark and Light mode.
- **Interactive 3D Cards**: Direct raycasting on the 3D modules (`Web`, `Android`, `Business`, `Cloud`, `API`, `Database`) with hover scale physics and smooth-scroll navigation to matching services.
- **Light & Dark Mode**: Persistent theme switcher with zero-flash pre-render initialization script and WCAG AAA/AA contrast compliance.
- **Blazing Fast Performance**:
  - Deferred 3D hydration via `requestIdleCallback` ensures instant First Contentful Paint (FCP).
  - Explicit vendor chunk splitting (`react-vendor`, `three-vendor`, and core application logic).
  - Build completes in under **800 ms** using Vite Rolldown.
- **Production SEO & Discovery**: Comprehensive Schema.org JSON-LD, Open Graph tags, Twitter Cards, canonical tags, [`robots.txt`](public/robots.txt), and [`sitemap.xml`](public/sitemap.xml).

---

## 🏗️ 3D Ecosystem Architecture

The 3D hero scene is generated via procedural Blender script ([`kodmates_hero_v2.py`](kodmates_hero_v2.py)) and exported with Draco geometry compression:

```
KODMATES_HERO
├── Core/
│   ├── CoreBody          # Dark graphite metallic sphere (radius = 2.0)
│   ├── CoreGrid          # Procedural Voronoi network grid with idle rotation
│   ├── CoreRecess        # Front aperture housing
│   └── CoreK             # 3D glowing "K" emblem in cream-gold (#F7D88F)
├── Modules/
│   ├── Web               # Upper-left module (Wireframe globe)
│   ├── Android           # Top module (Android head with antennae)
│   ├── Cloud             # Upper-right module (Volumetric cloud puffs)
│   ├── Database          # Lower-left module (Stacked database platters)
│   ├── API               # Lower-right module (3D code brackets)
│   └── Business          # Front-bottom module (Tiered bar charts)
├── Connections/          # Curved Bézier arcs with traveling data pulses
├── Orbits/               # 3 inclined orbital rings with scattered node beacons
└── Platform/             # 3-tier stepped circular metallic base with gold trim
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm** / **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/kodmates/our_landing_page.git
cd our_landing_page

# Install dependencies
npm install
```

### Local Development

Start the local Vite development server with HMR:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

Compile and minify for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 📁 Project Structure

```
├── blender/               # Blender source models and export assets
├── public/                # Static public assets served at root
│   ├── assets/            # Draco-compressed GLB model and textures
│   ├── draco/             # Local Google Draco WebAssembly decoders
│   ├── favicon.svg        # Brand icon
│   ├── robots.txt         # Crawler indexing directives
│   └── sitemap.xml        # Search engine sitemap
├── src/
│   ├── components/        # UI and 3D components
│   │   ├── Header.js      # Navigation bar and theme switcher
│   │   ├── Hero.js        # Hero layout and lazy WebGL mount host
│   │   ├── HeroScene.jsx  # React Three Fiber 3D ecosystem scene
│   │   ├── HeroSceneMount.jsx # React 19 mount boundary
│   │   ├── ServicesSection.js # Capabilities grid
│   │   ├── ProjectsSection.js # Case studies showcase
│   │   └── ContactSection.js  # Lead capture form
│   ├── pages/             # Subpage templates (Projects, Blog, Contact)
│   ├── styles/            # Modular stylesheets & design tokens
│   │   ├── tokens.css     # Dark/Light CSS design variables
│   │   ├── theme.css      # Theme overrides & interactive styles
│   │   └── sections.css   # Section typography and layout rules
│   └── main.js            # Vanilla SPA router and app lifecycle
├── kodmates_hero_v2.py    # Python Blender generator and Draco exporter
├── vite.config.js         # Vite configuration and chunk-splitting
└── package.json           # Scripts and dependency manifest
```

---

## 🎨 Design Tokens & Theme Engine

Kodmates features a unified color palette adhering to strict contrast ratios:

| Token | Dark Mode (`[data-theme="dark"]`) | Light Mode (`[data-theme="light"]`) |
| :--- | :--- | :--- |
| **Surface** | Obsidian (`#080B0C`) | Pure White (`#FFFFFF`) / Slate (`#F8FAFC`) |
| **Headings** | Crisp White (`#FFFFFF`) | Deep Slate 900 (`#0F172A`) |
| **Body** | Soft Light (`rgba(240,242,238,0.78)`) | Slate 700 (`#334155`) |
| **Accents** | Luminous Gold (`#FEEFB8`) | Warm Amber 700 (`#B45309`) |

---

## 🛠️ Blender Asset Pipeline

To rebuild the 3D assets from source:

```bash
# Headless render & Draco GLB export:
blender -b -P kodmates_hero_v2.py -- --render --export
```

Output `.glb` and baked emission textures are automatically placed in `export/` and synchronized with `public/assets/`.

---

## 📄 License

Copyright © 2026 Kodmates Technologies. All rights reserved.
Proprietary software. Unauthorized reproduction or redistribution is strictly prohibited.
