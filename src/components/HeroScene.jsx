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
import { useGLTF, Html, Sparkles, ContactShadows } from '@react-three/drei';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const GLB_URL = '/assets/kodmates_hero.glb';
const DRACO_PATH = '/draco/gltf/';

// Configure local Draco decoder path (zero CDN dependencies)
useGLTF.setDecoderPath(DRACO_PATH);
useGLTF.preload(GLB_URL, DRACO_PATH);

const MODULE_NAMES = ['Web', 'Android', 'Cloud', 'Database', 'API', 'Business'];

const SERVICE_INFO = {
  Web: { title: 'Web Applications', id: 'web' },
  Android: { title: 'Android & Mobile', id: 'android' },
  Business: { title: 'Business ERP & POS', id: 'business' },
  Cloud: { title: 'Cloud & DevOps', id: 'cloud' },
  API: { title: 'APIs & Microservices', id: 'api' },
  Database: { title: 'High-Concurrency DB', id: 'database' }
};

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
 * Procedural Local Environment (zero network calls, tinted warm)
 */
function LocalEnvironment() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    const room = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(room).texture;
    scene.environment = envTexture;
    scene.environmentIntensity = 0.45;
    scene.background = null;

    return () => {
      envTexture.dispose();
      pmremGenerator.dispose();
    };
  }, [gl, scene]);

  return null;
}

/**
 * Fresnel Rim-Glow Shell (ambient inner light halo around central sphere)
 */
function FresnelRimShell({ radius = 2.997 }) {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color('#D9A441') },
        fresnelPower: { value: 2.2 }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float fresnelPower;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = 1.0 - abs(dot(vNormal, viewDir));
          fresnel = pow(fresnel, fresnelPower) * 0.25;
          gl_FragColor = vec4(glowColor, fresnel);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false
    });
  }, []);

  return (
    <mesh material={material}>
      <sphereGeometry args={[radius, 64, 32]} />
    </mesh>
  );
}

/**
 * Platform Soft Amber Grounding Glow Sprite
 */
function PlatformContactGlow() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, 'rgba(217, 164, 65, 0.35)');
    grad.addColorStop(0.35, 'rgba(217, 164, 65, 0.18)');
    grad.addColorStop(0.65, 'rgba(217, 164, 65, 0.05)');
    grad.addColorStop(1, 'rgba(217, 164, 65, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  return (
    <mesh position={[0, -4.98, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[14, 14]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
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

  // Hitbox data for each interactive module card
  const moduleHitboxes = useMemo(() => {
    return MODULE_NAMES.map((name) => {
      const modObj = scene.getObjectByName(name);
      return {
        name,
        position: modObj ? modObj.position.clone() : new THREE.Vector3(),
        rotation: modObj ? modObj.rotation.clone() : new THREE.Euler()
      };
    });
  }, [scene]);

  // Click handler: smooth scroll to matching service card in #services and pulse highlight
  const handleModuleClick = (name) => {
    const info = SERVICE_INFO[name];
    const serviceKey = info ? info.id : name.toLowerCase();
    const targetCard = document.querySelector(`.service-card[data-service-id="${serviceKey}"]`);
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetCard.classList.add('service-card--highlighted');
      setTimeout(() => {
        targetCard.classList.remove('service-card--highlighted');
      }, 2400);
    } else {
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

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
          // Low envMapIntensity (0.45) on non-emissive metals
          child.material.envMapIntensity = 0.45;

          // Core Body: MeshPhysicalMaterial, metalness 1, roughness 0.18, clearcoat 1, clearcoatRoughness 0.1, base colour #101416
          if (child.name === 'CoreBody') {
            const prevMap = child.material.map;
            const prevEmissiveMap = child.material.emissiveMap;
            child.material = new THREE.MeshPhysicalMaterial({
              color: new THREE.Color('#101416'),
              metalness: 1.0,
              roughness: 0.18,
              clearcoat: 1.0,
              clearcoatRoughness: 0.1,
              map: prevMap || null,
              emissiveMap: prevEmissiveMap || null,
              emissive: new THREE.Color('#D9A441'),
              emissiveIntensity: 0.8,
              envMapIntensity: 0.45
            });
            child.material.toneMapped = true;
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

          // Module Face Plate: solid dark matte-charcoal screen, strictly non-emissive
          if (child.name.includes('Face') && !child.name.includes('InnerFrame') && !child.name.includes('EdgeGlow')) {
            child.material.color.set(0x0a0d0e);
            child.material.metalness = 0.85;
            child.material.roughness = 0.35;
            if (child.material.emissive) {
              child.material.emissive.set(0x000000);
              child.material.emissiveIntensity = 0;
            }
          }

          // Exact cream-gold palette with toneMapped={false}:
          if (child.name === 'CoreK') {
            // K emblem: warm cream-gold tuned to exact target (R>240, 200<=G<=225, 120<=B<=160), toneMapped={false}
            if (child.material) {
              child.material.toneMapped = false;
              child.material.color.set('#000000');
              child.material.emissive.set('#F8C68A');
              child.material.emissiveIntensity = 1.22;
            }
          } else if (
            child.name.startsWith('OrbitRing') ||
            child.name.startsWith('InterModuleArc') ||
            child.name.startsWith('Arc') ||
            child.name.includes('Connection') ||
            child.name.includes('Grid') ||
            child.name.includes('Loop') ||
            child.name.includes('Band') ||
            child.name.includes('InnerFrame') ||
            child.name === 'CoreRingOuter' ||
            child.name === 'CoreRingInner'
          ) {
            // Lines, arcs, trims: #D9A441 with toneMapped={false}
            if (child.material) {
              child.material.toneMapped = false;
              child.material.emissive.set('#D9A441');
              child.material.emissiveIntensity = 0.70;
            }
          } else if (child.name.includes('EdgeGlow')) {
            // Module edge glow: #D9A441 at 0.80
            if (child.material) {
              child.material.toneMapped = false;
              child.material.emissive.set('#D9A441');
              child.material.emissiveIntensity = 0.80;
            }
          } else if (
            child.name.startsWith('PlatformLine') ||
            child.name === 'Ring' ||
            child.name === 'Ring2' ||
            child.name === 'Ring3'
          ) {
            // Platform rings: #D9A441 lowered by 25% (0.68)
            if (child.material) {
              child.material.toneMapped = false;
              child.material.emissive.set('#D9A441');
              child.material.emissiveIntensity = 0.68;
            }
          } else if (
            child.name.includes('Icon') ||
            child.name.includes('Head') ||
            child.name.includes('Puff') ||
            child.name.includes('Disk') ||
            child.name.includes('Bar') ||
            child.name.includes('Equator') ||
            child.name.includes('Ant') ||
            child.name.includes('Label')
          ) {
            // Icons and labels: #F2CF85 with emissive intensity 1.15, toneMapped={false}
            if (child.material) {
              child.material.toneMapped = false;
              child.material.emissive.set('#F2CF85');
              child.material.emissiveIntensity = 1.15;
            }
          } else if (child.name.includes('Node') || child.name.includes('Pulse')) {
            // Nodes & pulses: #FFE3A0 with emissive intensity 1.4, toneMapped={false}
            if (child.material) {
              child.material.toneMapped = false;
              child.material.emissive.set('#FFE3A0');
              child.material.emissiveIntensity = 1.40;
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

  // Extra 12 data pulse tracks along Arc01..Arc12 (desktop only)
  const arcPulseRefs = useRef([]);
  const arcPulseTracks = useMemo(() => {
    if (isMobile) return [];
    const tracks = [];
    for (let i = 1; i <= 12; i++) {
      const arcName = `Arc${String(i).padStart(2, '0')}`;
      const arcObj = scene.getObjectByName(arcName);
      if (arcObj && arcObj.geometry && arcObj.geometry.attributes.position) {
        const posAttr = arcObj.geometry.attributes.position;
        const pts = [];
        const count = posAttr.count;
        const step = Math.max(1, Math.floor(count / 8));
        for (let p = 0; p < count; p += step) {
          pts.push(new THREE.Vector3().fromBufferAttribute(posAttr, p));
        }
        if (pts.length >= 2) {
          tracks.push({
            name: arcName,
            curve: new THREE.CatmullRomCurve3(pts),
            speed: 0.18 + (i % 4) * 0.05,
            offset: (i * 0.17) % 1.0
          });
        }
      }
    }
    return tracks;
  }, [scene, isMobile]);

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

      // Animate 12 arc data pulses (desktop only)
      if (!isMobile && arcPulseTracks.length > 0) {
        arcPulseTracks.forEach(({ curve, speed, offset }, idx) => {
          const mesh = arcPulseRefs.current[idx];
          if (mesh) {
            const progress = (t * speed + offset) % 1.0;
            const pt = curve.getPointAt(progress);
            mesh.position.copy(pt);
            const scale = 0.85 + 0.35 * Math.sin(progress * Math.PI);
            mesh.scale.set(scale, scale, scale);
          }
        });
      }
    }

    // Module Hover Interaction
    modules.forEach((mod) => {
      const isTarget = hoveredModule === mod.name;
      const targetScale = isTarget ? 1.07 : 1.0;
      mod.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);

      mod.traverse((child) => {
        if (
          child.isMesh &&
          child.material &&
          child.material.emissive &&
          !child.name.includes('Face') &&
          !child.name.includes('Body') &&
          !child.name.includes('GoldShell')
        ) {
          const targetIntensity = isTarget ? 1.8 : 0.8;
          child.material.emissiveIntensity = THREE.MathUtils.lerp(
            child.material.emissiveIntensity || 0.8,
            targetIntensity,
            0.12
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
        <FresnelRimShell radius={2.997} />

        {/* 3D Interactive Module Hitboxes */}
        {moduleHitboxes.map(({ name, position, rotation }) => (
          <mesh
            key={`hitbox-${name}`}
            position={position}
            rotation={rotation}
            onClick={(e) => {
              e.stopPropagation();
              handleModuleClick(name);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredModule(name);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHoveredModule(null);
              document.body.style.cursor = 'auto';
            }}
          >
            <boxGeometry args={[1.9, 1.5, 1.1]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        ))}

        {/* Floating Tooltip above Hovered Module */}
        {hoveredModule && SERVICE_INFO[hoveredModule] && (
          <Html
            position={[
              moduleHitboxes.find((m) => m.name === hoveredModule)?.position.x || 0,
              (moduleHitboxes.find((m) => m.name === hoveredModule)?.position.y || 0) + 1.15,
              (moduleHitboxes.find((m) => m.name === hoveredModule)?.position.z || 0) + 0.3
            ]}
            center
            distanceFactor={18}
            style={{ pointerEvents: 'none' }}
          >
            <div className="hero-module-tooltip">
              <span>{SERVICE_INFO[hoveredModule].title}</span>
              <span className="hero-module-tooltip-arrow">Explore ↓</span>
            </div>
          </Html>
        )}

        {!isMobile &&
          arcPulseTracks.map((tr, idx) => (
            <mesh
              key={tr.name}
              ref={(el) => (arcPulseRefs.current[idx] = el)}
            >
              <sphereGeometry args={[0.07, 10, 10]} />
              <meshBasicMaterial color="#FFE3A0" toneMapped={false} />
            </mesh>
          ))}
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
  const [theme, setTheme] = useState(() => {
    return (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme')) || 'dark';
  });

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const onMotionChange = (e) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', onMotionChange);

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const updateTheme = () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(current);
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => {
      motionQuery.removeEventListener('change', onMotionChange);
      window.removeEventListener('resize', checkMobile);
      observer.disconnect();
    };
  }, []);

  const enableBloom = !isMobile && !prefersReducedMotion;
  const isLight = theme === 'light';

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
      {/* Soft warm haze behind the model - dynamically responds to theme */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '380px' : '560px',
          height: isMobile ? '380px' : '560px',
          borderRadius: '50%',
          background: isLight
            ? 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.07) 35%, rgba(217, 119, 6, 0.02) 55%, transparent 70%)'
            : 'radial-gradient(circle at 50% 50%, rgba(242, 181, 68, 0.08) 0%, rgba(217, 164, 65, 0.05) 35%, rgba(217, 164, 65, 0.02) 55%, transparent 70%)',
          filter: 'blur(45px)',
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'background 0.4s ease'
        }}
      />

      <Canvas
        style={{ position: 'relative', zIndex: 1 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: isLight ? 1.22 : 1.15
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
        dpr={[1, isMobile ? 1.25 : 2]}
      >
        {/* Procedural Local Studio Environment (zero remote network calls) */}
        <LocalEnvironment />

        {/* Studio Lighting - Theme Reactive (Subdued in dark mode, crisp fill in light mode) */}
        <ambientLight
          color={isLight ? '#f8fafc' : '#ffffff'}
          intensity={isLight ? 0.85 : 0.4}
        />
        
        {/* Warm Key Light */}
        <directionalLight
          position={[6, 9, 9]}
          intensity={isLight ? 2.1 : 1.8}
          color={isLight ? '#FFFBEB' : '#FEEFB8'}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        {/* Warm Rim Light */}
        <directionalLight
          position={[-6, 7, -5]}
          intensity={isLight ? 1.7 : 1.3}
          color={isLight ? '#FEF3C7' : '#FFD494'}
        />

        {/* Soft Ambient Fill Light */}
        <directionalLight
          position={[7, 4, 3]}
          intensity={isLight ? 0.75 : 0.5}
          color={isLight ? '#F8FAFC' : '#ffe2b0'}
        />

        {/* Under-Platform Grounding Contact Glow & Shadows */}
        <ContactShadows
          position={[0, -4.95, 0]}
          opacity={isLight ? 0.38 : 0.7}
          scale={14}
          blur={2.2}
          far={4}
          color={isLight ? '#334155' : '#05080a'}
        />
        <PlatformContactGlow />

        {/* Atmospheric Floating Amber Dust Particles (Desktop only) */}
        {!isMobile && (
          <Sparkles
            count={60}
            scale={[14, 11, 11]}
            size={2.5}
            speed={0.3}
            opacity={isLight ? 0.65 : 0.5}
            color={isLight ? '#D97706' : '#FFE3A0'}
          />
        )}

        <Suspense fallback={<HeroLoadingFallback />}>
          <EcosystemModel
            prefersReducedMotion={prefersReducedMotion}
            isMobile={isMobile}
          />
        </Suspense>

        {enableBloom && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={isLight ? 0.22 : 0.28}
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
