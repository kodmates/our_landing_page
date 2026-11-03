/**
 * Derives unique, non-empty categories programmatically from the project registry.
 * Never fabricates or hard-codes categories.
 *
 * @param {Array<object>} projectsList - Array of project objects
 * @returns {Array<string>} List of categories starting with 'All'
 */
export function getCategories(projectsList = []) {
  const seen = new Set();
  const categories = ['All'];

  projectsList.forEach((project) => {
    if (project && typeof project.category === 'string' && project.category.trim().length > 0) {
      const trimmed = project.category.trim();
      if (!seen.has(trimmed)) {
        seen.add(trimmed);
        categories.push(trimmed);
      }
    }
  });

  return categories;
}

/**
 * ProjectFilters Component (Phase 04)
 * Generates semantic, keyboard-accessible filter buttons using <button>.
 * Communicates state via aria-pressed and visual indicators.
 *
 * @param {object} options
 * @param {Array<string>} options.categories - Available categories
 * @param {string} options.activeCategory - Currently active category
 * @returns {string} HTML markup
 */
export function createProjectFilters({ categories = [], activeCategory = 'All' } = {}) {
  const buttonsMarkup = categories.map((cat) => {
    const isActive = cat.toLowerCase() === activeCategory.toLowerCase();
    return `
      <button
        type="button"
        class="project-filter-btn ${isActive ? 'is-active' : ''}"
        aria-pressed="${isActive ? 'true' : 'false'}"
        data-filter-category="${cat}"
      >
        <span class="project-filter-btn__dot" aria-hidden="true"></span>
        <span class="project-filter-btn__label">${cat}</span>
      </button>
    `;
  }).join('');

  return `
    <div class="project-filters" role="region" aria-label="Project category filters">
      <div class="project-filters__track" role="toolbar" aria-label="Filter buttons">
        ${buttonsMarkup}
      </div>
    </div>
  `;
}

export default createProjectFilters;
