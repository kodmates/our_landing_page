/**
 * Subrat Dakua — Developer Portfolio Entrypoint
 * High-performance, lightweight script:
 * - Header & Mobile Drawer Navigation
 * - Dark / Light Theme Toggle
 * - Portfolio Contact Form Handling (info@kodmates.com)
 * - Smooth Scrolling & Back-to-Top
 * - Active Section ScrollSpy
 */

import './styles/tokens.css';
import './styles/base.css';
import './styles/theme.css';
import './styles/header.css';
import './styles/portfolio.css';

import { initHeader } from './components/Header.js';

// 1. Initialize Sticky Header with Portfolio Navigation
const header = initHeader({ activePage: 'Work' });

// 2. Form Submission & Direct Mail Handler
function initPortfolioForm() {
  const form = document.getElementById('portfolio-contact-form');
  const statusEl = document.getElementById('portfolio-form-status');
  const submitBtn = document.getElementById('portfolio-submit-btn');

  if (!form || !statusEl) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      statusEl.className = 'portfolio-form-status is-error';
      statusEl.textContent = 'Please fill out all required fields.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      statusEl.className = 'portfolio-form-status is-error';
      statusEl.textContent = 'Please enter a valid email address.';
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending...</span>';
    }

    // Success response and open direct mail client to info@kodmates.com
    setTimeout(() => {
      statusEl.className = 'portfolio-form-status is-success';
      statusEl.innerHTML = `Thank you, <strong>${name}</strong>! Your message has been prepared for <strong>info@kodmates.com</strong>.`;
      
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      window.location.href = `mailto:info@kodmates.com?subject=${subject}&body=${body}`;

      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Send Message</span><span aria-hidden="true">→</span>';
      }
    }, 400);
  });
}

// 3. Back to Top Button
function initBackToTop() {
  const btn = document.getElementById('portfolio-back-to-top');
  if (btn) {
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// 4. Smooth Anchor Scrolling & ScrollSpy
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  function updateActiveNav() {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach((link) => {
        const href = link.getAttribute('href') || '';
        const linkId = href.replace('#', '').replace('/', '');
        if (linkId === currentId) {
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('is-active');
          link.removeAttribute('aria-current');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
}

// Bootstrap Portfolio Application
document.addEventListener('DOMContentLoaded', () => {
  initPortfolioForm();
  initBackToTop();
  initScrollSpy();
});

// Run immediately if DOM already loaded
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  initPortfolioForm();
  initBackToTop();
  initScrollSpy();
}
