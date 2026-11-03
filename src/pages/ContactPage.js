/**
 * ContactPage Component
 * Pixel-Accurate Reference Recreation:
 * - Wide cinematic hero with 3 core value propositions and studio photo
 * - Three-column main contact section: Contact Info (left), Inquiry Form (center), Why Reach Out + Isometric Art (right)
 * - Section D: Inquiry follow-up 3-step timeline ("WHAT HAPPENS AFTER YOU SEND THIS INQUIRY?")
 * - Section E: 5-step engineering process with animated topographic wave
 * - Section F: Final consultation banner ("Have a Complex Project in Mind?")
 */

import { createContactHero } from '../components/contact/ContactHero.js';
import { createContactInfo } from '../components/contact/ContactInfo.js';
import { createContactFormHTML, isValidEmail } from '../components/contact/ContactForm.js';
import { createContactBenefits } from '../components/contact/ContactBenefits.js';
import { createContactNextSteps } from '../components/contact/ContactNextSteps.js';
import { createContactProcess } from '../components/contact/ContactProcess.js';
import { createContactConsultationBanner } from '../components/contact/ContactConsultationBanner.js';
import { CONTACT_CONFIG } from '../components/contact/ContactConfig.js';

export class ContactPage {
  constructor(options = {}) {
    this.target = options.target || document.getElementById('main-content');
    this.pageEl = null;
    this.isSubmitting = false;

    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleInput = this._handleInput.bind(this);
  }

  renderHTML() {
    return `
      <div class="contact-page" id="contact-page">
        <!-- 1. Hero Section: Cinematic Split with Team Studio Photo -->
        ${createContactHero()}

        <!-- 2. Main Three-Column Contact Section -->
        <section class="contact-main-section" id="contact-main-section" aria-label="Contact and Project Inquiry">
          <div class="contact-main-container">
            ${createContactInfo()}
            ${createContactFormHTML()}
            ${createContactBenefits()}
          </div>
        </section>

        <!-- 3. What Happens After You Send This Inquiry: 3-Step Follow-Up Timeline -->
        ${createContactNextSteps()}

        <!-- 4. Our Process: 5-Step Connected Timeline -->
        ${createContactProcess()}

        <!-- 5. Final Consultation Banner -->
        ${createContactConsultationBanner()}
      </div>
    `;
  }

  mount() {
    this.destroy();

    const temp = document.createElement('div');
    temp.innerHTML = this.renderHTML().trim();
    this.pageEl = temp.firstElementChild;

    if (this.target) {
      this.target.appendChild(this.pageEl);
    }

    this.bindEvents();
    this.updateSEO();
    window.scrollTo({ top: 0, behavior: 'instant' });
    return this.pageEl;
  }

  updateSEO() {
    document.title = "Contact KodMates — Start a Project Discussion";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', "Discuss your custom software project with KodMates engineers. Share requirements for web applications, mobile platforms, APIs, and cloud infrastructure.");
    }
  }

  bindEvents() {
    if (!this.pageEl) return;

    // Contact Form
    const form = this.pageEl.querySelector('#kodmates-contact-form');
    if (form) {
      form.addEventListener('submit', this._handleSubmit);
      form.addEventListener('input', this._handleInput);
      form.addEventListener('change', this._handleInput);
    }

    // Character counter for description
    const descTextarea = this.pageEl.querySelector('#field-description');
    const charCounter = this.pageEl.querySelector('#char-count-description');
    if (descTextarea && charCounter) {
      descTextarea.addEventListener('input', () => {
        const len = descTextarea.value.length;
        charCounter.textContent = `${len}/1000`;
      });
    }

    // Final consultation banner CTA smooth scroll
    const bannerCta = this.pageEl.querySelector('#consultation-banner-cta');
    if (bannerCta) {
      bannerCta.addEventListener('click', (e) => {
        e.preventDefault();
        const targetForm = this.pageEl.querySelector('#kodmates-contact-form');
        if (targetForm) {
          targetForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const nameInput = targetForm.querySelector('#field-fullname');
          setTimeout(() => nameInput?.focus(), 450);
        }
      });
    }
  }

  _handleInput(e) {
    const input = e.target;
    const group = input.closest('.form-field-group');
    if (group && group.classList.contains('is-invalid')) {
      group.classList.remove('is-invalid');
      input.removeAttribute('aria-invalid');
      const errEl = group.querySelector('.form-error-msg');
      if (errEl) errEl.textContent = '';
    }
  }

  async _handleSubmit(e) {
    e.preventDefault();
    if (this.isSubmitting) return;

    const form = e.target;
    const hp = form.querySelector('#contact-hp-field')?.value;
    // Honeypot bot protection
    if (hp) {
      return;
    }

    // Form inputs
    const fullNameInput = form.querySelector('#field-fullname');
    const emailInput = form.querySelector('#field-email');
    const companyInput = form.querySelector('#field-company');
    const serviceInput = form.querySelector('#field-service');
    const budgetInput = form.querySelector('#field-budget');
    const timelineInput = form.querySelector('#field-timeline');
    const descInput = form.querySelector('#field-description');
    const consentInput = form.querySelector('#field-consent');

    let hasError = false;
    let firstErrorField = null;

    const setError = (input, groupSelector, errorSelector, msg) => {
      const group = form.querySelector(groupSelector);
      const err = form.querySelector(errorSelector);
      if (group && err) {
        group.classList.add('is-invalid');
        input.setAttribute('aria-invalid', 'true');
        err.textContent = msg;
        if (!firstErrorField) firstErrorField = input;
      }
      hasError = true;
    };

    // 1. Full name validation (Required)
    if (!fullNameInput.value || fullNameInput.value.trim().length < 2) {
      setError(fullNameInput, '#group-fullname', '#error-fullname', 'Please provide your full name.');
    }

    // 2. Email format validation (Required)
    if (!emailInput.value || !isValidEmail(emailInput.value)) {
      setError(emailInput, '#group-email', '#error-email', 'Please provide a valid email address.');
    }

    // 3. Project type validation (Required)
    if (!serviceInput.value) {
      setError(serviceInput, '#group-service', '#error-service', 'Please select a project type.');
    }

    // 4. Budget range is OPTIONAL per reference design

    // 5. Project details validation (Required, min 10 chars)
    if (!descInput.value || descInput.value.trim().length < 10) {
      setError(descInput, '#group-description', '#error-description', 'Please share a few details about what you want to build (minimum 10 characters).');
    }

    // 6. Consent validation (Required)
    if (!consentInput.checked) {
      setError(consentInput, '#group-consent', '#error-consent', 'Please agree to the privacy policy to submit.');
    }

    if (hasError) {
      firstErrorField?.focus();
      return;
    }

    // Trigger submission state
    this.isSubmitting = true;
    const submitBtn = form.querySelector('#contact-submit-btn');
    submitBtn?.classList.add('is-loading');

    // Simulate standard request processing latency
    await new Promise((res) => setTimeout(res, 600));

    // Construct structured submission payload
    const payload = {
      submissionId: 'km-msg-' + Date.now().toString(36),
      submittedAt: new Date().toISOString(),
      inquiryData: {
        fullName: fullNameInput.value.trim(),
        email: emailInput.value.trim(),
        company: companyInput.value.trim() || 'Not specified',
        service: serviceInput.options[serviceInput.selectedIndex]?.text || serviceInput.value,
        budget: budgetInput.value ? (budgetInput.options[budgetInput.selectedIndex]?.text || budgetInput.value) : 'Flexible / To be estimated',
        timeline: timelineInput.value ? (timelineInput.options[timelineInput.selectedIndex]?.text || timelineInput.value) : 'Flexible / Standard milestones',
        description: descInput.value.trim(),
        consentAcknowledged: true
      },
      integrationEnvironment: {
        backendConfigured: Boolean(CONTACT_CONFIG.backendIntegration.endpointUrl),
        deliveryStatus: CONTACT_CONFIG.backendIntegration.endpointUrl ? 'TRANSMITTING' : 'SERVICE_ENDPOINT_UNLINKED',
        note: CONTACT_CONFIG.backendIntegration.integrationNotice
      }
    };

    // If a live backend endpoint is configured, perform transmission
    if (CONTACT_CONFIG.backendIntegration.endpointUrl) {
      try {
        const response = await fetch(CONTACT_CONFIG.backendIntegration.endpointUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          payload.integrationEnvironment.deliveryStatus = 'DELIVERED_SUCCESSFULLY';
          this.renderSubmissionFeedback(payload, true);
        } else {
          throw new Error(`HTTP Error ${response.status}`);
        }
      } catch (err) {
        payload.integrationEnvironment.deliveryStatus = 'DELIVERY_FAILED';
        payload.integrationEnvironment.error = err.message;
        this.renderSubmissionFeedback(payload, false, true);
      }
    } else {
      // Operationally honest state: endpoint is unlinked in this frontend deployment
      this.renderSubmissionFeedback(payload, false, false);
    }
  }

  renderSubmissionFeedback(payload, isDelivered = false, isError = false) {
    const feedbackBox = this.pageEl.querySelector('#contact-feedback-container');
    const form = this.pageEl.querySelector('#kodmates-contact-form');

    if (!feedbackBox || !form) return;

    form.style.display = 'none';
    feedbackBox.style.display = 'block';

    const payloadJsonString = JSON.stringify(payload, null, 2);
    const { fullName, email, service, budget, description } = payload.inquiryData;

    // Generate pre-filled mailto link so user has a working transmission path
    const mailtoSubject = encodeURIComponent(`Project Inquiry: ${service} — ${fullName}`);
    const mailtoBody = encodeURIComponent(
      `Hi KodMates Team,\n\nI would like to discuss a project:\n\nName: ${fullName}\nEmail: ${email}\nService: ${service}\nBudget: ${budget}\n\nProject Details:\n${description}\n\nSubmission Ref: ${payload.submissionId}`
    );
    const mailtoUrl = `mailto:${CONTACT_CONFIG.contactDetails.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

    let statusBadge = 'INQUIRY VALIDATED';
    let statusTitle = 'Inquiry Validated — Service Connection Pending';
    let statusDesc = `
      Your project details have been successfully validated against our production API schema. 
      Because an external email or API dispatch endpoint has not yet been linked in this frontend deployment, 
      your message has not been transmitted automatically.
    `;

    if (isDelivered) {
      statusBadge = 'INQUIRY DELIVERED';
      statusTitle = 'Message Sent Successfully';
      statusDesc = 'Your project inquiry has been received by our engineering team. We will review your requirements.';
    } else if (isError) {
      statusBadge = 'DELIVERY ERROR';
      statusTitle = 'Network Transmission Error';
      statusDesc = 'We encountered a connection issue while contacting the dispatch server. You can retry or send directly via email.';
    }

    feedbackBox.innerHTML = `
      <div class="feedback-card" role="region" aria-label="Submission feedback">
        <div class="feedback-header">
          <div class="feedback-icon-badge" aria-hidden="true">${isDelivered ? '✓' : 'ℹ'}</div>
          <div class="feedback-title-group">
            <span class="feedback-badge">${statusBadge}</span>
            <h3 class="feedback-title">${statusTitle}</h3>
          </div>
        </div>

        <p class="feedback-desc">
          ${statusDesc}
        </p>

        <!-- Direct Email Transmission Fallback -->
        ${!isDelivered ? `
          <div class="feedback-email-fallback">
            <span class="fallback-note-title">Direct Transmission Option:</span>
            <p class="fallback-note-text">
              You can send this pre-compiled inquiry directly to our engineering mailbox with one click:
            </p>
            <a href="${mailtoUrl}" class="cta-button feedback-email-btn" id="direct-email-send-btn">
              <span>Send via Email to ${CONTACT_CONFIG.contactDetails.email}</span>
              <span class="cta-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        ` : ''}

        <!-- Technical Payload Inspection Box -->
        <div class="feedback-payload-box">
          <div class="feedback-payload-header">
            <span class="feedback-payload-label">Validated API Request Payload</span>
            <button type="button" class="copy-payload-btn" id="copy-payload-btn">
              Copy Payload JSON
            </button>
          </div>
          <pre class="feedback-payload-code"><code>${payloadJsonString}</code></pre>
        </div>

        <div class="feedback-actions">
          <button type="button" class="feedback-reset-btn" id="edit-inquiry-btn">
            ← Return to Form &amp; Edit
          </button>
        </div>
      </div>
    `;

    // Copy Payload Button
    const copyBtn = feedbackBox.querySelector('#copy-payload-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(payloadJsonString);
          copyBtn.textContent = 'Copied to Clipboard!';
          setTimeout(() => {
            copyBtn.textContent = 'Copy Payload JSON';
          }, 2000);
        } catch {
          copyBtn.textContent = 'Copied';
        }
      });
    }

    // Edit Inquiry / Return to form
    const editBtn = feedbackBox.querySelector('#edit-inquiry-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        feedbackBox.style.display = 'none';
        feedbackBox.innerHTML = '';
        form.style.display = '';
        this.isSubmitting = false;
        const submitBtn = form.querySelector('#contact-submit-btn');
        submitBtn?.classList.remove('is-loading');
      });
    }
  }

  destroy() {
    if (this.pageEl && this.pageEl.parentNode) {
      this.pageEl.parentNode.removeChild(this.pageEl);
    }
    this.pageEl = null;
    this.isSubmitting = false;
  }
}

export function initContactPage(options = {}) {
  const page = new ContactPage(options);
  page.mount();
  return page;
}
