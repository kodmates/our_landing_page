/**
 * Kodmates Hero 3D Scene Component
 * Built with @react-three/fiber and @react-three/drei
 *
 * Implements:
 * - Local Draco-compressed GLB loading via useGLTF pointing to /draco/gltf/
 * - Automatic bounding-box computation & camera fitting (Box3 + drei Bounds)
 * - Environment preset="city" for realistic PBR metallic reflections on graphite sphere
 * - Studio lighting: warm key (#FEEFB8), rim (#FFD494), ambient, and fill
 * - Emissive gold boost for K emblem, orbital rings, and connection lines
 * - Idle rotation strictly constrained to CoreGrid and OrbitRing1-3 (K remains locked camera-facing)
 * - True 3D CatmullRomCurve3 data pulses travelling dynamically between core and modules
 * - Responsive 100% canvas fitting without navbar overflow
 */

import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const GLB_URL = '/assets/kodmates_hero.glb';
const DRACO_PATH = '/draco/gltf/';

// Configure local Draco decoder path (zero CDN dependencies)
useGLTF.setDecoderPath(DRACO_PATH);
useGLTF.preload(GLB_URL, DRACO_PATH);

const MODULE_NAMES = ['Web', 'Android', 'Cloud', 'Database', 'API', 'Business'];

/**
 * Lightweight Loading Fallback for Suspense
 */
export function HeroLoadingFallback() {
  return (
    <Html center>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '16px 24px',
          background: 'rgba(10, 15, 16, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: '1px solid rgba(254, 239, 184, 0.25)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
          pointerEvents: 'none'
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '2px solid rgba(254, 239, 184, 0.2)',
            borderTopColor: '#feefb8',
            animation: 'spin 1s linear infinite'
          }}
        />
        <span
          style={{
            fontSize: '11px',
            fontFamily: 'monospace',
            letterSpacing: '0.12em',
            color: '#feefb8',
            textTransform: 'uppercase'
          }}
        >
          Loading 3D Ecosystem
        </span>
      </div>
    </Html>
  );
}

/**
 * Camera Controller & Bounding Box Framing
 */
function CameraController({ scene, isMobile }) {
  const { camera, size } = useThree();

  useEffect(() => {
    if (!scene) return;

    // 1. Compute exact Box3 bounding box of the loaded GLB
    const box = new THREE.Box3().setFromObject(scene);
    const boxSize = new THREE.Vector3();
    const boxCenter = new THREE.Vector3();
    box.getSize(boxSize);
    box.getCenter(boxCenter);

    console.log('>>> [HERO 3D] GLB Bounding Box:');
    console.log('    Min:    [', box.min.x.toFixed(2), box.min.y.toFixed(2), box.min.z.toFixed(2), ']');
    console.log('    Max:    [', box.max.x.toFixed(2), box.max.y.toFixed(2), box.max.z.toFixed(2), ']');
    console.log('    Size:   [', boxSize.x.toFixed(2), boxSize.y.toFixed(2), boxSize.z.toFixed(2), ']');
    console.log('    Center: [', boxCenter.x.toFixed(2), boxCenter.y.toFixed(2), boxCenter.z.toFixed(2), ']');

    // 2. Compute camera distance with tighter margin (1.05) to fill the right column
    const fovRad = (camera.fov * Math.PI) / 180;
    const aspect = size.width / size.height;

    const fitHeightDist = (boxSize.y / 2) / Math.tan(fovRad / 2);
    const fitWidthDist = ((boxSize.x / 2) / Math.tan(fovRad / 2)) / Math.max(aspect, 0.45);
    
    // Margin multiplier: 1.05 as requested to fill right column height like reference sheet
    const margin = isMobile ? 1.04 : 1.05;
    let dist = Math.max(fitHeightDist, fitWidthDist) * margin;

    // Centered cleanly on the core & ecosystem with full stepped base and top module visible
    const targetY = boxCenter.y;
    camera.position.set(0, targetY + 0.15, dist);
    camera.lookAt(0, targetY, 0);
    camera.updateProjectionMatrix();

    console.log('>>> [HERO 3D] Camera Fitted Position: [', camera.position.x.toFixed(2), camera.position.y.toFixed(2), camera.position.z.toFixed(2), ']');
    console.log('>>> [HERO 3D] Camera FOV:', camera.fov, '| Canvas Aspect:', aspect.toFixed(2), '| Margin:', margin);
  }, [scene, camera, size, isMobile]);

  return null;
}

/**
 * Ecosystem Model & Mesh Setup
 */
function EcosystemModel({ prefersReducedMotion, isMobile }) {
  const { scene } = useGLTF(GLB_URL, DRACO_PATH);
  const rootRef = useRef();
  const [hoveredModule, setHoveredModule] = useState(null);

  // Mouse & Scroll coordinates for subtle parallax (does not rotate whole scene away)
  const pointerPos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollOffset = useRef(0);

  // Traverse scene once to enhance materials and collect interactive node references
  const { modules, coreGrid, orbitRings, pulseMeshes, coreK } = useMemo(() => {
    const mods = [];
    let grid = null;
    let kEmblem = null;
    const rings = [];
    const pulses = {};

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          child.material.toneMapped = true;
          // Step 2: Use low envMapIntensity (0.35) so dark platform and graphite sphere do not reflect as white
          child.material.envMapIntensity = 0.35;

          // Core Body: dark charcoal graphite sphere with fine gold network lines (subtle emissive 0.6)
          if (child.name === 'CoreBody') {
            child.material.color.set(0x101416);
            child.material.metalness = 1.0;
            child.material.roughness = 0.35;
            if (child.material.emissive) {
              child.material.emissive.set('#FFB92E');
              child.material.emissiveIntensity = 0.6;
            }
          }

          // Core Aperture Bezel & Recess: deep charcoal/black mechanical framing
          if (child.name === 'CoreBezel') {
            child.material.color.set(0x1a1e20);
            child.material.metalness = 0.85;
            child.material.roughness = 0.45;
            if (child.material.emissive) {
              child.material.emissive.set(0x000000);
              child.material.emissiveIntensity = 0;
            }
          }
          if (child.name === 'CoreRecess') {
            child.material.color.set(0x060809);
            child.material.metalness = 0.92;
            child.material.roughness = 0.35;
            if (child.material.emissive) {
              child.material.emissive.set(0x000000);
              child.material.emissiveIntensity = 0;
            }
          }

          // Refined soft gold emissive calibrations:
          if (child.name === 'CoreK') {
            // Brightest element: K (1.8-2.2)
            if (child.material.emissive) {
              child.material.emissive.set('#FFD27A');
              child.material.emissiveIntensity = 2.0;
            }
          } else if (child.name === 'CoreRingOuter' || child.name === 'CoreRingInner') {
            if (child.material.emissive) {
              child.material.emissive.set('#FFD27A');
              child.material.emissiveIntensity = 1.0;
            }
          } else if (child.name.startsWith('OrbitRing')) {
            // Orbit rings: 0.6-0.9
            if (child.material.emissive) {
              child.material.emissive.set('#FFB92E');
              child.material.emissiveIntensity = 0.75;
            }
          } else if (child.name.includes('EdgeGlow')) {
            // Module edge glow: 0.8-1.2
            if (child.material.emissive) {
              child.material.emissive.set('#FFB92E');
              child.material.emissiveIntensity = 0.95;
            }
          } else if (
            child.name.startsWith('PlatformLine') ||
            child.name === 'Ring' ||
            child.name === 'Ring2' ||
            child.name === 'Ring3'
          ) {
            // Platform rings: 0.8-1.1
            if (child.material.emissive) {
              child.material.emissive.set('#FFB92E');
              child.material.emissiveIntensity = 0.9;
            }
          } else if (
            child.name.includes('Icon') ||
            child.name.includes('Head') ||
            child.name.includes('Puff') ||
            child.name.includes('Disk') ||
            child.name.includes('Bar') ||
            child.name.includes('Equator') ||
            child.name.includes('Ant')
          ) {
            // Icons: 1.0-1.4
            if (child.material.emissive) {
              child.material.emissive.set('#FFB92E');
              child.material.emissiveIntensity = 1.2;
            }
          } else if (
            child.name.includes('Connection') ||
            child.name.includes('Grid') ||
            child.name.includes('Pulse') ||
            child.name.includes('Node') ||
            child.name.includes('Glow') ||
            child.name.includes('Loop') ||
            child.name.includes('Band')
          ) {
            if (child.material.emissive) {
              child.material.emissive.set('#FFB92E');
              child.material.emissiveIntensity = 0.85;
            }
          }
        }

        // Pulse mesh references
        MODULE_NAMES.forEach((m) => {
          if (child.name === `${m}Pulse`) {
            pulses[m] = child;
          }
        });
      }

      if (MODULE_NAMES.includes(child.name)) {
        mods.push(child);
      }
      if (child.name === 'CoreGrid') {
        grid = child;
      }
      if (child.name === 'CoreK') {
        kEmblem = child;
      }
      if (['OrbitRing1', 'OrbitRing2', 'OrbitRing3'].includes(child.name)) {
        rings.push(child);
      }
    });

    console.log('>>> [HERO 3D] Scene Traversed. Modules:', mods.map(m => m.name), '| Rings:', rings.length, '| K Emblem Found:', !!kEmblem);
    return { modules: mods, coreGrid: grid, orbitRings: rings, pulseMeshes: pulses, coreK: kEmblem };
  }, [scene]);

  // Construct true 3D CatmullRomCurve3 tracks based on ACTUAL module positions in the GLB
  const pulseTracks = useMemo(() => {
    return MODULE_NAMES.map((name) => {
      const modObj = scene.getObjectByName(name);
      const modPos = modObj ? modObj.position.clone() : new THREE.Vector3(0, 0, 0);
      const start = modPos.clone().normalize().multiplyScalar(2.62);
      const end = modPos.clone().multiplyScalar(0.88);
      const mid = start.clone().add(end).multiplyScalar(0.5).add(new THREE.Vector3(0, 0.45, 0.35));
      const curve = new THREE.CatmullRomCurve3([start, mid, end]);
      return { name, curve };
    });
  }, [scene]);

  // Pointer and scroll event listeners for subtle parallax
  useEffect(() => {
    const handlePointerMove = (e) => {
      if (prefersReducedMotion) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerPos.current.targetX = x * 0.08;
      pointerPos.current.targetY = y * 0.06;
    };

    const handleScroll = () => {
      if (prefersReducedMotion) return;
      scrollOffset.current = (window.scrollY || window.pageYOffset) * 0.0004;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prefersReducedMotion]);

  // Render loop: idle rotations strictly for CoreGrid and orbit rings; K emblem remains camera-facing
  useFrame((state, delta) => {
    if (!rootRef.current) return;

    const t = state.clock.getElapsedTime();

    if (!prefersReducedMotion) {
      // Subtle mouse parallax (rest position is strictly 0, camera-facing)
      pointerPos.current.x = THREE.MathUtils.lerp(
        pointerPos.current.x,
        pointerPos.current.targetX,
        0.05
      );
      pointerPos.current.y = THREE.MathUtils.lerp(
        pointerPos.current.y,
        pointerPos.current.targetY,
        0.05
      );

      rootRef.current.rotation.y = pointerPos.current.x;
      rootRef.current.rotation.x = pointerPos.current.y - scrollOffset.current * 0.1;

      // IDLE ROTATION: Only CoreGrid and the orbit rings rotate around vertical Y axis
      if (coreGrid) {
        coreGrid.rotation.y += delta * 0.08;
      }
      orbitRings.forEach((ring, idx) => {
        ring.rotation.y += delta * (0.04 + idx * 0.02);
      });

      // Data pulses travel along the true 3D CatmullRomCurve3 paths
      pulseTracks.forEach(({ name, curve }, idx) => {
        const mesh = pulseMeshes[name];
        if (mesh) {
          const progress = (t * 0.32 + idx * (1 / 6)) % 1.0;
          const point = curve.getPointAt(progress);
          mesh.position.copy(point);

          const scale = 0.85 + 0.35 * Math.sin(progress * Math.PI);
          mesh.scale.set(scale, scale, scale);
        }
      });
    }

    // Module Hover Interaction
    modules.forEach((mod) => {
      const isTarget = hoveredModule === mod.name;
      const targetScale = isTarget ? 1.06 : 1.0;
      mod.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      mod.traverse((child) => {
        if (child.isMesh && child.material && child.material.emissive) {
          const targetIntensity = isTarget ? 1.6 : 0.95;
          child.material.emissiveIntensity = THREE.MathUtils.lerp(
            child.material.emissiveIntensity || 0.95,
            targetIntensity,
            0.1
          );
        }
      });
    });
  });

  return (
    <>
      <CameraController scene={scene} isMobile={isMobile} />
      <group ref={rootRef} position={[0, 0, 0]}>
        <primitive object={scene} />
      </group>
    </>
  );
}

/**
 * Main HeroScene Canvas Component
 */
export default function HeroScene({ className = '', style = {} }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const onMotionChange = (e) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', onMotionChange);

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      motionQuery.removeEventListener('change', onMotionChange);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const enableBloom = !isMobile && !prefersReducedMotion;

  return (
    <div
      className={`hero-r3f-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: isMobile ? '420px' : '580px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        touchAction: 'none',
        overflow: 'hidden',
        ...style
      }}
    >
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15
        }}
        onCreated={({ gl, scene }) => {
          scene.background = null;
          gl.setClearColor(0x000000, 0);
        }}
        camera={{
          position: [0, 0.4, 18],
          fov: isMobile ? 35 : 32,
          near: 0.1,
          far: 80
        }}
        dpr={[1, isMobile ? 1.5 : 2]}
      >
        {/* Studio Lighting - Subdued ambient to preserve deep dark tones */}
        <ambientLight color="#ffffff" intensity={0.4} />
        
        {/* Warm Key Light (#FEEFB8) */}
        <directionalLight
          position={[6, 9, 9]}
          intensity={1.8}
          color="#FEEFB8"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        {/* Warm Rim Light (#FFD494) */}
        <directionalLight
          position={[-6, 7, -5]}
          intensity={1.3}
          color="#FFD494"
        />

        {/* Soft Ambient Fill Light */}
        <directionalLight
          position={[7, 4, 3]}
          intensity={0.5}
          color="#ffe2b0"
        />

        <Suspense fallback={<HeroLoadingFallback />}>
          <EcosystemModel
            prefersReducedMotion={prefersReducedMotion}
            isMobile={isMobile}
          />
        </Suspense>

        {enableBloom && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.3}
              luminanceThreshold={1.0}
              luminanceSmoothing={0.15}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
