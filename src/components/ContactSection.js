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
              <div class="km-eyebrow">LET'S CONNECT</div>
              <h2 class="km-section-title" id="contact-title">
                Have a Project in Mind? <span class="km-section-title-accent">Let's Talk</span>
              </h2>
              <p class="km-section-desc">
                Whether you need a custom e-commerce storefront, a high-performance web application, or design engineering, feel free to reach out. I'm currently available for freelance work and new projects.
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
                    <div class="contact-direct-label">Direct Contact</div>
                    <a href="mailto:info@kodmates.com" class="contact-direct-val">info@kodmates.com</a>
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
                    <div class="contact-direct-label">Based in</div>
                    <div class="contact-direct-val">Bhubaneswar, Odisha, India • Remote Worldwide</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="contact-sla-badge">
              <span class="contact-sla-dot" aria-hidden="true"></span>
              <span><strong>Fast Response:</strong> Messages are sent directly to Subrat and answered within 24 hours.</span>
            </div>
          </div>

          <!-- Right Column: Interactive Contact Form -->
          <div class="contact-form-card">
            <form id="contact-project-form" class="contact-form" novalidate>
              <div class="form-row-2">
                <div class="form-group">
                  <label for="contact-name" class="form-label">Your Name *</label>
                  <input type="text" id="contact-name" name="name" class="form-input" placeholder="e.g. Alex Morgan" required autocomplete="name" />
                  <span class="form-feedback" id="name-feedback" aria-live="polite"></span>
                </div>

                <div class="form-group">
                  <label for="contact-email" class="form-label">Your Email *</label>
                  <input type="email" id="contact-email" name="email" class="form-input" placeholder="alex@example.com" required autocomplete="email" />
                  <span class="form-feedback" id="email-feedback" aria-live="polite"></span>
                </div>
              </div>

              <div class="form-row-2">
                <div class="form-group">
                  <label for="contact-type" class="form-label">Project Type *</label>
                  <select id="contact-type" name="systemType" class="form-select" required>
                    <option value="E-Commerce & Storefront">E-Commerce &amp; D2C Storefront</option>
                    <option value="Web Application">Web Application &amp; Frontend</option>
                    <option value="Landing Page & Portfolio">Landing Page &amp; Product Showcase</option>
                    <option value="API & Backend Integration">API &amp; Backend Integration</option>
                    <option value="General Collaboration">General Inquiry / Collaboration</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="contact-budget" class="form-label">Project Scope / Budget</label>
                  <select id="contact-budget" name="budget" class="form-select">
                    <option value="Flexible / To be discussed">Flexible / To be discussed</option>
                    <option value="Small ($500 - $1,500)">Small Project ($500 – $1,500)</option>
                    <option value="Medium ($1,500 - $5,000)">Medium Project ($1,500 – $5,000)</option>
                    <option value="Comprehensive ($5,000+)">Comprehensive ($5,000+)</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="contact-message" class="form-label">Message / Project Description *</label>
                <textarea id="contact-message" name="message" class="form-textarea" placeholder="Tell me a bit about your idea, timeline, or what you're looking to build..." required minlength="20"></textarea>
                <span class="form-feedback" id="message-feedback" aria-live="polite"></span>
              </div>

              <button type="submit" id="contact-submit-btn" class="form-submit-btn">
                <span>Send Message</span>
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

  form.addEventListener('submit', async (e) => {
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

    const submitBtn = form.querySelector('#contact-submit-btn');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '<span>Send Inquiry</span><span class="cta-arrow">→</span>';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Transmitting to info@kodmates.com...</span>';
    }

    try {
      const response = await fetch('https://formsubmit.co/ajax/info@kodmates.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: nameVal,
          email: emailVal,
          systemType: typeSelect.value,
          budget: budgetSelect.value,
          message: msgVal,
          _subject: `New Project Inquiry: ${typeSelect.value} - ${nameVal}`,
          _replyto: emailVal,
          _template: 'table'
        })
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        statusAlert.className = 'form-status-alert is-success';
        statusAlert.innerHTML = `
          <div style="font-weight: 700; margin-bottom: 6px; font-size: 15px; color: #10B981;">✓ Inquiry Sent Successfully</div>
          <p style="margin-bottom: 8px; font-size: 13.5px; color: rgba(240,242,238,0.95);">
            Thank you, <strong>${nameVal}</strong>! Your inquiry has been delivered directly to <strong>info@kodmates.com</strong>.
          </p>
          <p style="font-size: 12.5px; color: var(--km-accent-primary, #FEEFB8); margin: 0;">
            Subrat will review your message and reply to <strong>${emailVal}</strong> within 24 hours.
          </p>
        `;
        statusAlert.style.display = 'block';
        form.reset();
      } else {
        throw new Error(data.message || 'Dispatch error');
      }
    } catch (err) {
      // Direct Email Fallback
      const subject = encodeURIComponent(`Project Inquiry: ${typeSelect.value} - ${nameVal}`);
      const bodyContent = encodeURIComponent(
        `Name: ${nameVal}\nEmail: ${emailVal}\nSystem Type: ${typeSelect.value}\nBudget: ${budgetSelect.value}\n\nProject Overview:\n${msgVal}`
      );
      const mailtoUrl = `mailto:info@kodmates.com?subject=${subject}&body=${bodyContent}`;

      statusAlert.className = 'form-status-alert is-success';
      statusAlert.innerHTML = `
        <div style="font-weight: 700; margin-bottom: 6px; font-size: 15px;">✓ Inquiry Details Prepared</div>
        <p style="margin-bottom: 12px; font-size: 13px; color: rgba(240,242,238,0.92);">
          Thank you, <strong>${nameVal}</strong>! Send this inquiry directly to our engineering mailbox:
        </p>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <a href="${mailtoUrl}" class="cta-button" style="padding: 8px 16px; font-size: 13px; text-decoration: none;">
            <span>Send to info@kodmates.com</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      `;
      statusAlert.style.display = 'block';
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }
  });
}
