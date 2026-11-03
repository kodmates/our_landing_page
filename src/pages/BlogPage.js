/**
 * BlogPage Component
 * Orchestrates:
 * 1. View 1 (Main Blog Listing Page):
 *    - Editorial Hero with "Ideas That Move Technology Forward." & 4 Publication Benefits
 *    - Search input and Sort dropdown
 *    - Category Filter Pills
 *    - Featured Article with technical illustration on right
 *    - Latest Engineering Guides section with balanced responsive grid
 *    - Bottom Technical Question CTA
 * 2. View 3 (Category-Filtered Topic Listing):
 *    - "BROWSE BY TOPIC" header with gold wave background & inline search
 *    - Category Filter Pills
 *    - Matching article cards grid
 *    - Bottom Technical Question CTA
 */

import { getAllArticles, filterArticles, getFeaturedArticle } from '../data/blog/index.js';
import { createBlogHero, createTopicHero } from '../components/blog/BlogHero.js';
import { createFeaturedArticle } from '../components/blog/FeaturedArticle.js';
import { createBlogFilters } from '../components/blog/BlogFilters.js';
import { createBlogCard } from '../components/blog/BlogCard.js';
import { updateBlogListingSEO } from '../components/blog/BlogSEO.js';

export class BlogPage {
  constructor(options = {}) {
    this.target = options.target || document.getElementById('main-content');
    this.pageEl = null;
    
    // Check URL search parameters or hash for initial category
    const urlParams = new URLSearchParams(window.location.search);
    const initialCat = options.category || urlParams.get('category') || 'All';

    this.activeCategory = initialCat;
    this.searchQuery = options.search || urlParams.get('search') || '';
    this.sortBy = 'latest';
    this.allArticles = getAllArticles();
    this.featuredArticle = getFeaturedArticle();

    this._handleCategoryClick = this._handleCategoryClick.bind(this);
    this._handleSearchInput = this._handleSearchInput.bind(this);
    this._handleSearchClear = this._handleSearchClear.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);
  }

  getFilteredList() {
    let list = filterArticles(this.allArticles, {
      category: this.activeCategory,
      search: this.searchQuery
    });

    // Apply sorting
    if (this.sortBy === 'oldest') {
      list = [...list].sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
    } else if (this.sortBy === 'readtime') {
      const getMins = (str) => parseInt(str || '5', 10) || 5;
      list = [...list].sort((a, b) => getMins(b.readTime) - getMins(a.readTime));
    } else {
      // Default: latest first
      list = [...list].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    }

    return list;
  }

  renderHTML() {
    const isCategoryView = this.activeCategory !== 'All';
    const isDefaultView = !this.searchQuery && !isCategoryView;

    // Header Hero: Editorial Hero (View 1) vs Topic Hero (View 3)
    const heroMarkup = isCategoryView
      ? createTopicHero({ category: this.activeCategory, searchValue: this.searchQuery })
      : createBlogHero();

    // Featured Article (only rendered on main default view)
    const featuredMarkup = (isDefaultView && this.featuredArticle)
      ? createFeaturedArticle(this.featuredArticle)
      : '';

    const filtered = this.getFilteredList();

    // Standard grid articles: exclude featured card if default view to avoid duplicate
    const gridArticles = (isDefaultView && this.featuredArticle)
      ? filtered.filter((art) => art.slug !== this.featuredArticle.slug)
      : filtered;

    const filtersMarkup = createBlogFilters({
      activeCategory: this.activeCategory,
      searchValue: this.searchQuery,
      sortBy: this.sortBy,
      showSearchBar: !isCategoryView, // Topic hero has its own inline search
      count: filtered.length
    });

    const cardsMarkup = gridArticles.length > 0
      ? gridArticles.map((art) => createBlogCard(art)).join('')
      : `
        <div class="blog-empty-state" role="status">
          <div class="blog-empty-state__icon" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="20" stroke="#FEEFB8" stroke-width="1.8" stroke-dasharray="3 4"/>
              <path d="M18 24H30M24 18V30" stroke="#FEEFB8" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </div>
          <h3 class="blog-empty-state__title">No articles found</h3>
          <p class="blog-empty-state__desc">
            No engineering publications matched the query "${this.searchQuery || this.activeCategory}". Try adjusting your keywords or clearing the category filter.
          </p>
          <button type="button" class="cta-button blog-empty-state__reset" id="blog-reset-filters-btn">
            Reset Filters
          </button>
        </div>
      `;

    return `
      <div class="blog-page ${isCategoryView ? 'blog-page--category-view' : ''}" id="blog-page">
        ${heroMarkup}
        
        <div class="blog-page__container">
          <!-- Search & Filters Toolbar (Positioned directly above featured guide matching reference) -->
          <div id="blog-filters-container" class="blog-filters-container">
            ${filtersMarkup}
          </div>

          <!-- Featured Article Banner (Only on default view) -->
          ${featuredMarkup}
          
          <!-- Latest Engineering Guides Section -->
          <section class="blog-listing-section" aria-label="Engineering Articles">
            <div class="blog-listing-section__header" style="${(!isDefaultView && !this.searchQuery) ? 'display:none;' : ''}">
              <div class="blog-listing-section__title-group">
                <h2 class="blog-section-title">
                  <span class="blog-section-title__accent" aria-hidden="true">&#9654;</span>
                  ${isDefaultView ? 'Latest Engineering Guides' : `Matching Articles (${gridArticles.length})`}
                </h2>
              </div>
            </div>

            <div class="blog-grid" id="blog-grid" role="region" aria-label="Articles list">
              ${cardsMarkup}
            </div>
          </section>

          <!-- Bottom Technical Question / Project Discussion CTA matching Reference -->
          <section class="blog-advisory-cta" aria-label="Technical Consultation">
            <div class="blog-advisory-cta__card">
              <div class="blog-advisory-cta__text">
                <h3 class="blog-advisory-title">Have a Technical Question or a Project in Mind?</h3>
                <p class="blog-advisory-desc">
                  Discuss your requirements with our engineering team and get practical guidance for your specific use case.
                </p>
              </div>
              <div class="blog-advisory-cta__action">
                <a href="/contact" class="cta-button" id="blog-consult-cta">
                  <span>Start a Discussion</span>
                  <span class="cta-arrow" aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    `;
  }

  mount() {
    this.destroy();

    const temp = document.createElement('div');
    temp.innerHTML = this.renderHTML().trim();
    this.pageEl = temp.firstElementChild;

    if (this.target) {
      this.target.appendChild(this.pageEl);
    }

    this.bindEvents();
    updateBlogListingSEO();
    window.scrollTo({ top: 0, behavior: 'instant' });
    return this.pageEl;
  }

  bindEvents() {
    if (!this.pageEl) return;

    // Category pills click delegation
    this.pageEl.addEventListener('click', this._handleCategoryClick);

    // Live search input
    const searchInput = this.pageEl.querySelector('#blog-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', this._handleSearchInput);
    }

    // Clear search button
    const clearBtn = this.pageEl.querySelector('#blog-search-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', this._handleSearchClear);
    }

    // Sort select change
    const sortSelect = this.pageEl.querySelector('#blog-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', this._handleSortChange);
    }

    // Reset filters button in empty state
    const resetBtn = this.pageEl.querySelector('#blog-reset-filters-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.activeCategory = 'All';
        this.searchQuery = '';
        this.sortBy = 'latest';
        this.updateURL();
        this.reRenderPage();
      });
    }
  }

  _handleCategoryClick(e) {
    const btn = e.target.closest('[data-blog-category]');
    if (!btn) return;

    const selectedCategory = btn.getAttribute('data-blog-category');
    if (!selectedCategory || selectedCategory === this.activeCategory) return;

    this.activeCategory = selectedCategory;
    this.updateURL();
    this.reRenderPage();
  }

  _handleSearchInput(e) {
    this.searchQuery = e.target.value;
    this.updateGridOnly();
  }

  _handleSearchClear() {
    this.searchQuery = '';
    const searchInput = this.pageEl?.querySelector('#blog-search-input');
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
    this.updateGridOnly();
  }

  _handleSortChange(e) {
    this.sortBy = e.target.value;
    this.updateGridOnly();
  }

  updateURL() {
    const params = new URLSearchParams();
    if (this.activeCategory && this.activeCategory !== 'All') {
      params.set('category', this.activeCategory);
    }
    if (this.searchQuery) {
      params.set('search', this.searchQuery);
    }
    const queryString = params.toString();
    const newPath = queryString ? `/blog?${queryString}` : '/blog';
    window.history.replaceState({}, '', newPath);
  }

  reRenderPage() {
    const newTemp = document.createElement('div');
    newTemp.innerHTML = this.renderHTML().trim();
    const newEl = newTemp.firstElementChild;

    if (this.pageEl && this.pageEl.parentNode) {
      this.pageEl.parentNode.replaceChild(newEl, this.pageEl);
      this.pageEl = newEl;
      this.bindEvents();
    }
  }

  updateGridOnly() {
    if (!this.pageEl) return;

    const isCategoryView = this.activeCategory !== 'All';
    const isDefaultView = !this.searchQuery && !isCategoryView;
    const filtered = this.getFilteredList();

    const gridArticles = (isDefaultView && this.featuredArticle)
      ? filtered.filter((art) => art.slug !== this.featuredArticle.slug)
      : filtered;

    // Toggle featured section visibility
    const featuredEl = this.pageEl.querySelector('.blog-featured');
    if (featuredEl) {
      featuredEl.style.display = isDefaultView ? '' : 'none';
    }

    // Toggle section header title
    const sectionHeader = this.pageEl.querySelector('.blog-listing-section__header');
    if (sectionHeader) {
      sectionHeader.style.display = (isDefaultView || this.searchQuery) ? '' : 'none';
      const titleText = sectionHeader.querySelector('.blog-section-title');
      if (titleText) {
        titleText.innerHTML = `
          <span class="blog-section-title__accent" aria-hidden="true">&#9654;</span>
          ${isDefaultView ? 'Latest Engineering Guides' : `Matching Articles (${gridArticles.length})`}
        `;
      }
    }

    const grid = this.pageEl.querySelector('#blog-grid');
    if (grid) {
      if (gridArticles.length > 0) {
        grid.innerHTML = gridArticles.map((art) => createBlogCard(art)).join('');
      } else {
        grid.innerHTML = `
          <div class="blog-empty-state" role="status">
            <div class="blog-empty-state__icon" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="20" stroke="#FEEFB8" stroke-width="1.8" stroke-dasharray="3 4"/>
                <path d="M18 24H30M24 18V30" stroke="#FEEFB8" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </div>
            <h3 class="blog-empty-state__title">No articles found</h3>
            <p class="blog-empty-state__desc">
              No engineering publications matched the query "${this.searchQuery || this.activeCategory}". Try adjusting your keywords or clearing the category filter.
            </p>
            <button type="button" class="cta-button blog-empty-state__reset" id="blog-reset-filters-btn">
              Reset Filters
            </button>
          </div>
        `;
        const resetBtn = grid.querySelector('#blog-reset-filters-btn');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            this.activeCategory = 'All';
            this.searchQuery = '';
            this.sortBy = 'latest';
            this.updateURL();
            this.reRenderPage();
          });
        }
      }
    }
  }

  destroy() {
    if (this.pageEl && this.pageEl.parentNode) {
      this.pageEl.parentNode.removeChild(this.pageEl);
    }
    this.pageEl = null;
  }
}

export function initBlogPage(options = {}) {
  const page = new BlogPage(options);
  page.mount();
  return page;
}
