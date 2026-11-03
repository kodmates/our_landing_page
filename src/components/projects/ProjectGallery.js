/**
 * Escapes HTML entities to ensure safe rendering
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Normalizes screenshot input entries into a consistent object schema.
 * Supports string paths and structured screenshot objects.
 * Gracefully ignores null, undefined, or empty values.
 * 
 * @param {string|object} item
 * @param {string} projectTitle
 * @param {number} index
 * @returns {object|null}
 */
export function normalizeScreenshot(item, projectTitle = 'Project', index = 0) {
  if (!item) return null;

  if (typeof item === 'string') {
    const trimmed = item.trim();
    if (!trimmed) return null;
    return {
      src: trimmed,
      alt: `${projectTitle} Interface — View ${index + 1}`,
      caption: null,
      device: null
    };
  }

  if (typeof item === 'object') {
    const src = item.src && typeof item.src === 'string' ? item.src.trim() : null;
    if (!src) return null;

    return {
      src,
      alt: item.alt && typeof item.alt === 'string' && item.alt.trim()
        ? item.alt.trim()
        : `${projectTitle} Interface — View ${index + 1}`,
      caption: item.caption && typeof item.caption === 'string' && item.caption.trim()
        ? item.caption.trim()
        : null,
      device: item.device && typeof item.device === 'string' && item.device.trim()
        ? item.device.trim()
        : null
    };
  }

  return null;
}

/**
 * Renders the reusable Project Gallery section.
 * Returns an empty string if project.screenshots is empty or contains no valid assets.
 * 
 * @param {object} project
 * @returns {string}
 */
export function createProjectGallery(project) {
  if (!project || !Array.isArray(project.screenshots) || project.screenshots.length === 0) {
    return '';
  }

  const projectTitle = project.title || 'Project';
  const validScreenshots = project.screenshots
    .map((item, idx) => normalizeScreenshot(item, projectTitle, idx))
    .filter(Boolean);

  if (validScreenshots.length === 0) {
    return '';
  }

  const isSingle = validScreenshots.length === 1;
  const gridClass = isSingle
    ? 'case-study__gallery-grid--single'
    : 'case-study__gallery-grid--multi';

  const itemsMarkup = validScreenshots.map((item, index) => {
    const deviceBadge = item.device
      ? `<span class="case-study__gallery-device">${escapeHTML(item.device)}</span>`
      : '';

    const captionMarkup = item.caption
      ? `<figcaption class="case-study__gallery-caption">${escapeHTML(item.caption)}</figcaption>`
      : '';

    const loadingAttr = index === 0 ? 'eager' : 'lazy';

    return `
      <figure class="case-study__gallery-item" data-gallery-index="${index}">
        <div class="case-study__gallery-frame">
          ${deviceBadge}
          <button
            type="button"
            class="case-study__gallery-trigger"
            aria-haspopup="dialog"
            aria-label="Enlarge screenshot: ${escapeHTML(item.alt)}"
          >
            <img
              src="${escapeHTML(item.src)}"
              alt="${escapeHTML(item.alt)}"
              class="case-study__gallery-img"
              loading="${loadingAttr}"
              decoding="async"
              onerror="this.onerror=null;this.classList.add('is-hidden');if(this.nextElementSibling){this.nextElementSibling.classList.remove('is-hidden');}"
            />
            <div class="case-study__gallery-fallback is-hidden" aria-hidden="true">
              <span class="case-study__gallery-fallback-icon">▨</span>
              <span class="case-study__gallery-fallback-text">Visual Asset Unavailable</span>
            </div>
          </button>
        </div>
        ${captionMarkup}
      </figure>
    `;
  }).join('');

  return `
    <section class="case-study__section case-study__gallery-section" aria-labelledby="cs-gallery-heading">
      <div class="case-study__section-header">
        <span class="case-study__section-eyebrow">VISUAL EVIDENCE</span>
        <h2 class="case-study__section-title" id="cs-gallery-heading">Interface & Visual Evidence</h2>
      </div>
      <div class="case-study__gallery-grid ${gridClass}">
        ${itemsMarkup}
      </div>

      <!-- Lightweight Modal Lightbox Container -->
      <div id="case-study-lightbox" class="case-study__lightbox is-hidden" role="dialog" aria-modal="true" aria-label="Expanded Image Preview">
        <div class="case-study__lightbox-backdrop" data-action="close"></div>
        <div class="case-study__lightbox-content">
          <button type="button" class="case-study__lightbox-close" data-action="close" aria-label="Close enlarged preview">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <img src="" alt="" class="case-study__lightbox-img" loading="lazy" decoding="async" />
          <p class="case-study__lightbox-caption"></p>
        </div>
      </div>
    </section>
  `;
}

/**
 * Initializes interactive gallery behaviors (keyboard-accessible lightbox preview)
 * @param {HTMLElement} rootEl
 * @returns {function} cleanup callback
 */
export function initGalleryInteractions(rootEl) {
  if (!rootEl) return () => {};

  const lightbox = rootEl.querySelector('#case-study-lightbox');
  if (!lightbox) return () => {};

  const lightboxImg = lightbox.querySelector('.case-study__lightbox-img');
  const lightboxCaption = lightbox.querySelector('.case-study__lightbox-caption');
  const closeBtn = lightbox.querySelector('.case-study__lightbox-close');
  let lastActiveElement = null;

  function openLightbox(triggerEl, captionText) {
    if (!lightbox || !lightboxImg) return;
    const imgInside = triggerEl.querySelector('img');
    if (!imgInside) return;

    lastActiveElement = triggerEl;
    lightboxImg.src = imgInside.src;
    lightboxImg.alt = imgInside.alt || '';
    if (lightboxCaption) {
      lightboxCaption.textContent = captionText || '';
      lightboxCaption.style.display = captionText ? 'block' : 'none';
    }
    lightbox.classList.remove('is-hidden');
    document.body.style.overflow = 'hidden';

    if (closeBtn) {
      closeBtn.focus();
    }
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.add('is-hidden');
    if (lightboxImg) lightboxImg.src = '';
    document.body.style.overflow = '';
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  function handleTrigger(e) {
    const trigger = e.target.closest('.case-study__gallery-trigger');
    if (!trigger) return;

    e.preventDefault();
    const figure = trigger.closest('.case-study__gallery-item');
    const captionEl = figure ? figure.querySelector('.case-study__gallery-caption') : null;
    openLightbox(trigger, captionEl ? captionEl.textContent : '');
  }

  function handleKeydown(e) {
    if (lightbox.classList.contains('is-hidden')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeLightbox();
      return;
    }

    if (e.key === 'Tab') {
      const focusables = Array.from(
        lightbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      ).filter((el) => !el.disabled && el.offsetParent !== null);

      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }

      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl || !lightbox.contains(document.activeElement)) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl || !lightbox.contains(document.activeElement)) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  }

  function handleLightboxClick(e) {
    if (e.target.getAttribute('data-action') === 'close') {
      closeLightbox();
    }
  }

  rootEl.addEventListener('click', handleTrigger);
  lightbox.addEventListener('click', handleLightboxClick);
  window.addEventListener('keydown', handleKeydown);

  return function cleanup() {
    rootEl.removeEventListener('click', handleTrigger);
    lightbox.removeEventListener('click', handleLightboxClick);
    window.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = '';
  };
}

export default createProjectGallery;
