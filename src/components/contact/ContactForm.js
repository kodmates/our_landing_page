/**
 * ContactForm Component
 * Focused, compact, client-first inquiry form card.
 * - Two-column field arrangement on desktop.
 * - Budget and Timeline are strictly optional.
 * - Character counter, accessible inline validation, spam prevention.
 */

import { CONTACT_CONFIG } from './ContactConfig.js';

export function createContactFormHTML() {
  const serviceOptions = CONTACT_CONFIG.services.map((s) => `
    <option value="${s.value}">${s.label}</option>
  `).join('');

  const budgetOptions = CONTACT_CONFIG.budgetRanges.map((b) => `
    <option value="${b.value}">${b.label}</option>
  `).join('');

  const timelineOptions = CONTACT_CONFIG.timelines.map((t) => `
    <option value="${t.value}">${t.label}</option>
  `).join('');

  return `
    <div class="contact-form-card" id="contact-form-card" aria-label="Project Inquiry Form Card">
      <div class="contact-form-card__header">
        <h3 class="contact-form-card__title">Send us a message</h3>
        <p class="contact-form-card__subtitle">${CONTACT_CONFIG.responseNotice}</p>
      </div>

      <!-- Live Form Container -->
      <form id="kodmates-contact-form" class="contact-form" novalidate aria-label="Project inquiry form">
        <!-- Honeypot Field for Bot Spam Prevention -->
        <div class="sr-only" aria-hidden="true" style="display:none !important;">
          <label for="contact-hp-field">Leave this field blank</label>
          <input type="text" id="contact-hp-field" name="organization_hp" tabindex="-1" autocomplete="off" />
        </div>

        <div class="form-grid">
          <!-- Row 1: Full Name * & Email Address * -->
          <div class="form-field-group" id="group-fullname">
            <label for="field-fullname" class="form-label">
              Full Name <span class="form-required-mark" aria-hidden="true">*</span>
            </label>
            <input 
              type="text" 
              id="field-fullname" 
              name="fullname" 
              class="form-input" 
              placeholder="Your name" 
              required 
              aria-required="true"
              aria-describedby="error-fullname"
              autocomplete="name"
            />
            <span class="form-error-msg" id="error-fullname" role="alert" aria-live="polite"></span>
          </div>

          <div class="form-field-group" id="group-email">
            <label for="field-email" class="form-label">
              Email Address <span class="form-required-mark" aria-hidden="true">*</span>
            </label>
            <input 
              type="email" 
              id="field-email" 
              name="email" 
              class="form-input" 
              placeholder="you@company.com" 
              required 
              aria-required="true"
              aria-describedby="error-email"
              autocomplete="email"
            />
            <span class="form-error-msg" id="error-email" role="alert" aria-live="polite"></span>
          </div>

          <!-- Row 2: Company / Organization & Project Type * -->
          <div class="form-field-group" id="group-company">
            <label for="field-company" class="form-label">
              Company / Organization <span class="form-optional-tag">(Optional)</span>
            </label>
            <input 
              type="text" 
              id="field-company" 
              name="company" 
              class="form-input" 
              placeholder="Your company name" 
              autocomplete="organization"
            />
          </div>

          <div class="form-field-group" id="group-service">
            <label for="field-service" class="form-label">
              Project Type <span class="form-required-mark" aria-hidden="true">*</span>
            </label>
            <div class="form-select-wrapper">
              <select id="field-service" name="service" class="form-select" required aria-required="true">
                <option value="">Select project type</option>
                ${serviceOptions}
              </select>
            </div>
            <span class="form-error-msg" id="error-service" role="alert" aria-live="polite"></span>
          </div>

          <!-- Row 3: Budget Range (Optional) & Timeline (Optional) -->
          <div class="form-field-group" id="group-budget">
            <label for="field-budget" class="form-label">
              Budget Range <span class="form-optional-tag">(Optional)</span>
            </label>
            <div class="form-select-wrapper">
              <select id="field-budget" name="budget" class="form-select">
                <option value="">Select budget range (Optional)</option>
                ${budgetOptions}
              </select>
            </div>
          </div>

          <div class="form-field-group" id="group-timeline">
            <label for="field-timeline" class="form-label">
              Timeline <span class="form-optional-tag">(Optional)</span>
            </label>
            <div class="form-select-wrapper">
              <select id="field-timeline" name="timeline" class="form-select">
                <option value="">Select timeline (Optional)</option>
                ${timelineOptions}
              </select>
            </div>
          </div>

          <!-- Row 4: Project Details * (Full Width, 1000 char max) -->
          <div class="form-field-group form-field-group--full" id="group-description">
            <label for="field-description" class="form-label">
              Project Details <span class="form-required-mark" aria-hidden="true">*</span>
            </label>
            <div class="form-textarea-wrapper">
              <textarea 
                id="field-description" 
                name="description" 
                class="form-textarea" 
                rows="4" 
                placeholder="Tell us what you're building, the problem you're solving, any specific technical requirements or constraints..."
                required
                aria-required="true"
                aria-describedby="error-description"
                maxlength="1000"
              ></textarea>
              <div class="form-char-count-wrap">
                <span class="form-char-count" id="char-count-description">0/1000</span>
              </div>
            </div>
            <span class="form-error-msg" id="error-description" role="alert" aria-live="polite"></span>
          </div>

          <!-- Row 5: Consent Checkbox (Full Width) -->
          <div class="form-field-group form-field-group--full" id="group-consent">
            <label class="form-checkbox-label" for="field-consent">
              <input 
                type="checkbox" 
                id="field-consent" 
                name="consent" 
                class="form-checkbox" 
                required 
                aria-required="true"
                aria-describedby="error-consent"
              />
              <span class="form-checkbox-custom" aria-hidden="true"></span>
              <span class="form-checkbox-text">
                I agree to the privacy policy and terms of service.
              </span>
            </label>
            <span class="form-error-msg" id="error-consent" role="alert" aria-live="polite"></span>
          </div>
        </div>

        <!-- Row 6: Form Actions Row (Button on left, Lock guarantee on right) -->
        <div class="form-actions-row">
          <button 
            type="submit" 
            class="cta-button form-submit-btn" 
            id="contact-submit-btn"
          >
            <span class="btn-spinner" aria-hidden="true"></span>
            <span class="btn-label">Send Message</span>
            <span class="cta-arrow" aria-hidden="true">→</span>
          </button>

          <div class="form-security-note">
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="security-lock-icon" aria-hidden="true">
              <rect x="3" y="6" width="10" height="8" rx="2" stroke="#A7ADAB" stroke-width="1.2"/>
              <path d="M5 6V4.5C5 2.8 6.3 1.5 8 1.5C9.7 1.5 11 2.8 11 4.5V6" stroke="#A7ADAB" stroke-width="1.2"/>
            </svg>
            <span>Your information is safe with us.</span>
          </div>
        </div>
      </form>

      <!-- Dynamic Result Feedback Container (Initially Hidden) -->
      <div id="contact-feedback-container" aria-live="polite" class="contact-feedback-container" style="display: none;"></div>
    </div>
  `;
}

/**
 * Validates email format according to standard RFC pattern
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return re.test(email.trim());
}
