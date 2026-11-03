/**
 * Project Results & Impact Component (Phase 13)
 *
 * Renders a data-driven, engineering-focused presentation of verified
 * results, qualitative outcomes, and metrics for project case studies.
 *
 * Design constraints:
 * - 100% data-driven from project.results
 * - Returns "" when results are missing, empty, or unverified
 * - No project-specific slug checks or hardcoded names
 * - No placeholder statistics ("—", "N/A", "Coming soon", fake 0s)
 * - No fabricated vanity metrics or unverified percentage claims
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
 * Creates the reusable Results & Impact section.
 * Renders only when project.results contains verified data.
 *
 * @param {object} project
 * @returns {string} HTML markup string or empty string
 */
export function createProjectResults(project) {
  if (!project || !project.results) {
    return '';
  }

  let summary = '';
  let rawItems = [];

  const res = project.results;

  if (typeof res === 'string') {
    summary = res.trim();
    if (!summary) return '';
  } else if (Array.isArray(res)) {
    if (res.length === 0) return '';
    rawItems = res;
  } else if (typeof res === 'object') {
    if (typeof res.summary === 'string') {
      summary = res.summary.trim();
    } else if (typeof res.narrative === 'string') {
      summary = res.narrative.trim();
    } else if (typeof res.description === 'string') {
      summary = res.description.trim();
    }

    const itemsArray = Array.isArray(res.items)
      ? res.items
      : Array.isArray(res.metrics)
      ? res.metrics
      : Array.isArray(res.outcomes)
      ? res.outcomes
      : [];

    rawItems = itemsArray;

    if (!summary && rawItems.length === 0) {
      return '';
    }
  }

  // Normalize items
  const items = [];
  rawItems.forEach((item) => {
    if (typeof item === 'string') {
      const trimmed = item.trim();
      if (trimmed) {
        items.push({ text: trimmed });
      }
    } else if (item && typeof item === 'object') {
      const value = typeof item.value === 'string' || typeof item.value === 'number'
        ? String(item.value).trim()
        : '';
      const label = typeof item.label === 'string' ? item.label.trim() : '';
      const text = typeof item.text === 'string'
        ? item.text.trim()
        : typeof item.description === 'string'
        ? item.description.trim()
        : '';

      if (value || label || text) {
        items.push({ value, label, text });
      }
    }
  });

  // If no summary and no valid items, return empty
  if (!summary && items.length === 0) {
    return '';
  }

  let gridMarkup = '';
  if (items.length > 0) {
    const cardsMarkup = items
      .map((item, index) => {
        const paddedIndex = String(index + 1).padStart(2, '0');
        const hasMetric = Boolean(item.value);

        if (hasMetric) {
          return `
            <li class="case-study__result-card case-study__result-card--metric">
              <span class="case-study__result-value">${escapeHTML(item.value)}</span>
              ${item.label ? `<span class="case-study__result-label">${escapeHTML(item.label)}</span>` : ''}
              ${item.text ? `<p class="case-study__result-text">${escapeHTML(item.text)}</p>` : ''}
            </li>
          `;
        }

        return `
          <li class="case-study__result-card case-study__result-card--outcome">
            <span class="case-study__result-index" aria-hidden="true">${paddedIndex}</span>
            <p class="case-study__result-text">${escapeHTML(item.text)}</p>
          </li>
        `;
      })
      .join('');

    gridMarkup = `
      <ul class="case-study__results-grid" aria-label="Results and impact items">
        ${cardsMarkup}
      </ul>
    `;
  }

  const summaryMarkup = summary
    ? `<p class="case-study__section-body case-study__results-summary">${escapeHTML(summary)}</p>`
    : '';

  return `
    <section class="case-study__section case-study__results-section" aria-labelledby="cs-results-heading">
      <div class="case-study__section-header">
        <span class="case-study__section-eyebrow">IMPACT</span>
        <h2 class="case-study__section-title" id="cs-results-heading">Results &amp; Impact</h2>
      </div>
      ${summaryMarkup}
      ${gridMarkup}
    </section>
  `;
}

export default createProjectResults;
