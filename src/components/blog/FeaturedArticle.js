/**
 * FeaturedArticle Component
 * Client-First Architecture Guide Feature:
 * Implements reference layout with content on the left, author info and CTA,
 * and a reusable technical illustration on the right.
 */

import { createFeaturedCardIllustration } from './TechnicalIllustrations.js';

export function createFeaturedArticle(article) {
  if (!article) return '';

  const href = `/blog/${article.slug}`;
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return `
    <section class="blog-featured" aria-label="Featured Guide">
      <div class="blog-featured__card">
        <!-- Content Column (Left in Reference) -->
        <div class="blog-featured__content-col">
          <div class="blog-featured__badge-row">
            <span class="blog-featured__guide-badge">FEATURED GUIDE</span>
          </div>

          <div class="blog-featured__meta-row">
            <span class="blog-category-tag">${(article.category || 'Web Development').toUpperCase()}</span>
            <span class="blog-meta-sep" aria-hidden="true">•</span>
            <span class="blog-read-time">${(article.readTime || '10 min read').toUpperCase()}</span>
          </div>

          <h2 class="blog-featured__title">
            <a href="${href}" class="blog-featured__link" data-article-slug="${article.slug}">
              ${article.title}
            </a>
          </h2>

          <p class="blog-featured__summary">
            ${article.summary}
          </p>

          <div class="blog-featured__footer">
            <a href="${href}" class="blog-featured__cta-btn" data-article-slug="${article.slug}">
              <span>Read Full Guide</span>
              <span class="cta-arrow" aria-hidden="true">→</span>
            </a>

            <div class="blog-author-block">
              <div class="blog-author-avatar" aria-hidden="true">KM</div>
              <div class="blog-author-info">
                <span class="blog-author-name">${article.author?.name || 'KodMates Technical Team'}</span>
                <span class="blog-author-date">${formattedDate}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Visual Column (Right in Reference) -->
        <div class="blog-featured__visual-col">
          ${createFeaturedCardIllustration()}
        </div>
      </div>
    </section>
  `;
}
