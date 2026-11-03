/**
 * Helper to generate a 2-character monogram for visual fallback
 * @param {string} title 
 * @returns {string}
 */
export function getProjectInitials(title) {
  if (!title) return 'KM';
  const words = title.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return title.slice(0, 2).toUpperCase();
}

/**
 * Returns an authentic, truthful CSS/SVG visual interface composition
 * tailored to each real KodMates project based on verified capabilities.
 * @param {object} project 
 * @returns {string} HTML markup
 */
export function renderProjectCardInterface(project) {
  const { slug, title, category, screenshots } = project;

  // Use real screenshot if available
  if (Array.isArray(screenshots) && screenshots.length > 0 && Boolean(screenshots[0])) {
    return `<img src="${screenshots[0]}" alt="${title} project preview" class="project-card__image" loading="lazy" decoding="async" />`;
  }

  switch (slug) {
    case 'gatepass':
      return `
        <div class="project-card__interface" aria-label="GatePass security console preview">
          <div class="project-card__interface-header">
            <span class="project-card__interface-code">GATEPASS // SECURE ACCESS</span>
            <span class="project-card__interface-status">
              <span class="hero-log-item__dot"></span>
              LIVE CAMERAX
            </span>
          </div>
          <div class="project-card__interface-body">
            <div style="background: rgba(18, 24, 24, 0.9); border: 1px solid rgba(254, 239, 184, 0.14); border-radius: 8px; padding: 10px; display: flex; gap: 10px; align-items: center;">
              <div style="width: 40px; height: 40px; background: rgba(8, 10, 10, 0.9); border: 1px dashed rgba(254, 239, 184, 0.35); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: var(--km-accent-primary, #FEEFB8); font-size: 15px; flex-shrink: 0;">
                ⛶
              </div>
              <div>
                <div style="font-size: 8px; font-weight: 800; letter-spacing: 0.08em; color: #34D399; text-transform: uppercase;">VERIFIED VISITOR PASS</div>
                <div style="font-size: 11px; font-weight: 700; color: #FFFFFF;">PASS #GP-8492</div>
                <div style="font-size: 8.5px; color: rgba(240, 242, 238, 0.6);">Terminal 02 // North Turnstile</div>
              </div>
            </div>
          </div>
        </div>
      `;
    case 'korocraft':
      return `
        <div class="project-card__interface" aria-label="KoroCraft catalog and webhook sync engine preview">
          <div class="project-card__interface-header">
            <span class="project-card__interface-code">KOROCRAFT // FULFILLMENT SYNC</span>
            <span class="project-card__interface-status">
              <span class="hero-log-item__dot"></span>
              2-WAY SYNC
            </span>
          </div>
          <div class="project-card__interface-body">
            <div style="background: rgba(18, 24, 24, 0.9); border: 1px solid rgba(254, 239, 184, 0.14); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 9px;">
                <span style="color: rgba(240, 242, 238, 0.6);">Supplier Ingest API</span>
                <span style="color: var(--km-accent-primary, #FEEFB8); font-weight: 700;">140ms Latency</span>
              </div>
              <div style="display: flex; gap: 6px;">
                <div style="flex: 1; height: 18px; background: rgba(254, 239, 184, 0.1); border-radius: 4px; display: flex; align-items: center; padding: 0 6px; font-size: 8px; color: var(--km-accent-primary, #FEEFB8);">SKU #9941 Synced</div>
                <div style="flex: 1; height: 18px; background: rgba(52, 211, 153, 0.15); border-radius: 4px; display: flex; align-items: center; padding: 0 6px; font-size: 8px; color: #34D399;">Stock: 48 in Hub</div>
              </div>
            </div>
          </div>
        </div>
      `;
    case 'asuti':
      return `
        <div class="project-card__interface" aria-label="ASUTI luxury minimalist e-commerce storefront preview">
          <div class="project-card__interface-header">
            <span class="project-card__interface-code">ASUTI // EDITORIAL STOREFRONT</span>
            <span class="project-card__interface-status">
              <span class="hero-log-item__dot"></span>
              0.6s LCP SPEED
            </span>
          </div>
          <div class="project-card__interface-body">
            <div style="background: rgba(18, 24, 24, 0.9); border: 1px solid rgba(254, 239, 184, 0.14); border-radius: 8px; padding: 10px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 8px; letter-spacing: 0.12em; color: var(--km-accent-primary, #FEEFB8); text-transform: uppercase;">D2C BEAUTY RITUALS</div>
                <div style="font-size: 11.5px; font-weight: 700; color: #FFFFFF;">Botanical Hydration Mist</div>
                <div style="font-size: 8.5px; color: rgba(240, 242, 238, 0.55);">Dynamic Cart & Fast Checkout</div>
              </div>
              <div style="background: rgba(254, 239, 184, 0.12); border: 1px solid rgba(254, 239, 184, 0.25); border-radius: 6px; padding: 4px 8px; font-size: 8.5px; font-weight: 700; color: var(--km-accent-primary, #FEEFB8);">
                BAG (2)
              </div>
            </div>
          </div>
        </div>
      `;
    case 'beast':
      return `
        <div class="project-card__interface" aria-label="BEAST industrial audio flagship preview">
          <div class="project-card__interface-header">
            <span class="project-card__interface-code">BEAST // AUDIO HARDWARE FLAGSHIP</span>
            <span class="project-card__interface-status">
              <span class="hero-log-item__dot"></span>
              ANC ACTIVE
            </span>
          </div>
          <div class="project-card__interface-body">
            <div style="background: rgba(18, 24, 24, 0.9); border: 1px solid rgba(254, 239, 184, 0.14); border-radius: 8px; padding: 10px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 8px; letter-spacing: 0.1em; color: #34D399; text-transform: uppercase; font-weight: 700;">STUDIO DRIVER // 40MM</div>
                <div style="font-size: 11.5px; font-weight: 700; color: #FFFFFF;">Acoustic Chamber Matrix</div>
                <div style="font-size: 8.5px; color: rgba(240, 242, 238, 0.55);">20Hz – 40kHz High-Resolution</div>
              </div>
              <div style="background: rgba(254, 239, 184, 0.1); border: 1px solid rgba(254, 239, 184, 0.2); border-radius: 4px; padding: 3px 6px; font-size: 8px; color: var(--km-accent-primary, #FEEFB8);">
                -38dB ANC
              </div>
            </div>
          </div>
        </div>
      `;
    case 'tinytots':
      return `
        <div class="project-card__interface" aria-label="TinyTots baby essentials retail storefront preview">
          <div class="project-card__interface-header">
            <span class="project-card__interface-code">TINYTOTS // RETAIL COMMERCE</span>
            <span class="project-card__interface-status">
              <span class="hero-log-item__dot"></span>
              SAFE CHECKOUT
            </span>
          </div>
          <div class="project-card__interface-body">
            <div style="background: rgba(18, 24, 24, 0.9); border: 1px solid rgba(254, 239, 184, 0.14); border-radius: 8px; padding: 10px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 8px; letter-spacing: 0.1em; color: var(--km-accent-primary, #FEEFB8); text-transform: uppercase;">BABY ESSENTIALS</div>
                <div style="font-size: 11.5px; font-weight: 700; color: #FFFFFF;">Organic Cotton Bundles</div>
                <div style="font-size: 8.5px; color: rgba(240, 242, 238, 0.55);">Multi-Category Rapid Filtering</div>
              </div>
              <div style="background: rgba(52, 211, 153, 0.15); border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 4px; padding: 3px 6px; font-size: 8px; color: #34D399; font-weight: 700;">
                Certified ✓
              </div>
            </div>
          </div>
        </div>
      `;
    default:
      const initials = getProjectInitials(title);
      return `
        <div class="project-card__visual-fallback" aria-hidden="true">
          <div class="project-card__fallback-grid"></div>
          <div class="project-card__fallback-glow"></div>
          <div class="project-card__fallback-center">
            <div class="project-card__fallback-badge">
              <span class="project-card__fallback-monogram">${initials}</span>
            </div>
            <span class="project-card__fallback-title">${title}</span>
          </div>
          <div class="project-card__fallback-footer">
            <span class="project-card__fallback-code">REF // ${slug.toUpperCase()}</span>
            ${category ? `<span class="project-card__fallback-cat">${category}</span>` : ''}
          </div>
        </div>
      `;
  }
}

/**
 * ProjectCard Component (Phase 05 Refined)
 * Reusable, semantic, data-driven project card.
 *
 * Information Hierarchy:
 * 1. Visual area (verified image or authentic UI interface preview)
 * 2. Meta row (category + featured indicator when verified)
 * 3. Project title
 * 4. Short description / tagline when verified
 * 5. Technologies / services when verified
 * 6. Action area with primary case study link & verified secondary external links
 *
 * @param {object} project - Project schema object
 * @returns {string} HTML markup string
 */
export function createProjectCard(project = {}) {
  const {
    slug = '',
    title = '',
    category = '',
    tagline = '',
    shortDescription = '',
    featured = false,
    technologies = [],
    services = [],
    links = {}
  } = project;

  // 1. Description resolution: prefer shortDescription, fallback to tagline
  const description = (shortDescription || tagline || '').trim();
  const isFeatured = Boolean(featured);

  // 2. Visual presentation
  const visualMarkup = renderProjectCardInterface(project);

  // 3. Category & Featured Meta
  const categoryMarkup = category
    ? `<span class="project-card__category">${category}</span>`
    : '';

  const featuredMarkup = isFeatured
    ? `<span class="project-card__featured-badge" aria-label="Featured System">Featured</span>`
    : '';

  const metaMarkup = (categoryMarkup || featuredMarkup)
    ? `
      <div class="project-card__meta">
        ${categoryMarkup}
        ${featuredMarkup}
      </div>
    `
    : '';

  // 4. Description (Conditional)
  const descriptionMarkup = description
    ? `<p class="project-card__description">${description}</p>`
    : '';

  // 5. Technologies & Services (Conditional - only if verified data exists)
  const techMarkup = Array.isArray(technologies) && technologies.length > 0
    ? `
      <ul class="project-card__tech-list" aria-label="Technologies used">
        ${technologies.slice(0, 5).map((t) => `<li class="project-card__tech-item">${t}</li>`).join('')}
      </ul>
    `
    : '';

  const servicesMarkup = Array.isArray(services) && services.length > 0
    ? `
      <ul class="project-card__services-list" aria-label="Services provided">
        ${services.map((s) => `<li class="project-card__service-item">${s}</li>`).join('')}
      </ul>
    `
    : '';

  // 6. Secondary External Link (Conditional - only if verified live URL or repo URL exists)
  let secondaryLinkMarkup = '';
  if (links && links.live) {
    secondaryLinkMarkup = `
      <a href="${links.live}" target="_blank" rel="noopener noreferrer" class="project-card__secondary-link" aria-label="Visit ${title} live website (opens in new tab)">
        <span>Live Site</span>
        <svg class="project-card__external-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M3.5 1.5H10.5V8.5M10.5 1.5L1.5 10.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
    `;
  } else if (links && links.repository) {
    secondaryLinkMarkup = `
      <a href="${links.repository}" target="_blank" rel="noopener noreferrer" class="project-card__secondary-link" aria-label="View ${title} repository (opens in new tab)">
        <span>Repository</span>
        <svg class="project-card__external-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M3.5 1.5H10.5V8.5M10.5 1.5L1.5 10.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
    `;
  }

  return `
    <article class="project-card ${isFeatured ? 'project-card--featured' : ''}" data-project-slug="${slug}">
      <div class="project-card__visual">
        ${visualMarkup}
      </div>

      <div class="project-card__content">
        ${metaMarkup}

        <h3 class="project-card__title">
          <a href="/projects/${slug}" class="project-card__title-link">
            ${title}
          </a>
        </h3>

        ${descriptionMarkup}
        ${servicesMarkup}
        ${techMarkup}

        <div class="project-card__actions">
          <a href="/projects/${slug}" class="project-card__link" aria-label="View ${title} Case Study">
            <span class="project-card__link-text">View Case Study</span>
            <svg class="project-card__link-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
          ${secondaryLinkMarkup}
        </div>
      </div>
    </article>
  `;
}

export default createProjectCard;
