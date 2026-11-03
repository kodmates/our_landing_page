/**
 * BlogFilters Component
 * Category filtering pills with live article counts, responsive search input,
 * and sort dropdown matching the reference design.
 * Clean, professional, and accessible with zero duplicate labels.
 */

import { BLOG_CATEGORIES, getCategoryCounts } from '../../data/blog/index.js';

export function createBlogFilters({ 
  activeCategory = 'All', 
  searchValue = '', 
  sortBy = 'latest',
  showSearchBar = true,
  count = 0 
} = {}) {
  const counts = getCategoryCounts();

  const categoryPills = BLOG_CATEGORIES.map((cat) => {
    const isActive = cat.toLowerCase() === activeCategory.toLowerCase();
    const activeClass = isActive ? 'blog-filter-btn is-active' : 'blog-filter-btn';
    const ariaPressed = isActive ? 'true' : 'false';
    const catCount = counts[cat] ?? 0;

    return `
      <button 
        type="button" 
        class="${activeClass}" 
        data-blog-category="${cat}" 
        aria-pressed="${ariaPressed}"
      >
        <span class="blog-filter-name">${cat}</span>
        <span class="blog-filter-count">(${catCount})</span>
      </button>
    `;
  }).join('');

  return `
    <div class="blog-filters-toolbar" role="search" aria-label="Filter blog articles">
      ${showSearchBar ? `
        <div class="blog-search-sort-row">
          <div class="blog-filters-search-wrapper">
            <div class="blog-search-input-box">
              <svg class="blog-search-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="9" cy="9" r="6" stroke="#FEEFB8" stroke-width="1.6"/>
                <path d="M13.5 13.5L17.5 17.5" stroke="#FEEFB8" stroke-width="1.6" stroke-linecap="round"/>
              </svg>
              <input 
                type="search" 
                id="blog-search-input" 
                class="blog-search-input" 
                aria-label="Search articles by title, topic, or keyword"
                placeholder="Search articles by title, topic, or keyword..." 
                value="${searchValue}"
                autocomplete="off"
                spellcheck="false"
              />
              ${searchValue ? `
                <button type="button" class="blog-search-clear-btn" id="blog-search-clear" aria-label="Clear search">
                  ×
                </button>
              ` : ''}
            </div>
          </div>

          <div class="blog-sort-wrapper">
            <label for="blog-sort-select" class="blog-sort-label">Sort by</label>
            <div class="blog-sort-select-box">
              <select id="blog-sort-select" class="blog-sort-select" aria-label="Sort articles">
                <option value="latest" ${sortBy === 'latest' ? 'selected' : ''}>Latest</option>
                <option value="oldest" ${sortBy === 'oldest' ? 'selected' : ''}>Oldest</option>
                <option value="readtime" ${sortBy === 'readtime' ? 'selected' : ''}>Read Time</option>
              </select>
              <svg class="blog-sort-chevron" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M4 6L8 10L12 6" stroke="#FEEFB8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      ` : ''}

      <div class="blog-categories-scroll" tabindex="0" role="region" aria-label="Filter by category">
        <div class="blog-categories-track">
          ${categoryPills}
        </div>
      </div>
    </div>
  `;
}
