/**
 * ContactBenefits Component
 * Right column of the 3-column contact section: "Why Reach Out to KodMates?"
 * Recreates the reference mockup with:
 * - 4 concise value items with gold outlined icon containers
 * - Reusable animated isometric technical illustration
 */

export function createContactBenefits() {
  return `
    <div class="contact-benefits-card" aria-label="Why Reach Out to KodMates">
      <h3 class="contact-benefits-title">Why Reach Out to KodMates?</h3>

      <div class="contact-benefits-list">
        <!-- 1. Discuss Your Idea -->
        <div class="contact-benefit-item">
          <div class="contact-benefit-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="#F4D779" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <line x1="9" y1="10" x2="15" y2="10"></line>
            </svg>
          </div>
          <div class="contact-benefit-text">
            <h4 class="contact-benefit-heading">Discuss Your Idea</h4>
            <p class="contact-benefit-desc">Share your goals, audience, and key challenges.</p>
          </div>
        </div>

        <!-- 2. Get Technical Guidance -->
        <div class="contact-benefit-item">
          <div class="contact-benefit-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="#F4D779" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
              <circle cx="12" cy="12" r="2"></circle>
            </svg>
          </div>
          <div class="contact-benefit-text">
            <h4 class="contact-benefit-heading">Get Technical Guidance</h4>
            <p class="contact-benefit-desc">Explore the right architecture, tech stack, and possible approaches.</p>
          </div>
        </div>

        <!-- 3. Understand Scope -->
        <div class="contact-benefit-item">
          <div class="contact-benefit-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="#F4D779" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="12 8 8 12 12 16 16 12 12 8"></polygon>
            </svg>
          </div>
          <div class="contact-benefit-text">
            <h4 class="contact-benefit-heading">Understand Scope</h4>
            <p class="contact-benefit-desc">We'll help you refine requirements and identify the next steps.</p>
          </div>
        </div>

        <!-- 4. Start a Meaningful Conversation -->
        <div class="contact-benefit-item">
          <div class="contact-benefit-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="#F4D779" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="contact-benefit-text">
            <h4 class="contact-benefit-heading">Start a Meaningful Conversation</h4>
            <p class="contact-benefit-desc">If it's a good fit, we'll arrange a detailed discussion with the right team members.</p>
          </div>
        </div>
      </div>

      <!-- Layered Isometric Technical SVG Illustration -->
      <div class="contact-benefits-illustration" aria-hidden="true">
        <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" class="contact-iso-svg">
          <defs>
            <radialGradient id="contactIsoGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#E5B955" stop-opacity="0.22"/>
              <stop offset="100%" stop-color="#E5B955" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="contactSlabTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#141C1C"/>
              <stop offset="100%" stop-color="#080C0D"/>
            </linearGradient>
            <linearGradient id="contactTopGlass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FEEFB8" stop-opacity="0.18"/>
              <stop offset="100%" stop-color="#070A0A" stop-opacity="0.75"/>
            </linearGradient>
            <filter id="contactGoldGlowSm" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>

          <!-- Ambient Glow Pool -->
          <circle cx="160" cy="115" r="75" fill="url(#contactIsoGlow)"/>

          <!-- Background Circuit Traces -->
          <g stroke="#F4D779" stroke-opacity="0.2" stroke-width="0.9">
            <path d="M40,110 L80,110 L105,95"/>
            <path d="M160,35 L225,72 L260,72"/>
            <path d="M210,135 L255,160 L285,160"/>
            <path d="M160,165 L160,195 L220,195"/>
          </g>

          <!-- Glowing Junction Dots with circuit pulse animation -->
          <circle cx="80" cy="110" r="2.2" fill="#F4D779" class="contact-iso-pulse-dot" filter="url(#contactGoldGlowSm)"/>
          <circle cx="225" cy="72" r="2.2" fill="#F4D779" class="contact-iso-pulse-dot" filter="url(#contactGoldGlowSm)"/>
          <circle cx="255" cy="160" r="2.2" fill="#F4D779" class="contact-iso-pulse-dot" filter="url(#contactGoldGlowSm)"/>
          <circle cx="160" cy="195" r="2.2" fill="#F4D779" class="contact-iso-pulse-dot" filter="url(#contactGoldGlowSm)"/>

          <!-- 1. Bottom Illuminated Grid Plate -->
          <polygon points="160,105 230,145 160,185 90,145" fill="rgba(244, 215, 121, 0.08)" stroke="#F4D779" stroke-opacity="0.45" stroke-width="1"/>
          <path d="M125,125 L195,165 M195,125 L125,165" stroke="#F4D779" stroke-opacity="0.2" stroke-width="0.8"/>

          <!-- 2. Middle 3D Slate Slab (with 14px thickness extrusion) -->
          <g>
            <polygon points="90,120 160,160 160,174 90,134" fill="#0E1515" stroke="#F4D779" stroke-opacity="0.2" stroke-width="0.8"/>
            <polygon points="160,160 230,120 230,134 160,174" fill="#070A0A" stroke="#F4D779" stroke-opacity="0.15" stroke-width="0.8"/>
            <polygon points="160,80 230,120 160,160 90,120" fill="url(#contactSlabTop)" stroke="#F4D779" stroke-opacity="0.3" stroke-width="1"/>
          </g>

          <!-- 3. Top Suspended Glass Plate with Glowing </> Code Badge -->
          <g class="contact-iso-floating-top">
            <polygon points="160,58 230,98 160,138 90,98" fill="url(#contactTopGlass)" stroke="#F4D779" stroke-width="1.2"/>
            <!-- Surface grid lines on top plate -->
            <path d="M125,78 L195,118 M195,78 L125,118" stroke="#F4D779" stroke-opacity="0.3" stroke-width="0.7"/>
            <!-- Glowing </> Code Symbol -->
            <g filter="url(#contactGoldGlowSm)">
              <path d="M148,93 L138,98 L148,103" stroke="#F4D779" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M163,89 L157,107" stroke="#F4D779" stroke-width="2.4" stroke-linecap="round"/>
              <path d="M172,93 L182,98 L172,103" stroke="#F4D779" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
          </g>

          <!-- 4. Left Node: Standing Card with Gear -->
          <g transform="translate(40, 95)">
            <g class="contact-iso-node-gear">
              <rect x="0" y="0" width="38" height="46" rx="6" fill="#0C1212" stroke="#F4D779" stroke-opacity="0.35" stroke-width="1"/>
              <circle cx="19" cy="23" r="3.5" fill="none" stroke="#F4D779" stroke-width="1.4"/>
              <path d="M17.5,16 h3 v2 h-3 z M17.5,28 h3 v2 h-3 z M12,21.5 v3 h2 v-3 z M24,21.5 v3 h2 v-3 z" fill="#F4D779"/>
            </g>
          </g>

          <!-- 5. Right Node: Top Cloud Card -->
          <g transform="translate(242, 52)">
            <g class="contact-iso-node-cloud">
              <path d="M10,22 C7,22 5,19.5 5,16.5 C5,13.8 7,11.5 10,11.2 C11,8.5 14,6.5 17.5,6.5 C21.5,6.5 25,9.5 25.5,13.2 C28,13.4 30,15.4 30,17.8 C30,20.2 28,22 25.5,22 Z" 
                    fill="#141E1E" stroke="#F4D779" stroke-width="1.2" stroke-linejoin="round" filter="url(#contactGoldGlowSm)"/>
            </g>
          </g>

          <!-- 6. Right Node: 3D Database Cylinder in Glass Card -->
          <g transform="translate(252, 112)">
            <g class="contact-iso-node-db">
              <rect x="0" y="0" width="36" height="42" rx="6" fill="#0C1212" stroke="#F4D779" stroke-opacity="0.35" stroke-width="1"/>
              <g transform="translate(6, 9)">
                <path d="M0,5 L0,18 C0,20.5 5.5,22 12,22 C18.5,22 24,20.5 24,18 L24,5 Z" fill="#090D0D" stroke="#F4D779" stroke-width="1"/>
                <ellipse cx="12" cy="5" rx="12" ry="4.5" fill="#141C1C" stroke="#F4D779" stroke-width="1"/>
                <path d="M0,9.5 C0,12 5.5,13.5 12,13.5 C18.5,13.5 24,12 24,9.5" stroke="#F4D779" stroke-width="0.9" fill="none"/>
                <path d="M0,14 C0,16.5 5.5,18 12,18 C18.5,18 24,16.5 24,14" stroke="#F4D779" stroke-width="0.9" fill="none"/>
              </g>
            </g>
          </g>

          <!-- Four-Point Star Glints -->
          <g transform="translate(230, 98)" filter="url(#contactGoldGlowSm)">
            <path d="M0,-5 L1,-1 L5,0 L1,1 L0,5 L-1,1 L-5,0 L-1,-1 Z" fill="#FFFFFF"/>
          </g>
          <g transform="translate(90, 98)" filter="url(#contactGoldGlowSm)">
            <path d="M0,-4 L0.8,-0.8 L4,0 L0.8,0.8 L0,4 L-0.8,0.8 L-4,0 L-0.8,-0.8 Z" fill="#FFF5D6"/>
          </g>
        </svg>
      </div>
    </div>
  `;
}
