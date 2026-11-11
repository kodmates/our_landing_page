import { NAV_ITEMS } from './Navigation.js';

/**
 * Kodmates Mobile Menu & Drawer Component
 * Includes accessible toggle button and slide/fade drawer.
 */
export function createMobileMenu({ activePage = 'Home' } = {}) {
  const normalizedActive = activePage.toLowerCase();

  const navLinks = NAV_ITEMS.map((item) => {
    const isActive = item.id === normalizedActive || item.label.toLowerCase() === normalizedActive;
    const activeClass = isActive ? 'mobile-nav-link is-active' : 'mobile-nav-link';
    const ariaCurrent = isActive ? 'aria-current="page"' : '';

    return `
      <li class="mobile-nav-item">
        <a href="${item.href}" class="${activeClass}" ${ariaCurrent} data-mobile-nav-id="${item.id}">
          ${item.label}
        </a>
      </li>
    `;
  }).join('');

  const toggleButtonHtml = `
    <button 
      type="button" 
      class="mobile-toggle" 
      id="mobile-nav-toggle" 
      aria-label="Toggle navigation menu" 
      aria-expanded="false" 
      aria-controls="mobile-nav-drawer"
    >
      <span class="hamburger-icon" aria-hidden="true">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </span>
    </button>
  `;

  const drawerHtml = `
    <div 
      class="mobile-drawer" 
      id="mobile-nav-drawer" 
      role="dialog" 
      aria-modal="true" 
      aria-label="Mobile Navigation"
    >
      <ul class="mobile-nav-list">
        ${navLinks}
      </ul>
      <div class="mobile-cta-wrapper">
        <button 
          type="button" 
          class="mobile-theme-toggle" 
          id="mobile-theme-toggle" 
          aria-label="Toggle color theme"
        >
          <span class="mobile-theme-label">Switch Theme</span>
          <span class="mobile-theme-icon-wrap" aria-hidden="true">
            <svg class="theme-icon theme-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg class="theme-icon theme-icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </span>
        </button>
        <a href="#contact" class="cta-button mobile-cta-button" id="mobile-cta-btn">
          <span>Start a Project</span>
          <span class="cta-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  `;

  return {
    toggleButtonHtml,
    drawerHtml,
  };
}
