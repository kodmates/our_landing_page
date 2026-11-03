/**
 * Kodmates Contact Section Component
 * Fully accessible contact form with real-time client validation and authentic submission handling.
 */

export function createContactSection() {
  return `
    <section class="km-section" id="contact" aria-labelledby="contact-title">
      <div class="km-section-container">
        <div class="contact-grid">
          <!-- Left Column: Direct Coordinates & SLA -->
          <div class="contact-info-col">
            <div>
              <div class="km-eyebrow">START A PROJECT</div>
              <h2 class="km-section-title" id="contact-title">
                Let's Build Something <span class="km-section-title-accent">Exceptional Together</span>
              </h2>
              <p class="km-section-desc">
                Have a complex software challenge, mobile app, or business infrastructure system to engineer? Tell us about your goals, timelines, and technical requirements.
              </p>

              <div class="contact-direct-items">
                <div class="contact-direct-item">
                  <div class="contact-direct-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="22" height="22">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div>
                    <div class="contact-direct-label">Direct Engineering Inquiries</div>
                    <a href="mailto:hello@kodmates.com" class="contact-direct-val">hello@kodmates.com</a>
                  </div>
                </div>

                <div class="contact-direct-item">
                  <div class="contact-direct-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="22" height="22">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <div class="contact-direct-label">Engineering Hub</div>
                    <div class="contact-direct-val">Bhubaneswar, Odisha, India • Remote Global Delivery</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="contact-sla-badge">
              <span class="contact-sla-dot" aria-hidden="true"></span>
              <span><strong>Guaranteed Response:</strong> Senior engineers reply within 24 business hours.</span>
            </div>
          </div>

          <!-- Right Column: Interactive Contact Form -->
          <div class="contact-form-card">
            <form id="contact-project-form" class="contact-form" novalidate>
              <div class="form-row-2">
                <div class="form-group">
                  <label for="contact-name" class="form-label">Full Name *</label>
                  <input type="text" id="contact-name" name="name" class="form-input" placeholder="e.g. Alex Morgan" required autocomplete="name" />
                  <span class="form-feedback" id="name-feedback" aria-live="polite"></span>
                </div>

                <div class="form-group">
                  <label for="contact-email" class="form-label">Work Email *</label>
                  <input type="email" id="contact-email" name="email" class="form-input" placeholder="alex@company.com" required autocomplete="email" />
                  <span class="form-feedback" id="email-feedback" aria-live="polite"></span>
                </div>
              </div>

              <div class="form-row-2">
                <div class="form-group">
                  <label for="contact-type" class="form-label">System Type *</label>
                  <select id="contact-type" name="systemType" class="form-select" required>
                    <option value="Web Applications">Web Applications & SaaS</option>
                    <option value="Android Apps">Android / Mobile App</option>
                    <option value="Business Software">Business Software & Custom ERP</option>
                    <option value="Cloud Infrastructure">Cloud & DevOps Architecture</option>
                    <option value="API & Microservices">APIs & Microservices</option>
                    <option value="Architecture Consultation">System Architecture Audit</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="contact-budget" class="form-label">Estimated Budget</label>
                  <select id="contact-budget" name="budget" class="form-select">
                    <option value="$5,000 - $15,000">$5,000 – $15,000</option>
                    <option value="$15,000 - $35,000">$15,000 – $35,000</option>
                    <option value="$35,000+">$35,000+</option>
                    <option value="To be determined">To be determined</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="contact-message" class="form-label">Project Overview & Objectives *</label>
                <textarea id="contact-message" name="message" class="form-textarea" placeholder="Briefly describe your business challenge, required integrations, and current timeline..." required minlength="20"></textarea>
                <span class="form-feedback" id="message-feedback" aria-live="polite"></span>
              </div>

              <button type="submit" id="contact-submit-btn" class="form-submit-btn">
                <span>Send Project Inquiry</span>
                <span aria-hidden="true">→</span>
              </button>

              <div id="contact-status-alert" class="form-status-alert" role="status" aria-live="polite"></div>
            </form>
          </div>
        </div>
      </div>
    </section>
  `;
}

/**
 * Attaches validation and authentic submission handling
 */
export function initContactSection() {
  const form = document.getElementById('contact-project-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const typeSelect = document.getElementById('contact-type');
  const budgetSelect = document.getElementById('contact-budget');
  const messageInput = document.getElementById('contact-message');
  const statusAlert = document.getElementById('contact-status-alert');

  const nameFeedback = document.getElementById('name-feedback');
  const emailFeedback = document.getElementById('email-feedback');
  const messageFeedback = document.getElementById('message-feedback');

  // Real-time validation listeners
  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim().length >= 2) {
      nameFeedback.textContent = '';
      nameInput.style.borderColor = '';
    }
  });

  emailInput.addEventListener('input', () => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
      emailFeedback.textContent = '';
      emailInput.style.borderColor = '';
    }
  });

  messageInput.addEventListener('input', () => {
    if (messageInput.value.trim().length >= 20) {
      messageFeedback.textContent = '';
      messageInput.style.borderColor = '';
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Name
    const nameVal = nameInput.value.trim();
    if (nameVal.length < 2) {
      nameFeedback.textContent = 'Please enter your full name (at least 2 characters).';
      nameInput.style.borderColor = '#F87171';
      isValid = false;
    } else {
      nameFeedback.textContent = '';
      nameInput.style.borderColor = '';
    }

    // Validate Email
    const emailVal = emailInput.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      emailFeedback.textContent = 'Please enter a valid work email address.';
      emailInput.style.borderColor = '#F87171';
      isValid = false;
    } else {
      emailFeedback.textContent = '';
      emailInput.style.borderColor = '';
    }

    // Validate Message
    const msgVal = messageInput.value.trim();
    if (msgVal.length < 20) {
      messageFeedback.textContent = 'Please provide a brief overview (at least 20 characters).';
      messageInput.style.borderColor = '#F87171';
      isValid = false;
    } else {
      messageFeedback.textContent = '';
      messageInput.style.borderColor = '';
    }

    if (!isValid) {
      statusAlert.style.display = 'none';
      return;
    }

    // Authentic Client Submission Handling:
    // Format mailto link and provide one-click dispatch / copy capability
    const subject = encodeURIComponent(`Project Inquiry: ${typeSelect.value} - ${nameVal}`);
    const bodyContent = encodeURIComponent(
      `Name: ${nameVal}\nEmail: ${emailVal}\nSystem Type: ${typeSelect.value}\nBudget: ${budgetSelect.value}\n\nProject Overview:\n${msgVal}`
    );
    const mailtoUrl = `mailto:hello@kodmates.com?subject=${subject}&body=${bodyContent}`;

    statusAlert.className = 'form-status-alert is-success';
    statusAlert.innerHTML = `
      <div style="font-weight: 700; margin-bottom: 6px;">✓ Inquiry Details Formatted</div>
      <p style="margin-bottom: 12px; font-size: 13px; color: rgba(240,242,238,0.9);">
        Thank you, <strong>${nameVal}</strong>! To send directly to our engineering team without intermediary tracking:
      </p>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <a href="${mailtoUrl}" class="cta-button" style="padding: 8px 16px; font-size: 13px; text-decoration: none;">
          <span>Open in Mail Client</span>
          <span aria-hidden="true">↗</span>
        </a>
        <button type="button" id="copy-inquiry-btn" class="project-detail-btn" style="padding: 8px 14px; font-size: 12.5px;">
          <span>Copy Inquiry Text</span>
        </button>
      </div>
    `;
    statusAlert.style.display = 'block';

    const copyBtn = document.getElementById('copy-inquiry-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const textToCopy = `Name: ${nameVal}\nEmail: ${emailVal}\nSystem Type: ${typeSelect.value}\nBudget: ${budgetSelect.value}\n\nProject Overview:\n${msgVal}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
          copyBtn.innerHTML = '<span>✓ Copied to Clipboard</span>';
          setTimeout(() => {
            copyBtn.innerHTML = '<span>Copy Inquiry Text</span>';
          }, 3000);
        });
      });
    }
  });
}
