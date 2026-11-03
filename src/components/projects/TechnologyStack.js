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
 * Creates the reusable Technology Stack section.
 * Renders only when project.technologies is a non-empty array.
 * Zero hard-coded project references or fabricated metadata.
 * 
 * @param {object} project
 * @returns {string} HTML markup string or empty string
 */
export function createTechnologyStack(project) {
  if (!project || !Array.isArray(project.technologies) || project.technologies.length === 0) {
    return '';
  }

  // Filter out any empty, non-string, or invalid values while preserving order
  const validTechs = project.technologies
    .map((t) => (typeof t === 'string' ? t.trim() : ''))
    .filter(Boolean);

  if (validTechs.length === 0) {
    return '';
  }

  const itemsMarkup = validTechs.map((tech, index) => {
    const paddedIndex = String(index + 1).padStart(2, '0');
    return `
      <li class="case-study__tech-card">
        <span class="case-study__tech-card-idx" aria-hidden="true">${paddedIndex}</span>
        <div class="case-study__tech-card-content">
          <span class="case-study__tech-card-name">${escapeHTML(tech)}</span>
        </div>
      </li>
    `;
  }).join('');

  return `
    <section class="case-study__section case-study__tech-section" aria-labelledby="cs-tech-heading">
      <div class="case-study__section-header">
        <span class="case-study__section-eyebrow">STACK</span>
        <h2 class="case-study__section-title" id="cs-tech-heading">Technologies &amp; Tools</h2>
        <p class="case-study__tech-subtext">Core frameworks, runtime environments, and engineering libraries utilized across the platform.</p>
      </div>
      <ul class="case-study__tech-grid" aria-label="Technologies list">
        ${itemsMarkup}
      </ul>
    </section>
  `;
}

export default createTechnologyStack;
