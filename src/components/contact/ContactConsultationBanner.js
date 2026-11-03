/**
 * ContactConsultationBanner Component
 * Wide restrained bordered consultation banner at the bottom of the contact page.
 * Recreates the reference mockup with:
 * - Direct headline and explanatory copy
 * - Gold "Start a Technical Discussion →" CTA button
 * - Animated subtle gold topographic wave flowing in background
 */

export function createContactConsultationBanner() {
  return `
    <section class="contact-consultation-section" aria-label="Project Consultation">
      <div class="contact-consultation-banner">
        <!-- Animated Background Topographic Wave Graphic -->
        <div class="contact-banner-wave" aria-hidden="true">
          <svg viewBox="0 0 1200 160" fill="none" preserveAspectRatio="none" class="contact-banner-wave-svg">
            <path d="M0,80 C300,140 600,20 900,90 C1050,125 1150,50 1200,80" stroke="#F4D779" stroke-width="1.2" stroke-opacity="0.22" fill="none"/>
            <path d="M0,100 C280,160 580,40 880,110 C1040,145 1140,70 1200,100" stroke="#F4D779" stroke-width="0.9" stroke-opacity="0.14" fill="none"/>
            <path d="M0,60 C320,120 620,0 920,70 C1060,105 1160,30 1200,60" stroke="#F4D779" stroke-width="0.8" stroke-opacity="0.1" fill="none"/>
          </svg>
        </div>

        <div class="contact-consultation-content">
          <div class="contact-consultation-text">
            <h3 class="contact-consultation-title">Have a Complex Project in Mind?</h3>
            <p class="contact-consultation-desc">
              Whether you're building a new product, modernizing an existing system, or need technical consultation, we'd love to learn more about your requirements.
            </p>
          </div>

          <div class="contact-consultation-action">
            <a href="#kodmates-contact-form" class="cta-button contact-consultation-btn" id="consultation-banner-cta">
              <span>Start a Technical Discussion</span>
              <span class="cta-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}
