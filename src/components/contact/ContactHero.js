/**
 * ContactHero Component
 * Client-First Optimization: Direct, credible messaging answering:
 * 1. What can I discuss?
 * 2. Why start a conversation?
 * 3. What happens next?
 */

export function createContactHero() {
  return `
    <section class="contact-hero" aria-label="Contact Overview">
      <div class="contact-hero__container">
        <!-- Left Column: Typography and 3 Core Value Propositions -->
        <div class="contact-hero__content">
          <div class="contact-hero__eyebrow">LET'S TALK</div>

          <h1 class="contact-hero__title">
            Great ideas build<br/>
            <span class="contact-hero__title-accent">great products.</span>
          </h1>

          <p class="contact-hero__description">
            Tell us what you're building, the problem you're solving, and where you want to go. We'll use the details to understand your requirements and explore the right technical approach.
          </p>

          <!-- Value Pillars in horizontal row -->
          <div class="contact-hero__pillars" aria-label="Why partner with KodMates">
            <div class="contact-pillar-item">
              <div class="contact-pillar-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="#F4D779" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2"></polygon>
                  <circle cx="12" cy="12" r="3.5"></circle>
                </svg>
              </div>
              <div class="contact-pillar-text">
                <span class="contact-pillar-title">Collaborative</span>
                <span class="contact-pillar-sub">We work with you</span>
              </div>
            </div>

            <div class="contact-pillar-divider" aria-hidden="true"></div>

            <div class="contact-pillar-item">
              <div class="contact-pillar-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="#F4D779" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="16" rx="3"></rect>
                  <polyline points="9 12 11 14 15 10"></polyline>
                </svg>
              </div>
              <div class="contact-pillar-text">
                <span class="contact-pillar-title">Transparent</span>
                <span class="contact-pillar-sub">No hidden costs</span>
              </div>
            </div>

            <div class="contact-pillar-divider" aria-hidden="true"></div>

            <div class="contact-pillar-item">
              <div class="contact-pillar-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="#F4D779" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div class="contact-pillar-text">
                <span class="contact-pillar-title">Long-term</span>
                <span class="contact-pillar-sub">We're in it together</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Cinematic Studio Workspace Photograph -->
        <div class="contact-hero__visual">
          <div class="contact-hero__image-wrapper">
            <img 
              src="/assets/contact-hero-studio.jpg" 
              alt="KodMates Engineering Studio at night with warm illumination and Better Code. Bigger Dreams. neon sign" 
              class="contact-hero__img" 
              loading="eager"
            />
            <!-- Atmospheric gradient overlay blending into deep dark background -->
            <div class="contact-hero__image-overlay" aria-hidden="true"></div>
            <!-- Ambient breathing neon glow layer -->
            <div class="contact-hero__neon-glow" aria-hidden="true"></div>
          </div>
        </div>
      </div>
    </section>
  `;
}
