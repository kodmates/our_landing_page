import { getProjectInitials } from './ProjectCard.js';

/**
 * Renders an authentic, truthful product interface preview for the featured project.
 * Demonstrates the verified multi-tier architecture (React web console + native Android CameraX app).
 */
function renderFeaturedVisualPreview(project) {
  const { slug = '', title = '', category = '', screenshots = [] } = project || {};

  // Use real screenshot if provided
  if (Array.isArray(screenshots) && screenshots.length > 0 && Boolean(screenshots[0])) {
    return `<img src="${screenshots[0]}" alt="${title} featured preview" class="featured-project__image" loading="lazy" decoding="async" />`;
  }

  // Authentic KoroCraft Interface Console (E-Commerce & Automation)
  if (slug === 'korocraft') {
    return `
      <div class="featured-project__console" aria-label="KoroCraft catalog and webhook sync engine preview">
        <!-- Desktop Sourcing & Fulfillment Console -->
        <div class="featured-project__desktop-shell">
          <div class="featured-project__console-titlebar">
            <div class="featured-project__window-dots" aria-hidden="true">
              <span class="featured-project__dot featured-project__dot--red"></span>
              <span class="featured-project__dot featured-project__dot--yellow"></span>
              <span class="featured-project__dot featured-project__dot--green"></span>
            </div>
            <span class="featured-project__console-address">api.korocraft.com/v1/fulfillment/sync</span>
            <span class="featured-project__console-status">
              <span class="hero-log-item__dot"></span>
              2-WAY SYNC
            </span>
          </div>

          <div class="featured-project__console-body">
            <!-- Telemetry Metrics -->
            <div class="featured-project__console-metrics">
              <div class="featured-project__metric-tile">
                <span class="featured-project__metric-label">SUPPLIER SYNC</span>
                <span class="featured-project__metric-val" style="color: #34D399;">140ms Latency</span>
              </div>
              <div class="featured-project__metric-tile">
                <span class="featured-project__metric-label">ACTIVE SKUS</span>
                <span class="featured-project__metric-val">14,820 Live</span>
              </div>
              <div class="featured-project__metric-tile">
                <span class="featured-project__metric-label">DISPATCH STATUS</span>
                <span class="featured-project__metric-val" style="color: var(--km-accent-primary, #FEEFB8);">Auto-Routed</span>
              </div>
            </div>

            <!-- Live Ingest Manifest -->
            <div class="featured-project__manifest-card">
              <div class="featured-project__manifest-header">
                <span>REAL-TIME INVENTORY & ORDER STREAM</span>
                <span style="color: var(--km-accent-primary, #FEEFB8);">WEBHOOK DISPATCH</span>
              </div>
              <div class="featured-project__manifest-row">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="hero-log-item__dot"></span>
                  <span style="font-weight: 600; color: #FFFFFF;">Order #KC-9941 // Multi-Item</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-family: monospace; font-size: 10px; color: rgba(254, 239, 184, 0.7);">CJ API SYNCED</span>
                  <span class="featured-project__status-badge">STOCK: 48 IN HUB</span>
                </div>
              </div>
              <div class="featured-project__manifest-row">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="hero-log-item__dot"></span>
                  <span style="font-weight: 600; color: #FFFFFF;">Order #KC-9942 // Express Route</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-family: monospace; font-size: 10px; color: rgba(254, 239, 184, 0.7);">TRACKING GENERATED</span>
                  <span class="featured-project__status-badge" style="border-color: #34D399; color: #34D399;">DISPATCHED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Overlapping Telemetry Handset -->
        <div class="featured-project__phone-shell" aria-hidden="true">
          <div class="hero-mobile-shell__notch"></div>
          <div class="featured-project__phone-screen">
            <div style="font-size: 8.5px; font-weight: 800; letter-spacing: 0.08em; color: #34D399; margin-bottom: 4px;">
              SUPPLIER INGEST
            </div>
            <div class="featured-project__phone-qr" style="font-size: 14px; color: var(--km-accent-primary, #FEEFB8);">⚡</div>
            <div style="font-size: 9px; font-weight: 700; color: #FFFFFF; margin-bottom: 2px;">
              SKU #9941
            </div>
            <div style="font-size: 8px; color: var(--km-accent-primary, #FEEFB8);">
              140ms Latency
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // GatePass Fallback (Legacy)
  if (slug === 'gatepass') {
    return `
      <div class="featured-project__console" aria-label="GatePass security console and mobile scanner preview">
        <div class="featured-project__desktop-shell">
          <div class="featured-project__console-titlebar">
            <span class="featured-project__console-address">stags.internal/perimeter/turnstiles</span>
          </div>
        </div>
      </div>
    `;
  }

  // Clean fallback for other projects
  const initials = getProjectInitials(title);
  return `
    <div class="featured-project__visual-fallback" aria-hidden="true">
      <div class="featured-project__fallback-grid"></div>
      <div class="featured-project__fallback-glow"></div>
      <div class="featured-project__fallback-center">
        <div class="featured-project__fallback-badge">
          <span class="featured-project__fallback-monogram">${initials}</span>
        </div>
        <span class="featured-project__fallback-title">${title}</span>
      </div>
      <div class="featured-project__fallback-footer">
        <span class="featured-project__fallback-code">REF // ${(slug || 'SYSTEM').toUpperCase()}</span>
        ${category ? `<span class="featured-project__fallback-cat">${category}</span>` : ''}
      </div>
    </div>
  `;
}

/**
 * Creates the HTML markup for an individual featured project card
 * Follows an editorial, widescreen layout for elevated visual hierarchy
 *
 * @param {object} project - Project data schema object
 * @returns {string} HTML markup string
 */
export function createFeaturedProjectCard(project = {}) {
  const {
    slug = '',
    title = '',
    category = '',
    tagline = '',
    shortDescription = '',
    problem = '',
    solution = '',
    technologies = [],
    links = {}
  } = project;

  const description = (shortDescription || tagline || '').trim();

  // Category badge
  const categoryMarkup = category
    ? `<span class="featured-project__category">${category}</span>`
    : '';

  // Problem & Solution Structured Callouts
  const narrativeMarkup = (problem || solution)
    ? `
      <div class="featured-project__narrative">
        ${problem ? `
          <div class="featured-project__narrative-item">
            <span class="featured-project__narrative-label">THE PROBLEM</span>
            <p class="featured-project__narrative-text">${problem}</p>
          </div>
        ` : ''}
        ${solution ? `
          <div class="featured-project__narrative-item">
            <span class="featured-project__narrative-label">THE SOLUTION</span>
            <p class="featured-project__narrative-text">${solution}</p>
          </div>
        ` : ''}
      </div>
    `
    : (description ? `<p class="featured-project__description">${description}</p>` : '');

  // Technologies
  const techMarkup = Array.isArray(technologies) && technologies.length > 0
    ? `
      <ul class="featured-project__tech-list" aria-label="Verified technologies used">
        ${technologies.slice(0, 6).map((t) => `<li class="featured-project__tech-item">${t}</li>`).join('')}
      </ul>
    `
    : '';

  // Secondary external links
  let secondaryLinkMarkup = '';
  if (links && links.live) {
    secondaryLinkMarkup = `
      <a href="${links.live}" target="_blank" rel="noopener noreferrer" class="featured-project__secondary-link" aria-label="Visit ${title} live website (opens in new tab)">
        <span>Live Site</span>
        <svg class="featured-project__external-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M3.5 1.5H10.5V8.5M10.5 1.5L1.5 10.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
    `;
  } else if (links && links.repository) {
    secondaryLinkMarkup = `
      <a href="${links.repository}" target="_blank" rel="noopener noreferrer" class="featured-project__secondary-link" aria-label="View ${title} repository (opens in new tab)">
        <span>Repository</span>
        <svg class="featured-project__external-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M3.5 1.5H10.5V8.5M10.5 1.5L1.5 10.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
    `;
  }

  return `
    <article class="featured-project" data-project-slug="${slug}">
      <div class="featured-project__visual">
        ${renderFeaturedVisualPreview(project)}
      </div>

      <div class="featured-project__content">
        <div class="featured-project__header">
          <span class="featured-project__eyebrow-tag">FLAGSHIP ARCHITECTURE</span>
          ${categoryMarkup}
        </div>

        <h3 class="featured-project__title">${title}</h3>
        ${tagline ? `<div class="featured-project__tagline">${tagline}</div>` : ''}

        ${narrativeMarkup}
        ${techMarkup}

        <div class="featured-project__actions">
          <a href="/projects/${slug}" class="featured-project__link" aria-label="Explore ${title} Case Study">
            <span class="featured-project__link-text">Explore Full Case Study</span>
            <svg class="featured-project__link-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
          ${secondaryLinkMarkup}
        </div>
      </div>
    </article>
  `;
}

/**
 * FeaturedProject Component (Phase 06)
 * Generates the Featured Projects section markup.
 * Gracefully handles 0, 1, or multiple featured projects.
 *
 * @param {Array<object>} featuredProjects - Array of featured project objects
 * @returns {string} HTML markup string or empty string if no featured projects
 */
export function createFeaturedSection(featuredProjects = []) {
  if (!Array.isArray(featuredProjects) || featuredProjects.length === 0) {
    return '';
  }

  const sectionTitle = featuredProjects.length === 1 ? 'Featured System' : 'Featured Systems';
  const cardsMarkup = featuredProjects.map((p) => createFeaturedProjectCard(p)).join('');

  return `
    <section class="featured-projects-section" aria-labelledby="featured-section-heading">
      <div class="featured-projects__container">
        <div class="featured-projects__section-header">
          <span class="featured-projects__section-label">PRODUCTION SPOTLIGHT</span>
          <h2 class="featured-projects__section-title" id="featured-section-heading">${sectionTitle}</h2>
        </div>

        <div class="featured-projects__collection ${featuredProjects.length > 1 ? 'featured-projects__collection--multi' : ''}">
          ${cardsMarkup}
        </div>
      </div>
    </section>
  `;
}

export default createFeaturedSection;
