/**
 * Kodmates Process / How We Work Component
 * 4-stage engineering lifecycle from architecture blueprint to continuous production ops.
 */

export const PROCESS_STAGES = [
  {
    step: '01',
    title: 'Discovery & Architecture Blueprint',
    desc: 'We map operational workflows, identify throughput bottlenecks, and produce a formal data schema and system design blueprint before a single line of code is written.',
    deliverables: ['System Architecture Diagram', 'Data Model & Entity Mapping', 'Security & Compliance Plan', 'Milestone Schedule']
  },
  {
    step: '02',
    title: 'Iterative Sprint Engineering',
    desc: 'We deliver working software increments every sprint. High-coverage automated tests, pair programming, and direct transparent communication keep development aligned.',
    deliverables: ['Bi-weekly Staging Releases', 'Automated CI/CD Pipelines', 'Clean Documented Codebases', 'Direct Engineering Slack/Chat']
  },
  {
    step: '03',
    title: 'QA & Security Hardening',
    desc: 'Thorough stress testing under concurrent load, security penetration audits, edge-case validation, and device matrix testing across real hardware.',
    deliverables: ['Concurrency Load Reports', 'OWASP Security Verification', 'Cross-Device QA Sign-off', 'Failover & Disaster Recovery']
  },
  {
    step: '04',
    title: 'Deployment & 24/7 Operations',
    desc: 'Zero-downtime cloud migration, telemetry instrumentation, performance monitoring, and rapid response SLAs to ensure ongoing system stability.',
    deliverables: ['Zero-Downtime Deployment', 'Telemetry & Alert Dashboards', 'Production Runbooks & Training', 'Guaranteed SLA Support']
  }
];

export function createProcessSection() {
  const cardsHtml = PROCESS_STAGES.map((stg) => {
    const itemsHtml = stg.deliverables.map(d => `<li class="process-deliverable-item">${d}</li>`).join('');
    return `
      <div class="process-card">
        <div class="process-step-num">${stg.step}</div>
        <h3 class="process-title">${stg.title}</h3>
        <p class="process-desc">${stg.desc}</p>
        <div class="process-deliverables-title">Key Deliverables</div>
        <ul class="process-deliverables-list">
          ${itemsHtml}
        </ul>
      </div>
    `;
  }).join('');

  return `
    <section class="km-section" id="process" aria-labelledby="process-title">
      <div class="km-section-container">
        <header class="km-section-header">
          <div class="km-eyebrow">ENGINEERING LIFECYCLE</div>
          <h2 class="km-section-title" id="process-title">
            Pragmatic Engineering, <span class="km-section-title-accent">Zero Drama</span>
          </h2>
          <p class="km-section-desc">
            We operate as an elite engineering partner, not a detached agency. Our battle-tested four-phase lifecycle guarantees predictable delivery, robust security, and maintainable systems.
          </p>
        </header>

        <div class="process-timeline">
          ${cardsHtml}
        </div>
      </div>
    </section>
  `;
}
