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
        <div class="footer-main-grid">
          <!-- Col 1: Brand & Operational Status -->
          <div class="footer-brand-col">
            ${logoHtml}
            <p class="footer-tagline">
              Engineering high-reliability software, web applications, Android systems, and cloud infrastructure for businesses.
            </p>
            <div class="footer-status-pill" aria-label="System status: All operational">
              <span class="contact-sla-dot" aria-hidden="true"></span>
              <span>All Systems Operational</span>
            </div>
          </div>

          <!-- Col 2: Solutions Directory -->
          <div>
            <div class="footer-col-title">Engineering Solutions</div>
            <ul class="footer-links-list">
              <li><a href="#services" class="footer-link">Web Applications</a></li>
              <li><a href="#services" class="footer-link">Android Mobile Apps</a></li>
              <li><a href="#services" class="footer-link">Business ERP & POS</a></li>
              <li><a href="#services" class="footer-link">Cloud & DevOps</a></li>
              <li><a href="#services" class="footer-link">APIs & Microservices</a></li>
              <li><a href="#services" class="footer-link">Database Engineering</a></li>
            </ul>
          </div>

          <!-- Col 3: Company Navigation -->
          <div>
            <div class="footer-col-title">Company & Process</div>
            <ul class="footer-links-list">
              <li><a href="#projects" class="footer-link">Production Projects</a></li>
              <li><a href="#process" class="footer-link">Engineering Process</a></li>
              <li><a href="#about" class="footer-link">About Kodmates</a></li>
              <li><a href="#blog" class="footer-link">Technical Blog</a></li>
              <li><a href="#contact" class="footer-link">Start a Project</a></li>
            </ul>
          </div>

          <!-- Col 4: Direct Engineering Coordinates -->
          <div>
            <div class="footer-col-title">Direct Inquiries</div>
            <ul class="footer-links-list">
              <li><a href="mailto:hello@kodmates.com" class="footer-link">hello@kodmates.com</a></li>
              <li><span style="color: rgba(240,242,238,0.55); font-size: 13px;">Bhubaneswar, Odisha, India</span></li>
              <li><span style="color: rgba(240,242,238,0.55); font-size: 13px;">Remote Global Operations</span></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom-bar">
          <div class="footer-copyright">
            © 2026 Kodmates. All rights reserved. Built with precision and care.
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
