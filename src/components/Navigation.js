/**
 * Kodmates Navigation Component
 * Supports active page highlighting with understated #FEEFB8 indicator.
 * Semantic HTML with aria-current="page" and keyboard accessibility.
 */

export const NAV_ITEMS = [
  { label: 'Home', href: '/', id: 'home' },
  { label: 'Services', href: '/services', id: 'services' },
  { label: 'Projects', href: '/projects', id: 'projects' },
  { label: 'Process', href: '/#process', id: 'process' },
  { label: 'About', href: '/#about', id: 'about' },
  { label: 'Blog', href: '/blog', id: 'blog' },
  { label: 'Contact', href: '/contact', id: 'contact' },
];

export function createNavigation({ activePage = 'Home' } = {}) {
  const normalizedActive = activePage.toLowerCase();

  const navItemsMarkup = NAV_ITEMS.map((item) => {
    const isActive = item.id === normalizedActive || item.label.toLowerCase() === normalizedActive;
    const activeClass = isActive ? 'nav-link is-active' : 'nav-link';
    const ariaCurrent = isActive ? 'aria-current="page"' : '';

    return `
      <li class="nav-item">
        <a href="${item.href}" class="${activeClass}" ${ariaCurrent} data-nav-id="${item.id}">
          ${item.label}
        </a>
      </li>
    `;
  }).join('');

  return `
    <nav class="desktop-nav" aria-label="Main Navigation">
      <ul class="nav-list">
        ${navItemsMarkup}
      </ul>
    </nav>
  `;
}
