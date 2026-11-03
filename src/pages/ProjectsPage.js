import projects from '../data/projects/index.js';
import { createProjectCard } from '../components/projects/ProjectCard.js';
import { createProjectFilters, getCategories } from '../components/projects/ProjectFilters.js';
import { createFeaturedSection } from '../components/projects/FeaturedProject.js';
import { updateProjectsListingSEO } from '../components/projects/ProjectSEO.js';

/**
 * ProjectsPage Component (Phases 03, 04, 05, 06)
 * Renders the compact hero, featured project highlight, data-driven filters,
 * and dynamic project listing. Consumes the central project registry dynamically.
 */
export class ProjectsPage {
  constructor(options = {}) {
    this.target = options.target || document.getElementById('main-content');
    this.pageEl = null;
    this.activeCategory = 'All';
    this.categories = getCategories(projects);
    // Data-driven featured selection (zero hard-coding)
    this.featuredProjects = projects.filter((p) => Boolean(p.featured));
    this._handleFilterClick = this._handleFilterClick.bind(this);
  }

  /**
   * Filters projects by the active category for the All Projects section
   * @param {string} category
   * @returns {Array<object>}
   */
  getFilteredProjects(category = this.activeCategory) {
    if (!category || category === 'All') {
      return projects;
    }
    const target = category.toLowerCase();
    return projects.filter((p) => (p.category || '').toLowerCase() === target);
  }

  /**
   * Generates semantic HTML for the projects listing page
   */
  renderHTML() {
    // Featured section markup (gracefully renders empty string if 0 featured projects)
    const featuredMarkup = createFeaturedSection(this.featuredProjects);

    // Filter toolbar markup
    const filtersMarkup = createProjectFilters({
      categories: this.categories,
      activeCategory: this.activeCategory
    });

    const filtered = this.getFilteredProjects();
    const cardsMarkup = filtered.length > 0
      ? filtered.map((project) => createProjectCard(project)).join('')
      : `
        <div class="projects-empty" role="status">
          <p class="projects-empty__text">No projects in this category yet.</p>
        </div>
      `;

    return `
      <div class="projects-page" id="projects-page">
        <!-- Compact Page Hero -->
        <header class="projects-hero" aria-labelledby="projects-hero-title">
          <div class="projects-hero__container">
            <div class="projects-hero__eyebrow">SELECTED PORTFOLIO</div>
            <h1 class="projects-hero__title" id="projects-hero-title">
              Selected Work.<br />
              <span class="projects-hero__title-accent">Real Products. Thoughtful Engineering.</span>
            </h1>
            <p class="projects-hero__description">
              Explore production software systems, mobile applications, and digital platforms engineered for real-world operations.
            </p>
          </div>
        </header>

        <!-- Featured Project System (Phase 06) -->
        ${featuredMarkup}

        <!-- All Projects Section -->
        <section class="projects-listing-section" aria-labelledby="projects-listing-heading">
          <div class="projects-listing__container">
            <div class="projects-listing__header">
              <h2 class="projects-listing__title" id="projects-listing-heading">All Projects</h2>
            </div>

            <!-- Data-Driven Category Filters -->
            ${filtersMarkup}

            <!-- Filter Status Announcement for Screen Readers -->
            <div id="projects-filter-status" class="sr-only" role="status" aria-live="polite" aria-atomic="true"></div>

            <!-- Filtered Project Grid -->
            <div class="projects-grid">
              ${cardsMarkup}
            </div>
          </div>
        </section>
      </div>
    `;
  }

  /**
   * Mounts the ProjectsPage into the DOM and binds event listeners
   */
  mount(container = null) {
    const parent = container || this.target;
    if (!parent) return null;

    const existing = document.getElementById('projects-page');
    if (existing) {
      this.pageEl = existing;
      this.bindEvents();
      return this.pageEl;
    }

    const temp = document.createElement('div');
    temp.innerHTML = this.renderHTML().trim();
    this.pageEl = temp.firstElementChild;
    parent.appendChild(this.pageEl);

    this.bindEvents();
    updateProjectsListingSEO();
    return this.pageEl;
  }

  /**
   * Attaches event listeners for category filtering
   */
  bindEvents() {
    if (!this.pageEl) return;
    this._filterButtons = Array.from(this.pageEl.querySelectorAll('.project-filter-btn'));
    this._gridEl = this.pageEl.querySelector('.projects-grid');
    this._statusEl = this.pageEl.querySelector('#projects-filter-status');

    this._filterButtons.forEach((btn) => {
      btn.addEventListener('click', this._handleFilterClick);
    });
  }

  _handleFilterClick(event) {
    const btn = event.currentTarget;
    if (!btn) return;
    const selected = btn.getAttribute('data-filter-category');
    if (selected && selected !== this.activeCategory) {
      this.setCategory(selected);
    }
  }

  /**
   * Updates the active category and re-renders only the All Projects grid
   * The Featured Project highlight remains independently visible
   * @param {string} category
   */
  setCategory(category) {
    this.activeCategory = category;

    // Update filter buttons state using cached node list
    if (this._filterButtons) {
      const lower = category.toLowerCase();
      this._filterButtons.forEach((btn) => {
        const cat = btn.getAttribute('data-filter-category');
        const isActive = cat && cat.toLowerCase() === lower;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    }

    // Update grid with filtered projects using cached grid element
    if (this._gridEl) {
      const filtered = this.getFilteredProjects(category);
      if (filtered.length === 0) {
        this._gridEl.innerHTML = `
          <div class="projects-empty" role="status">
            <p class="projects-empty__text">No projects in this category yet.</p>
          </div>
        `;
        if (this._statusEl) {
          this._statusEl.textContent = `No projects found in category ${category}.`;
        }
      } else {
        this._gridEl.innerHTML = filtered.map((project) => createProjectCard(project)).join('');
        if (this._statusEl) {
          this._statusEl.textContent = `Showing ${filtered.length} ${filtered.length === 1 ? 'project' : 'projects'} in category ${category}.`;
        }
      }
    }
  }

  /**
   * Unmounts and cleans up the ProjectsPage
   */
  destroy() {
    if (this._filterButtons) {
      this._filterButtons.forEach((btn) => {
        btn.removeEventListener('click', this._handleFilterClick);
      });
      this._filterButtons = null;
    }
    this._gridEl = null;
    this._statusEl = null;
    if (this.pageEl && this.pageEl.parentNode) {
      this.pageEl.parentNode.removeChild(this.pageEl);
    }
    this.pageEl = null;
  }
}

export function initProjectsPage(options = {}) {
  const page = new ProjectsPage(options);
  page.mount();
  return page;
}

export default ProjectsPage;
