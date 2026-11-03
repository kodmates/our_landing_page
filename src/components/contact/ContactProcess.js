/**
 * ContactProcess Component
 * Section E: Five-Step Engineering Process
 * Recreates reference image:
 * - Two-column composition: Left intro text, Right 5 connected horizontal steps
 * - Steps: 01 Discovery, 02 Planning, 03 Development, 04 Testing, 05 Launch
 * - Subtle animated gold topographic wave along bottom edge
 */

export function createContactProcess() {
  const steps = [
    {
      num: '01',
      title: 'Discovery',
      desc: 'Understand your goals, users, and requirements.',
      icon: `
        <svg viewBox="0 0 24 24" fill="none" stroke="#F4D779" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      `
    },
    {
      num: '02',
      title: 'Planning',
      desc: 'Define architecture, tech stack, and milestones.',
      icon: `
        <svg viewBox="0 0 24 24" fill="none" stroke="#F4D779" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      `
    },
    {
      num: '03',
      title: 'Development',
      desc: 'Build with clean code and regular updates.',
      icon: `
        <svg viewBox="0 0 24 24" fill="none" stroke="#F4D779" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      `
    },
    {
      num: '04',
      title: 'Testing',
      desc: 'Ensure quality, performance, and security.',
      icon: `
        <svg viewBox="0 0 24 24" fill="none" stroke="#F4D779" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <polyline points="9 12 11 14 15 10"></polyline>
        </svg>
      `
    },
    {
      num: '05',
      title: 'Launch',
      desc: 'Go live with support and documentation.',
      icon: `
        <svg viewBox="0 0 24 24" fill="none" stroke="#F4D779" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="m12 15 2 2 4-4"></path>
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
        </svg>
      `
    }
  ];

  const stepsMarkup = steps.map((s) => `
    <div class="timeline-step" data-step="${s.num}">
      <div class="timeline-step__badge">
        <span class="timeline-step__num">${s.num}</span>
      </div>
      <div class="timeline-step__content">
        <div class="timeline-step__header">
          <div class="timeline-step__icon" aria-hidden="true">
            ${s.icon}
          </div>
          <h4 class="timeline-step__title">${s.title}</h4>
        </div>
        <p class="timeline-step__desc">${s.desc}</p>
      </div>
    </div>
  `).join('');

  return `
    <section class="contact-process-section" id="inquiry-process" aria-label="Our Process">
      <div class="contact-process__container">
        <!-- Left Side: Section Intro -->
        <div class="contact-process__intro">
          <span class="contact-process__eyebrow">OUR PROCESS</span>
          <h2 class="contact-process__heading">How We Work Together</h2>
          <p class="contact-process__subtext">
            From initial discussion to launch, we follow a clear and collaborative process to turn your ideas into reliable and scalable products.
          </p>
        </div>

        <!-- Right Side: 5-Step Connected Timeline Track -->
        <div class="contact-timeline-track" role="list">
          <div class="timeline-connector-line" aria-hidden="true"></div>
          ${stepsMarkup}
        </div>
      </div>

      <!-- Animated Subtle Gold Technical Topographic Wave Graphic along lower edge -->
      <div class="contact-process__wave-graphic" aria-hidden="true">
        <svg viewBox="0 0 1440 140" fill="none" preserveAspectRatio="none" class="contact-process-wave-svg">
          <path d="M0,70 C240,120 480,20 720,70 C960,120 1200,30 1440,70" stroke="#F4D779" stroke-width="1.2" stroke-opacity="0.2" fill="none"/>
          <path d="M0,50 C220,100 460,10 700,60 C940,110 1180,20 1440,50" stroke="#F4D779" stroke-width="0.9" stroke-opacity="0.14" fill="none"/>
          <path d="M0,90 C260,135 500,40 740,85 C980,130 1220,45 1440,90" stroke="#F4D779" stroke-width="0.8" stroke-opacity="0.1" fill="none"/>
          <path d="M0,110 C280,150 520,60 760,100 C1000,145 1240,60 1440,110" stroke="#F4D779" stroke-width="0.7" stroke-opacity="0.06" fill="none"/>
        </svg>
      </div>
    </section>
  `;
}
