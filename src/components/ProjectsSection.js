/**
 * Kodmates Projects Section Component
 * Filterable engineering project showcase with interactive case study architecture previews.
 */

export const PROJECTS_DATA = [
  {
    id: 'gate-pass',
    title: 'Gate Pass — Enterprise Visitor & Security Management',
    category: 'Enterprise Software',
    categoryFilter: 'enterprise',
    summary: 'Comprehensive enterprise visitor clearance and security audit platform with QR-code authorization, biometric sync, real-time guard verification, and compliance logging.',
    metrics: ['350,000+ Clearances Logged', '&lt; 400ms Verification', 'Audit-Compliant'],
    tech: ['Node.js', 'Android Kotlin', 'WebSockets', 'PostgreSQL', 'Docker'],
    fullArchitecture: 'Built to replace error-prone manual paper registers at industrial facilities. Incorporates offline pass verification, encrypted QR payloads, real-time sync with on-premises security checkpoints via WebSockets, and role-based administrative audits.'
  },
  {
    id: 'pos-cloud',
    title: 'Enterprise POS & Multi-Store Retail Cloud',
    category: 'Web Systems',
    categoryFilter: 'web',
    summary: 'Cloud-synced offline-capable multi-terminal point of sale, real-time inventory reconciliation, GST-compliant invoicing, and multi-branch analytics.',
    metrics: ['99.99% Offline Reliability', 'Multi-Terminal Sync', 'Zero Data Loss'],
    tech: ['React', 'Express', 'SQLite Offline Cache', 'Redis', 'PostgreSQL'],
    fullArchitecture: 'Engineered for high-volume retail environments where network disruptions cannot interrupt billing. Uses local SQLite persistence on each cash counter terminal with asynchronous two-way delta sync to the central cloud cluster once connectivity is established.'
  },
  {
    id: 'newsroom-flow',
    title: 'Live Newsroom & Editorial Media Automation',
    category: 'Web Systems',
    categoryFilter: 'web',
    summary: 'High-concurrency editorial production pipeline orchestrating article approvals, automated asset ingestion, live video streaming, and multi-channel publication.',
    metrics: ['Sub-second Publication', '10,000 Concurrent Writers', 'Low Latency'],
    tech: ['Fastify', 'WebSockets', 'Cloudflare Stream', 'Docker', 'Redis'],
    fullArchitecture: 'Designed for fast-paced digital newsrooms. Handles concurrent real-time collaborative text editing, media transcoding via distributed workers, and instant caching invalidation across global edge CDNs.'
  },
  {
    id: 'logistics-ops',
    title: 'Industrial Logistics & Telematics Operations',
    category: 'Mobile Apps',
    categoryFilter: 'mobile',
    summary: 'Turnkey fleet dispatch, telematics vehicle tracking, geofenced route optimization, and driver duty-status logging for commercial transport fleets.',
    metrics: ['Real-Time GPS Tracking', '18% Fuel Route Efficiency', 'Geofence Alarms'],
    tech: ['Android SDK', 'Go Backend', 'TimescaleDB', 'MQTT', 'Google Maps API'],
    fullArchitecture: 'Collects high-frequency GPS telemetry and engine metrics from vehicle IoT gateways and mobile driver terminals. Ingests via lightweight MQTT broker into TimescaleDB with real-time alerting for route deviations and geofence perimeter events.'
  }
];

export function createProjectsSection() {
  const cardsHtml = PROJECTS_DATA.map((proj) => {
    const techChips = proj.tech.map(t => `<span class="project-tech-chip">${t}</span>`).join('');
    const metricsHtml = proj.metrics.map(m => `
      <div class="project-metric">
        <span class="project-metric-dot" aria-hidden="true"></span>
        <span>${m}</span>
      </div>
    `).join('');

    return `
      <article class="project-card" data-category="${proj.categoryFilter}" id="project-card-${proj.id}">
        <div class="project-media">
          <div class="project-media-badge">${proj.category}</div>
          <svg class="project-media-preview-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/>
            <polyline points="2 17 12 22 22 17"/>
            <polyline points="2 12 12 17 22 12"/>
          </svg>
        </div>
        <div class="project-content">
          <div>
            <div class="project-category">${proj.category}</div>
            <h3 class="project-title">${proj.title}</h3>
            <p class="project-summary">${proj.summary}</p>
            <div class="project-metrics-row">
              ${metricsHtml}
            </div>
            <div class="project-tech-stack" aria-label="Tech Stack">
              ${techChips}
            </div>
          </div>
          <div class="project-actions">
            <button type="button" class="project-detail-btn" data-project-id="${proj.id}" aria-label="View architecture for ${proj.title}">
              <span>View Architecture</span>
              <span aria-hidden="true">→</span>
            </button>
            <a href="#contact" class="service-link" aria-label="Build a system like ${proj.title}">
              <span>Inquire</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');

  return `
    <section class="km-section" id="projects" aria-labelledby="projects-title">
      <div class="km-section-container">
        <header class="km-section-header is-centered">
          <div class="km-eyebrow">PROVEN ENGINEERING WORK</div>
          <h2 class="km-section-title" id="projects-title">
            Production Software Systems <span class="km-section-title-accent">Built for Demanding Scale</span>
          </h2>
          <p class="km-section-desc">
            Explore authentic digital systems and enterprise tools engineered by Kodmates. From security gate pass automation to high-throughput point-of-sale platforms.
          </p>
        </header>

        <div class="projects-filter-bar" role="tablist" aria-label="Filter Projects">
          <button type="button" class="filter-btn is-active" data-filter="all" role="tab" aria-selected="true">All Systems</button>
          <button type="button" class="filter-btn" data-filter="web" role="tab" aria-selected="false">Web Systems</button>
          <button type="button" class="filter-btn" data-filter="mobile" role="tab" aria-selected="false">Mobile Apps</button>
          <button type="button" class="filter-btn" data-filter="enterprise" role="tab" aria-selected="false">Enterprise Software</button>
        </div>

        <div class="projects-grid" id="projects-grid">
          ${cardsHtml}
        </div>
      </div>
    </section>
  `;
}

/**
 * Initializes project card filtering and modal architecture inspection
 */
export function initProjectsSection() {
  const container = document.getElementById('projects');
  if (!container) return;

  const filterBtns = container.querySelectorAll('.filter-btn');
  const projectCards = container.querySelectorAll('.project-card');

  // Filter functionality
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal architecture inspect
  const detailBtns = container.querySelectorAll('.project-detail-btn');
  detailBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projId = btn.getAttribute('data-project-id');
      const project = PROJECTS_DATA.find(p => p.id === projId);
      if (project) {
        openProjectModal(project);
      }
    });
  });
}

let lastProjectFocusedElement = null;

function openProjectModal(project, triggerElement = null) {
  lastProjectFocusedElement = triggerElement || document.activeElement;
  let modal = document.getElementById('project-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'project-modal';
    modal.className = 'km-modal-overlay';
    modal.innerHTML = `
      <div class="km-modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-project-title">
        <button type="button" class="km-modal-close-btn" id="project-modal-close" aria-label="Close dialog">×</button>
        <div id="modal-project-body"></div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#project-modal-close').addEventListener('click', () => {
      closeProjectModal();
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeProjectModal();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeProjectModal();
      }
    });
  }

  const bodyEl = modal.querySelector('#modal-project-body');
  const techChips = project.tech.map(t => `<span class="project-tech-chip">${t}</span>`).join('');
  const metrics = project.metrics.map(m => `<li>${m}</li>`).join('');

  bodyEl.innerHTML = `
    <div class="project-category" style="margin-bottom: 8px;">${project.category}</div>
    <h3 class="km-section-title" id="modal-project-title" style="font-size: 26px; margin-bottom: 16px;">${project.title}</h3>
    <p style="font-size: 15px; color: rgba(240,242,238,0.75); line-height: 1.6; margin-bottom: 24px;">${project.summary}</p>
    
    <div style="margin-bottom: 24px; padding: 18px; border-radius: 10px; background: rgba(254,239,184,0.04); border: 1px solid rgba(254,239,184,0.12);">
      <h4 style="font-size: 13px; font-weight: 700; color: var(--km-accent-primary); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px;">Technical Architecture & Engineering Highlights</h4>
      <p style="font-size: 14px; color: rgba(240,242,238,0.85); line-height: 1.65;">${project.fullArchitecture}</p>
    </div>

    <div style="margin-bottom: 20px;">
      <h4 style="font-size: 12px; font-weight: 700; color: var(--km-accent-champagne); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px;">Production Metrics</h4>
      <ul style="color: rgba(240,242,238,0.8); font-size: 13.5px; line-height: 1.7; padding-left: 20px;">
        ${metrics}
      </ul>
    </div>

    <div style="margin-bottom: 28px;">
      <h4 style="font-size: 12px; font-weight: 700; color: var(--km-accent-champagne); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px;">Stack & Components</h4>
      <div class="project-tech-stack">${techChips}</div>
    </div>

    <a href="#contact" class="cta-button" style="display: inline-flex;" onclick="document.getElementById('project-modal').classList.remove('is-open');">
      <span>Discuss a Similar System</span>
      <span aria-hidden="true">→</span>
    </a>
  `;

  modal.classList.add('is-open');
  modal.querySelector('#project-modal-close').focus();
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastProjectFocusedElement && typeof lastProjectFocusedElement.focus === 'function') {
      lastProjectFocusedElement.focus();
    }
  }
}
