/**
 * Blog SEO Management
 * Dynamically updates document title, meta tags, OpenGraph, Canonical URLs,
 * and JSON-LD structured data for Blog listing and individual articles.
 */

const DEFAULT_TITLE = 'Kodmates — Building Digital Systems for the Real World';
const DEFAULT_DESC = 'We design and develop software, web applications, Android apps and business systems that solve real operational problems.';

/**
 * Updates document meta tag or creates it if not present
 */
function setMetaTag(name, content, attribute = 'name') {
  if (!content) return;
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Updates or creates canonical link tag
 */
function setCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

/**
 * Injects or updates Schema.org JSON-LD script tag
 */
function setStructuredData(id, json) {
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(json, null, 2);
}

/**
 * Removes structured data tag
 */
function removeStructuredData(id) {
  const script = document.getElementById(id);
  if (script && script.parentNode) {
    script.parentNode.removeChild(script);
  }
}

/**
 * Updates SEO for Blog Listing Page
 */
export function updateBlogListingSEO() {
  const title = 'Blog & Engineering Insights — KodMates Digital Systems';
  const description = 'Practical guidance and engineering insights on web applications, Android development, APIs, database design, and software systems from the KodMates team.';
  const currentUrl = window.location.origin + '/blog';

  document.title = title;
  setMetaTag('description', description);
  setMetaTag('og:title', title, 'property');
  setMetaTag('og:description', description, 'property');
  setMetaTag('og:type', 'website', 'property');
  setMetaTag('og:url', currentUrl, 'property');
  setCanonical(currentUrl);

  // Schema.org Blog collection
  setStructuredData('kodmates-blog-schema', {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'KodMates Engineering Insights',
    description: description,
    url: currentUrl,
    publisher: {
      '@type': 'Organization',
      name: 'KodMates',
      url: window.location.origin
    }
  });
}

/**
 * Updates SEO for an individual Article Page
 * @param {object} article
 */
export function updateArticleSEO(article) {
  if (!article) return;

  const title = `${article.title} — KodMates Insights`;
  const description = article.summary;
  const currentUrl = `${window.location.origin}/blog/${article.slug}`;

  document.title = title;
  setMetaTag('description', description);
  setMetaTag('og:title', title, 'property');
  setMetaTag('og:description', description, 'property');
  setMetaTag('og:type', 'article', 'property');
  setMetaTag('og:url', currentUrl, 'property');
  setCanonical(currentUrl);

  // BlogPosting Schema.org JSON-LD
  setStructuredData('kodmates-blog-schema', {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.summary,
    url: currentUrl,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    articleSection: article.category,
    keywords: (article.tags || []).join(', '),
    author: {
      '@type': 'Organization',
      name: article.author?.name || 'KodMates Technical Team',
      jobTitle: article.author?.role || 'Software Engineering'
    },
    publisher: {
      '@type': 'Organization',
      name: 'KodMates',
      url: window.location.origin
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': currentUrl
    }
  });
}

/**
 * Resets SEO back to homepage defaults
 */
export function resetBlogSEO() {
  document.title = DEFAULT_TITLE;
  setMetaTag('description', DEFAULT_DESC);
  setMetaTag('og:title', DEFAULT_TITLE, 'property');
  setMetaTag('og:description', DEFAULT_DESC, 'property');
  setMetaTag('og:type', 'website', 'property');
  removeStructuredData('kodmates-blog-schema');
}
