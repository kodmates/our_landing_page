/**
 * Kodmates About Us Section Component
 * Details company mission, engineering philosophy, pillars, and operational metrics.
 */

export function createAboutSection() {
  return `
    <section class="km-section" id="about" aria-labelledby="about-title">
      <div class="km-section-container">
        <header class="km-section-header">
          <div class="km-eyebrow">ABOUT KODMATES</div>
          <h2 class="km-section-title" id="about-title">
            Engineering Software That Runs <span class="km-section-title-accent">Mission-Critical Business Operations</span>
          </h2>
        </header>

        <div class="about-grid">
          <div class="about-narrative">
            <p class="about-lead">
              Kodmates was founded on a simple conviction: software should solve real operational problems, not create new ones.
            </p>
            <p class="about-body">
              We specialize in custom web applications, native Android software, and enterprise business systems. While typical agencies build disposable landing pages, our team designs and engineers core business infrastructure—the software that handles high-traffic inventory, security gate verification, real-time dispatch, and daily billing.
            </p>
            <p class="about-body">
              Our culture centers on technical rigor, deep architectural thinking, and direct communication. Every engineer on our team understands database locks, network partitions, and real-world failure modes.
            </p>

            <div class="about-pillars-grid">
              <div class="about-pillar-card">
                <div class="about-pillar-title">Resilient Architecture</div>
                <div class="about-pillar-desc">Designed from day one to handle network dropouts, database contention, and hardware edge cases.</div>
              </div>
              <div class="about-pillar-card">
                <div class="about-pillar-title">Transparent Delivery</div>
                <div class="about-pillar-desc">Direct engineer-to-client communication with continuous sprint demo deployments. No account-manager telephone games.</div>
              </div>
              <div class="about-pillar-card">
                <div class="about-pillar-title">Zero Legacy Bloat</div>
                <div class="about-pillar-desc">Clean, thoroughly tested codebases documented with comprehensive runbooks and zero vendor lock-in.</div>
              </div>
              <div class="about-pillar-card">
                <div class="about-pillar-title">Security by Default</div>
                <div class="about-pillar-desc">Role-based access controls, cryptographic payload validation, and OWASP compliance baked into every layer.</div>
              </div>
            </div>
          </div>

          <div class="about-stats-panel" aria-label="Operational Metrics">
            <div class="stat-item">
              <div class="stat-value">99.98%</div>
              <div class="stat-label">Average System Uptime Across Production Deployments</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">350k+</div>
              <div class="stat-label">Daily Operational Events & Transactions Processed</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">&lt; 400ms</div>
              <div class="stat-label">Peak API Latency SLA on Critical Endpoints</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">100%</div>
              <div class="stat-label">Production Milestone Delivery on Schedule</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
