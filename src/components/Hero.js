import { createCapabilityRow } from './CapabilityRow.js';

/**
 * Kodmates Homepage Hero Component
 * Assembles Left typography/actions, Right 3D software ecosystem, and bottom capability indicators.
 * Implements code-splitting and dynamic import for Three.js to guarantee immediate text render.
 */
export class Hero {
  constructor(options = {}) {
    this.target = options.target || document.getElementById('main-content');
    this.heroEl = null;
    this.ecosystem3D = null;
  }

  renderHTML() {
    const capabilityRowHtml = createCapabilityRow();

    return `
      <section class="hero-section" id="hero" aria-label="Kodmates Hero">
        <!-- Subtle dark landscape horizon & ambient warm atmospheric illumination -->
        <div class="hero-ambient-glow" aria-hidden="true"></div>
        <div class="hero-ambient-landscape" aria-hidden="true">
          <img src="/assets/hero-bg-landscape.jpg?v=3" alt="" class="hero-landscape-img" loading="eager" />
        </div>

        <div class="hero-container">
          <div class="hero-main-grid">
            <!-- Left Column: Typography & CTAs (~46%) -->
            <div class="hero-content-col">
              <div class="hero-eyebrow">
                DIGITAL SOLUTIONS FOR A SMARTER TOMORROW
              </div>

              <h1 class="hero-title">
                <span class="hero-title-line">Software Built</span>
                <span class="hero-title-line">Around <span class="hero-title-accent">Your</span></span>
                <span class="hero-title-line"><span class="hero-title-accent">Business.</span></span>
              </h1>

              <p class="hero-description">
                We design and develop custom web applications, Android apps and business systems that solve real problems and create real growth.
              </p>

              <div class="hero-actions">
                <a href="#contact" class="cta-button hero-cta-primary" id="hero-primary-cta">
                  <span>Start a Project</span>
                  <span class="cta-arrow" aria-hidden="true">→</span>
                </a>

                <a href="#projects" class="hero-cta-secondary" id="hero-secondary-cta">
                  <svg class="hero-cta-play-icon" viewBox="0 0 20 20" fill="none" width="18" height="18" aria-hidden="true">
                    <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.4"/>
                    <polygon points="8,6.5 14.5,10 8,13.5" fill="currentColor"/>
                  </svg>
                  <span>View Our Work</span>
                </a>
              </div>
            </div>

            <!-- Right Column: Interactive 3D Software Ecosystem (~54%) -->
            <div class="hero-visual-col">
              <div class="hero-3d-wrapper" id="hero-3d-wrapper">
                <!-- Static Fallback (active on slow connections, reduced motion, or WebGL absence) -->
                <div class="hero-fallback" id="hero-fallback">
                  <img 
                    src="/assets/hero-fallback.jpg" 
                    alt="Kodmates Interactive Software Ecosystem" 
                    class="hero-fallback-img"
                    width="620" 
                    height="620" 
                    loading="eager" 
                  />
                </div>
              </div>

              </div>
            </div>
          </div>

          <!-- Bottom Capability Row -->
          ${capabilityRowHtml}
        </div>
      </section>
    `;
  }

  mount(container = null) {
    const parent = container || this.target;
    if (!parent) return null;

    const existing = document.getElementById('hero');
    if (existing) {
      this.heroEl = existing;
    } else {
      const temp = document.createElement('div');
      temp.innerHTML = this.renderHTML().trim();
      this.heroEl = temp.firstElementChild;
      parent.appendChild(this.heroEl);
    }

    this.init3D();
    return this.heroEl;
  }

    async init3D() {
    const wrapper = this.heroEl.querySelector('#hero-3d-wrapper');
    const fallback = this.heroEl.querySelector('#hero-fallback');

    if (wrapper) {
      try {
        // Mount React Three Fiber HeroScene component
        const { mountHeroScene } = await import('./HeroSceneMount.jsx');
        this.reactHeroRoot = mountHeroScene(wrapper);
      } catch (err) {
        console.warn('Failed to load React Three Fiber module, falling back to Vanilla Three.js engine:', err);
        try {
          const { HeroEcosystem3D } = await import('./HeroEcosystem3D.js');
          this.ecosystem3D = new HeroEcosystem3D({
            container: wrapper,
            fallbackEl: fallback,
            heroSectionEl: this.heroEl
          });
          this.ecosystem3D.init();
        } catch (innerErr) {
          console.warn('Failed to load 3D engine, displaying static fallback:', innerErr);
          if (fallback) fallback.style.display = 'block';
        }
      }
    }
  }


  pause() {
    if (this.ecosystem3D && typeof this.ecosystem3D.pause === 'function') {
      this.ecosystem3D.pause();
    }
  }

  resume() {
    if (this.ecosystem3D && typeof this.ecosystem3D.resume === 'function') {
      this.ecosystem3D.resume();
    }
  }

    destroy() {
    if (this.reactHeroRoot && typeof this.reactHeroRoot.destroy === 'function') {
      this.reactHeroRoot.destroy();
      this.reactHeroRoot = null;
    }
    if (this.ecosystem3D) {
      this.ecosystem3D.destroy();
      this.ecosystem3D = null;
    }
    if (this.heroEl && this.heroEl.parentNode) {
      this.heroEl.parentNode.removeChild(this.heroEl);
    }
  }
}

export function initHero(options = {}) {
  const hero = new Hero(options);
  hero.mount();
  return hero;
}
