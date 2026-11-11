/**
 * Kodmates CTA Button Component
 * Includes Header Theme Switcher (Light / Dark mode) & "Start a Project →" Action
 */
export function createCTAButton({ 
  label = 'Start a Project', 
  href = '#contact', 
  extraClass = '', 
  id = 'header-cta-btn',
  withThemeToggle = true
} = {}) {
  const themeToggleHtml = withThemeToggle ? `
    <button 
      type="button" 
      class="theme-toggle-btn" 
      id="theme-toggle" 
      aria-label="Toggle light/dark theme" 
      title="Switch theme"
    >
      <svg class="theme-icon theme-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="18" height="18">
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
      <svg class="theme-icon theme-icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="18" height="18">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </button>
  ` : '';

  return `
    <div class="header-cta ${extraClass}">
      ${themeToggleHtml}
      <a href="${href}" class="cta-button" id="${id}">
        <span>${label}</span>
        <span class="cta-arrow" aria-hidden="true">→</span>
      </a>
    </div>
  `;
}
