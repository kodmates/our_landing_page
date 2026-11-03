/**
 * Project-Specific 3D Visual System (Phase 15 & 19 Performance Optimized)
 *
 * Procedural Three.js visualization that conceptually reinforces verified
 * project themes (e.g. Digital Access & Verification for GatePass).
 *
 * Performance optimizations:
 * - Dynamic import of Three.js: loads ONLY when project.visual3D actually exists
 * - Never loads or executes Three.js for projects without visual3D or on /projects
 * - Pauses rendering when scrolled offscreen (IntersectionObserver)
 * - Pauses rendering when browser tab is hidden (document.visibilitychange)
 * - Zero layout thrashing on mousemove: cached bounding rect
 * - Throttled ResizeObserver with dimensional change detection
 * - Capped device pixel ratio (max 2) to protect mobile GPU fill rate
 * - Full resource disposal: geometries, materials, lights, canvas, context loss
 * - Synchronous cancellation on unmount to prevent post-navigation race conditions
 * - Reduced-motion mode renders a single static frame with zero loops
 */

/**
 * Escapes HTML entities to ensure safe rendering
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Checks whether WebGL rendering context is available
 * @returns {boolean}
 */
export function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

/**
 * Generates the semantic HTML shell for a project's 3D visualization.
 * Returns an empty string if the project has no approved 3D treatment.
 * Does NOT import or execute Three.js (pure string template).
 *
 * @param {object} project
 * @returns {string} HTML markup string or empty string
 */
export function createProject3D(project) {
  if (!project || !project.visual3D || typeof project.visual3D.type !== 'string') {
    return '';
  }

  const type = escapeHTML(project.visual3D.type.trim());
  if (!type) return '';

  return `
    <div class="case-study__project-3d" data-project-3d="${type}">
      <div class="case-study__project-3d-canvas-container" aria-hidden="true"></div>
      <div class="case-study__project-3d-caption" aria-label="Conceptual visualization: Digital Access and Verified Entry">
        <span class="case-study__project-3d-tag">CONCEPTUAL VISUALIZATION</span>
        <span class="case-study__project-3d-sub">Digital Access &amp; Verified Entry</span>
      </div>
    </div>
  `;
}

/**
 * Builds the procedural 3D scene objects for GatePass ('gatepass-access')
 *
 * @param {object} scene - Three.js Scene instance
 * @param {object} THREE - Dynamically loaded Three.js module
 * @returns {object} animation handles and disposable resources
 */
function buildGatePassScene(scene, THREE) {
  const disposables = [];
  const rootGroup = new THREE.Group();
  scene.add(rootGroup);

  // 1. Central Access Card (Digital Credential)
  const cardWidth = 2.0;
  const cardHeight = 3.0;
  const cardGeo = new THREE.BoxGeometry(cardWidth, cardHeight, 0.06);
  const cardMat = new THREE.MeshStandardMaterial({
    color: 0x0a0e0e,
    metalness: 0.85,
    roughness: 0.25,
    transparent: true,
    opacity: 0.92
  });
  const cardMesh = new THREE.Mesh(cardGeo, cardMat);
  rootGroup.add(cardMesh);
  disposables.push(cardGeo, cardMat);

  // Subtle Card Edge Highlight
  const edgeGeo = new THREE.EdgesGeometry(cardGeo);
  const edgeMat = new THREE.LineBasicMaterial({
    color: 0xfeefb8,
    transparent: true,
    opacity: 0.45
  });
  const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
  cardMesh.add(edgeLines);
  disposables.push(edgeGeo, edgeMat);

  // 2. Optical Verification Matrix (QR-inspired geometric matrix on card face)
  const matrixGroup = new THREE.Group();
  matrixGroup.position.set(0, 0, 0.035);
  cardMesh.add(matrixGroup);

  const blockMat = new THREE.MeshBasicMaterial({
    color: 0xfeefb8,
    transparent: true,
    opacity: 0.75
  });
  disposables.push(blockMat);

  // Corner Position Markers (Nested Squares)
  const cornerCoords = [
    [-0.6, 0.85],
    [0.6, 0.85],
    [-0.6, -0.35]
  ];

  cornerCoords.forEach(([cx, cy]) => {
    // Outer box
    const outerGeo = new THREE.RingGeometry(0.18, 0.24, 4);
    outerGeo.rotateZ(Math.PI / 4);
    const outerMesh = new THREE.Mesh(outerGeo, blockMat);
    outerMesh.position.set(cx, cy, 0);
    matrixGroup.add(outerMesh);
    disposables.push(outerGeo);

    // Inner dot
    const innerGeo = new THREE.PlaneGeometry(0.12, 0.12);
    const innerMesh = new THREE.Mesh(innerGeo, blockMat);
    innerMesh.position.set(cx, cy, 0.001);
    matrixGroup.add(innerMesh);
    disposables.push(innerGeo);
  });

  // Micro QR Data Blocks
  const dataBlockGeo = new THREE.PlaneGeometry(0.08, 0.08);
  disposables.push(dataBlockGeo);
  const dotCoords = [
    [0.0, 0.85], [0.15, 0.75], [0.0, 0.6], [0.3, 0.6],
    [-0.15, 0.45], [0.15, 0.45], [-0.45, 0.25], [0.45, 0.25],
    [0.0, 0.15], [0.2, 0.0], [-0.2, 0.0], [0.4, -0.15],
    [0.0, -0.35], [0.25, -0.35], [-0.1, -0.5], [0.1, -0.5],
    [-0.4, -0.8], [-0.2, -0.8], [0.0, -0.8], [0.2, -0.8], [0.4, -0.8]
  ];

  dotCoords.forEach(([x, y]) => {
    const dot = new THREE.Mesh(dataBlockGeo, blockMat);
    dot.position.set(x, y, 0.001);
    matrixGroup.add(dot);
  });

  // 3. Circular Verification Rings
  const ring1Geo = new THREE.TorusGeometry(2.35, 0.015, 12, 64);
  const ring1Mat = new THREE.MeshBasicMaterial({
    color: 0xfeefb8,
    transparent: true,
    opacity: 0.35
  });
  const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
  ring1Mesh.rotation.x = Math.PI / 2.3;
  rootGroup.add(ring1Mesh);
  disposables.push(ring1Geo, ring1Mat);

  const ring2Geo = new THREE.TorusGeometry(2.55, 0.01, 8, 48);
  const ring2Mat = new THREE.MeshBasicMaterial({
    color: 0x889a9a,
    transparent: true,
    opacity: 0.25,
    wireframe: true
  });
  const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2Mesh.rotation.y = Math.PI / 4;
  ring2Mesh.rotation.x = -Math.PI / 3;
  rootGroup.add(ring2Mesh);
  disposables.push(ring2Geo, ring2Mat);

  // 4. Perimeter Portal Frame (Procedural gate lines)
  const portalGroup = new THREE.Group();
  portalGroup.position.set(0, 0, -0.2);
  rootGroup.add(portalGroup);

  const pillarGeo = new THREE.BoxGeometry(0.04, 4.4, 0.04);
  const pillarMat = new THREE.MeshStandardMaterial({
    color: 0x161e1e,
    metalness: 0.9,
    roughness: 0.3
  });
  disposables.push(pillarGeo, pillarMat);

  const leftPillar = new THREE.Mesh(pillarGeo, pillarMat);
  leftPillar.position.set(-2.1, 0, 0);
  portalGroup.add(leftPillar);

  const rightPillar = new THREE.Mesh(pillarGeo, pillarMat);
  rightPillar.position.set(2.1, 0, 0);
  portalGroup.add(rightPillar);

  const lintelGeo = new THREE.BoxGeometry(4.24, 0.04, 0.04);
  const lintelMesh = new THREE.Mesh(lintelGeo, pillarMat);
  lintelMesh.position.set(0, 2.18, 0);
  portalGroup.add(lintelMesh);
  disposables.push(lintelGeo);

  // 5. Optical Scanning Beam Line
  const scanLineGeo = new THREE.PlaneGeometry(2.1, 0.02);
  const scanLineMat = new THREE.MeshBasicMaterial({
    color: 0xfeefb8,
    transparent: true,
    opacity: 0.65,
    side: THREE.DoubleSide
  });
  const scanBeam = new THREE.Mesh(scanLineGeo, scanLineMat);
  scanBeam.position.set(0, 0, 0.05);
  cardMesh.add(scanBeam);
  disposables.push(scanLineGeo, scanLineMat);

  // 6. Restrained Access Particle Field
  const particleCount = 36;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 5.0;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 4.5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xfeefb8,
    size: 0.035,
    transparent: true,
    opacity: 0.35
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  rootGroup.add(particleSystem);
  disposables.push(particleGeo, particleMat);

  return {
    rootGroup,
    cardMesh,
    ring1Mesh,
    ring2Mesh,
    scanBeam,
    particleSystem,
    disposables
  };
}

/**
 * Starts the Three.js scene once the module has been dynamically loaded.
 * Handles render loop, observers, pointer interactions, and disposal.
 *
 * @param {HTMLElement} rootEl
 * @param {object} project
 * @param {object} THREE
 * @returns {Function} cleanup callback
 */
function startThreeScene(rootEl, project, THREE) {
  const container = rootEl.querySelector('.case-study__project-3d-canvas-container');
  const wrapper = rootEl.querySelector('.case-study__project-3d');
  const fallbackEl = rootEl.querySelector('.case-study__hero-visual-fallback');

  function triggerFallback() {
    if (wrapper) wrapper.style.display = 'none';
    if (fallbackEl) fallbackEl.style.display = 'block';
  }

  if (!container || !wrapper) return () => {};

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scene & Camera
  const scene = new THREE.Scene();
  let width = container.clientWidth || 400;
  let height = container.clientHeight || 360;

  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
  camera.position.set(0, 0, 7.5);

  // Renderer
  let renderer = null;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
  } catch (e) {
    triggerFallback();
    return () => {};
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xfeefb8, 1.4);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0x4a6b6b, 0.8, 12);
  fillLight.position.set(-3, -2, 3);
  scene.add(fillLight);

  // Scene Objects
  let sceneHandles = null;
  if (project.visual3D.type === 'gatepass-access') {
    sceneHandles = buildGatePassScene(scene, THREE);
  }

  // Pointer Parallax (Subtle, desktop only, zero layout thrashing)
  let mouseTargetX = 0;
  let mouseTargetY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;
  let cachedRect = null;

  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  function updateCachedRect() {
    if (wrapper) {
      cachedRect = wrapper.getBoundingClientRect();
    }
  }

  function onPointerEnter() {
    updateCachedRect();
  }

  function onPointerMove(e) {
    if (prefersReducedMotion || isTouch) return;
    if (!cachedRect) updateCachedRect();
    if (!cachedRect || cachedRect.width === 0 || cachedRect.height === 0) return;
    const x = (e.clientX - cachedRect.left) / cachedRect.width - 0.5;
    const y = (e.clientY - cachedRect.top) / cachedRect.height - 0.5;
    mouseTargetX = x * 0.35;
    mouseTargetY = -y * 0.35;
  }

  function onPointerLeave() {
    mouseTargetX = 0;
    mouseTargetY = 0;
  }

  if (!isTouch && !prefersReducedMotion) {
    wrapper.addEventListener('pointerenter', onPointerEnter, { passive: true });
    wrapper.addEventListener('pointermove', onPointerMove, { passive: true });
    wrapper.addEventListener('pointerleave', onPointerLeave, { passive: true });
  }

  // Animation Loop, Tab Visibility, and Intersection Control
  let animFrameId = null;
  let isIntersecting = true;
  let isPageVisible = !document.hidden;
  let startTime = performance.now();

  function renderFrame() {
    if (!renderer) return;

    // Halt render loop when tab is hidden or element is offscreen
    if (!isIntersecting || !isPageVisible) {
      animFrameId = null;
      return;
    }

    const t = (performance.now() - startTime) * 0.001;

    if (sceneHandles && !prefersReducedMotion) {
      sceneHandles.cardMesh.position.y = Math.sin(t * 0.8) * 0.08;
      sceneHandles.cardMesh.rotation.y = Math.sin(t * 0.5) * 0.12;
      sceneHandles.cardMesh.rotation.x = Math.cos(t * 0.4) * 0.05;

      sceneHandles.ring1Mesh.rotation.z = t * 0.12;
      sceneHandles.ring2Mesh.rotation.z = -t * 0.09;

      sceneHandles.scanBeam.position.y = Math.sin(t * 1.4) * 1.25;

      sceneHandles.particleSystem.rotation.y = t * 0.02;

      currentMouseX += (mouseTargetX - currentMouseX) * 0.06;
      currentMouseY += (mouseTargetY - currentMouseY) * 0.06;
      sceneHandles.rootGroup.rotation.y = currentMouseX;
      sceneHandles.rootGroup.rotation.x = currentMouseY;
    } else if (sceneHandles && prefersReducedMotion) {
      sceneHandles.cardMesh.position.y = 0;
      sceneHandles.cardMesh.rotation.y = 0.08;
      sceneHandles.scanBeam.position.y = 0;
    }

    renderer.render(scene, camera);

    if (!prefersReducedMotion) {
      animFrameId = requestAnimationFrame(renderFrame);
    }
  }

  // Start rendering
  renderFrame();

  // Page Visibility Change (Step 06): Pause when tab is minimized or hidden
  function onVisibilityChange() {
    isPageVisible = !document.hidden;
    if (isPageVisible && isIntersecting && !prefersReducedMotion && !animFrameId) {
      startTime = performance.now();
      animFrameId = requestAnimationFrame(renderFrame);
    }
  }
  document.addEventListener('visibilitychange', onVisibilityChange);

  // ResizeObserver with dimensional change detection to avoid redundant renderer updates
  let lastW = width;
  let lastH = height;
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const cr = entry.contentRect;
      const newW = Math.round(cr.width);
      const newH = Math.round(cr.height);
      if (newW > 0 && newH > 0 && (newW !== lastW || newH !== lastH) && renderer) {
        lastW = newW;
        lastH = newH;
        cachedRect = null;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
        if (prefersReducedMotion) {
          renderer.render(scene, camera);
        }
      }
    }
  });
  resizeObserver.observe(container);

  // IntersectionObserver to pause rendering when scrolled out of view
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const wasIntersecting = isIntersecting;
        isIntersecting = entry.isIntersecting;
        if (isIntersecting && !wasIntersecting && isPageVisible && !prefersReducedMotion && !animFrameId) {
          startTime = performance.now();
          animFrameId = requestAnimationFrame(renderFrame);
        }
      }
    },
    { threshold: 0.1 }
  );
  intersectionObserver.observe(wrapper);

  // Cleanup Function: Complete resource disposal
  return function destroyThreeScene() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }

    document.removeEventListener('visibilitychange', onVisibilityChange);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();

    if (!isTouch && !prefersReducedMotion) {
      wrapper.removeEventListener('pointerenter', onPointerEnter);
      wrapper.removeEventListener('pointermove', onPointerMove);
      wrapper.removeEventListener('pointerleave', onPointerLeave);
    }

    // Dispose scene-specific geometries and materials
    if (sceneHandles && sceneHandles.disposables) {
      sceneHandles.disposables.forEach((item) => {
        if (item && typeof item.dispose === 'function') {
          item.dispose();
        }
      });
    }

    // Dispose lights
    ambientLight.dispose?.();
    keyLight.dispose?.();
    fillLight.dispose?.();

    // Dispose renderer and force GPU context loss
    if (renderer) {
      renderer.dispose?.();
      renderer.forceContextLoss?.();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer = null;
    }
  };
}

/**
 * Initializes and manages the Three.js canvas lifecycle for the project 3D visual.
 * Loads Three.js asynchronously only when project.visual3D actually exists.
 * Returns a synchronous cleanup function immediately to prevent navigation race conditions.
 *
 * @param {HTMLElement} rootEl - Mounted case study page element
 * @param {object} project - Current project data
 * @returns {Function|null} Cleanup function to dispose all resources
 */
export function initProject3D(rootEl, project) {
  if (!rootEl || !project || !project.visual3D || !project.visual3D.type) {
    return null;
  }

  const wrapper = rootEl.querySelector('.case-study__project-3d');
  const fallbackEl = rootEl.querySelector('.case-study__hero-visual-fallback');

  function triggerFallback() {
    if (wrapper) wrapper.style.display = 'none';
    if (fallbackEl) fallbackEl.style.display = 'block';
  }

  // Pre-flight check: WebGL availability
  if (!isWebGLAvailable()) {
    triggerFallback();
    return null;
  }

  let isDestroyed = false;
  let cleanupScene = null;

  // Dynamically load Three.js ONLY for projects that actually require 3D
  import('three')
    .then((THREE) => {
      if (isDestroyed) return;
      cleanupScene = startThreeScene(rootEl, project, THREE);
    })
    .catch((err) => {
      console.warn('Failed to load Three.js for project 3D visual:', err);
      triggerFallback();
    });

  return function destroyProject3D() {
    isDestroyed = true;
    if (typeof cleanupScene === 'function') {
      cleanupScene();
      cleanupScene = null;
    }
  };
}

export default {
  createProject3D,
  initProject3D,
  isWebGLAvailable
};
