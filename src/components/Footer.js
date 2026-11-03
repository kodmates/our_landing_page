/**
 * KodMates Shared Footer Component
 * Concept: Dark Tech Structured Footer
 * Matches reference mockup: 4-column layout, verified contact info, brand presence, and clean copyright bar.
 */

import { createLogo } from './Logo.js';
import { CONTACT_CONFIG } from './contact/ContactConfig.js';

export function createFooterHTML() {
  const logoHtml = createLogo({ withTagline: true });
  const { contactDetails } = CONTACT_CONFIG;

  return `
    <footer class="site-footer" id="site-footer" aria-label="Site Footer">
      <div class="site-footer__ambient" aria-hidden="true"></div>
      <div class="site-footer__container">
        <div class="site-footer__top">
          <!-- Col 1: Brand & Philosophy -->
          <div class="site-footer__brand-col">
            ${logoHtml}
            <p class="site-footer__tagline-text">
              We are a team of passionate engineers and designers building innovative digital solutions for modern businesses.
            </p>
          </div>

          <!-- Col 2: Quick Links -->
          <div class="site-footer__nav-col">
            <span class="site-footer__col-heading">Quick Links</span>
            <ul class="site-footer__link-list">
              <li><a href="/" data-nav-id="home" class="footer-link">Home</a></li>
              <li><a href="#services" data-nav-id="services" class="footer-link">Services</a></li>
              <li><a href="/projects" data-nav-id="projects" class="footer-link">Projects</a></li>
              <li><a href="/blog" data-nav-id="blog" class="footer-link">Blog</a></li>
              <li><a href="/contact" data-nav-id="contact" class="footer-link">Contact</a></li>
            </ul>
          </div>

          <!-- Col 3: Services -->
          <div class="site-footer__nav-col">
            <span class="site-footer__col-heading">Services</span>
            <ul class="site-footer__link-list">
              <li><span class="footer-static-item">Web Applications</span></li>
              <li><span class="footer-static-item">Mobile Apps</span></li>
              <li><span class="footer-static-item">Cloud & DevOps</span></li>
              <li><span class="footer-static-item">UI/UX Design</span></li>
              <li><span class="footer-static-item">Consulting</span></li>
            </ul>
          </div>

          <!-- Col 4: Contact Information -->
          <div class="site-footer__nav-col site-footer__contact-col">
            <span class="site-footer__col-heading">Contact</span>
            <ul class="site-footer__link-list site-footer__contact-list">
              <li>
                <a href="mailto:${contactDetails.email}" class="footer-contact-link">
                  <span class="footer-contact-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#F4D779" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="footer-svg-icon"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                  </span>
                  <span>${contactDetails.email}</span>
                </a>
              </li>
              <li>
                <a href="tel:${contactDetails.phone.replace(/\s+/g, '')}" class="footer-contact-link">
                  <span class="footer-contact-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#F4D779" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="footer-svg-icon"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </span>
                  <span>${contactDetails.phone}</span>
                </a>
              </li>
              <li>
                <span class="footer-contact-item">
                  <span class="footer-contact-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#F4D779" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="footer-svg-icon"><path d="M12 21s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 7.2c0 7.3-8 11.8-8 11.8z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </span>
                  <span>${contactDetails.location}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div class="site-footer__bottom">
          <div class="site-footer__copyright">
            © 2026 KODMATES. All rights reserved.
          </div>
          <div class="site-footer__meta">
            <span>Built with <span style="color:#F4D779;">❤️</span> for a better web.</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}

export class Footer {
  constructor(options = {}) {
    this.target = options.target || document.getElementById('app') || document.body;
    this.footerEl = null;
  }

  mount() {
    const existing = document.getElementById('site-footer');
    if (existing) {
      this.footerEl = existing;
      return this.footerEl;
    }

    const temp = document.createElement('div');
    temp.innerHTML = createFooterHTML().trim();
    this.footerEl = temp.firstElementChild;
    this.target.appendChild(this.footerEl);
    return this.footerEl;
  }
}

export function initFooter(options = {}) {
  const footer = new Footer(options);
  footer.mount();
  return footer;
}
