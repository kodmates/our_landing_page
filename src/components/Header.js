import { createLogo } from './Logo.js';
import { createNavigation } from './Navigation.js';
import { createCTAButton } from './CTAButton.js';
import { createMobileMenu } from './MobileMenu.js';

/**
 * Kodmates Header Component
 * Modular, lightweight, 3D compatible, accessible sticky header.
 */
export class Header {
  constructor(options = {}) {
    this.activePage = options.activePage || 'Home';
    this.target = options.target || document.body;
    this.headerEl = null;
    this.mobileToggle = null;
    this.mobileDrawer = null;
    this.isMenuOpen = false;
    this._handleScroll = this._handleScroll.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
  }

  /**
   * Generates the complete HTML string for the header
   */
  renderHTML() {
    const logoHtml = createLogo({ withTagline: true });
    const navigationHtml = createNavigation({ activePage: this.activePage });
    const ctaButtonHtml = createCTAButton({ label: 'Start a Project', href: '/contact' });
    const { toggleButtonHtml, drawerHtml } = createMobileMenu({ activePage: this.activePage });

    return `
      <header class="site-header" id="site-header">
        <div class="site-header__container">
          ${logoHtml}
          ${navigationHtml}
          ${ctaButtonHtml}
          ${toggleButtonHtml}
        </div>
        ${drawerHtml}
      </header>
    `;
  }

  /**
   * Mounts the header into a DOM element and binds event listeners
   */
  mount(container = null) {
    const existing = document.getElementById('site-header');
    if (existing) {
      this.headerEl = existing;
      this.bindEvents();
      return this.headerEl;
    }

    const parent = container || this.target;
    const temp = document.createElement('div');
    temp.innerHTML = this.renderHTML().trim();
    this.headerEl = temp.firstElementChild;

    if (parent.firstChild) {
      parent.insertBefore(this.headerEl, parent.firstChild);
    } else {
      parent.appendChild(this.headerEl);
    }

    this.bindEvents();
    return this.headerEl;
  }

  /**
   * Attaches high-performance scroll listeners & mobile navigation events
   */
  bindEvents() {
    if (!this.headerEl) {
      this.headerEl = document.getElementById('site-header');
    }
    if (!this.headerEl) return;

    this.mobileToggle = this.headerEl.querySelector('#mobile-nav-toggle');
    this.mobileDrawer = this.headerEl.querySelector('#mobile-nav-drawer');

    // Scroll listener with RAF throttling for smooth 60fps performance
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this._handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Initial check in case page starts scrolled
    this._handleScroll();

    // Mobile menu toggle
    if (this.mobileToggle && this.mobileDrawer) {
      this.mobileToggle.addEventListener('click', () => {
        this.toggleMenu();
      });

      // Close menu when clicking any nav link
      const links = this.mobileDrawer.querySelectorAll('a');
      links.forEach((link) => {
        link.addEventListener('click', () => {
          this.closeMenu();
        });
      });
    }

    // Theme Switcher Binding (Light / Dark mode)
    const bindTheme = (btn) => {
      if (!btn) return;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        try {
          localStorage.setItem('kodmates-theme', nextTheme);
        } catch (err) {}
      });
    };

    bindTheme(this.headerEl.querySelector('#theme-toggle'));
    bindTheme(this.headerEl.querySelector('#mobile-theme-toggle'));

    // Keyboard accessibility: ESC key closes mobile menu
    window.addEventListener('keydown', this._handleKeyDown);
  }

  _handleScroll() {
    if (!this.headerEl) return;
    const scrollThreshold = 15;
    if (window.scrollY > scrollThreshold) {
      this.headerEl.classList.add('site-header--scrolled');
    } else {
      this.headerEl.classList.remove('site-header--scrolled');
    }
  }

  _handleKeyDown(event) {
    if (event.key === 'Escape' && this.isMenuOpen) {
      this.closeMenu();
      if (this.mobileToggle) {
        this.mobileToggle.focus();
      }
    }
  }

  toggleMenu() {
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.isMenuOpen = true;
    if (this.mobileToggle) {
      this.mobileToggle.setAttribute('aria-expanded', 'true');
    }
    if (this.mobileDrawer) {
      this.mobileDrawer.classList.add('is-open');
    }
    document.body.style.overflow = 'hidden';
  }

  closeMenu() {
    this.isMenuOpen = false;
    if (this.mobileToggle) {
      this.mobileToggle.setAttribute('aria-expanded', 'false');
    }
    if (this.mobileDrawer) {
      this.mobileDrawer.classList.remove('is-open');
    }
    document.body.style.overflow = '';
  }

  /**
   * Sets a new active page (e.g. for client-side routing)
   */
  setActivePage(pageName) {
    this.activePage = pageName;
    const normalized = pageName.toLowerCase();

    // Desktop
    const desktopLinks = this.headerEl.querySelectorAll('.desktop-nav .nav-link');
    desktopLinks.forEach((link) => {
      const match = link.getAttribute('data-nav-id') === normalized;
      link.classList.toggle('is-active', match);
      if (match) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    // Mobile
    const mobileLinks = this.headerEl.querySelectorAll('.mobile-drawer .mobile-nav-link');
    mobileLinks.forEach((link) => {
      const match = link.getAttribute('data-mobile-nav-id') === normalized;
      link.classList.toggle('is-active', match);
      if (match) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  destroy() {
    window.removeEventListener('keydown', this._handleKeyDown);
    if (this.headerEl && this.headerEl.parentNode) {
      this.headerEl.parentNode.removeChild(this.headerEl);
    }
  }
}

/**
 * Convenience helper to initialize the Kodmates header on any page
 */
export function initHeader(options = {}) {
  const header = new Header(options);
  header.mount();
  return header;
}
