/**
 * Next Project Navigation Component (Phase 14)
 *
 * Renders a data-driven, editorial transition section to the next project
 * in the canonical registry order.
 *
 * Design constraints:
 * - 100% data-driven from project registry order
 * - Deterministic circular sequence: project[i] -> project[(i + 1) % length]
 * - Never links a project to itself
 * - Returns "" for 0 or 1 project registries or invalid data
 * - Displays only verified fields (omits empty categories/taglines)
 * - Semantic HTML, accessible keyboard navigation, responsive across viewports
 * - Zero external dependencies
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
 * Creates the reusable Next Project navigation section.
 *
 * @param {object} currentProject - The active case-study project
 * @param {Array<object>} projectList - The canonical registry of projects
 * @returns {string} HTML markup string or empty string
 */
export function createNextProject(currentProject, projectList) {
  if (!currentProject || !currentProject.slug) {
    return '';
  }

  if (!Array.isArray(projectList) || projectList.length <= 1) {
    return '';
  }

  const currentIndex = projectList.findIndex(
    (p) => p && typeof p.slug === 'string' && p.slug === currentProject.slug
  );

  if (currentIndex === -1) {
    return '';
  }

  const nextIndex = (currentIndex + 1) % projectList.length;
  const nextProject = projectList[nextIndex];

  if (!nextProject || !nextProject.slug || !nextProject.title) {
    return '';
  }

  // Prevent self-linking
  if (nextProject.slug === currentProject.slug) {
    return '';
  }

  const safeSlug = escapeHTML(nextProject.slug);
  const safeTitle = escapeHTML(nextProject.title);
  const category = typeof nextProject.category === 'string' ? nextProject.category.trim() : '';
  const tagline = typeof nextProject.tagline === 'string'
    ? nextProject.tagline.trim()
    : typeof nextProject.shortDescription === 'string'
    ? nextProject.shortDescription.trim()
    : '';

  const safeCategory = category ? escapeHTML(category) : '';
  const safeTagline = tagline ? escapeHTML(tagline) : '';

  return `
    <section class="case-study__next-section" aria-labelledby="cs-next-heading">
      <div class="case-study__next-card">
        <div class="case-study__next-card-content">
          <div class="case-study__next-meta">
            <h2 class="case-study__next-eyebrow" id="cs-next-heading">NEXT PROJECT</h2>
            ${safeCategory ? `<span class="case-study__next-category">${safeCategory}</span>` : ''}
          </div>
          <h3 class="case-study__next-title">${safeTitle}</h3>
          ${safeTagline ? `<p class="case-study__next-tagline">${safeTagline}</p>` : ''}
          <div class="case-study__next-action">
            <a href="/projects/${safeSlug}" class="case-study__next-btn" aria-label="View case study for ${safeTitle}">
              <span>View Case Study</span>
              <svg class="case-study__next-arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div class="case-study__next-footer">
        <a href="/projects" class="case-study__next-back-link" aria-label="Return to all projects listing">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>All Projects</span>
        </a>
      </div>
    </section>
  `;
}

export default createNextProject;
