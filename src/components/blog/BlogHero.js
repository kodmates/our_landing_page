/**
 * BlogHero Component
 * Implements the reference design's editorial hero and category topic header:
 * - View 1: Main editorial hero with headline "Ideas That Move Technology Forward.",
 *   abstract isometric illustration, and 4 publication benefits.
 * - View 3: Category Topic header with "BROWSE BY TOPIC", category headline,
 *   subtle gold wave artwork, and inline search.
 */

import { createHeroIsometricIllustration, createTopicHeaderBackgroundArt } from './TechnicalIllustrations.js';

export function createBlogHero() {
  return `
    <section class="blog-hero" aria-label="Editorial Engineering Publications Header">
      <div class="blog-hero__ambient" aria-hidden="true"></div>
      <div class="blog-hero__container">
        <div class="blog-hero__content">
          <div class="blog-hero__eyebrow">
            ENGINEERING INSIGHTS
          </div>
          <h1 class="blog-hero__title">
            Ideas That Move<br>
            <span class="km-text-gradient">Technology Forward.</span>
          </h1>
          <p class="blog-hero__description">
            In-depth guides, practical tutorials, and architectural insights from our engineering team. Real-world lessons on building scalable web applications, mobile apps, cloud infrastructure, and data systems.
          </p>
        </div>
        
        <div class="blog-hero__visual">
          ${createHeroIsometricIllustration()}
        </div>
      </div>

      <!-- Publication Benefits Row -->
      <div class="blog-hero__benefits-container">
        <div class="blog-publication-benefits" role="region" aria-label="Publication Focus Areas">
          <div class="blog-benefit-card">
            <div class="blog-benefit-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="#FEEFB8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div class="blog-benefit-info">
              <span class="blog-benefit-title">Practical Guides</span>
              <span class="blog-benefit-desc">Real-world examples</span>
            </div>
          </div>

          <div class="blog-benefit-card">
            <div class="blog-benefit-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="#FEEFB8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                <polyline points="2 17 12 22 22 17"/>
                <polyline points="2 12 12 17 22 12"/>
              </svg>
            </div>
            <div class="blog-benefit-info">
              <span class="blog-benefit-title">Architecture &amp; Design</span>
              <span class="blog-benefit-desc">System thinking</span>
            </div>
          </div>

          <div class="blog-benefit-card">
            <div class="blog-benefit-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="#FEEFB8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
              </svg>
            </div>
            <div class="blog-benefit-info">
              <span class="blog-benefit-title">Modern Technologies</span>
              <span class="blog-benefit-desc">Latest tools &amp; practices</span>
            </div>
          </div>

          <div class="blog-benefit-card">
            <div class="blog-benefit-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="#FEEFB8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="blog-benefit-info">
              <span class="blog-benefit-title">Written by Engineers</span>
              <span class="blog-benefit-desc">From our experience</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

/**
 * Topic Hero for Category Listing (View 3 from Reference)
 */
export function createTopicHero({ category = 'Software Engineering', searchValue = '' } = {}) {
  const displayTitle = category.toLowerCase().endsWith('articles') 
    ? category 
    : `${category} Articles`;

  return `
    <section class="blog-topic-hero" aria-label="Topic Header">
      ${createTopicHeaderBackgroundArt()}
      <div class="blog-topic-hero__container">
        <div class="blog-topic-hero__content">
          <span class="blog-topic-hero__eyebrow">BROWSE BY TOPIC</span>
          <h1 class="blog-topic-hero__title">${displayTitle}</h1>
          <p class="blog-topic-hero__desc">
            Explore practical guides, architecture deep dives, and technical best practices.
          </p>
        </div>

        <div class="blog-topic-hero__search">
          <div class="blog-search-input-box">
            <svg class="blog-search-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="9" cy="9" r="6" stroke="#FEEFB8" stroke-width="1.6"/>
              <path d="M13.5 13.5L17.5 17.5" stroke="#FEEFB8" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
            <input 
              type="search" 
              id="blog-search-input" 
              class="blog-search-input" 
              placeholder="Search articles..." 
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
      </div>
    </section>
  `;
}
