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

              <!-- Blueprint Annotation Layer (Phase N Engineering Blueprint Match) -->
              <div class="hero-blueprint-annotations" aria-hidden="true">
                <!-- 1. Web Module -->
                <div class="bp-annotation bp-anno-web">
                  <div class="bp-anno-header">WEB MODULE</div>
                  <ul class="bp-anno-list">
                    <li>3D metallic module</li>
                    <li>Icon + Label</li>
                    <li>Glowing edge</li>
                    <li>Data connection</li>
                  </ul>
                  <svg class="bp-leader-line" viewBox="0 0 120 70">
                    <path d="M0,12 L60,12 L112,62" fill="none" stroke="rgba(254, 239, 184, 0.75)" stroke-width="1.2"/>
                    <circle cx="112" cy="62" r="2.5" fill="#FEEFB8"/>
                  </svg>
                </div>

                <!-- 2. Android Module -->
                <div class="bp-annotation bp-anno-android">
                  <div class="bp-anno-header">ANDROID MODULE</div>
                  <ul class="bp-anno-list">
                    <li>3D metallic module</li>
                    <li>Icon + Label</li>
                    <li>Glowing edge</li>
                    <li>Data connection</li>
                  </ul>
                  <svg class="bp-leader-line" viewBox="0 0 120 50">
                    <path d="M120,15 L45,15 L6,42" fill="none" stroke="rgba(254, 239, 184, 0.75)" stroke-width="1.2"/>
                    <circle cx="6" cy="42" r="2.5" fill="#FEEFB8"/>
                  </svg>
                </div>

                <!-- 3. Central Core -->
                <div class="bp-annotation bp-anno-core">
                  <div class="bp-anno-header">CENTRAL CORE</div>
                  <ul class="bp-anno-list">
                    <li>Dark metallic sphere</li>
                    <li>Internal network grid</li>
                    <li>Recessed K logo</li>
                    <li>Gold illumination</li>
                    <li>System lines &amp; nodes</li>
                  </ul>
                  <svg class="bp-leader-line" viewBox="0 0 115 20">
                    <path d="M0,8 L104,8" fill="none" stroke="rgba(254, 239, 184, 0.75)" stroke-width="1.2"/>
                    <circle cx="104" cy="8" r="2.5" fill="#FEEFB8"/>
                  </svg>
                </div>

                <!-- 4. Cloud Module -->
                <div class="bp-annotation bp-anno-cloud">
                  <div class="bp-anno-header">CLOUD MODULE</div>
                  <ul class="bp-anno-list">
                    <li>3D metallic module</li>
                    <li>Icon + Label</li>
                    <li>Glowing edge</li>
                    <li>Data connection</li>
                  </ul>
                  <svg class="bp-leader-line" viewBox="0 0 80 40">
                    <path d="M80,15 L30,15 L6,30" fill="none" stroke="rgba(254, 239, 184, 0.75)" stroke-width="1.2"/>
                    <circle cx="6" cy="30" r="2.5" fill="#FEEFB8"/>
                  </svg>
                </div>

                <!-- 5. API Module -->
                <div class="bp-annotation bp-anno-api">
                  <div class="bp-anno-header">API MODULE</div>
                  <ul class="bp-anno-list">
                    <li>3D metallic module</li>
                    <li>Icon + Label</li>
                    <li>Glowing edge</li>
                    <li>Data connection</li>
                  </ul>
                  <svg class="bp-leader-line" viewBox="0 0 80 20">
                    <path d="M75,8 L6,8" fill="none" stroke="rgba(254, 239, 184, 0.75)" stroke-width="1.2"/>
                    <circle cx="6" cy="8" r="2.5" fill="#FEEFB8"/>
                  </svg>
                </div>

                <!-- 6. Business Module -->
                <div class="bp-annotation bp-anno-business">
                  <div class="bp-anno-header">BUSINESS MODULE</div>
                  <ul class="bp-anno-list">
                    <li>3D metallic module</li>
                    <li>Icon + Label</li>
                    <li>Glowing edge</li>
                    <li>Data connection</li>
                  </ul>
                  <svg class="bp-leader-line" viewBox="0 0 170 20">
                    <path d="M0,8 L162,8" fill="none" stroke="rgba(254, 239, 184, 0.75)" stroke-width="1.2"/>
                    <circle cx="162" cy="8" r="2.5" fill="#FEEFB8"/>
                  </svg>
                </div>

                <!-- 7. Platform Base -->
                <div class="bp-annotation bp-anno-platform">
                  <div class="bp-anno-header">PLATFORM BASE</div>
                  <ul class="bp-anno-list">
                    <li>Metallic platform</li>
                    <li>Subtle glow</li>
                    <li>Grounded composition</li>
                    <li>Reflection and shadow</li>
                  </ul>
                  <svg class="bp-leader-line" viewBox="0 0 100 35">
                    <path d="M95,8 L40,8 L8,28" fill="none" stroke="rgba(254, 239, 184, 0.75)" stroke-width="1.2"/>
                    <circle cx="8" cy="28" r="2.5" fill="#FEEFB8"/>
                  </svg>
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
        // Dynamic import / lazy-loading so Three.js does not block critical HTML text
        const { HeroEcosystem3D } = await import('./HeroEcosystem3D.js');
        this.ecosystem3D = new HeroEcosystem3D({
          container: wrapper,
          fallbackEl: fallback,
          heroSectionEl: this.heroEl
        });
        this.ecosystem3D.init();
      } catch (err) {
        console.warn('Failed to load 3D module, displaying static fallback:', err);
        if (fallback) fallback.style.display = 'block';
      }
    }
  }

  destroy() {
    if (this.ecosystem3D) {
      this.ecosystem3D.destroy();
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
