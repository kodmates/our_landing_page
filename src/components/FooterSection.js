/**
 * Kodmates Footer Component
 * Semantic footer with solutions directory, company links, live operational status, and smooth back-to-top control.
 */

import { createLogo } from './Logo.js';

export function createFooterSection() {
  const logoHtml = createLogo({ withTagline: true });

  return `
    <footer class="site-footer" id="site-footer" role="contentinfo">
      <div class="km-section-container">
        <div class="footer-main-grid" style="grid-template-columns: 2fr 1fr 1fr; gap: 40px;">
          <!-- Col 1: Brand & Bio -->
          <div class="footer-brand-col">
            ${logoHtml}
            <p class="footer-tagline">
              Crafting high-performance web applications, bespoke e-commerce storefronts, and seamless digital solutions.
            </p>
            <div class="footer-status-pill" aria-label="Status: Available for work">
              <span class="contact-sla-dot" aria-hidden="true"></span>
              <span>Available for Freelance &amp; Contract Work</span>
            </div>
          </div>

          <!-- Col 2: Navigation -->
          <div>
            <div class="footer-col-title">Navigation</div>
            <ul class="footer-links-list">
              <li><a href="#home" class="footer-link">Home</a></li>
              <li><a href="#projects" class="footer-link">Featured Work</a></li>
              <li><a href="#skills" class="footer-link">Skills &amp; Toolkit</a></li>
              <li><a href="#about" class="footer-link">About Me</a></li>
              <li><a href="#contact" class="footer-link">Contact</a></li>
            </ul>
          </div>

          <!-- Col 3: Direct Inquiries -->
          <div>
            <div class="footer-col-title">Get in Touch</div>
            <ul class="footer-links-list">
              <li><a href="mailto:info@kodmates.com" class="footer-link">info@kodmates.com</a></li>
              <li><span style="color: rgba(240,242,238,0.55); font-size: 13px;">Bhubaneswar, Odisha, India</span></li>
              <li><span style="color: var(--km-accent-primary, #FEEFB8); font-size: 13px;">Fast Response Guaranteed</span></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom-bar">
          <div class="footer-copyright">
            © 2026 Subrat Dakua (Kodmates). All rights reserved.
          </div>
          <button type="button" class="footer-back-to-top" id="footer-back-to-top" aria-label="Scroll back to top of page">
            <span>Back to top</span>
            <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  `;
}

export function initFooterSection() {
  const backToTopBtn = document.getElementById('footer-back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
