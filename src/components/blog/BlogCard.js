/**
 * BlogCard Component
 * Implements the exact layout and hierarchy from Reference Image 2:
 * - Top: Category Pill Badge & Reading Time
 * - Center: Reusable Topic Architecture Illustration
 * - Body: Article Title & Summary
 * - Footer: Author Avatar (KM), Name, Date, and "Read Article →"
 */

import { createTopicCardIllustration } from './TechnicalIllustrations.js';

export function createBlogCard(article) {
  if (!article) return '';

  const href = `/blog/${article.slug}`;
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return `
    <article class="blog-card" data-slug="${article.slug}">
      <!-- Top Meta Row (Above Illustration matching Reference Image 2) -->
      <div class="blog-card__header-meta">
        <span class="blog-card__category-badge">${(article.category || 'Engineering').toUpperCase()}</span>
        <span class="blog-card__meta-sep" aria-hidden="true">•</span>
        <span class="blog-card__read-time">${(article.readTime || '5 min read').toUpperCase()}</span>
      </div>

      <!-- Center Technical Illustration -->
      <div class="blog-card__illustration-wrap" aria-hidden="true">
        ${createTopicCardIllustration(article.category, article.slug)}
      </div>

      <!-- Content Body -->
      <div class="blog-card__body">
        <h3 class="blog-card__title">
          <a href="${href}" class="blog-card__link" data-article-slug="${article.slug}">
            ${article.title}
          </a>
        </h3>

        <p class="blog-card__summary">
          ${article.summary}
        </p>

        <!-- Card Footer -->
        <div class="blog-card__footer">
          <div class="blog-card__author-wrap">
            <div class="blog-card__author-avatar" aria-hidden="true">KM</div>
            <div class="blog-card__author-details">
              <span class="blog-card__author">${article.author?.name || 'KodMates Technical Team'}</span>
              <span class="blog-card__date">${formattedDate}</span>
            </div>
          </div>

          <a href="${href}" class="blog-card__cta" aria-label="Read ${article.title}" data-article-slug="${article.slug}">
            <span class="blog-card__cta-text">Read Article</span>
            <span class="cta-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </article>
  `;
}
