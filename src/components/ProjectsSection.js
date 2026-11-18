/**
 * Kodmates Projects Section Component
 * Dedicated showcase for the featured ASUTI project in the portfolio.
 */

export function createProjectsSection() {
  return `
    <section class="km-section" id="projects" aria-labelledby="projects-title">
      <div class="km-section-container">
        <header class="km-section-header is-centered">
          <div class="km-eyebrow">SELECTED WORK</div>
          <h2 class="km-section-title" id="projects-title">
            Featured Project: <span class="km-section-title-accent">ASUTI</span>
          </h2>
          <p class="km-section-desc">
            An artisanal, high-performance direct-to-consumer digital storefront engineered with soothing aesthetics, sub-second page loads, and seamless checkout conversion.
          </p>
        </header>

        <div class="featured-projects__collection">
          <article class="featured-project" data-project-slug="asuti">
            <div class="featured-project__visual">
              <img src="/assets/projects/asuti-preview.jpg" alt="ASUTI Minimalist &amp; Aesthetic Skincare project preview" class="featured-project__image" loading="lazy" decoding="async" />
            </div>

            <div class="featured-project__content">
              <div class="featured-project__header">
                <span class="featured-project__eyebrow-tag">D2C E-COMMERCE</span>
                <span class="featured-project__category">Digital Products &amp; D2C</span>
              </div>

              <h3 class="featured-project__title">ASUTI</h3>
              <div class="featured-project__tagline">Minimalist &amp; Aesthetic D2C Skincare Experience</div>

              <div class="featured-project__narrative">
                <div class="featured-project__narrative-item">
                  <span class="featured-project__narrative-label">THE PROBLEM</span>
                  <p class="featured-project__narrative-text">
                    Boutique beauty brands frequently struggle to balance rich, visually serene editorial aesthetics with mobile performance and conversion speed. Heavy imagery and sluggish transitions cause high bounce rates.
                  </p>
                </div>
                <div class="featured-project__narrative-item">
                  <span class="featured-project__narrative-label">THE SOLUTION</span>
                  <p class="featured-project__narrative-text">
                    Crafted a custom-engineered, lightweight digital storefront centered on serene micro-interactions and rapid page speed. Built with modern CSS custom properties, responsive image delivery, and a distraction-free slide-out cart drawer.
                  </p>
                </div>
              </div>

              <ul class="featured-project__tech-list" aria-label="Verified technologies used">
                <li class="featured-project__tech-item">JavaScript (ESNext)</li>
                <li class="featured-project__tech-item">HTML5 / Modern CSS</li>
                <li class="featured-project__tech-item">Responsive Grid</li>
                <li class="featured-project__tech-item">Web Performance</li>
                <li class="featured-project__tech-item">Headless E-Commerce</li>
                <li class="featured-project__tech-item">Accessible Micro-Interactions</li>
              </ul>

              <div class="featured-project__actions">
                <a href="/demos/asuti/" target="_blank" rel="noopener noreferrer" class="cta-button hero-cta-primary" aria-label="View ASUTI Live Website (opens in new tab)">
                  <span>View Live Demo</span>
                  <span class="cta-arrow" aria-hidden="true">↗</span>
                </a>
                <a href="/projects/asuti" class="featured-project__secondary-link" aria-label="Explore ASUTI Case Study">
                  <span>Explore Case Study</span>
                  <svg class="featured-project__external-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M3.5 1.5H10.5V8.5M10.5 1.5L1.5 10.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  `;
}

/**
 * Initializes project card interactions
 */
export function initProjectsSection() {
  // Safe listener initialization for portfolio project showcase
}
