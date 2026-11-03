/**
 * Project Contribution Component (Phase 12)
 *
 * Renders a data-driven, engineering-focused presentation of verified
 * development responsibilities and roles for project case studies.
 *
 * Design constraints:
 * - 100% data-driven from project.contribution
 * - Returns "" when contribution is missing, empty, or unverified
 * - No project-specific slug checks or hardcoded names
 * - No fake metrics, percentages, Git commits, or decorative statistics
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
 * Creates the reusable Development & Contribution section.
 * Renders only when project.contribution contains verified data.
 *
 * @param {object} project
 * @returns {string} HTML markup string or empty string
 */
export function createProjectContribution(project) {
  if (!project || !project.contribution) {
    return '';
  }

  let role = '';
  let contributor = '';
  let items = [];
  let summary = '';

  const contrib = project.contribution;

  if (typeof contrib === 'string') {
    summary = contrib.trim();
    if (!summary) return '';
  } else if (Array.isArray(contrib)) {
    items = contrib
      .map((it) => (typeof it === 'string' ? it.trim() : ''))
      .filter(Boolean);
    if (items.length === 0) return '';
  } else if (typeof contrib === 'object') {
    if (typeof contrib.role === 'string') {
      role = contrib.role.trim();
    }
    if (typeof contrib.contributor === 'string') {
      contributor = contrib.contributor.trim();
    } else if (typeof contrib.author === 'string') {
      contributor = contrib.author.trim();
    } else if (typeof contrib.name === 'string') {
      contributor = contrib.name.trim();
    }

    const rawItems = Array.isArray(contrib.items)
      ? contrib.items
      : Array.isArray(contrib.contributions)
      ? contrib.contributions
      : Array.isArray(contrib.responsibilities)
      ? contrib.responsibilities
      : [];

    items = rawItems
      .map((it) => (typeof it === 'string' ? it.trim() : ''))
      .filter(Boolean);

    if (typeof contrib.summary === 'string') {
      summary = contrib.summary.trim();
    } else if (typeof contrib.description === 'string') {
      summary = contrib.description.trim();
    }

    if (!role && !contributor && items.length === 0 && !summary) {
      return '';
    }
  }

  // Left role / contributor panel markup
  let roleMarkup = '';
  if (role || contributor) {
    roleMarkup = `
      <div class="case-study__contribution-role">
        ${role ? `<span class="case-study__contribution-role-label">${escapeHTML(role)}</span>` : ''}
        ${contributor ? `<h3 class="case-study__contribution-name">${escapeHTML(contributor)}</h3>` : ''}
      </div>
    `;
  }

  // Right list or narrative summary markup
  let contentMarkup = '';
  if (items.length > 0) {
    const listItems = items
      .map((item, index) => {
        const padded = String(index + 1).padStart(2, '0');
        return `
          <li class="case-study__contribution-item">
            <span class="case-study__contribution-index" aria-hidden="true">${padded}</span>
            <span class="case-study__contribution-text">${escapeHTML(item)}</span>
          </li>
        `;
      })
      .join('');

    contentMarkup = `
      <ol class="case-study__contribution-list" aria-label="Contribution items">
        ${listItems}
      </ol>
    `;
  } else if (summary) {
    contentMarkup = `
      <div class="case-study__contribution-text-block">
        <p class="case-study__section-body">${escapeHTML(summary)}</p>
      </div>
    `;
  }

  return `
    <section class="case-study__section case-study__contribution-section" aria-labelledby="cs-contrib-heading">
      <div class="case-study__section-header">
        <span class="case-study__section-eyebrow">DEVELOPMENT</span>
        <h2 class="case-study__section-title" id="cs-contrib-heading">Development &amp; Contribution</h2>
        <p class="case-study__contribution-subtext">Verified engineering responsibilities for this project.</p>
      </div>
      <div class="case-study__contribution-layout">
        ${roleMarkup}
        ${contentMarkup}
      </div>
    </section>
  `;
}

export default createProjectContribution;
