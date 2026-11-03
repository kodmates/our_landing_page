/**
 * BlogArticlePage Component
 * Client-First Optimization:
 * Implements the reference editorial reading layout:
 * - Breadcrumbs: Blog > Category > Title
 * - Hero with category, read time, title, summary, author bar + share icons,
 *   and reusable isometric technical illustration on the right.
 * - Sticky Table of Contents sidebar with "ON THIS PAGE" and active pill highlighting.
 * - Article content with styled code blocks, tables, callouts, and process diagrams.
 * - Contextual engineering inquiry CTAs linking to Contact.
 * - Related articles at the bottom.
 */

import { getArticleBySlug, getRelatedArticles } from '../data/blog/index.js';
import { createBlogCard } from '../components/blog/BlogCard.js';
import { updateArticleSEO } from '../components/blog/BlogSEO.js';
import { createHeroIsometricIllustration } from '../components/blog/TechnicalIllustrations.js';

export class BlogArticlePage {
  constructor(options = {}) {
    this.target = options.target || document.getElementById('main-content');
    this.slug = options.slug || '';
    this.article = options.article || getArticleBySlug(this.slug);
    this.pageEl = null;
    this._observer = null;
  }

  renderHTML() {
    if (!this.article) {
      return `
        <div class="blog-not-found" id="blog-article-page">
          <div class="blog-not-found__card">
            <span class="blog-not-found__eyebrow">ARTICLE NOT FOUND</span>
            <h1 class="blog-not-found__title">Publication Unavailable</h1>
            <p class="blog-not-found__desc">
              The article you are looking for may have been moved, renamed, or is currently under revision.
            </p>
            <a href="/blog" class="cta-button" id="blog-back-btn">
              <span>← Back to All Articles</span>
            </a>
          </div>
        </div>
      `;
    }

    const formattedDate = new Date(this.article.publishedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    // Table of contents
    const tocItems = (this.article.sections || []).map((sec, idx) => `
      <li class="article-toc__item">
        <a href="#${sec.id}" class="article-toc__link ${idx === 0 ? 'is-active' : ''}" data-toc-target="${sec.id}">
          <span class="toc-number">${idx + 1}.</span>
          <span class="toc-text">${sec.title.replace(/^\d+\.\s*/, '')}</span>
        </a>
      </li>
    `).join('');

    // Article body sections
    const sectionsMarkup = (this.article.sections || []).map((sec) => `
      <section class="article-section" id="${sec.id}">
        <h2 class="article-section__title">${sec.title}</h2>
        <div class="article-section__content">
          ${sec.content}
        </div>
      </section>
    `).join('');

    // Tags
    const tagsMarkup = (this.article.tags || []).map((tag) => `
      <span class="article-tag-item">#${tag}</span>
    `).join('');

    // Related articles
    const related = getRelatedArticles(this.article.slug, this.article.category, 2);
    const relatedCardsMarkup = related.map((art) => createBlogCard(art)).join('');

    return `
      <div class="blog-article-page" id="blog-article-page">
        <!-- Top Breadcrumbs -->
        <div class="article-top-bar">
          <div class="article-top-bar__container">
            <nav class="article-breadcrumbs" aria-label="Breadcrumbs">
              <a href="/blog" class="breadcrumb-link">Blog</a>
              <span class="breadcrumb-sep" aria-hidden="true">&gt;</span>
              <a href="/blog?category=${encodeURIComponent(this.article.category)}" class="breadcrumb-link" data-blog-category="${this.article.category}">
                ${this.article.category}
              </a>
              <span class="breadcrumb-sep" aria-hidden="true">&gt;</span>
              <span class="breadcrumb-current">${this.article.title}</span>
            </nav>
          </div>
        </div>

        <!-- Article Header Hero matching Reference Layout -->
        <header class="article-header">
          <div class="article-header__container">
            <div class="article-header__content-col">
              <div class="article-header__meta-top">
                <span class="blog-category-tag">${(this.article.category || 'Web Development').toUpperCase()}</span>
                <span class="article-meta-sep" aria-hidden="true">•</span>
                <span class="article-header__read-time">${(this.article.readTime || '10 min read').toUpperCase()}</span>
              </div>

              <h1 class="article-header__title">
                ${this.article.title}
              </h1>

              <p class="article-header__summary">
                ${this.article.summary}
              </p>

              <!-- Author Info & Social Share Bar -->
              <div class="article-author-bar">
                <div class="article-author-block">
                  <div class="article-author-avatar" aria-hidden="true">KM</div>
                  <div class="article-author-details">
                    <span class="article-author-name">${this.article.author?.name || 'KodMates Technical Team'}</span>
                    <span class="article-author-date">${formattedDate}</span>
                  </div>
                </div>

                <div class="article-share-actions" aria-label="Share article">
                  <button type="button" class="article-share-btn" id="article-copy-link-btn" title="Copy article link" aria-label="Copy link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#FEEFB8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                  </button>
                  <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(this.article.title)}&url=${encodeURIComponent(window.location.href)}" target="_blank" rel="noopener noreferrer" class="article-share-btn" title="Share on X" aria-label="Share on X">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#FEEFB8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
                      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}" target="_blank" rel="noopener noreferrer" class="article-share-btn" title="Share on LinkedIn" aria-label="Share on LinkedIn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#FEEFB8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect x="2" y="9" width="4" height="12"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <!-- Header Visual Illustration Column -->
            <div class="article-header__visual-col">
              ${createHeroIsometricIllustration()}
            </div>
          </div>
        </header>

        <!-- Main Content Area with Sticky TOC Sidebar and Article Body -->
        <div class="article-layout-container">
          <div class="article-layout-grid">
            <!-- Sidebar: Table of Contents -->
            <aside class="article-sidebar" aria-label="Table of Contents">
              <div class="article-sidebar__sticky">
                <div class="article-toc-box">
                  <span class="article-toc__heading">ON THIS PAGE</span>
                  <nav aria-label="In this article">
                    <ul class="article-toc__list">
                      ${tocItems}
                    </ul>
                  </nav>
                </div>

                <div class="article-sidebar-cta">
                  <span class="sidebar-cta__eyebrow">TECHNICAL INQUIRY</span>
                  <p class="sidebar-cta__text">Evaluating this architecture for your application stack?</p>
                  <a href="/contact" class="sidebar-cta__btn">Discuss Your Architecture →</a>
                </div>
              </div>
            </aside>

            <!-- Main Editorial Body -->
            <main class="article-main-body">
              <div class="article-content">
                ${sectionsMarkup}
              </div>

              <!-- Tags Row -->
              <div class="article-tags-wrapper" aria-label="Article Tags">
                <span class="article-tags-label">Categorized under:</span>
                <div class="article-tags-list">
                  ${tagsMarkup}
                </div>
              </div>

              <!-- Post Article Action / Consultation Banner -->
              <section class="article-end-cta" aria-label="Consultation Call to Action">
                <div class="article-end-cta__inner">
                  <div class="article-end-cta__content">
                    <span class="article-end-cta__eyebrow">ENGINEERING COLLABORATION</span>
                    <h3 class="article-end-cta__title">Building software that demands this level of discipline?</h3>
                    <p class="article-end-cta__desc">
                      Whether you are planning a mission-critical web platform, designing APIs, or refining database architecture, KodMates engineers can partner with your team from initial scoping through production launch.
                    </p>
                  </div>
                  <div class="article-end-cta__actions">
                    <a href="/contact" class="cta-button" id="article-contact-cta">
                      <span>Start a Project Discussion</span>
                      <span class="cta-arrow" aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>

        <!-- Related Technical Insights -->
        ${related.length > 0 ? `
          <section class="article-related-section" aria-label="Related Publications">
            <div class="article-related__container">
              <div class="article-related__header">
                <span class="blog-section-eyebrow">FURTHER READING</span>
                <h2 class="blog-section-title">Related Technical Insights</h2>
              </div>
              <div class="blog-grid blog-grid--related">
                ${relatedCardsMarkup}
              </div>
            </div>
          </section>
        ` : ''}
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

    if (this.article) {
      updateArticleSEO(this.article);
    }
    this.bindEvents();
    window.scrollTo({ top: 0, behavior: 'instant' });
    return this.pageEl;
  }

  bindEvents() {
    if (!this.pageEl) return;

    // Copy link button
    const copyLinkBtn = this.pageEl.querySelector('#article-copy-link-btn');
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          copyLinkBtn.classList.add('is-copied');
          setTimeout(() => copyLinkBtn.classList.remove('is-copied'), 2000);
        } catch {
          // Fallback
        }
      });
    }

    // Code copy buttons insertion
    const codeBlocks = this.pageEl.querySelectorAll('pre.code-block');
    codeBlocks.forEach((block) => {
      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'code-copy-btn';
      copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
      copyBtn.innerHTML = `
        <span class="copy-icon">⧉</span>
        <span class="copy-text">Copy</span>
      `;

      copyBtn.addEventListener('click', async () => {
        const code = block.querySelector('code')?.innerText || block.innerText;
        try {
          await navigator.clipboard.writeText(code);
          copyBtn.classList.add('is-copied');
          copyBtn.querySelector('.copy-text').textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.classList.remove('is-copied');
            copyBtn.querySelector('.copy-text').textContent = 'Copy';
          }, 2000);
        } catch {
          copyBtn.querySelector('.copy-text').textContent = 'Copied';
        }
      });

      block.style.position = 'relative';
      block.appendChild(copyBtn);
    });

    // Active TOC Spy via IntersectionObserver
    const sections = this.pageEl.querySelectorAll('.article-section');
    const tocLinks = this.pageEl.querySelectorAll('.article-toc__link');

    if (sections.length > 0 && tocLinks.length > 0 && 'IntersectionObserver' in window) {
      this._observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            tocLinks.forEach((link) => {
              const matches = link.getAttribute('data-toc-target') === id;
              link.classList.toggle('is-active', matches);
            });
          }
        });
      }, {
        rootMargin: '-10% 0px -70% 0px'
      });

      sections.forEach((sec) => this._observer.observe(sec));
    }
  }

  destroy() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    if (this.pageEl && this.pageEl.parentNode) {
      this.pageEl.parentNode.removeChild(this.pageEl);
    }
    this.pageEl = null;
  }
}

export function initBlogArticlePage(options = {}) {
  const page = new BlogArticlePage(options);
  page.mount();
  return page;
}
