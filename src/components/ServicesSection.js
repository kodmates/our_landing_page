/**
 * Kodmates Services Section Component
 * Details engineering capabilities aligned with the 3D ecosystem modules.
 */

export const SERVICES_DATA = [
  {
    id: 'web',
    title: 'Web Applications',
    desc: 'High-performance web apps, responsive client portals, SaaS architectures, and interactive digital interfaces built with modern reactive stacks.',
    tags: ['Next.js', 'React', 'Vue', 'TypeScript', 'WebSockets'],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="26" height="26">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>`
  },
  {
    id: 'android',
    title: 'Android & Mobile Apps',
    desc: 'Reliable native and cross-platform Android mobile solutions engineered for operational resilience, offline-first sync, and smooth hardware integrations.',
    tags: ['Kotlin', 'Android SDK', 'Jetpack Compose', 'Offline Sync'],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="26" height="26">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
      <line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>`
  },
  {
    id: 'business',
    title: 'Business Software Systems',
    desc: 'Custom enterprise ERPs, billing pipelines, real-time inventory tracking, and POS ecosystems designed around actual business workflows.',
    tags: ['Custom ERP', 'POS Systems', 'Billing', 'Inventory', 'Multi-tenant'],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="26" height="26">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>`
  },
  {
    id: 'cloud',
    title: 'Cloud & DevOps Infrastructure',
    desc: 'Scalable cloud architecture, automated CI/CD deployment pipelines, containerization, and zero-downtime microservices hosting.',
    tags: ['Docker', 'Kubernetes', 'AWS', 'Cloudflare', 'CI/CD'],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="26" height="26">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
    </svg>`
  },
  {
    id: 'api',
    title: 'APIs & Microservices',
    desc: 'Low-latency REST and GraphQL APIs, event-driven messaging architectures, and high-concurrency microservices with rigorous authentication.',
    tags: ['Node.js', 'Go', 'GraphQL', 'REST', 'WebSockets', 'OAuth'],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="26" height="26">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>`
  },
  {
    id: 'database',
    title: 'Database Architecture',
    desc: 'Fault-tolerant relational and distributed databases, schema design, high-throughput caching layers, and continuous replication.',
    tags: ['PostgreSQL', 'Redis', 'TimescaleDB', 'Query Tuning'],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="26" height="26">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>`
  }
];

export function createServicesSection() {
  const cardsHtml = SERVICES_DATA.map((srv) => {
    const tagsHtml = srv.tags.map(t => `<span class="service-tag">${t}</span>`).join('');
    return `
      <div class="service-card" data-service-id="${srv.id}">
        <div>
          <div class="service-icon-box" aria-hidden="true">
            ${srv.icon}
          </div>
          <h3 class="service-title">${srv.title}</h3>
          <p class="service-desc">${srv.desc}</p>
        </div>
        <div>
          <div class="service-tags" aria-label="Technologies">
            ${tagsHtml}
          </div>
          <a href="#contact" class="service-link" aria-label="Inquire about ${srv.title}">
            <span>Discuss Requirements</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    `;
  }).join('');

  return `
    <section class="km-section" id="services" aria-labelledby="services-title">
      <div class="km-section-container">
        <header class="km-section-header">
          <div class="km-eyebrow">ENGINEERING CAPABILITIES</div>
          <h2 class="km-section-title" id="services-title">
            Digital Systems Engineered for <span class="km-section-title-accent">Real-World Operations</span>
          </h2>
          <p class="km-section-desc">
            We don't build superficial website templates. We architect, engineer, and deploy high-reliability software systems that handle operational data, transactions, and business continuity.
          </p>
        </header>

        <div class="services-grid">
          ${cardsHtml}
        </div>
      </div>
    </section>
  `;
}
