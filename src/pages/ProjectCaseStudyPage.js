import projects from '../data/projects/index.js';
import { getProjectInitials } from '../components/projects/ProjectCard.js';
import { createProjectGallery, initGalleryInteractions } from '../components/projects/ProjectGallery.js';
import { createTechnologyStack } from '../components/projects/TechnologyStack.js';
import { createSystemArchitecture } from '../components/projects/SystemArchitecture.js';
import { createProjectContribution } from '../components/projects/ProjectContribution.js';
import { createProjectResults } from '../components/projects/ProjectResults.js';
import { createNextProject } from '../components/projects/NextProject.js';
import { createProject3D, initProject3D } from '../components/projects/Project3D.js';
import { updateProjectCaseStudySEO } from '../components/projects/ProjectSEO.js';

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
 * ProjectCaseStudyPage Component (Phase 07 & 09)
 * Generic, data-driven case study template for /projects/{slug} routes.
 * Gracefully adapts to sparse project data without inventing content or rendering empty shells.
 */
export class ProjectCaseStudyPage {
  constructor(options = {}) {
    this.target = options.target || document.getElementById('main-content');
    this.project = options.project || null;
    this.slug = options.slug || (this.project ? this.project.slug : '');
    this.pageEl = null;
    this._cleanupGallery = null;
  }

  /**
   * Generates markup for the abstract identity fallback visual
   * @param {object} project
   * @returns {string}
   */
  renderVisualFallback(project) {
    const initials = getProjectInitials(project.title);
    const categoryText = project.category ? escapeHTML(project.category) : '';
    const safeSlug = escapeHTML((project.slug || '').toUpperCase());

    return `
      <div class="case-study__fallback" aria-hidden="true">
        <div class="case-study__fallback-grid"></div>
        <div class="case-study__fallback-center">
          <div class="case-study__fallback-badge">
            <span class="case-study__fallback-monogram">${escapeHTML(initials)}</span>
          </div>
          <span class="case-study__fallback-title">${escapeHTML(project.title)}</span>
        </div>
        <div class="case-study__fallback-footer">
          <span class="case-study__fallback-code">REF // ${safeSlug}</span>
          ${categoryText ? `<span class="case-study__fallback-cat">${categoryText}</span>` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Generates the Hero visual container (real screenshot or abstract identity fallback)
   * @param {object} project
   * @returns {string}
   */
  renderHeroVisual(project) {
    const hasScreenshots = Array.isArray(project.screenshots) && project.screenshots.length > 0;
    if (hasScreenshots && project.screenshots[0]) {
      const src = escapeHTML(project.screenshots[0]);
      return `
        <div class="case-study__hero-visual">
          <img src="${src}" alt="Screenshot for ${escapeHTML(project.title)}" class="case-study__screenshot" loading="eager" />
        </div>
      `;
    }

    // Project-specific 3D Visual (Phase 15)
    const visual3DMarkup = createProject3D(project);
    if (visual3DMarkup) {
      return `
        <div class="case-study__hero-visual">
          ${visual3DMarkup}
          <div class="case-study__hero-visual-fallback" style="display: none;">
            ${this.renderVisualFallback(project)}
          </div>
        </div>
      `;
    }

    return `
      <div class="case-study__hero-visual">
        ${this.renderVisualFallback(project)}
      </div>
    `;
  }

  /**
   * Generates verified metadata rail only for fields with actual data
   * @param {object} project
   * @returns {string}
   */
  renderMetadataRail(project) {
    const items = [];

    if (project.category) {
      items.push({
        label: 'Category',
        value: escapeHTML(project.category)
      });
    }

    if (project.industry) {
      items.push({
        label: 'Industry',
        value: escapeHTML(project.industry)
      });
    }

    if (Array.isArray(project.platforms) && project.platforms.length > 0) {
      items.push({
        label: 'Platform',
        value: escapeHTML(project.platforms.join(', '))
      });
    } else if (typeof project.platforms === 'string' && project.platforms.trim()) {
      items.push({
        label: 'Platform',
        value: escapeHTML(project.platforms)
      });
    }

    if (Array.isArray(project.services) && project.services.length > 0) {
      items.push({
        label: 'Services',
        value: escapeHTML(project.services.join(', '))
      });
    } else if (typeof project.services === 'string' && project.services.trim()) {
      items.push({
        label: 'Services',
        value: escapeHTML(project.services)
      });
    }

    if (Array.isArray(project.technologies) && project.technologies.length > 0) {
      items.push({
        label: 'Technologies',
        value: escapeHTML(project.technologies.join(', '))
      });
    }

    if (project.contribution) {
      let contribValue = '';
      if (typeof project.contribution === 'string') {
        contribValue = project.contribution;
      } else if (typeof project.contribution === 'object') {
        if (project.contribution.role && project.contribution.contributor) {
          contribValue = `${project.contribution.role} — ${project.contribution.contributor}`;
        } else if (project.contribution.role) {
          contribValue = project.contribution.role;
        } else if (project.contribution.contributor) {
          contribValue = project.contribution.contributor;
        } else if (project.contribution.summary) {
          contribValue = project.contribution.summary;
        }
      }
      if (contribValue) {
        items.push({
          label: 'Contribution',
          value: escapeHTML(contribValue)
        });
      }
    }

    if (items.length === 0) {
      return '';
    }

    const itemsMarkup = items.map((item) => `
      <div class="case-study__metadata-item">
        <span class="case-study__metadata-label">${item.label}</span>
        <span class="case-study__metadata-value">${item.value}</span>
      </div>
    `).join('');

    return `
      <section class="case-study__metadata" aria-label="Project Metadata">
        ${itemsMarkup}
      </section>
    `;
  }

  /**
   * Generates data-driven next project navigation (Phase 14)
   * @param {object} currentProject
   * @returns {string}
   */
  renderPagination(currentProject) {
    return createNextProject(currentProject, projects);
  }

  /**
   * Renders the 404 Project Not Found state
   * @returns {string}
   */
  renderNotFoundHTML() {
    const safeSlug = escapeHTML(this.slug || 'unknown');
    return `
      <div class="case-study-page case-study-page--not-found" id="case-study-page">
        <nav class="case-study__nav" aria-label="Breadcrumb">
          <a href="/projects" class="case-study__back-link">
            <svg class="case-study__back-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 12L6 8l4-4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Back to Projects</span>
          </a>
        </nav>

        <section class="case-study-not-found" aria-labelledby="not-found-heading">
          <div class="case-study-not-found__container">
            <span class="case-study-not-found__eyebrow">404 // CASE STUDY</span>
            <h1 class="case-study-not-found__title" id="not-found-heading">Project Not Found</h1>
            <p class="case-study-not-found__text">
              The project case study for <code>${safeSlug}</code> does not exist or may have been relocated.
            </p>
            <div class="case-study-not-found__action">
              <a href="/projects" class="case-study__back-btn">
                ← Return to All Projects
              </a>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  /**
   * Renders the complete Case Study Template HTML
   * @returns {string}
   */
  renderHTML() {
    if (!this.project) {
      return this.renderNotFoundHTML();
    }

    const p = this.project;
    const safeTitle = escapeHTML(p.title);
    const safeTagline = p.tagline ? escapeHTML(p.tagline) : '';
    const safeCategory = p.category ? escapeHTML(p.category) : '';

    // Action buttons (only when links exist)
    const actionButtons = [];
    if (p.links && p.links.live) {
      actionButtons.push(`
        <a href="${escapeHTML(p.links.live)}" target="_blank" rel="noopener noreferrer" class="case-study__action-btn case-study__action-btn--primary" aria-label="Visit ${safeTitle} live website (opens in new tab)">
          <span>Visit Live Site</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3.5 1.5H10.5V8.5M10.5 1.5L1.5 10.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      `);
    }
    if (p.links && p.links.repository) {
      actionButtons.push(`
        <a href="${escapeHTML(p.links.repository)}" target="_blank" rel="noopener noreferrer" class="case-study__action-btn case-study__action-btn--secondary" aria-label="View ${safeTitle} repository (opens in new tab)">
          <span>Repository</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3.5 1.5H10.5V8.5M10.5 1.5L1.5 10.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      `);
    }

    const actionsMarkup = actionButtons.length > 0
      ? `<div class="case-study__hero-actions">${actionButtons.join('')}</div>`
      : '';

    // Hero Visual
    const heroVisualMarkup = this.renderHeroVisual(p);

    // Verified Metadata Rail
    const metadataRailMarkup = this.renderMetadataRail(p);

    // Content sections - rendered ONLY when corresponding data exists
    const sectionsMarkup = [];

    // Description / Story
    const descText = p.fullDescription || p.shortDescription || '';
    if (descText) {
      sectionsMarkup.push(`
        <section class="case-study__section" aria-labelledby="cs-desc-heading">
          <div class="case-study__section-header">
            <span class="case-study__section-eyebrow">OVERVIEW</span>
            <h2 class="case-study__section-title" id="cs-desc-heading">Project Overview</h2>
          </div>
          <p class="case-study__section-body">${escapeHTML(descText)}</p>
        </section>
      `);
    }

    // Problem Section
    if (p.problem) {
      sectionsMarkup.push(`
        <section class="case-study__section" aria-labelledby="cs-problem-heading">
          <div class="case-study__section-header">
            <span class="case-study__section-eyebrow">CHALLENGE</span>
            <h2 class="case-study__section-title" id="cs-problem-heading">The Problem</h2>
          </div>
          <p class="case-study__section-body">${escapeHTML(p.problem)}</p>
        </section>
      `);
    }

    // Solution Section
    if (p.solution) {
      sectionsMarkup.push(`
        <section class="case-study__section" aria-labelledby="cs-solution-heading">
          <div class="case-study__section-header">
            <span class="case-study__section-eyebrow">APPROACH</span>
            <h2 class="case-study__section-title" id="cs-solution-heading">The Solution</h2>
          </div>
          <p class="case-study__section-body">${escapeHTML(p.solution)}</p>
        </section>
      `);
    }

    // Visual Evidence / Screenshot Gallery Section (Phase 09)
    const galleryMarkup = createProjectGallery(p);
    if (galleryMarkup) {
      sectionsMarkup.push(galleryMarkup);
    }

    // Features Section
    if (Array.isArray(p.features) && p.features.length > 0) {
      const featuresItems = p.features.map((feat) => `
        <li class="case-study__feature-item">
          <span class="case-study__feature-bullet" aria-hidden="true">✦</span>
          <span>${escapeHTML(feat)}</span>
        </li>
      `).join('');

      sectionsMarkup.push(`
        <section class="case-study__section" aria-labelledby="cs-features-heading">
          <div class="case-study__section-header">
            <span class="case-study__section-eyebrow">CAPABILITIES</span>
            <h2 class="case-study__section-title" id="cs-features-heading">Key Features</h2>
          </div>
          <ul class="case-study__features-list">
            ${featuresItems}
          </ul>
        </section>
      `);
    }

    // Technology Stack Section (Phase 10)
    const techStackMarkup = createTechnologyStack(p);
    if (techStackMarkup) {
      sectionsMarkup.push(techStackMarkup);
    }

    // System Architecture Section (Phase 11)
    const archMarkup = createSystemArchitecture(p);
    if (archMarkup) {
      sectionsMarkup.push(archMarkup);
    }

    // Development & Contribution Section (Phase 12)
    const contribMarkup = createProjectContribution(p);
    if (contribMarkup) {
      sectionsMarkup.push(contribMarkup);
    }

    // Results & Impact Section (Phase 13)
    const resultsMarkup = createProjectResults(p);
    if (resultsMarkup) {
      sectionsMarkup.push(resultsMarkup);
    }

    const contentSectionsMarkup = sectionsMarkup.length > 0
      ? `<div class="case-study__sections">${sectionsMarkup.join('')}</div>`
      : '';

    // Next Project Pagination
    const paginationMarkup = this.renderPagination(p);

    return `
      <div class="case-study-page" id="case-study-page">
        <!-- Breadcrumb / Back Link -->
        <nav class="case-study__nav" aria-label="Breadcrumb">
          <a href="/projects" class="case-study__back-link">
            <svg class="case-study__back-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 12L6 8l4-4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Back to Projects</span>
          </a>
        </nav>

        <!-- Case Study Hero -->
        <header class="case-study__hero" aria-labelledby="case-study-title">
          <div class="case-study__hero-content">
            ${safeCategory ? `<span class="case-study__category-badge">${safeCategory}</span>` : ''}
            <h1 class="case-study__title" id="case-study-title">${safeTitle}</h1>
            ${safeTagline ? `<p class="case-study__tagline">${safeTagline}</p>` : ''}
            ${actionsMarkup}
          </div>

          ${heroVisualMarkup}
        </header>

        <!-- Verified Metadata Rail -->
        ${metadataRailMarkup}

        <!-- Editorial Content Sections -->
        ${contentSectionsMarkup}

        <!-- Next Project Pagination -->
        ${paginationMarkup}
      </div>
    `;
  }

  /**
   * Mounts the Case Study template into the target container
   */
  mount(container = null) {
    const parent = container || this.target;
    if (!parent) return null;

    const existing = document.getElementById('case-study-page');
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }

    const temp = document.createElement('div');
    temp.innerHTML = this.renderHTML().trim();
    this.pageEl = temp.firstElementChild;
    parent.appendChild(this.pageEl);

    // Initialize interactive behaviors (e.g. accessible gallery lightbox & 3D canvas)
    this._cleanupGallery = initGalleryInteractions(this.pageEl);
    this._cleanup3D = initProject3D(this.pageEl, this.project);

    // Apply route-specific SEO metadata
    updateProjectCaseStudySEO(this.project, this.slug);

    return this.pageEl;
  }

  /**
   * Cleans up the mounted page element
   */
  destroy() {
    if (typeof this._cleanupGallery === 'function') {
      this._cleanupGallery();
      this._cleanupGallery = null;
    }
    if (typeof this._cleanup3D === 'function') {
      this._cleanup3D();
      this._cleanup3D = null;
    }
    if (this.pageEl && this.pageEl.parentNode) {
      this.pageEl.parentNode.removeChild(this.pageEl);
    }
    this.pageEl = null;
  }
}

/**
 * Factory function to instantiate and mount ProjectCaseStudyPage
 * @param {object} options
 * @returns {ProjectCaseStudyPage}
 */
export function initProjectCaseStudyPage(options = {}) {
  const page = new ProjectCaseStudyPage(options);
  page.mount();
  return page;
}

export default ProjectCaseStudyPage;
