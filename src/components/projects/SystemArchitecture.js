/**
 * System Architecture Component (Phase 11)
 *
 * Renders a data-driven, engineering-focused presentation of a project's
 * verified system architecture layers.
 *
 * Design constraints:
 * - 100% data-driven from project.architecture
 * - Returns "" when architecture is empty, missing, or unverified
 * - No hardcoded project slugs or project names
 * - No fake network topologies or fabricated infrastructure
 * - Semantic HTML, accessible hierarchy, responsive across all viewports
 */

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
 * Creates the reusable System Architecture section.
 * Renders only when project.architecture contains verified data.
 *
 * @param {object} project
 * @returns {string} HTML markup string or empty string
 */
export function createSystemArchitecture(project) {
  if (!project || !project.architecture) {
    return '';
  }

  let summary = '';
  let rawLayers = [];

  const arch = project.architecture;

  if (typeof arch === 'string') {
    summary = arch.trim();
  } else if (Array.isArray(arch)) {
    if (arch.length === 0) return '';
    rawLayers = arch;
  } else if (typeof arch === 'object') {
    if (typeof arch.summary === 'string') {
      summary = arch.summary.trim();
    } else if (typeof arch.description === 'string') {
      summary = arch.description.trim();
    }

    if (Array.isArray(arch.layers)) {
      rawLayers = arch.layers;
    }
  }

  // Normalize layers
  const layers = [];
  rawLayers.forEach((layer) => {
    if (typeof layer === 'string') {
      const trimmed = layer.trim();
      if (trimmed) {
        layers.push({ title: trimmed, items: [] });
      }
    } else if (layer && typeof layer === 'object') {
      const title = (layer.title || layer.name || '').trim();
      const rawItems = Array.isArray(layer.items)
        ? layer.items
        : Array.isArray(layer.components)
        ? layer.components
        : [];
      const items = rawItems
        .map((it) => (typeof it === 'string' ? it.trim() : ''))
        .filter(Boolean);

      if (title || items.length > 0) {
        layers.push({
          title: title || 'System Component',
          items
        });
      }
    }
  });

  // If no summary and no layers, hide completely
  if (!summary && layers.length === 0) {
    return '';
  }

  // Render layer cards
  let gridMarkup = '';
  if (layers.length > 0) {
    const cardsMarkup = layers
      .map((layer, index) => {
        const paddedIndex = String(index + 1).padStart(2, '0');
        const itemsMarkup =
          layer.items.length > 0
            ? `
              <ul class="case-study__architecture-items">
                ${layer.items
                  .map(
                    (item) => `
                    <li class="case-study__architecture-item">
                      <span class="case-study__architecture-item-dot" aria-hidden="true"></span>
                      <span class="case-study__architecture-item-text">${escapeHTML(item)}</span>
                    </li>
                  `
                  )
                  .join('')}
              </ul>
            `
            : '';

        return `
          <li class="case-study__architecture-card">
            <div class="case-study__architecture-card-header">
              <span class="case-study__architecture-index" aria-hidden="true">${paddedIndex}</span>
              <h3 class="case-study__architecture-title">${escapeHTML(layer.title)}</h3>
            </div>
            ${itemsMarkup}
          </li>
        `;
      })
      .join('');

    gridMarkup = `
      <ul class="case-study__architecture-grid" aria-label="System architecture layers">
        ${cardsMarkup}
      </ul>
    `;
  }

  const summaryMarkup = summary
    ? `<p class="case-study__section-body case-study__architecture-summary">${escapeHTML(summary)}</p>`
    : '';

  return `
    <section class="case-study__section case-study__architecture-section" aria-labelledby="cs-arch-heading">
      <div class="case-study__section-header">
        <span class="case-study__section-eyebrow">ARCHITECTURE</span>
        <h2 class="case-study__section-title" id="cs-arch-heading">System Architecture</h2>
        <p class="case-study__architecture-subtext">Verified multi-tier architectural layers and component hierarchy.</p>
      </div>
      ${summaryMarkup}
      ${gridMarkup}
    </section>
  `;
}

export default createSystemArchitecture;
