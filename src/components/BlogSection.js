/**
 * Kodmates Blog / Technical Insights Section Component
 * In-depth technical articles with reading time, category tags, and full modal reader preview.
 */

export const BLOG_POSTS = [
  {
    id: 'offline-android',
    title: 'Architecting Resilient Offline-First Sync for Industrial Android Apps',
    category: 'Mobile Engineering',
    readTime: '6 min read',
    date: 'Oct 2026',
    excerpt: 'How we structured local SQLite caches with idempotent delta queues to guarantee zero data loss across spotty factory Wi-Fi networks in the Gate Pass mobile app.',
    content: `
      <p style="margin-bottom: 16px;">Building mobile apps for industrial and enterprise environments introduces constraints that consumer apps rarely encounter. Network connections drop unpredictably, devices roam between access points with packet loss, and data integrity cannot be compromised.</p>
      <h4 style="color: var(--km-accent-primary); margin: 20px 0 10px; font-size: 16px;">1. The Idempotent Delta Queue</h4>
      <p style="margin-bottom: 16px;">Rather than queuing raw mutation requests, every user action is transformed into an immutable event with a client-generated UUID v4. When network connectivity restores, the synchronization worker flushes events in sequence, with backend idempotency checks preventing duplicate records.</p>
      <h4 style="color: var(--km-accent-primary); margin: 20px 0 10px; font-size: 16px;">2. Two-Way Conflict Resolution</h4>
      <p style="margin-bottom: 16px;">For bidirectional state, we employ hybrid vector clocks. Server timestamps establish a global ordering, while client event sequence numbers resolve local races without data loss.</p>
      <h4 style="color: var(--km-accent-primary); margin: 20px 0 10px; font-size: 16px;">3. Battery & Worker Optimization</h4>
      <p style="margin-bottom: 16px;">Continuous polling drains battery and creates network chatter. We utilize WorkManager with network-metered constraints, augmented by high-priority WebSocket pings when online, cutting background power consumption by 40%.</p>
    `
  },
  {
    id: 'websockets-scale',
    title: 'Scaling Real-Time WebSockets in Node.js: Lessons from 100k Simultaneous Connections',
    category: 'Backend Systems',
    readTime: '8 min read',
    date: 'Sep 2026',
    excerpt: 'Key memory optimizations, Linux kernel socket tuning, and Redis Pub/Sub broadcast patterns we implemented to sustain high-concurrency editorial updates with sub-millisecond latencies.',
    content: `
      <p style="margin-bottom: 16px;">Real-time collaboration across thousands of concurrent clients requires careful socket lifecycle management. Default Node.js HTTP servers run out of file descriptors and memory when handling tens of thousands of idle connections.</p>
      <h4 style="color: var(--km-accent-primary); margin: 20px 0 10px; font-size: 16px;">1. Kernel Socket Tuning</h4>
      <p style="margin-bottom: 16px;">We adjusted Linux sysctl configurations, increasing <code>fs.file-max</code> and decreasing <code>tcp_fin_timeout</code> to prevent ephemeral port exhaustion. Setting <code>SO_REUSEPORT</code> enabled clean multi-process socket sharing across cluster workers.</p>
      <h4 style="color: var(--km-accent-primary); margin: 20px 0 10px; font-size: 16px;">2. Minimizing Memory Per Socket</h4>
      <p style="margin-bottom: 16px;">By switching to <code>uWebSockets.js</code> and stripping unnecessary per-socket metadata, memory consumption dropped from 32 KB per socket to under 3.5 KB, allowing a single 16 GB instance to comfortably hold 100,000 active connections.</p>
      <h4 style="color: var(--km-accent-primary); margin: 20px 0 10px; font-size: 16px;">3. Redis Sharding for Room Broadcasting</h4>
      <p style="margin-bottom: 16px;">Broadcast storms can saturate a single Redis instance. Implementing consistent hashing across Redis clusters enabled linear broadcast scaling across isolated editorial rooms.</p>
    `
  },
  {
    id: 'monolith-migration',
    title: 'From Legacy Monolith to Scalable Services Without Downtime: A Production Playbook',
    category: 'Cloud & DevOps',
    readTime: '10 min read',
    date: 'Aug 2026',
    excerpt: 'A practical, step-by-step roadmap for carving independent services out of legacy databases using the Strangler Fig pattern, database shadow-writes, and zero customer downtime.',
    content: `
      <p style="margin-bottom: 16px;">Rewriting legacy monoliths from scratch is notorious for budget overruns and missed deadlines. Our preferred approach utilizes incremental strangulation with dual-write verification.</p>
      <h4 style="color: var(--km-accent-primary); margin: 20px 0 10px; font-size: 16px;">1. The Strangler Fig Gateway</h4>
      <p style="margin-bottom: 16px;">We place an intelligent reverse proxy (such as Envoy or Cloudflare Workers) in front of the existing application. New domain paths are routed directly to newly engineered services, while existing routes remain untouched on the monolith.</p>
      <h4 style="color: var(--km-accent-primary); margin: 20px 0 10px; font-size: 16px;">2. Dark Launching with Shadow Reads</h4>
      <p style="margin-bottom: 16px;">Before switching live user traffic, incoming read requests are duplicated asynchronously to the new service. Telemetry compares responses and response times to ensure 100% equivalence before making the cutover official.</p>
      <h4 style="color: var(--km-accent-primary); margin: 20px 0 10px; font-size: 16px;">3. Clean Database Decoupling</h4>
      <p style="margin-bottom: 16px;">Shared database tables create coupling. Using Change Data Capture (CDC) via Debezium, we replicate updates from the legacy database into domain-specific PostgreSQL instances until the monolith dependency can be severed.</p>
    `
  }
];

export function createBlogSection() {
  const cardsHtml = BLOG_POSTS.map((post) => `
    <article class="blog-card" id="blog-card-${post.id}">
      <div>
        <div class="blog-meta-row">
          <span class="blog-category-badge">${post.category}</span>
          <span class="blog-read-time">${post.readTime}</span>
        </div>
        <h3 class="blog-title">${post.title}</h3>
        <p class="blog-excerpt">${post.excerpt}</p>
      </div>
      <div>
        <button type="button" class="blog-read-btn" data-post-id="${post.id}" aria-label="Read full article: ${post.title}">
          <span>Read Engineering Article</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  `).join('');

  return `
    <section class="km-section" id="blog" aria-labelledby="blog-title">
      <div class="km-section-container">
        <header class="km-section-header">
          <div class="km-eyebrow">TECHNICAL PERSPECTIVES</div>
          <h2 class="km-section-title" id="blog-title">
            Architecture Insights & <span class="km-section-title-accent">Production Engineering Playbooks</span>
          </h2>
          <p class="km-section-desc">
            Direct learnings from the engineering trenches. We publish practical deep-dives on high-concurrency systems, mobile offline sync, and enterprise infrastructure.
          </p>
        </header>

        <div class="blog-grid">
          ${cardsHtml}
        </div>
      </div>
    </section>
  `;
}

export function initBlogSection() {
  const container = document.getElementById('blog');
  if (!container) return;

  const readBtns = container.querySelectorAll('.blog-read-btn');
  readBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const postId = btn.getAttribute('data-post-id');
      const post = BLOG_POSTS.find(p => p.id === postId);
      if (post) {
        openBlogModal(post);
      }
    });
  });
}

let lastBlogFocusedElement = null;

function openBlogModal(post, triggerElement = null) {
  lastBlogFocusedElement = triggerElement || document.activeElement;
  let modal = document.getElementById('blog-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'blog-modal';
    modal.className = 'km-modal-overlay';
    modal.innerHTML = `
      <div class="km-modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-blog-title">
        <button type="button" class="km-modal-close-btn" id="blog-modal-close" aria-label="Close article">×</button>
        <div id="modal-blog-body"></div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#blog-modal-close').addEventListener('click', () => {
      closeBlogModal();
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeBlogModal();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeBlogModal();
      }
    });
  }

  const bodyEl = modal.querySelector('#modal-blog-body');
  bodyEl.innerHTML = `
    <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 12px;">
      <span class="blog-category-badge">${post.category}</span>
      <span style="color: rgba(240,242,238,0.45); font-size: 12px;">•</span>
      <span class="blog-read-time">${post.readTime}</span>
      <span style="color: rgba(240,242,238,0.45); font-size: 12px;">•</span>
      <span style="font-size: 12px; color: rgba(240,242,238,0.5);">${post.date}</span>
    </div>
    <h3 class="km-section-title" id="modal-blog-title" style="font-size: 26px; line-height: 1.3; margin-bottom: 24px;">${post.title}</h3>
    <div style="color: rgba(240,242,238,0.85); font-size: 15px; line-height: 1.75;">
      ${post.content}
    </div>
    <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(254,239,184,0.1); display: flex; justify-content: space-between; align-items: center;">
      <span style="font-size: 13px; color: rgba(240,242,238,0.6);">Have questions about this architecture?</span>
      <a href="#contact" class="service-link" onclick="document.getElementById('blog-modal').classList.remove('is-open');">
        <span>Discuss with an engineer</span>
        <span aria-hidden="true">→</span>
      </a>
    </div>
  `;

  modal.classList.add('is-open');
  modal.querySelector('#blog-modal-close').focus();
  document.body.style.overflow = 'hidden';
}

function closeBlogModal() {
  const modal = document.getElementById('blog-modal');
  if (modal) {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastBlogFocusedElement && typeof lastBlogFocusedElement.focus === 'function') {
      lastBlogFocusedElement.focus();
    }
  }
}
