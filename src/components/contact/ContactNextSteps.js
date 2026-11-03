/**
 * ContactNextSteps Component
 * Section D: Inquiry Follow-Up Section
 * Faithful recreation of reference image:
 * - Gold eyebrow: "WHAT HAPPENS AFTER YOU SEND THIS INQUIRY?"
 * - Connected 3-step timeline:
 *   01 — Technical Review
 *   02 — Discovery Call
 *   03 — Scope & Roadmap
 * - Circular number markers, gold outline square icons, and connecting arrows
 */

export function createContactNextSteps() {
  return `
    <section class="contact-followup-section" aria-label="What Happens After You Send This Inquiry">
      <div class="contact-followup-container">
        <div class="contact-followup-eyebrow">
          WHAT HAPPENS AFTER YOU SEND THIS INQUIRY?
        </div>

        <div class="contact-followup-timeline" role="list">
          <!-- Step 01: Technical Review -->
          <div class="contact-followup-step" role="listitem">
            <div class="followup-step-top">
              <div class="followup-circle-badge">01</div>
            </div>
            <div class="followup-step-body">
              <div class="followup-icon-box" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="#F4D779" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div class="followup-text">
                <h4 class="followup-title">Technical Review</h4>
                <p class="followup-desc">Our team reviews your requirements and key technical constraints.</p>
              </div>
            </div>
          </div>

          <!-- Connector 1 -> 2 -->
          <div class="followup-arrow-divider" aria-hidden="true">
            <span class="followup-arrow">→</span>
          </div>

          <!-- Step 02: Discovery Call -->
          <div class="contact-followup-step" role="listitem">
            <div class="followup-step-top">
              <div class="followup-circle-badge">02</div>
            </div>
            <div class="followup-step-body">
              <div class="followup-icon-box" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="#F4D779" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div class="followup-text">
                <h4 class="followup-title">Discovery Call</h4>
                <p class="followup-desc">If it's a mutual fit, we'll arrange an in-depth discussion.</p>
              </div>
            </div>
          </div>

          <!-- Connector 2 -> 3 -->
          <div class="followup-arrow-divider" aria-hidden="true">
            <span class="followup-arrow">→</span>
          </div>

          <!-- Step 03: Scope & Roadmap -->
          <div class="contact-followup-step" role="listitem">
            <div class="followup-step-top">
              <div class="followup-circle-badge">03</div>
            </div>
            <div class="followup-step-body">
              <div class="followup-icon-box" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="#F4D779" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                  <polyline points="2 17 12 22 22 17"></polyline>
                  <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
              </div>
              <div class="followup-text">
                <h4 class="followup-title">Scope &amp; Roadmap</h4>
                <p class="followup-desc">We'll share technical options, timeline considerations, and next steps.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
