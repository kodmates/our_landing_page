/**
 * Central Blog Content Registry & Utility Functions
 * Supports category management, article lookup, reading time calculation,
 * related article recommendations, and search filtering.
 */

import { webAppPlanningArticle } from './articles/web-app-planning.js';
import { restApisGuideArticle } from './articles/rest-apis-guide.js';
import { databaseDesignMistakesArticle } from './articles/database-design-mistakes.js';
import { websiteVsWebAppArticle } from './articles/website-vs-web-app.js';
import { androidDevelopmentGuideArticle } from './articles/android-development-guide.js';

/**
 * Standardized KodMates Blog Categories matching active engineering publications
 */
export const BLOG_CATEGORIES = [
  'All',
  'Web Development',
  'APIs & Backend',
  'Databases',
  'Software Engineering',
  'Android Development'
];

/**
 * Registry of all published blog articles
 */
export const BLOG_ARTICLES = [
  webAppPlanningArticle,
  restApisGuideArticle,
  databaseDesignMistakesArticle,
  websiteVsWebAppArticle,
  androidDevelopmentGuideArticle
];

/**
 * Retrieves all articles sorted by publication date (newest first)
 */
export function getAllArticles() {
  return [...BLOG_ARTICLES].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

/**
 * Retrieves a single article by its URL slug
 * @param {string} slug
 * @returns {object|null}
 */
export function getArticleBySlug(slug) {
  if (!slug) return null;
  const normalized = slug.trim().toLowerCase();
  return BLOG_ARTICLES.find((art) => art.slug.toLowerCase() === normalized) || null;
}

/**
 * Retrieves the featured article (or first article as fallback)
 */
export function getFeaturedArticle() {
  const featured = BLOG_ARTICLES.find((art) => Boolean(art.featured));
  return featured || BLOG_ARTICLES[0] || null;
}

/**
 * Computes article counts per category
 */
export function getCategoryCounts() {
  const counts = { All: BLOG_ARTICLES.length };
  BLOG_CATEGORIES.forEach((cat) => {
    if (cat !== 'All') {
      counts[cat] = BLOG_ARTICLES.filter((a) => (a.category || '').toLowerCase() === cat.toLowerCase()).length;
    }
  });
  return counts;
}

/**
 * Recommends related articles based on category match, excluding current article
 * @param {string} currentSlug
 * @param {string} category
 * @param {number} limit
 * @returns {Array<object>}
 */
export function getRelatedArticles(currentSlug, category, limit = 2) {
  return BLOG_ARTICLES
    .filter((art) => art.slug !== currentSlug)
    .sort((a, b) => {
      // Prioritize same category match
      const aSame = a.category === category ? 1 : 0;
      const bSame = b.category === category ? 1 : 0;
      return bSame - aSame;
    })
    .slice(0, limit);
}

/**
 * Filters articles by category and search keyword
 * @param {Array<object>} articles
 * @param {object} options
 * @param {string} options.category
 * @param {string} options.search
 * @returns {Array<object>}
 */
export function filterArticles(articles = BLOG_ARTICLES, { category = 'All', search = '' } = {}) {
  let results = [...articles];

  // Category filter
  if (category && category !== 'All') {
    const targetCat = category.toLowerCase();
    results = results.filter((art) => (art.category || '').toLowerCase() === targetCat);
  }

  // Search keyword filter (title, summary, tags, author name, sections)
  if (search && search.trim().length > 0) {
    const term = search.trim().toLowerCase();
    results = results.filter((art) => {
      const matchTitle = (art.title || '').toLowerCase().includes(term);
      const matchSummary = (art.summary || '').toLowerCase().includes(term);
      const matchCategory = (art.category || '').toLowerCase().includes(term);
      const matchTags = (art.tags || []).some((tag) => tag.toLowerCase().includes(term));
      const matchAuthor = (art.author?.name || '').toLowerCase().includes(term);
      return matchTitle || matchSummary || matchCategory || matchTags || matchAuthor;
    });
  }

  return results.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}
