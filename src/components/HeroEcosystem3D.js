import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

/**
 * Kodmates Interactive 3D Software Ecosystem
 * Step 02B Visual Correction Pass:
 * - Substantially increased visual scale on desktop (fills ~48-52% hero width)
 * - Studio lighting & PMREM reflection environment revealing dark graphite PBR materials
 * - Optically centered ecosystem with platform grounded above capability row
 * - All six modules clearly legible and interactive
 * - Seamless desktop framing fitting Header + Hero + Capability Row within first viewport
 */
export class HeroEcosystem3D {
  constructor(options = {}) {
    this.container = options.container;
    this.fallbackEl = options.fallbackEl;
    this.heroSectionEl = options.heroSectionEl || document.getElementById('hero');
    this.modelUrl = options.modelUrl || '/assets/kodmates_hero.glb';

    this.isWebGLSupported = this._checkWebGL();
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.composer = null;
    this.pmremGenerator = null;
    this.loader = null;

    // Hierarchy handles
    this.rootGroup = null; // Container group for parallax & scroll transforms
    this.heroModelRoot = null; // KODMATES_HERO object from GLB
    this.coreGroup = null;
    this.modulesGroup = null;
    this.connectionsGroup = null;
    this.platformGroup = null;
    this.environmentGroup = null;

    // Module objects for hover interaction
    this.moduleObjects = new Map();
    this.moduleBaseScales = new Map();
    this.moduleHoverStates = new Map();
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2(-999, -999);
    this.hoveredModule = null;

    // Pulse objects for subtle hardware activity
    this.pulseObjects = [];
    this.connectionBeads = [];
    this.orbitalRingsGroup = null;

    // Animation & Interaction tracking
    this.animId = null;
    this._startTime = performance.now();
    this._pausedElapsed = 0;
    this._pauseStart = null;
    this._resizeRafId = null;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scroll = { y: 0, targetY: 0 };
    this.isLoaded = false;
    this.isDestroyed = false;
    this.isVisible = true;
    this.isDocHidden = typeof document !== 'undefined' ? document.hidden : false;
    this.observer = null;
    this.pointerNeedsCheck = false;

    // Bound listeners
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerLeave = this._onPointerLeave.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onDocVisibilityChange = this._onDocVisibilityChange.bind(this);
    this._onMotionPreferenceChange = this._onMotionPreferenceChange.bind(this);
    this._onVisibilityChange = this._onVisibilityChange.bind(this);
    this._animate = this._animate.bind(this);
  }

  _checkWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch {
      return false;
    }
  }

  init() {
    if (!this.container) return;

    if (!this.isWebGLSupported) {
      this._showFallback();
      return;
    }

    try {
      this._setupScene();
      this._createStudioLighting();
      this._bindEvents();
      this._loadGLB();
    } catch (err) {
      console.warn('3D initialization failed, falling back to static presentation:', err);
      this._showFallback();
    }
  }

  _showFallback() {
    if (this.fallbackEl) {
      this.fallbackEl.style.display = 'block';
    }
    if (this.container) {
      const canvas = this.container.querySelector('canvas');
      if (canvas) canvas.style.display = 'none';
    }
  }

  _setupScene() {
    const width = this.container.clientWidth || 720;
    const height = this.container.clientHeight || 620;

    this.scene = new THREE.Scene();

    // Perspective camera framing the ecosystem
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Studio Environment for soft PBR reflections on graphite metallic surfaces
    this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    this.scene.environment = this.pmremGenerator.fromScene(roomEnv, 0.04).texture;
    this.scene.environmentIntensity = 0.20;

    // Progressive fade-in
    this.renderer.domElement.style.opacity = '0';
    this.renderer.domElement.style.transition = 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
    this.renderer.domElement.style.display = 'block';

    this.container.appendChild(this.renderer.domElement);

    // Transparent direct WebGL rendering preserving crystal-clear alpha over mountain backdrop
    this.composer = null;

    // Root group for all interactive transforms
    this.rootGroup = new THREE.Group();
    this.scene.add(this.rootGroup);

    this._updateCameraFraming(width, height);
  }

  _updateCameraFraming(width, height) {
    if (!this.camera) return;
    const aspect = width / Math.max(height, 1);
    this.camera.aspect = aspect;

    const isDesktop = window.innerWidth >= 900;

    if (this.heroModelRoot) {
      // Scale GLB so ecosystem matches reference proportions with balanced negative space
      const modelScale = isDesktop ? 1.00 : 0.82;
      this.heroModelRoot.scale.setScalar(modelScale);

      // Optically center core vertically with comfortable header clearance
      // and position platform comfortably above capability row
      const posY = isDesktop ? 0.00 : 0.05;
      const posX = isDesktop ? 0.00 : 0.0;
      this.heroModelRoot.position.set(posX, posY, 0);
    }

    const fov = 40;
    this.camera.fov = fov;
    const tanHalf = Math.tan((fov * Math.PI) / 360);

    // Frame required bounds so all 6 modules, K core, and platform fit with generous breathing room
    const reqW = isDesktop ? 8.7 : 8.2;
    const reqH = isDesktop ? 8.2 : 7.8;
    const zH = reqH / (2 * tanHalf);
    const zW = (reqW / Math.max(aspect, 0.4)) / (2 * tanHalf);
    let targetZ = Math.max(zH, zW);

    targetZ = Math.min(Math.max(targetZ, 9.5), 16.5);
    const camY = isDesktop ? 0.58 : 0.60;
    this.camera.position.set(0, camY, targetZ);
    this.camera.lookAt(0, isDesktop ? -0.04 : 0, 0);
    this.camera.updateProjectionMatrix();
  }

  _createStudioLighting() {
    // 1. Warm Champagne Key Light (Grazing rim angle catching card bevels and aperture)
    const keyLight = new THREE.DirectionalLight(0xFFF0D0, 1.45);
    keyLight.position.set(6.5, 4.5, 2.0);
    this.scene.add(keyLight);

    // 2. Warm Champagne Rim Light (Rear-Left catching module bevels & core silhouette)
    const rimLight = new THREE.DirectionalLight(0xFFE5B8, 1.95);
    rimLight.position.set(-6.0, 4.5, -2.5);
    this.scene.add(rimLight);

    // 3. Warm Champagne Edge Light (Rear-Right edge separation)
    const rimLightRight = new THREE.DirectionalLight(0xFFECC4, 1.35);
    rimLightRight.position.set(5.5, 3.2, -2.2);
    this.scene.add(rimLightRight);

    // 4. Dedicated Frontal Core Light (Grazing illumination for central K emblem)
    const coreFrontLight = new THREE.DirectionalLight(0xFFF2D0, 1.45);
    coreFrontLight.position.set(0.3, 1.2, 4.5);
    this.scene.add(coreFrontLight);

    // 5. Overhead Bevel Definition Light (Warm gold highlight on top module rims)
    const overheadLight = new THREE.DirectionalLight(0xFFECC4, 0.40);
    overheadLight.position.set(0, 6.2, -1.0);
    this.scene.add(overheadLight);

    // 6. Platform Grazing Uplight (Warm champagne bounce on stepped metallic tiers)
    const platformLight = new THREE.DirectionalLight(0xFEE8B8, 1.20);
    platformLight.position.set(0, -3.0, 2.0);
    this.scene.add(platformLight);

    // 7. Localized Warm Amber Point Light (Grazing horizon glow across lower globe, platform, and card undersides)
    const horizonAmberPoint = new THREE.PointLight(0xFFAA40, 2.20, 9.0, 1.2);
    horizonAmberPoint.position.set(0.0, -1.6, 1.6);
    this.scene.add(horizonAmberPoint);

    // 8. Soft Directional Fill Light (Cool charcoal fill to maintain deep contrast)
    const fillLight = new THREE.DirectionalLight(0x90A0B0, 0.18);
    fillLight.position.set(-4.5, 1.8, 3.5);
    this.scene.add(fillLight);

    // 9. Studio Hemisphere Light (Deep dark tones in shadows, keeps floor deep obsidian black)
    const hemiLight = new THREE.HemisphereLight(0x181512, 0x020304, 0.18);
    this.scene.add(hemiLight);

    // 10. Dark Ambient Studio Base (Low to prevent washed out grays)
    const ambientLight = new THREE.AmbientLight(0x06080A, 0.08);
    this.scene.add(ambientLight);

    // 11. Dedicated Aperture Cavity Radiant Point Light (Gently illuminates cavity dish behind K)
    const cavityPointLight = new THREE.PointLight(0xFFE4A0, 1.10, 3.8, 1.2);
    cavityPointLight.position.set(0, 0.15, 1.68);
    this.scene.add(cavityPointLight);

    // 12. Golden Horizon Backlight (Amber dawn rim illumination matching blueprint mountain backdrop)
    const horizonRim = new THREE.DirectionalLight(0xFED892, 1.55);
    horizonRim.position.set(0, -1.2, -4.5);
    this.scene.add(horizonRim);
  }

  _loadGLB() {
    this.loader = new GLTFLoader();

    this.loader.load(
      this.modelUrl,
      (gltf) => {
        if (this.isDestroyed) return;
        this._onGLBLoaded(gltf);
      },
      undefined,
      (err) => {
        console.warn('Error loading Kodmates Hero GLB asset, using fallback:', err);
        this._showFallback();
      }
    );
  }

  _onGLBLoaded(gltf) {
    const heroRoot = gltf.scene.getObjectByName('KODMATES_HERO') || gltf.scene;
    this.heroModelRoot = heroRoot;

    // Attach to rootGroup
    this.rootGroup.add(heroRoot);

    // Discover and index hierarchy components
    this.coreGroup = heroRoot.getObjectByName('CORE');
    this.modulesGroup = heroRoot.getObjectByName('MODULES');
    this.connectionsGroup = heroRoot.getObjectByName('CONNECTIONS');
    this.platformGroup = heroRoot.getObjectByName('PLATFORM');
    this.environmentGroup = heroRoot.getObjectByName('ENVIRONMENT');

    // Hide GLB background mesh polygons if any exist (HTML background handles mountain backdrop)
    if (this.environmentGroup) {
      this.environmentGroup.visible = false;
    }

    // Index the six technology modules for hover interactivity
    const moduleNames = [
      'Module_Web',
      'Module_Android',
      'Module_Cloud',
      'Module_API',
      'Module_Database',
      'Module_Business'
    ];

    moduleNames.forEach((name) => {
      const modObj = heroRoot.getObjectByName(name);
      if (modObj) {
        this.moduleObjects.set(name, modObj);
        this.moduleBaseScales.set(name, modObj.scale.clone());
        this.moduleHoverStates.set(name, {
          targetScale: 1.0,
          currentScale: 1.0,
          baseEmissive: this._extractEmissive(modObj)
        });
      }
    });

    // Calibrate module card positions & 3D inward rotations matching blueprint reference
    const modAndroid = heroRoot.getObjectByName('Module_Android');
    if (modAndroid) {
      modAndroid.position.set(0.00, 2.24, 1.85);
      modAndroid.rotation.set(-0.05, 0.00, 0.00);
    }
    const modBusiness = heroRoot.getObjectByName('Module_Business');
    if (modBusiness) {
      modBusiness.position.set(0.00, -1.42, 1.82);
      modBusiness.rotation.set(0.04, 0.00, 0.00);
    }
    const modDatabase = heroRoot.getObjectByName('Module_Database');
    if (modDatabase) {
      modDatabase.position.set(-2.42, -0.82, 1.68);
      modDatabase.rotation.set(0.03, 0.22, -0.02);
    }
    const modAPI = heroRoot.getObjectByName('Module_API');
    if (modAPI) {
      modAPI.position.set(2.42, -0.82, 1.68);
      modAPI.rotation.set(0.03, -0.22, 0.02);
    }
    const modWeb = heroRoot.getObjectByName('Module_Web');
    if (modWeb) {
      modWeb.position.set(-2.45, 1.45, 1.65);
      modWeb.rotation.set(-0.03, 0.24, 0.03);
    }
    const modCloud = heroRoot.getObjectByName('Module_Cloud');
    if (modCloud) {
      modCloud.position.set(2.45, 1.45, 1.65);
      modCloud.rotation.set(-0.03, -0.24, -0.03);
    }

    // Clean aperture opening in CoreGrid and CoreInnerGrid: strictly excise all triangles/edges crossing into r < 1.28, z > 0.60
    ['CoreGrid', 'CoreInnerGrid'].forEach((gridName) => {
      const grid = heroRoot.getObjectByName(gridName);
      if (grid && grid.geometry) {
        const geom = grid.geometry;
        const pos = geom.attributes.position;
        const index = geom.index;
        if (index && pos) {
          const count = index.count / 3;
          const newIndices = [];
          for (let i = 0; i < count; i++) {
            const a = index.getX(i * 3);
            const b = index.getX(i * 3 + 1);
            const c = index.getX(i * 3 + 2);
            const vAx = pos.getX(a), vAy = pos.getY(a), vAz = pos.getZ(a);
            const vBx = pos.getX(b), vBy = pos.getY(b), vBz = pos.getZ(b);
            const vCx = pos.getX(c), vCy = pos.getY(c), vCz = pos.getZ(c);

            const rA = Math.hypot(vAx, vAy);
            const rB = Math.hypot(vBx, vBy);
            const rC = Math.hypot(vCx, vCy);
            const maxZ = Math.max(vAz, vBz, vCz);

            const midR = Math.hypot((vAx + vBx + vCx) / 3, (vAy + vBy + vCy) / 3);
            const midAB_R = Math.hypot((vAx + vBx) / 2, (vAy + vBy) / 2);
            const midBC_R = Math.hypot((vBx + vCx) / 2, (vBy + vCy) / 2);
            const midCA_R = Math.hypot((vCx + vAx) / 2, (vCy + vAy) / 2);

            // Canonical aperture exclusion cylinder: R = 1.28, Z_front = 0.60
            const crossesAperture = maxZ > 0.60 && (
              rA < 1.28 || rB < 1.28 || rC < 1.28 ||
              midR < 1.28 || midAB_R < 1.28 || midBC_R < 1.28 || midCA_R < 1.28
            );

            if (!crossesAperture) {
              newIndices.push(a, b, c);
            }
          }
          geom.setIndex(newIndices);
          geom.computeVertexNormals();
        }
      }
    });

    // Remove any surface nodes that sit inside or touch the central aperture opening (r < 1.28, z > 0.60)
    const coreGridNodes = heroRoot.getObjectByName('CoreGridNodes');
    if (coreGridNodes && coreGridNodes.geometry && coreGridNodes.geometry.index) {
      const geom = coreGridNodes.geometry;
      const pos = geom.attributes.position;
      const index = geom.index;
      const newIndices = [];
      for (let i = 0; i < index.count / 3; i++) {
        const a = index.getX(i * 3);
        const b = index.getX(i * 3 + 1);
        const c = index.getX(i * 3 + 2);
        const ax = pos.getX(a), ay = pos.getY(a), az = pos.getZ(a);
        const bx = pos.getX(b), by = pos.getY(b), bz = pos.getZ(b);
        const cx = pos.getX(c), cy = pos.getY(c), cz = pos.getZ(c);

        const inAperture = (Math.hypot(ax, ay) < 1.28 && az > 0.60) ||
                           (Math.hypot(bx, by) < 1.28 && bz > 0.60) ||
                           (Math.hypot(cx, cy) < 1.28 && cz > 0.60);
        if (!inAperture) {
          newIndices.push(a, b, c);
        }
      }
      geom.setIndex(newIndices);
      geom.computeVertexNormals();
    }

    // PBR Material enhancement & blueprint calibration:
    // Polished graphite metallic reflections, gleaming champagne gold bevels,
    // concentric mechanical rings, and crisp 3D typography
    heroRoot.traverse((child) => {
      if (child.name === 'Background_Mountains' || child.name === 'Atmosphere' || child.name === 'ENVIRONMENT') {
        child.visible = false;
        return;
      }

      // Deep dark recessed cavity dish & wall behind the illuminated K
      if ((child.name === 'CoreInnerShell' || child.name === 'CoreCavityWall') && child.isMesh) {
        child.renderOrder = 1;
        child.material = child.material.clone();
        child.material.color = new THREE.Color(0x020305);
        child.material.roughness = 0.88;
        child.material.metalness = 0.40;
        child.material.envMapIntensity = 0.15;
        return;
      }

      // Hide any secondary cavity glow ring that creates flat concentric target reticles
      if (child.name === 'CoreGlow') {
        child.visible = false;
        return;
      }

      // Hide old low-detail CoreK mesh from GLB (replaced by precision sculpted 3D CoreK with beveled depth)
      if (child.name === 'CoreK') {
        child.visible = false;
        return;
      }

      // Native Blender aperture details & microchips (rendered procedurally with bloom flares in Three.js)
      if (child.name === 'ApertureMechanicalDetail' || child.name === 'SphereMicrochips') {
        child.visible = false;
        return;
      }

      if (child.name === 'CoreBody' && child.geometry) {
        child.geometry.computeVertexNormals();
      }

      if (child.name === 'CoreKBezel' && child.isMesh) {
        child.renderOrder = 4;
      }

      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((mat) => {
          mat.toneMapped = true;

          const matName = mat.name || '';
          if (matName.includes('CoreBody')) {
            // Deep graphite metallic sphere with dense curved circuit network matching blueprint
            const globeTex = this._createGlobeCircuitTexture(THREE);
            mat.map = globeTex;
            mat.emissiveMap = globeTex;
            mat.color = new THREE.Color(0x070A0E);
            mat.emissive = new THREE.Color(0xDFB870);
            mat.emissiveIntensity = 0.52;
            mat.roughness = 0.20;
            mat.metalness = 0.95;
            mat.envMapIntensity = 0.95;
          } else if (child.name.includes('GridNodes') || child.name === 'CoreGridNodes') {
            // Surface Data Beads: restrained champagne gold nodes with delicate glow
            mat.color = new THREE.Color(0xFFF2D0);
            mat.emissive = new THREE.Color(0xDFA025);
            mat.emissiveIntensity = 0.85;
            mat.roughness = 0.16;
            mat.metalness = 0.94;
          } else if (child.name === 'CoreInnerGrid' || matName.includes('InnerGrid')) {
            // Internal illuminated grid structure visible inside sphere
            mat.color = new THREE.Color(0xD8A845);
            mat.emissive = new THREE.Color(0x9A6516);
            mat.emissiveIntensity = 0.26;
            mat.roughness = 0.24;
            mat.metalness = 0.92;
          } else if (child.name === 'CoreCavityVanes') {
            // Internal cavity radial vanes behind K
            mat.color = new THREE.Color(0xD5AE5C);
            mat.emissive = new THREE.Color(0x825816);
            mat.emissiveIntensity = 0.22;
            mat.roughness = 0.22;
            mat.metalness = 0.92;
          } else if (child.name.includes('Grid') || matName.includes('CoreGrid')) {
            // Thin, elegant champagne gold spherical surface traces with delicate sheen
            mat.color = new THREE.Color(0xF5D58E);
            mat.emissive = new THREE.Color(0x956A18);
            mat.emissiveIntensity = 0.38;
            mat.roughness = 0.20;
            mat.metalness = 0.96;
          } else if (child.name.startsWith('Orbit_') && !child.name.includes('Node')) {
            // Refined champagne gold orbital rings matching blueprint
            mat.color = new THREE.Color(0xD8BC80);
            mat.emissive = new THREE.Color(0x7A5618);
            mat.emissiveIntensity = 0.28;
            mat.roughness = 0.22;
            mat.metalness = 0.96;
            mat.transparent = true;
            mat.opacity = 0.85;
          } else if (child.name.includes('Node')) {
            // Restrained champagne gold data node beads along orbits
            mat.color = new THREE.Color(0xFFF2D0);
            mat.emissive = new THREE.Color(0xDF9520);
            mat.emissiveIntensity = 1.2;
            mat.roughness = 0.15;
            mat.metalness = 0.95;
          } else if (child.name.includes('Bezel') || matName.includes('GoldAccent')) {
            if (child.name.startsWith('Module_') || (child.parent && child.parent.name.startsWith('Module_'))) {
              // Module card casing: dark metallic graphite with subtle champagne edge reflection matching blueprint
              mat.color = new THREE.Color(0x181D22);
              mat.roughness = 0.22;
              mat.metalness = 0.94;
              mat.emissive = new THREE.Color(0x5A4010);
              mat.emissiveIntensity = 0.10;
              mat.envMapIntensity = 0.95;
            } else if (matName.includes('DarkMetal') || matName.includes('CavityDark')) {
              // Deep dark titanium machined rings and collar steps
              mat.color = new THREE.Color(0x06080B);
              mat.roughness = 0.28;
              mat.metalness = 0.94;
              mat.emissive = new THREE.Color(0x000000);
              mat.emissiveIntensity = 0.0;
              mat.envMapIntensity = 0.55;
            } else {
              // Single restrained champagne gold perimeter trim accent
              mat.color = new THREE.Color(0xE8D098);
              mat.roughness = 0.18;
              mat.metalness = 0.95;
              mat.emissive = new THREE.Color(0x8A6015);
              mat.emissiveIntensity = 0.18;
              mat.envMapIntensity = 1.05;
            }
          } else if (child.name.startsWith('Connection_') || child.name.startsWith('DataPulse_') || matName.includes('Beam')) {
            // Hide old fixed GLB connection & pulse meshes; replaced by dynamic 3D spline connection beams
            child.visible = false;
            return;
          } else if (matName.includes('BrushedMetal') || matName.includes('CasingGraphite')) {
            // Brushed dark graphite module casings and sidewalls
            mat.color = new THREE.Color(0x14181C);
            mat.roughness = 0.26;
            mat.metalness = 0.94;
            mat.envMapIntensity = 0.85;
          } else if (matName.includes('DarkMetal')) {
            // Deep obsidian faceplates and recessed mechanical collar rims
            mat.color = new THREE.Color(0x05070A);
            mat.roughness = 0.28;
            mat.metalness = 0.90;
            mat.envMapIntensity = 0.60;
          } else if (matName.includes('WarmText')) {
            // Hide old low-detail text primitives in favor of high-res blueprint faceplates
            child.visible = false;
            return;
          } else if (matName.includes('PlatformGlow') || child.name.includes('Platform_Glow')) {
            // Subtle concentric platform champagne gold hairline rim accents
            mat.color = new THREE.Color(0xE8D098);
            mat.emissive = new THREE.Color(0x8A6015);
            mat.emissiveIntensity = 0.35;
          } else if (child.name.includes('Platform_')) {
            // Deep dark reflective metallic stepped platform tiers with subtle ambient reflections
            mat.color = new THREE.Color(0x0A0D12);
            mat.metalness = 0.95;
            mat.roughness = 0.22;
            mat.envMapIntensity = 0.85;
          }
        });

        if (child.name.includes('DataPulse_') || child.name.includes('_Pulse')) {
          this.pulseObjects.push(child);
        }
      }
    });

    // Luminous champagne constellation light flares and bead nodes at orbital intersection points matching blueprint
    const glowTex = this._createGlowTexture();
    const nodeFlareMat = new THREE.SpriteMaterial({
      map: glowTex,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      opacity: 0.38
    });
    const nodeBeadMat = new THREE.MeshStandardMaterial({
      color: 0xFFF0D0,
      emissive: 0xE8A028,
      emissiveIntensity: 0.95,
      roughness: 0.18,
      metalness: 0.95
    });
    const nodeBeadGeom = new THREE.SphereGeometry(0.024, 12, 12);
    const flarePositions = [
      [1.65, 1.45, 0.85],
      [-1.75, 1.35, 0.75],
      [2.15, -0.65, 0.65],
      [-2.05, -0.75, 0.55],
      [0.00, 2.32, 0.90],
      [-2.35, 0.25, 0.70],
      [2.35, 0.25, 0.70],
      [0.00, -2.05, 0.60]
    ];
    flarePositions.forEach(([fx, fy, fz]) => {
      const sp = new THREE.Sprite(nodeFlareMat);
      sp.scale.set(0.38, 0.38, 1.0);
      sp.position.set(fx, fy, fz);
      heroRoot.add(sp);

      const bead = new THREE.Mesh(nodeBeadGeom, nodeBeadMat);
      bead.position.set(fx, fy, fz);
      heroRoot.add(bead);
    });

    // 1. Precision sculpted 3D K core
    this._buildSculptedCoreK(heroRoot, THREE);

    // 2. Multi-tiered mechanical aperture (machined collar, radial turbine vanes, fasteners)
    this._buildApertureMechanicalDetail(heroRoot, THREE);

    // 3. Six hardware module cards with exact blueprint iconography & typography
    this._buildModuleCardFaces(heroRoot, THREE);

    // 4. Dynamic 3D spline data connection beams linking modules to core
    this._buildDynamicConnectionBeams(heroRoot, THREE);

    // 5. Orbital rings: Use authentic GLB orbital rings (Orbit_Alpha, Beta, Delta, Gamma)
    // Disabled duplicate procedural orbital rings to prevent line crossing and geometric clutter
    // this._buildProceduralOrbitalRings(heroRoot, THREE);

    // 6. Spherical globe network: Dense curved spherical circuit network conforming to sphere
    this._buildGlobeNetwork(heroRoot, THREE);

    // 6b. Luminous surface microchips embedded on sphere surface outside aperture
    this._buildSphereMicrochips(heroRoot, THREE);

    // 7. Stepped platform dais: High-detail dark reflective metallic tiers with radial index ticks
    this._buildPlatformEnhancements(heroRoot, THREE);

    // Apply framing & scaling
    const width = this.container.clientWidth || 720;
    const height = this.container.clientHeight || 620;
    this._updateCameraFraming(width, height);

    // Hide fallback and fade in canvas gently
    if (this.fallbackEl) {
      this.fallbackEl.style.display = 'none';
    }

    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.style.opacity = '1';
    }

    this.isLoaded = true;
    window.__kmHeroLoaded = true;
    window.__kmHeroInstance = this;
    this._animate();
  }

  _buildSculptedCoreK(heroRoot, THREE) {
    const kGroup = new THREE.Group();
    kGroup.name = 'SculptedCoreK';
    kGroup.renderOrder = 5;

    // Champagne gold PBR material with radiant inner luminance matching blueprint K glyph
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xFFD268,
      emissive: 0xFFAA26,
      emissiveIntensity: 0.95,
      roughness: 0.12,
      metalness: 0.92,
      envMapIntensity: 2.10
    });

    const extrudeSettings = {
      depth: 0.10,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.025,
      bevelThickness: 0.025
    };

    function createRoundedRect(x, y, w, h, r) {
      const s = new THREE.Shape();
      s.moveTo(x + r, y);
      s.lineTo(x + w - r, y);
      s.quadraticCurveTo(x + w, y, x + w, y + r);
      s.lineTo(x + w, y + h - r);
      s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      s.lineTo(x + r, y + h);
      s.quadraticCurveTo(x, y + h, x, y + h - r);
      s.lineTo(x, y + r);
      s.quadraticCurveTo(x, y, x + r, y);
      return s;
    }

    // 0. Integrated mechanical mounting socket anchoring K to the cavity dish
    const darkHubMat = new THREE.MeshStandardMaterial({
      color: 0x050709,
      roughness: 0.22,
      metalness: 0.95,
      envMapIntensity: 0.90
    });
    const hubBaseGeom = new THREE.CylinderGeometry(0.12, 0.14, 0.05, 32);
    const hubBase = new THREE.Mesh(hubBaseGeom, darkHubMat);
    hubBase.rotation.x = Math.PI / 2;
    hubBase.position.set(0, 0, -0.04);
    kGroup.add(hubBase);

    // 1. Vertical Stem (rounded pill): centered at x = -0.16
    const stemShape = createRoundedRect(-0.09, -0.42, 0.18, 0.84, 0.09);
    const stemGeom = new THREE.ExtrudeGeometry(stemShape, extrudeSettings);
    const stemMesh = new THREE.Mesh(stemGeom, goldMat);
    stemMesh.position.set(-0.16, 0, 0);
    kGroup.add(stemMesh);

    // 2. Central chevron junction annular pivot ring with mechanical pin hole
    const hubShape = new THREE.Shape();
    hubShape.absarc(0, 0, 0.075, 0, Math.PI * 2, false);
    const hubHole = new THREE.Path();
    hubHole.absarc(0, 0, 0.032, 0, Math.PI * 2, true);
    hubShape.holes.push(hubHole);
    const hubGeom = new THREE.ExtrudeGeometry(hubShape, extrudeSettings);
    const hubMesh = new THREE.Mesh(hubGeom, goldMat);
    hubMesh.position.set(0.01, 0, 0);
    kGroup.add(hubMesh);

    // 3. Upper diagonal branch (rounded pill rotated ~46°)
    const upperArmShape = createRoundedRect(-0.075, 0, 0.15, 0.48, 0.075);
    const upperArmGeom = new THREE.ExtrudeGeometry(upperArmShape, extrudeSettings);
    const upperArmMesh = new THREE.Mesh(upperArmGeom, goldMat);
    upperArmMesh.position.set(0.01, 0, 0);
    upperArmMesh.rotation.z = -THREE.MathUtils.degToRad(46);
    kGroup.add(upperArmMesh);

    // 4. Lower diagonal branch (rounded pill rotated ~-46°)
    const lowerArmShape = createRoundedRect(-0.075, -0.48, 0.15, 0.48, 0.075);
    const lowerArmGeom = new THREE.ExtrudeGeometry(lowerArmShape, extrudeSettings);
    const lowerArmMesh = new THREE.Mesh(lowerArmGeom, goldMat);
    lowerArmMesh.position.set(0.01, 0, 0);
    lowerArmMesh.rotation.z = THREE.MathUtils.degToRad(46);
    kGroup.add(lowerArmMesh);

    // Position K emblem recessed inside the aperture dish (recessed behind outerLip at 1.77)
    kGroup.position.set(0, 0, 1.60);
    kGroup.scale.setScalar(0.94);
    heroRoot.add(kGroup);
  }

  _buildApertureMechanicalDetail(heroRoot, THREE) {
    const apertureGroup = new THREE.Group();
    apertureGroup.name = 'ProceduralApertureDetail';
    apertureGroup.renderOrder = 4;

    const darkTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0x14181E,
      roughness: 0.28,
      metalness: 0.92,
      envMapIntensity: 1.10
    });

    const brushedGraphiteMat = new THREE.MeshStandardMaterial({
      color: 0x0F1317,
      roughness: 0.26,
      metalness: 0.92,
      envMapIntensity: 0.80
    });

    const goldAccentMat = new THREE.MeshStandardMaterial({
      color: 0xFFF2C8,
      emissive: 0xB88825,
      emissiveIntensity: 0.52,
      roughness: 0.12,
      metalness: 0.95,
      envMapIntensity: 1.75
    });

    // Warm champagne cavity glow emanating from behind the K within the inner circular aperture dish
    const kBackGlow = new THREE.PointLight(0xFFE5A0, 1.8, 2.5, 1.2);
    kBackGlow.position.set(0, 0, 1.58);
    apertureGroup.add(kBackGlow);

    // 1. Recessed dark cavity backing dish (concentric grooved bowl behind K)
    const cavityDishGeom = new THREE.CylinderGeometry(0.86, 0.72, 0.08, 64);
    const cavityDish = new THREE.Mesh(cavityDishGeom, darkTitaniumMat);
    cavityDish.rotation.x = Math.PI / 2;
    cavityDish.position.set(0, 0, 1.56);
    apertureGroup.add(cavityDish);

    // Concentric grooved rings inside cavity dish
    [0.35, 0.50, 0.65, 0.78].forEach((r) => {
      const ringGeom = new THREE.TorusGeometry(r, 0.008, 12, 64);
      const ring = new THREE.Mesh(ringGeom, darkTitaniumMat);
      ring.position.set(0, 0, 1.59);
      apertureGroup.add(ring);
    });

    // 2. Inner gold step lip (radius 0.86, z = 1.62)
    const innerLipGeom = new THREE.TorusGeometry(0.86, 0.016, 16, 80);
    const innerLip = new THREE.Mesh(innerLipGeom, goldAccentMat);
    innerLip.position.set(0, 0, 1.62);
    apertureGroup.add(innerLip);

    // 3. Machined titanium stepped collar with beveled thickness
    const collar1FaceGeom = new THREE.RingGeometry(0.87, 0.97, 80);
    const collar1Face = new THREE.Mesh(collar1FaceGeom, darkTitaniumMat);
    collar1Face.position.set(0, 0, 1.66);
    apertureGroup.add(collar1Face);

    const collar1RimGeom = new THREE.TorusGeometry(0.97, 0.012, 14, 80);
    const collar1Rim = new THREE.Mesh(collar1RimGeom, brushedGraphiteMat);
    collar1Rim.position.set(0, 0, 1.66);
    apertureGroup.add(collar1Rim);

    // 4. Camera-Iris Turbine Radial Ring: 36 radial machined vanes
    const vaneCount = 36;
    const vaneGeom = new THREE.BoxGeometry(0.015, 0.088, 0.016);
    for (let i = 0; i < vaneCount; i++) {
      const angle = (i / vaneCount) * Math.PI * 2;
      const r = 1.01;
      const vx = r * Math.sin(angle);
      const vy = r * Math.cos(angle);
      const isGoldTick = (i % 4 === 0);
      const vane = new THREE.Mesh(vaneGeom, isGoldTick ? goldAccentMat : brushedGraphiteMat);
      vane.position.set(vx, vy, 1.69);
      vane.rotation.z = -angle + 0.12; // Slight turbine swirl angle
      apertureGroup.add(vane);
    }

    // 5. Concentric mid gold trim ring (radius 1.06, z = 1.72)
    const midLipGeom = new THREE.TorusGeometry(1.06, 0.014, 16, 80);
    const midLip = new THREE.Mesh(midLipGeom, goldAccentMat);
    midLip.position.set(0, 0, 1.72);
    apertureGroup.add(midLip);

    // 6. Outer titanium bezel collar with stepped beveled depth
    const collar2FaceGeom = new THREE.RingGeometry(1.07, 1.18, 80);
    const collar2Face = new THREE.Mesh(collar2FaceGeom, darkTitaniumMat);
    collar2Face.position.set(0, 0, 1.74);
    apertureGroup.add(collar2Face);

    // 7. Dial Tick Ring: 48 precision laser-etched tick marks around the bezel collar
    const tickRingCount = 48;
    const tickGeom = new THREE.BoxGeometry(0.009, 0.040, 0.012);
    for (let t = 0; t < tickRingCount; t++) {
      const tAngle = (t / tickRingCount) * Math.PI * 2;
      const tr = 1.132;
      const tx = tr * Math.sin(tAngle);
      const ty = tr * Math.cos(tAngle);
      const isMajor = (t % 4 === 0);
      const tickMesh = new THREE.Mesh(tickGeom, isMajor ? goldAccentMat : darkTitaniumMat);
      tickMesh.position.set(tx, ty, 1.755);
      tickMesh.rotation.z = -tAngle;
      apertureGroup.add(tickMesh);
    }

    // 8. Outer champagne-gold perimeter rim chamfer (radius 1.19, z = 1.77)
    const outerLipGeom = new THREE.TorusGeometry(1.19, 0.018, 16, 80);
    const outerLip = new THREE.Mesh(outerLipGeom, goldAccentMat);
    outerLip.position.set(0, 0, 1.77);
    apertureGroup.add(outerLip);

    // 9. 16 Precision machined gold fastener studs around outer collar
    const studCount = 16;
    const studGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.022, 12);
    for (let s = 0; s < studCount; s++) {
      const sAngle = (s / studCount) * Math.PI * 2;
      const sr = 1.145;
      const sx = sr * Math.sin(sAngle);
      const sy = sr * Math.cos(sAngle);
      const stud = new THREE.Mesh(studGeom, goldAccentMat);
      stud.rotation.x = Math.PI / 2;
      stud.position.set(sx, sy, 1.775);
      apertureGroup.add(stud);
    }

    // 10. 4 Cardinal alignment clamps at 0°, 90°, 180°, 270°
    const clampGeom = new THREE.BoxGeometry(0.065, 0.045, 0.028);
    for (let c = 0; c < 4; c++) {
      const cAngle = c * (Math.PI / 2);
      const cx = 1.21 * Math.sin(cAngle);
      const cy = 1.21 * Math.cos(cAngle);
      const clamp = new THREE.Mesh(clampGeom, darkTitaniumMat);
      clamp.position.set(cx, cy, 1.785);
      clamp.rotation.z = -cAngle;
      apertureGroup.add(clamp);
    }

    heroRoot.add(apertureGroup);
  }

  _buildModuleCardFaces(heroRoot, THREE) {
    const modules = [
      { id: 'Module_Web', name: 'Web', type: 'web' },
      { id: 'Module_Android', name: 'Android', type: 'android' },
      { id: 'Module_Cloud', name: 'Cloud', type: 'cloud' },
      { id: 'Module_Database', name: 'Database', type: 'database' },
      { id: 'Module_API', name: 'API', type: 'api' },
      { id: 'Module_Business', name: 'Business', type: 'business' }
    ];

    modules.forEach(({ id, name, type }) => {
      const modObj = heroRoot.getObjectByName(id);
      if (!modObj) return;

      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');

      // Deep dark obsidian faceplate background
      ctx.fillStyle = '#080B0E';
      ctx.fillRect(0, 0, 1024, 1024);

      // Subtle dark radial gradient
      const bgGrad = ctx.createRadialGradient(512, 512, 50, 512, 512, 512);
      bgGrad.addColorStop(0, '#101419');
      bgGrad.addColorStop(0.7, '#07090C');
      bgGrad.addColorStop(1, '#040507');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1024, 1024);

      // Fine champagne-gold perimeter edge with subtle metallic corner sheen matching blueprint
      ctx.save();
      const rimGrad = ctx.createLinearGradient(44, 44, 980, 980);
      rimGrad.addColorStop(0, '#F5E4B8');
      rimGrad.addColorStop(0.35, '#E2CF96');
      rimGrad.addColorStop(0.70, '#B09860');
      rimGrad.addColorStop(1, '#786438');
      ctx.strokeStyle = rimGrad;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.roundRect(44, 44, 936, 936, 108);
      ctx.stroke();

      // Subtle inner contour groove matching hardware casing
      ctx.strokeStyle = 'rgba(240, 220, 160, 0.18)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(58, 58, 908, 908, 96);
      ctx.stroke();
      ctx.restore();

      // 4 Precision corner hardware hex-bolts matching industrial blueprint module casing
      const boltPositions = [[105, 105], [919, 105], [105, 919], [919, 919]];
      boltPositions.forEach(([bx, by]) => {
        ctx.save();
        ctx.fillStyle = '#06080B';
        ctx.beginPath();
        ctx.arc(bx, by, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#28323C';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#181E24';
        ctx.beginPath();
        for (let a = 0; a < 6; a++) {
          const ang = (a * Math.PI) / 3;
          const hx = bx + Math.cos(ang) * 9;
          const hy = by + Math.sin(ang) * 9;
          if (a === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#E8D298';
        ctx.beginPath();
        ctx.arc(bx - 2, by - 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Subtle status indicator pin-dot in top right matching blueprint panel
      ctx.save();
      ctx.fillStyle = '#E8A020';
      ctx.shadowColor = 'rgba(232, 160, 32, 0.6)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(885, 125, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Render exact blueprint vector iconography in radiant champagne gold
      ctx.save();
      ctx.strokeStyle = '#FFE082';
      ctx.fillStyle = '#FFE082';
      ctx.lineWidth = 28;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = 'rgba(255, 215, 110, 0.55)';
      ctx.shadowBlur = 20;

      const cx = 512;
      const cy = 405;

      if (type === 'web') {
        // Globe with latitude & longitude grid matching blueprint
        const r = 175;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        // Horizontal equator
        ctx.beginPath();
        ctx.moveTo(cx - r, cy);
        ctx.lineTo(cx + r, cy);
        ctx.stroke();
        // Upper & lower latitude lines
        const yOff = r * 0.52;
        const xSpan = Math.sqrt(r * r - yOff * yOff);
        ctx.beginPath();
        ctx.moveTo(cx - xSpan, cy - yOff);
        ctx.quadraticCurveTo(cx, cy - yOff * 0.5, cx + xSpan, cy - yOff);
        ctx.moveTo(cx - xSpan, cy + yOff);
        ctx.quadraticCurveTo(cx, cy + yOff * 0.5, cx + xSpan, cy + yOff);
        ctx.stroke();
        // Central vertical & elliptical meridian
        ctx.beginPath();
        ctx.moveTo(cx, cy - r);
        ctx.lineTo(cx, cy + r);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * 0.50, r, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (type === 'android') {
        // Android robot head with dome, antennae, and eye cutouts
        const r = 175;
        // Head dome
        ctx.beginPath();
        ctx.arc(cx, cy + 32, r, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        // Left antenna
        ctx.beginPath();
        ctx.moveTo(cx - 75, cy - 85);
        ctx.lineTo(cx - 125, cy - 175);
        ctx.stroke();
        // Right antenna
        ctx.beginPath();
        ctx.moveTo(cx + 75, cy - 85);
        ctx.lineTo(cx + 125, cy - 175);
        ctx.stroke();
        // Eye cutouts
        ctx.fillStyle = '#080B0E';
        ctx.beginPath();
        ctx.arc(cx - 72, cy - 25, 20, 0, Math.PI * 2);
        ctx.arc(cx + 72, cy - 25, 20, 0, Math.PI * 2);
        ctx.fill();
      } else if (type === 'cloud') {
        // Multi-lobed cloud matching blueprint
        ctx.beginPath();
        ctx.arc(cx - 84, cy + 22, 84, Math.PI * 0.5, Math.PI * 1.5);
        ctx.arc(cx - 22, cy - 72, 90, Math.PI * 0.9, Math.PI * 1.9);
        ctx.arc(cx + 78, cy - 32, 78, Math.PI * 1.3, Math.PI * 0.2);
        ctx.arc(cx + 118, cy + 38, 68, Math.PI * 1.8, Math.PI * 0.5);
        ctx.closePath();
        ctx.fill();
      } else if (type === 'database') {
        // 3-tier cylindrical database stack
        const rx = 165;
        const ry = 46;
        // Top disc
        ctx.beginPath();
        ctx.ellipse(cx, cy - 95, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        // Middle tier
        ctx.beginPath();
        ctx.moveTo(cx - rx, cy - 95);
        ctx.lineTo(cx - rx, cy);
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI);
        ctx.lineTo(cx + rx, cy - 95);
        ctx.stroke();
        // Bottom tier
        ctx.beginPath();
        ctx.moveTo(cx - rx, cy);
        ctx.lineTo(cx - rx, cy + 95);
        ctx.ellipse(cx, cy + 95, rx, ry, 0, 0, Math.PI);
        ctx.lineTo(cx + rx, cy);
        ctx.stroke();
      } else if (type === 'api') {
        // Clean < / > code brackets
        ctx.lineWidth = 32;
        // Left chevron <
        ctx.beginPath();
        ctx.moveTo(cx - 65, cy - 85);
        ctx.lineTo(cx - 165, cy);
        ctx.lineTo(cx - 65, cy + 85);
        ctx.stroke();
        // Center slash /
        ctx.beginPath();
        ctx.moveTo(cx + 38, cy - 115);
        ctx.lineTo(cx - 38, cy + 115);
        ctx.stroke();
        // Right chevron >
        ctx.beginPath();
        ctx.moveTo(cx + 65, cy - 85);
        ctx.lineTo(cx + 165, cy);
        ctx.lineTo(cx + 65, cy + 85);
        ctx.stroke();
      } else if (type === 'business') {
        // 3 vertical ascending metric chart bars
        ctx.lineWidth = 14;
        const bw = 60;
        const bGap = 34;
        // Bar 1 (left)
        ctx.beginPath();
        ctx.roundRect(cx - bw - bGap - bw / 2, cy + 10, bw, 105, 12);
        ctx.fill();
        // Bar 2 (center)
        ctx.beginPath();
        ctx.roundRect(cx - bw / 2, cy - 55, bw, 170, 12);
        ctx.fill();
        // Bar 3 (right)
        ctx.beginPath();
        ctx.roundRect(cx + bw / 2 + bGap, cy - 120, bw, 235, 12);
        ctx.fill();
      }
      ctx.restore();

      // Crisp bold typography matching blueprint
      ctx.save();
      ctx.font = 'bold 90px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.45)';
      ctx.shadowBlur = 22;
      ctx.fillText(name, 512, 735);
      ctx.restore();

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;

      // 1. 3D Beveled Champagne Edge Frame for enhanced visual weight, edge highlights & face depth
      const frameShape = new THREE.Shape();
      const fw = 0.86;
      const fh = 0.84;
      const fr = 0.085;
      const fx = -fw / 2;
      const fy = -fh / 2;
      frameShape.moveTo(fx + fr, fy);
      frameShape.lineTo(fx + fw - fr, fy);
      frameShape.quadraticCurveTo(fx + fw, fy, fx + fw, fy + fr);
      frameShape.lineTo(fx + fw, fy + fh - fr);
      frameShape.quadraticCurveTo(fx + fw, fy + fh, fx + fw - fr, fy + fh);
      frameShape.lineTo(fx + fr, fy + fh);
      frameShape.quadraticCurveTo(fx, fy + fh, fx, fy + fh - fr);
      frameShape.lineTo(fx, fy + fr);
      frameShape.quadraticCurveTo(fx, fy, fx + fr, fy);

      // Inner cutout hole for faceplate
      const holePath = new THREE.Path();
      const hw = 0.80;
      const hh = 0.78;
      const hr = 0.065;
      const hx = -hw / 2;
      const hy = -hh / 2;
      holePath.moveTo(hx + hr, hy);
      holePath.lineTo(hx + hw - hr, hy);
      holePath.quadraticCurveTo(hx + hw, hy, hx + hw, hy + hr);
      holePath.lineTo(hx + hw, hy + hh - hr);
      holePath.quadraticCurveTo(hx + hw, hy + hh, hx + hw - hr, hy + hh);
      holePath.lineTo(hx + hr, hy + hh);
      holePath.quadraticCurveTo(hx, hy + hh, hx, hy + hh - hr);
      holePath.lineTo(hx, hy + hr);
      holePath.quadraticCurveTo(hx, hy, hx + hr, hy);
      frameShape.holes.push(holePath);

      const frameExtrudeSettings = {
        depth: 0.026,
        bevelEnabled: true,
        bevelThickness: 0.016,
        bevelSize: 0.016,
        bevelSegments: 4
      };
      const frameGeom = new THREE.ExtrudeGeometry(frameShape, frameExtrudeSettings);
      frameGeom.center();

      const frameMat = new THREE.MeshStandardMaterial({
        color: 0xFFD88A,
        roughness: 0.12,
        metalness: 0.98,
        emissive: 0x8A5A18,
        emissiveIntensity: 0.32,
        envMapIntensity: 1.75
      });
      const frameMesh = new THREE.Mesh(frameGeom, frameMat);
      frameMesh.name = `${name}_BeveledFrame`;
      frameMesh.position.set(0, 0, 0.170);
      frameMesh.renderOrder = 2;
      modObj.add(frameMesh);

      // 2. Dark graphite backing chassis providing physical depth and weight
      const backShape = new THREE.Shape();
      backShape.moveTo(fx + fr, fy);
      backShape.lineTo(fx + fw - fr, fy);
      backShape.quadraticCurveTo(fx + fw, fy, fx + fw, fy + fr);
      backShape.lineTo(fx + fw, fy + fh - fr);
      backShape.quadraticCurveTo(fx + fw, fy + fh, fx + fw - fr, fy + fh);
      backShape.lineTo(fx + fr, fy + fh);
      backShape.quadraticCurveTo(fx, fy + fh, fx, fy + fh - fr);
      backShape.lineTo(fx, fy + fr);
      backShape.quadraticCurveTo(fx, fy, fx + fr, fy);

      const backGeom = new THREE.ExtrudeGeometry(backShape, {
        depth: 0.038,
        bevelEnabled: true,
        bevelThickness: 0.012,
        bevelSize: 0.012,
        bevelSegments: 3
      });
      backGeom.center();

      const backMat = new THREE.MeshStandardMaterial({
        color: 0x101419,
        roughness: 0.24,
        metalness: 0.95,
        envMapIntensity: 1.15
      });
      const backMesh = new THREE.Mesh(backGeom, backMat);
      backMesh.name = `${name}_BackingCasing`;
      backMesh.position.set(0, 0, 0.140);
      backMesh.renderOrder = 1;
      modObj.add(backMesh);

      // 3. High-resolution front faceplate plane recessed inside beveled frame (high-gloss obsidian)
      const faceMat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.16,
        metalness: 0.85,
        emissive: new THREE.Color(0x06080B),
        emissiveIntensity: 0.25,
        transparent: true
      });

      const faceGeom = new THREE.PlaneGeometry(0.80, 0.78);
      const faceMesh = new THREE.Mesh(faceGeom, faceMat);
      faceMesh.name = `${name}_BlueprintFace`;
      faceMesh.position.set(0, 0, 0.180);
      faceMesh.renderOrder = 3;
      modObj.add(faceMesh);
    });
  }

  _buildPlatformEnhancements(heroRoot, THREE) {
    const platformEnhanceGroup = new THREE.Group();
    platformEnhanceGroup.name = 'ProceduralPlatformEnhance';

    const goldGlowMat = new THREE.MeshStandardMaterial({
      color: 0xFFF2C8,
      emissive: 0xBA8624,
      emissiveIntensity: 0.60,
      roughness: 0.14,
      metalness: 0.98,
      envMapIntensity: 1.75
    });

    const darkDaisMat = new THREE.MeshStandardMaterial({
      color: 0x06080B,
      roughness: 0.16,
      metalness: 0.96,
      envMapIntensity: 1.25
    });

    const darkTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0x14181E,
      roughness: 0.28,
      metalness: 0.92
    });

    // Stepped platform tiers grounded at y = -2.15 to -2.75
    // Tier 1 (top dais): r = 2.45, y = -2.20
    const t1Geom = new THREE.CylinderGeometry(2.45, 2.48, 0.08, 96);
    const t1 = new THREE.Mesh(t1Geom, darkDaisMat);
    t1.position.set(0, -2.20, 0);
    platformEnhanceGroup.add(t1);

    const t1RingGeom = new THREE.TorusGeometry(2.46, 0.016, 16, 96);
    const t1Ring = new THREE.Mesh(t1RingGeom, goldGlowMat);
    t1Ring.rotation.x = Math.PI / 2;
    t1Ring.position.set(0, -2.16, 0);
    platformEnhanceGroup.add(t1Ring);

    // Tier 1 inner concentric channel groove
    const t1InnerGrooveGeom = new THREE.TorusGeometry(2.32, 0.008, 12, 96);
    const t1InnerGroove = new THREE.Mesh(t1InnerGrooveGeom, darkTitaniumMat);
    t1InnerGroove.rotation.x = Math.PI / 2;
    t1InnerGroove.position.set(0, -2.16, 0);
    platformEnhanceGroup.add(t1InnerGroove);

    // Tier 2 (middle step): r = 3.05, y = -2.36
    const t2Geom = new THREE.CylinderGeometry(3.05, 3.10, 0.10, 96);
    const t2 = new THREE.Mesh(t2Geom, darkDaisMat);
    t2.position.set(0, -2.36, 0);
    platformEnhanceGroup.add(t2);

    const t2RingGeom = new THREE.TorusGeometry(3.06, 0.018, 16, 96);
    const t2Ring = new THREE.Mesh(t2RingGeom, goldGlowMat);
    t2Ring.rotation.x = Math.PI / 2;
    t2Ring.position.set(0, -2.31, 0);
    platformEnhanceGroup.add(t2Ring);

    // 48 Perimeter mechanical index ticks around Tier 2 rim (12 major gold, 36 titanium)
    const majorTickGeom = new THREE.BoxGeometry(0.024, 0.016, 0.075);
    const minorTickGeom = new THREE.BoxGeometry(0.012, 0.012, 0.042);
    for (let k = 0; k < 48; k++) {
      const angle = (k / 48) * Math.PI * 2;
      const isMajor = k % 4 === 0;
      const tick = new THREE.Mesh(isMajor ? majorTickGeom : minorTickGeom, isMajor ? goldGlowMat : darkTitaniumMat);
      const r = 3.06;
      tick.position.set(r * Math.sin(angle), -2.31, r * Math.cos(angle));
      tick.rotation.y = angle;
      platformEnhanceGroup.add(tick);
    }

    // Tier 3 (broad base dais): r = 3.75, y = -2.54
    const t3Geom = new THREE.CylinderGeometry(3.75, 3.82, 0.12, 96);
    const t3 = new THREE.Mesh(t3Geom, darkDaisMat);
    t3.position.set(0, -2.54, 0);
    platformEnhanceGroup.add(t3);

    const t3RingGeom = new THREE.TorusGeometry(3.76, 0.020, 16, 96);
    const t3Ring = new THREE.Mesh(t3RingGeom, goldGlowMat);
    t3Ring.rotation.x = Math.PI / 2;
    t3Ring.position.set(0, -2.48, 0);
    platformEnhanceGroup.add(t3Ring);

    // Tier 3 chamfered step grounding against horizon landscape
    const t3ChamferGeom = new THREE.TorusGeometry(3.60, 0.012, 12, 96);
    const t3Chamfer = new THREE.Mesh(t3ChamferGeom, darkTitaniumMat);
    t3Chamfer.rotation.x = Math.PI / 2;
    t3Chamfer.position.set(0, -2.48, 0);
    platformEnhanceGroup.add(t3Chamfer);

    // Segmented glowing perimeter notches around Tier 3 rim matching blueprint base
    const t3SegmentGeom = new THREE.BoxGeometry(0.045, 0.018, 0.090);
    const t3SegmentCount = 64;
    for (let s = 0; s < t3SegmentCount; s++) {
      const angle = (s / t3SegmentCount) * Math.PI * 2;
      const isEmissive = s % 2 === 0;
      if (isEmissive) {
        const seg = new THREE.Mesh(t3SegmentGeom, goldGlowMat);
        const r = 3.76;
        seg.position.set(r * Math.sin(angle), -2.48, r * Math.cos(angle));
        seg.rotation.y = angle;
        platformEnhanceGroup.add(seg);
      }
    }

    // Soft warm ambient ground radiance beneath the dais base
    const baseGlowCanvas = document.createElement('canvas');
    baseGlowCanvas.width = 512;
    baseGlowCanvas.height = 512;
    const gctx = baseGlowCanvas.getContext('2d');
    const gGrad = gctx.createRadialGradient(256, 256, 95, 256, 256, 256);
    gGrad.addColorStop(0, 'rgba(255, 195, 75, 0.65)');
    gGrad.addColorStop(0.28, 'rgba(235, 150, 45, 0.36)');
    gGrad.addColorStop(0.58, 'rgba(165, 90, 22, 0.16)');
    gGrad.addColorStop(0.82, 'rgba(85, 42, 10, 0.05)');
    gGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    gctx.fillStyle = gGrad;
    gctx.fillRect(0, 0, 512, 512);

    const baseGlowTex = new THREE.CanvasTexture(baseGlowCanvas);
    const baseGlowMat = new THREE.MeshBasicMaterial({
      map: baseGlowTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.95
    });
    const baseGlowPlane = new THREE.Mesh(new THREE.PlaneGeometry(11.8, 11.8), baseGlowMat);
    baseGlowPlane.rotation.x = -Math.PI / 2;
    baseGlowPlane.position.set(0, -2.62, 0);
    platformEnhanceGroup.add(baseGlowPlane);

    heroRoot.add(platformEnhanceGroup);
  }

  _buildDynamicConnectionBeams(heroRoot, THREE) {
    const connectionsGroup = new THREE.Group();
    connectionsGroup.name = 'DynamicModuleConnections';
    this.connectionBeads = [];

    const glowTex = this._createGlowTexture();
    const flareMat = new THREE.SpriteMaterial({
      map: glowTex,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      opacity: 0.25
    });

    const beamMat = new THREE.MeshStandardMaterial({
      color: 0xD8BD82,
      emissive: 0x7A5618,
      emissiveIntensity: 0.35,
      roughness: 0.20,
      metalness: 0.94,
      transparent: true,
      opacity: 0.85
    });

    const beadMat = new THREE.MeshStandardMaterial({
      color: 0xFFF2D0,
      emissive: 0xDF9620,
      emissiveIntensity: 1.4,
      roughness: 0.15,
      metalness: 0.95
    });

    const modules = [
      { id: 'Module_Web', start: new THREE.Vector3(-2.45, 1.45, 1.65), target: new THREE.Vector3(-1.42, 0.92, 1.30) },
      { id: 'Module_Android', start: new THREE.Vector3(0.00, 2.24, 1.85), target: new THREE.Vector3(0.00, 1.60, 1.28) },
      { id: 'Module_Cloud', start: new THREE.Vector3(2.45, 1.45, 1.65), target: new THREE.Vector3(1.42, 0.92, 1.30) },
      { id: 'Module_API', start: new THREE.Vector3(2.42, -0.82, 1.68), target: new THREE.Vector3(1.42, -0.65, 1.35) },
      { id: 'Module_Database', start: new THREE.Vector3(-2.42, -0.82, 1.68), target: new THREE.Vector3(-1.42, -0.65, 1.35) },
      { id: 'Module_Business', start: new THREE.Vector3(0.00, -1.42, 1.82), target: new THREE.Vector3(0.00, -1.58, 1.30) }
    ];

    modules.forEach(({ id, start, target }, idx) => {
      const modObj = heroRoot.getObjectByName(id);
      const startPt = modObj ? modObj.position.clone() : start.clone();
      startPt.z -= 0.05;

      const dir = target.clone().sub(startPt);
      const ctrl1 = startPt.clone().add(dir.clone().multiplyScalar(0.35));
      ctrl1.z += 0.12;
      ctrl1.y += (idx % 2 === 0 ? 0.10 : -0.10);

      const ctrl2 = target.clone().sub(dir.clone().multiplyScalar(0.35));
      ctrl2.z += 0.10;

      // Ensure Business module spline stays strictly below aperture outer collar (y < -1.40)
      if (id === 'Module_Business') {
        ctrl1.y = Math.min(ctrl1.y, -1.48);
        ctrl2.y = Math.min(ctrl2.y, -1.52);
      }

      const curve = new THREE.CubicBezierCurve3(startPt, ctrl1, ctrl2, target);
      const tubeGeom = new THREE.TubeGeometry(curve, 32, 0.012, 8, false);
      const tubeMesh = new THREE.Mesh(tubeGeom, beamMat);
      connectionsGroup.add(tubeMesh);

      // Terminal anchor collar on globe surface
      const ringGeom = new THREE.TorusGeometry(0.040, 0.008, 12, 24);
      const ringMesh = new THREE.Mesh(ringGeom, beamMat);
      ringMesh.position.copy(target);
      ringMesh.lookAt(target.clone().multiplyScalar(2));
      connectionsGroup.add(ringMesh);

      // Traveling data pulse bead
      const beadGeom = new THREE.SphereGeometry(0.030, 16, 16);
      const beadMesh = new THREE.Mesh(beadGeom, beadMat);
      connectionsGroup.add(beadMesh);

      const flare = new THREE.Sprite(flareMat.clone());
      flare.scale.set(0.24, 0.24, 1.0);
      connectionsGroup.add(flare);

      this.connectionBeads.push({
        mesh: beadMesh,
        flare: flare,
        curve: curve,
        speed: 0.35 + (idx % 3) * 0.08,
        offset: idx * 0.18
      });
    });

    heroRoot.add(connectionsGroup);
  }

  _buildProceduralOrbitalRings(heroRoot, THREE) {
    const orbitGroup = new THREE.Group();
    orbitGroup.name = 'ProceduralLuminousOrbits';
    this.orbitalRingsGroup = orbitGroup;

    const goldOrbitMat = new THREE.MeshStandardMaterial({
      color: 0xFFEFB8,
      emissive: 0xD8A030,
      emissiveIntensity: 1.25,
      roughness: 0.15,
      metalness: 0.95,
      transparent: true,
      opacity: 0.90
    });

    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      emissive: 0xFFA820,
      emissiveIntensity: 3.6,
      roughness: 0.10,
      metalness: 0.95
    });

    const glowTex = this._createGlowTexture();
    const flareMat = new THREE.SpriteMaterial({
      map: glowTex,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      opacity: 0.50
    });

    // 1. Primary Sweeping Orbital Ring (inclined ~36°, swooping around the equator)
    const ring1Geom = new THREE.TorusGeometry(2.65, 0.015, 16, 128);
    const ring1 = new THREE.Mesh(ring1Geom, goldOrbitMat);
    ring1.rotation.x = THREE.MathUtils.degToRad(68);
    ring1.rotation.y = THREE.MathUtils.degToRad(-24);
    orbitGroup.add(ring1);

    // 2. Secondary Crossing Orbital Ring (opposing incline ~-42°)
    const ring2Geom = new THREE.TorusGeometry(2.82, 0.014, 16, 128);
    const ring2 = new THREE.Mesh(ring2Geom, goldOrbitMat);
    ring2.rotation.x = THREE.MathUtils.degToRad(-62);
    ring2.rotation.y = THREE.MathUtils.degToRad(32);
    orbitGroup.add(ring2);

    // 3. Constellation Nodes & Flares positioned along the orbital rings
    const orbitNodeAngles = [0, 0.78, 1.57, 2.35, 3.14, 3.92, 4.71, 5.49];
    orbitNodeAngles.forEach((ang, i) => {
      // On Ring 1
      const r1 = 2.65;
      const p1 = new THREE.Vector3(r1 * Math.cos(ang), r1 * Math.sin(ang), 0);
      p1.applyEuler(ring1.rotation);

      if (i % 2 === 0) {
        const nodeGeom = new THREE.SphereGeometry(0.040, 16, 16);
        const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat);
        nodeMesh.position.copy(p1);
        orbitGroup.add(nodeMesh);

        const flare = new THREE.Sprite(flareMat);
        flare.scale.set(0.42, 0.42, 1.0);
        flare.position.copy(p1);
        orbitGroup.add(flare);
      }

      // On Ring 2
      const r2 = 2.82;
      const p2 = new THREE.Vector3(r2 * Math.cos(ang), r2 * Math.sin(ang), 0);
      p2.applyEuler(ring2.rotation);

      if (i % 2 === 1) {
        const nodeGeom = new THREE.SphereGeometry(0.038, 16, 16);
        const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat);
        nodeMesh.position.copy(p2);
        orbitGroup.add(nodeMesh);

        const flare = new THREE.Sprite(flareMat);
        flare.scale.set(0.38, 0.38, 1.0);
        flare.position.copy(p2);
        orbitGroup.add(flare);
      }
    });

    heroRoot.add(orbitGroup);
  }

  _buildGlobeNetwork(heroRoot, THREE) {
    const networkGroup = new THREE.Group();
    networkGroup.name = 'ProceduralGlobeNetwork';

    const R = 2.054; // Conforms smoothly 0.004 outside 2.05 sphere surface

    const stdLineMat = new THREE.LineBasicMaterial({
      color: 0xE8CA8C,
      transparent: true,
      opacity: 0.68,
      depthWrite: false
    });

    const brightLineMat = new THREE.LineBasicMaterial({
      color: 0xFFF2D0,
      transparent: true,
      opacity: 0.95,
      depthWrite: false
    });

    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xFFF5E0,
      emissive: 0xDF9820,
      emissiveIntensity: 1.45,
      roughness: 0.14,
      metalness: 0.96
    });

    const glowTex = this._createGlowTexture();
    const flareMat = new THREE.SpriteMaterial({
      map: glowTex,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      opacity: 0.34
    });

    // 1. Latitude circular circuit lines (12 levels strictly conforming to sphere)
    const latAngles = [-70, -58, -46, -34, -22, -10, 10, 22, 34, 46, 58, 70];
    latAngles.forEach((latDeg) => {
      const phi = THREE.MathUtils.degToRad(latDeg);
      const rRing = R * Math.cos(phi);
      const yRing = R * Math.sin(phi);
      const segments = 96;
      const points = [];
      const isIlluminated = (latDeg === -22 || latDeg === 34 || latDeg === 10 || latDeg === -46);
      const mat = isIlluminated ? brightLineMat : stdLineMat;

      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI * 2;
        const x = rRing * Math.sin(theta);
        const z = rRing * Math.cos(theta);

        // Exclude central aperture cylinder
        if (Math.hypot(x, yRing) < 1.30 && z > 0.60) {
          if (points.length > 1) {
            const geom = new THREE.BufferGeometry().setFromPoints(points);
            networkGroup.add(new THREE.Line(geom, mat));
            points.length = 0;
          }
          continue;
        }
        points.push(new THREE.Vector3(x, yRing, z));
      }
      if (points.length > 1) {
        const geom = new THREE.BufferGeometry().setFromPoints(points);
        networkGroup.add(new THREE.Line(geom, mat));
      }
    });

    // 2. Longitude meridian circuit lines (16 meridians pole-to-pole)
    const lonAngles = [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5];
    lonAngles.forEach((lonDeg) => {
      const theta = THREE.MathUtils.degToRad(lonDeg);
      const segments = 96;
      const points = [];
      const isIlluminated = (lonDeg === 45 || lonDeg === 225);
      const mat = isIlluminated ? brightLineMat : stdLineMat;

      for (let s = 0; s <= segments; s++) {
        const phi = (s / segments) * Math.PI - (Math.PI / 2);
        const x = R * Math.cos(phi) * Math.sin(theta);
        const y = R * Math.sin(phi);
        const z = R * Math.cos(phi) * Math.cos(theta);

        if (Math.hypot(x, y) < 1.30 && z > 0.60) {
          if (points.length > 1) {
            const geom = new THREE.BufferGeometry().setFromPoints(points);
            networkGroup.add(new THREE.Line(geom, mat));
            points.length = 0;
          }
          continue;
        }
        points.push(new THREE.Vector3(x, y, z));
      }
      if (points.length > 1) {
        const geom = new THREE.BufferGeometry().setFromPoints(points);
        networkGroup.add(new THREE.Line(geom, mat));
      }
    });

    // 3. Small gold connection nodes at grid intersections across visible flanks
    const nodeCoords = [
      // Upper lateral quadrants
      [-1.45, 1.35, 0.45], [1.45, 1.35, 0.45],
      [-1.15, 1.60, 0.65], [1.15, 1.60, 0.65],
      [-0.60, 1.85, 0.70], [0.60, 1.85, 0.70],
      [-1.70, 0.95, 0.60], [1.70, 0.95, 0.60],
      // Lower lateral quadrants
      [-1.45, -1.15, 0.55], [1.45, -1.15, 0.55],
      [-1.15, -1.45, 0.75], [1.15, -1.45, 0.75],
      [-0.75, -1.75, 0.60], [0.75, -1.75, 0.60],
      [-1.65, -0.90, 0.60], [1.65, -0.90, 0.60],
      // Equatorial outer flanks
      [-1.90, 0.20, 0.50], [1.90, 0.20, 0.50],
      [-1.85, -0.40, 0.55], [1.85, -0.40, 0.55],
      [-1.75, 0.60, 0.65], [1.75, 0.60, 0.65],
      // Apex and rear horizon perimeter
      [0.00, 1.95, -0.40], [-1.0, 1.65, -0.70], [1.0, 1.65, -0.70],
      [-1.70, 0.40, -0.80], [1.70, 0.40, -0.80],
      [-0.85, 1.70, 0.40], [0.85, 1.70, 0.40],
      [-1.30, -1.30, 0.70], [1.30, -1.30, 0.70]
    ];

    const goldNodeGeom = new THREE.SphereGeometry(0.024, 12, 12);
    const goldSubNodeGeom = new THREE.SphereGeometry(0.016, 10, 10);
    const validNodeVecs = [];

    nodeCoords.forEach(([nx, ny, nz], idx) => {
      const v = new THREE.Vector3(nx, ny, nz).normalize().multiplyScalar(R);
      if (Math.hypot(v.x, v.y) < 1.30 && v.z > 0.60) return;

      validNodeVecs.push(v);

      if (idx % 2 === 0) {
        // Prominent spherical gold connection bead conforming to globe surface
        const bead = new THREE.Mesh(goldNodeGeom, nodeMat);
        bead.position.copy(v);
        networkGroup.add(bead);

        // Soft champagne pinpoint flare on prominent intersection nodes
        if (idx % 4 === 0) {
          const flare = new THREE.Sprite(flareMat);
          flare.scale.set(0.20, 0.20, 1.0);
          flare.position.copy(v);
          networkGroup.add(flare);
        }
      } else {
        // Secondary delicate gold connection node
        const subBead = new THREE.Mesh(goldSubNodeGeom, nodeMat);
        subBead.position.copy(v);
        networkGroup.add(subBead);
      }
    });

    // 4. Geodesic diagonal circuit traces linking neighboring node clusters
    for (let i = 0; i < validNodeVecs.length; i++) {
      for (let j = i + 1; j < validNodeVecs.length; j++) {
        const dist = validNodeVecs[i].distanceTo(validNodeVecs[j]);
        if (dist > 0.40 && dist < 1.10) {
          const vA = validNodeVecs[i];
          const vB = validNodeVecs[j];
          const mid = vA.clone().add(vB).multiplyScalar(0.5).normalize().multiplyScalar(R);
          if (Math.hypot(mid.x, mid.y) < 1.30 && mid.z > 0.60) continue;

          const curve = new THREE.QuadraticBezierCurve3(vA, mid, vB);
          const pts = curve.getPoints(12);
          const geom = new THREE.BufferGeometry().setFromPoints(pts);
          networkGroup.add(new THREE.Line(geom, stdLineMat));
        }
      }
    }

    heroRoot.add(networkGroup);
  }

  _buildSphereMicrochips(heroRoot, THREE) {
    const microchipsGroup = new THREE.Group();
    microchipsGroup.name = 'ProceduralSphereMicrochips';
    microchipsGroup.renderOrder = 4;

    const R = 2.054;
    const housingMat = new THREE.MeshStandardMaterial({
      color: 0x14181E,
      roughness: 0.25,
      metalness: 0.94,
      envMapIntensity: 1.2
    });

    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xFFF2C8,
      emissive: 0xC88E28,
      emissiveIntensity: 0.65,
      roughness: 0.15,
      metalness: 0.95,
      envMapIntensity: 1.8
    });

    const glowingCoreMat = new THREE.MeshStandardMaterial({
      color: 0xFFF9E6,
      emissive: 0xFFA525,
      emissiveIntensity: 2.2,
      roughness: 0.10,
      metalness: 0.90
    });

    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xFFE090,
      emissive: 0x8A6015,
      emissiveIntensity: 0.35,
      roughness: 0.20,
      metalness: 0.95
    });

    const glowTex = this._createGlowTexture();
    const flareMat = new THREE.SpriteMaterial({
      map: glowTex,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      opacity: 0.55
    });

    // 6 Microchips arranged symmetrically around the outer collar on the sphere surface
    // Clock positions: 12, 2, 4, 6, 8, 10
    const clockAngles = [
      Math.PI / 2,         // 12 o'clock
      Math.PI / 6,         // 2 o'clock
      -Math.PI / 6,        // 4 o'clock
      -Math.PI / 2,        // 6 o'clock
      -5 * Math.PI / 6,    // 8 o'clock
      5 * Math.PI / 6      // 10 o'clock
    ];

    const rXY = 1.62;
    clockAngles.forEach((ang) => {
      const chip = new THREE.Group();
      const x = rXY * Math.cos(ang);
      const y = rXY * Math.sin(ang);
      const z = Math.sqrt(Math.max(0, R * R - rXY * rXY));

      chip.position.set(x, y, z);

      // Align chip normal to the sphere surface at (x, y, z)
      const normal = new THREE.Vector3(x, y, z).normalize();
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      chip.quaternion.copy(q);

      // Base ceramic/graphite package
      const pkgGeom = new THREE.BoxGeometry(0.125, 0.125, 0.022);
      const pkg = new THREE.Mesh(pkgGeom, housingMat);
      chip.add(pkg);

      // Gold beveled rim framing the chip package
      const rimGeom = new THREE.BoxGeometry(0.135, 0.135, 0.008);
      const rim = new THREE.Mesh(rimGeom, goldTrimMat);
      rim.position.set(0, 0, -0.006);
      chip.add(rim);

      // Radiant gold semiconductor silicon core
      const coreGeom = new THREE.BoxGeometry(0.065, 0.065, 0.026);
      const core = new THREE.Mesh(coreGeom, glowingCoreMat);
      core.position.set(0, 0, 0.005);
      chip.add(core);

      // Metallic contact pin leads on 4 sides
      const pinGeom = new THREE.BoxGeometry(0.012, 0.035, 0.006);
      [-0.07, 0.07].forEach((px) => {
        const pin1 = new THREE.Mesh(pinGeom, pinMat);
        pin1.position.set(px, 0.025, 0);
        chip.add(pin1);
        const pin2 = new THREE.Mesh(pinGeom, pinMat);
        pin2.position.set(px, -0.025, 0);
        chip.add(pin2);
      });

      // Luminous starburst sprite halo
      const flare = new THREE.Sprite(flareMat);
      flare.scale.set(0.32, 0.32, 1.0);
      flare.position.set(0, 0, 0.02);
      chip.add(flare);

      microchipsGroup.add(chip);
    });

    heroRoot.add(microchipsGroup);
  }

  _createGlobeCircuitTexture(THREE) {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Deep graphite metallic sphere base matching blueprint
    ctx.fillStyle = '#080B0F';
    ctx.fillRect(0, 0, 2048, 1024);

    // Subtle dark gradient from poles to equator
    const poleGrad = ctx.createLinearGradient(0, 0, 0, 1024);
    poleGrad.addColorStop(0, '#040507');
    poleGrad.addColorStop(0.2, '#080B0E');
    poleGrad.addColorStop(0.5, '#0E1217');
    poleGrad.addColorStop(0.8, '#080B0E');
    poleGrad.addColorStop(1, '#040507');
    ctx.fillStyle = poleGrad;
    ctx.fillRect(0, 0, 2048, 1024);

    // Dense horizontal latitude circuit hairlines
    ctx.lineWidth = 1.4;
    for (let y = 64; y < 976; y += 24) {
      const isMajor = (y % 72 === 0);
      ctx.strokeStyle = isMajor ? 'rgba(255, 225, 140, 0.65)' : 'rgba(215, 180, 105, 0.28)';
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(2048, y);
      ctx.stroke();
    }

    // Dense vertical longitude circuit hairlines
    for (let x = 0; x < 2048; x += 36) {
      const isMajor = (x % 144 === 0);
      ctx.strokeStyle = isMajor ? 'rgba(255, 225, 140, 0.60)' : 'rgba(215, 180, 105, 0.25)';
      ctx.beginPath();
      ctx.moveTo(x, 40);
      ctx.lineTo(x, 984);
      ctx.stroke();
    }

    // Pseudo-random deterministic generator for reproducible circuit traces & node clusters
    let seed = 42;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    // Diagonal stepped circuit traces (geodesic PCB look)
    ctx.lineWidth = 1.8;
    for (let i = 0; i < 130; i++) {
      const startX = rnd() * 2048;
      const startY = 100 + rnd() * 824;
      const len = 45 + rnd() * 135;
      const dir = rnd() > 0.5 ? 1 : -1;
      const isBright = rnd() > 0.6;

      // Exclude front center aperture zone (x ~ 820..1228, y ~ 340..684)
      if (startX > 780 && startX < 1268 && startY > 300 && startY < 724) continue;

      ctx.strokeStyle = isBright ? 'rgba(255, 235, 165, 0.75)' : 'rgba(225, 185, 110, 0.38)';
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + len * 0.5 * dir, startY + len * 0.5);
      ctx.lineTo(startX + len * dir, startY + len * 0.5);
      ctx.stroke();
    }

    // Glowing golden constellation node clusters (dense circuit nodes)
    for (let i = 0; i < 340; i++) {
      const nx = rnd() * 2048;
      const ny = 90 + rnd() * 844;

      // Exclude aperture
      if (nx > 760 && nx < 1288 && ny > 280 && ny < 744) continue;

      const isLarge = rnd() > 0.82;
      const r = isLarge ? 3.0 : 1.6;

      // Soft amber glow halo
      ctx.fillStyle = isLarge ? 'rgba(255, 195, 65, 0.45)' : 'rgba(235, 165, 45, 0.24)';
      ctx.beginPath();
      ctx.arc(nx, ny, r * 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Sharp champagne core bead
      ctx.fillStyle = isLarge ? '#FFF6D8' : '#ECC060';
      ctx.beginPath();
      ctx.arc(nx, ny, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Refined geometric circuit pathways with 45-degree doglegs & node terminals (blueprint fidelity)
    ctx.lineWidth = 1.4;
    for (let i = 0; i < 120; i++) {
      const startX = rnd() * 2048;
      const startY = 90 + rnd() * 844;
      if (startX > 740 && startX < 1308 && startY > 260 && startY < 764) continue;
      const len = 40 + rnd() * 110;
      const dirX = rnd() > 0.5 ? 1 : -1;
      const dirY = rnd() > 0.5 ? 1 : -1;
      const isMajor = rnd() > 0.60;

      ctx.strokeStyle = isMajor ? 'rgba(255, 242, 195, 0.65)' : 'rgba(226, 195, 130, 0.35)';
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      const midX = startX + len * 0.45 * dirX;
      ctx.lineTo(midX, startY);
      const doglegX = midX + 22 * dirX;
      const doglegY = startY + 22 * dirY;
      ctx.lineTo(doglegX, doglegY);
      ctx.lineTo(doglegX + (len * 0.55 - 22) * dirX, doglegY);
      ctx.stroke();

      // Delicate gold node endpoint
      ctx.fillStyle = isMajor ? '#FFF8E0' : '#E8C575';
      ctx.beginPath();
      ctx.arc(doglegX + (len * 0.55 - 22) * dirX, doglegY, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Aperture area exclusion: deep obsidian mask so recessed mechanical K area is clean
    ctx.save();
    ctx.fillStyle = '#06080B';
    ctx.beginPath();
    ctx.ellipse(1024, 512, 240, 220, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    return texture;
  }

  _createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0.0, 'rgba(255, 245, 210, 0.95)');
    grad.addColorStop(0.18, 'rgba(255, 215, 120, 0.65)');
    grad.addColorStop(0.45, 'rgba(240, 165, 45, 0.22)');
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
  }

  _extractEmissive(obj) {
    if (obj.material) {
      if (Array.isArray(obj.material)) {
        return obj.material.map(m => (m.emissiveIntensity !== undefined ? m.emissiveIntensity : 1.0));
      }
      return obj.material.emissiveIntensity !== undefined ? obj.material.emissiveIntensity : 1.0;
    }
    return 1.0;
  }

  _bindEvents() {
    window.addEventListener('mousemove', this._onMouseMove, { passive: true });
    window.addEventListener('scroll', this._onScroll, { passive: true });
    window.addEventListener('resize', this._onResize, { passive: true });
    document.addEventListener('visibilitychange', this._onDocVisibilityChange);

    if (this.container) {
      this.container.addEventListener('pointermove', this._onPointerMove, { passive: true });
      this.container.addEventListener('pointerleave', this._onPointerLeave, { passive: true });
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', this._onMotionPreferenceChange);
    }

    // IntersectionObserver to pause rendering when hero is off-screen
    const targetObs = this.heroSectionEl || this.container;
    if ('IntersectionObserver' in window && targetObs) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          this._onVisibilityChange(entry.isIntersecting);
        });
      }, { threshold: 0.05 });
      this.observer.observe(targetObs);
    }
  }

  _onDocVisibilityChange() {
    this.isDocHidden = document.hidden;
    if (this.isDocHidden) {
      this._pauseAnimation();
    } else if (this.isVisible) {
      this._resumeAnimation();
    }
  }

  _onVisibilityChange(isVisible) {
    if (this.isVisible === isVisible) return;
    this.isVisible = isVisible;
    if (this.isVisible && !this.isDocHidden) {
      this._resumeAnimation();
    } else if (!this.isVisible) {
      this._pauseAnimation();
    }
  }

  _pauseAnimation() {
    if (this._pauseStart === null) {
      this._pauseStart = performance.now();
    }
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  _resumeAnimation() {
    if (this._pauseStart !== null) {
      this._pausedElapsed += (performance.now() - this._pauseStart);
      this._pauseStart = null;
    }
    if (!this.animId && this.isLoaded && !this.isDestroyed) {
      this.animId = requestAnimationFrame(this._animate);
    }
  }

  _getElapsedTime() {
    if (this._pauseStart !== null) {
      return (this._pauseStart - this._startTime - this._pausedElapsed) * 0.001;
    }
    return (performance.now() - this._startTime - this._pausedElapsed) * 0.001;
  }

  _onMotionPreferenceChange(e) {
    this.prefersReducedMotion = e.matches;
    if (this.prefersReducedMotion && this.rootGroup) {
      this.rootGroup.rotation.set(0, 0, 0);
      this.rootGroup.position.set(0, 0, 0);
    }
  }

  _onMouseMove(event) {
    // Subtle mouse parallax (max ±2° rotation X, ±3° rotation Y)
    const normX = (event.clientX / window.innerWidth) * 2 - 1;
    const normY = -(event.clientY / window.innerHeight) * 2 + 1;
    this.mouse.targetX = normX * 0.052; // ±3 deg
    this.mouse.targetY = normY * 0.035; // ±2 deg
  }

  _onPointerMove(event) {
    if (event.pointerType === 'touch') return;
    if (!this.container || !this.isLoaded) return;

    const rect = this.container.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.pointerNeedsCheck = true;
  }

  _onPointerLeave() {
    this.pointer.set(-999, -999);
    this.pointerNeedsCheck = false;
    this._clearHover();
  }

  _checkRaycast() {
    if (!this.camera || !this.isLoaded || this.moduleObjects.size === 0) return;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const targets = Array.from(this.moduleObjects.values());
    const intersects = this.raycaster.intersectObjects(targets, true);

    if (intersects.length > 0) {
      let hit = intersects[0].object;
      let matchedName = null;

      while (hit && hit !== this.rootGroup && hit !== this.scene) {
        if (this.moduleObjects.has(hit.name)) {
          matchedName = hit.name;
          break;
        }
        hit = hit.parent;
      }

      if (matchedName) {
        this._setHover(matchedName);
        return;
      }
    }

    this._clearHover();
  }

  _setHover(name) {
    if (this.hoveredModule === name) return;
    this.hoveredModule = name;

    this.moduleHoverStates.forEach((state, modName) => {
      state.targetScale = modName === name ? 1.042 : 1.0;
    });

    if (this.container) {
      this.container.style.cursor = 'pointer';
    }
  }

  _clearHover() {
    if (!this.hoveredModule) return;
    this.hoveredModule = null;

    this.moduleHoverStates.forEach((state) => {
      state.targetScale = 1.0;
    });

    if (this.container) {
      this.container.style.cursor = 'default';
    }
  }

  _onScroll() {
    this.scroll.targetY = window.scrollY * 0.00045;
  }

  _onResize() {
    if (!this.container || !this.renderer || !this.camera || this.isDestroyed) return;
    if (this._resizeRafId) return;

    this._resizeRafId = requestAnimationFrame(() => {
      this._resizeRafId = null;
      if (!this.container || !this.renderer || !this.camera || this.isDestroyed) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      if (width === 0 || height === 0) return;

      this._updateCameraFraming(width, height);
      this.renderer.setSize(width, height);
      if (this.composer) {
        this.composer.setSize(width, height);
      }
    });
  }

  _animate() {
    if (this.isDestroyed || !this.isVisible || this.isDocHidden) {
      this.animId = null;
      return;
    }
    this.animId = requestAnimationFrame(this._animate);

    const time = this._getElapsedTime();

    // Frame-synced raycasting check (avoids redundant work on high-polling mice)
    if (this.pointerNeedsCheck) {
      this._checkRaycast();
      this.pointerNeedsCheck = false;
    }

    if (this.isLoaded && this.rootGroup) {
      if (!this.prefersReducedMotion) {
        // Smooth parallax interpolation
        this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.055;
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.055;
        this.scroll.y += (this.scroll.targetY - this.scroll.y) * 0.055;

        // Subtle restrained idle breathing sway (0.06 rad/sec, K remains legible and facing front)
        const idleSwayY = Math.sin(time * 0.38) * 0.022; // ±1.2 degrees
        const idleFloatY = Math.sin(time * 0.55) * 0.035;

        this.rootGroup.rotation.y = this.mouse.x + idleSwayY + (this.scroll.y * 0.5);
        this.rootGroup.rotation.x = -this.mouse.y;
        this.rootGroup.position.y = idleFloatY + (this.scroll.y * 0.4);

        // Subtle breathing pulse glow on connection beads
        if (this.pulseObjects.length > 0) {
          const pulseIntensity = 1.0 + Math.sin(time * 2.2) * 0.25;
          this.pulseObjects.forEach((pulse) => {
            if (pulse.material && pulse.material.emissiveIntensity !== undefined) {
              pulse.material.emissiveIntensity = pulseIntensity;
            }
          });
        }

        // Animate traveling data pulse packets along module connection splines
        if (this.connectionBeads && this.connectionBeads.length > 0) {
          this.connectionBeads.forEach((b) => {
            const progress = (time * b.speed + b.offset) % 1.0;
            const pt = b.curve.getPointAt(progress);
            b.mesh.position.copy(pt);
            if (b.flare) {
              b.flare.position.copy(pt);
              b.flare.material.opacity = 0.35 + Math.sin(time * 4.0 + b.offset * 10) * 0.15;
            }
          });
        }

        // Slow cinematic rotation of procedural orbital rings
        if (this.orbitalRingsGroup) {
          this.orbitalRingsGroup.rotation.y = time * 0.045;
          this.orbitalRingsGroup.rotation.z = Math.sin(time * 0.03) * 0.04;
        }
      } else {
        this.rootGroup.rotation.set(0, 0, 0);
        this.rootGroup.position.set(0, 0, 0);
      }

      // Smooth module hover scaling (active in both standard and reduced motion for crisp UI responsiveness)
      this.moduleObjects.forEach((modObj, name) => {
        const state = this.moduleHoverStates.get(name);
        const baseScale = this.moduleBaseScales.get(name);
        if (state && baseScale) {
          state.currentScale += (state.targetScale - state.currentScale) * 0.12;
          modObj.scale.set(
            baseScale.x * state.currentScale,
            baseScale.y * state.currentScale,
            baseScale.z * state.currentScale
          );
        }
      });
    }

    if (this.composer) {
      this.composer.render();
    } else if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  destroy() {
    this.isDestroyed = true;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    if (this._resizeRafId) {
      cancelAnimationFrame(this._resizeRafId);
      this._resizeRafId = null;
    }

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    document.removeEventListener('visibilitychange', this._onDocVisibilityChange);
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('scroll', this._onScroll);
    window.removeEventListener('resize', this._onResize);

    if (this.container) {
      this.container.removeEventListener('pointermove', this._onPointerMove);
      this.container.removeEventListener('pointerleave', this._onPointerLeave);
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.removeEventListener) {
      motionQuery.removeEventListener('change', this._onMotionPreferenceChange);
    }

    if (this.pmremGenerator) {
      this.pmremGenerator.dispose();
      this.pmremGenerator = null;
    }

    if (this.scene) {
      this.scene.traverse((obj) => {
        if (obj.geometry) {
          obj.geometry.dispose();
        }
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            if (m.map) m.map.dispose();
            if (m.emissiveMap) m.emissiveMap.dispose();
            if (m.roughnessMap) m.roughnessMap.dispose();
            if (m.metalnessMap) m.metalnessMap.dispose();
            if (m.normalMap) m.normalMap.dispose();
            m.dispose();
          });
        }
      });
    }

    if (this.composer) {
      this.composer.dispose();
      this.composer = null;
    }

    if (this.renderer) {
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
      this.renderer.dispose();
      this.renderer = null;
    }
  }
}
