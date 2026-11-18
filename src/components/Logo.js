/**
 * Kodmates Brand Logo Component
 * Matches the official reference: #FEEFB8 geometric mark + KODMATES + Tagline
 * Polished for commanding studio presence and optical balance
 */
export function createLogo({ withTagline = true } = {}) {
  const brandHref = '/';

  const logoHtml = `
    <a href="${brandHref}" class="brand-logo" aria-label="Subrat Dakua Home">
      <div class="brand-logo__mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Left bracket anchor -->
          <path d="M10.5 7H9C7.34315 7 6 8.34315 6 10V22C6 23.6569 7.34315 25 9 25H10.5" 
                stroke="#FEEFB8" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Chevron forming the K glyph -->
          <path d="M20.5 8L12 16L20.5 24" 
                stroke="#FEEFB8" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="brand-logo__meta">
        <span class="brand-logo__name">SUBRAT DAKUA</span>
        ${withTagline ? '<span class="brand-logo__tagline">Full-Stack &amp; E-Commerce Developer</span>' : ''}
      </div>
    </a>
  `;

  return logoHtml;
}
