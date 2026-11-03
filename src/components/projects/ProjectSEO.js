/**
 * Project SEO & Metadata Management System (Phase 17)
 *
 * Implements production-quality, data-driven SEO for the Projects area:
 * - Route-specific document.title management
 * - Dynamic meta description based strictly on verified project data
 * - Normalized runtime canonical URL management
 * - Route-aware Open Graph (og:type, og:title, og:description, og:url, og:image)
 * - Route-aware Twitter Card metadata
 * - Conservative Schema.org JSON-LD structured data (CollectionPage / CreativeWork)
 * - Safe 404 / unknown route handling (noindex, no misleading canonical/OG/JSON-LD)
 * - Strict SPA lifecycle management to prevent tag accumulation or memory leaks
 *
 * Non-negotiable content rules:
 * - 0% fabricated claims, client names, statistics, ratings, dates, or keywords
 * - 0% fake images or placeholder social preview images
 */

const DEFAULT_HOME_TITLE = 'Kodmates — Building Digital Systems for the Real World';
const DEFAULT_HOME_DESCRIPTION =
  'We design and develop software, web applications, Android apps and business systems that solve real operational problems.';

const JSONLD_SCRIPT_ID = 'km-project-jsonld';

/**
 * Retrieves the normalized runtime origin without trailing slash
 * @returns {string}
 */
export function getCanonicalOrigin() {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin.replace(/\/+$/, '');
  }
  return '';
}

/**
 * Normalizes a URL path to ensure leading slash and no trailing slash (except root)
 * @param {string} path
 * @returns {string}
 */
export function normalizePath(path) {
  if (!path) return '/';
  let cleaned = path.trim();
  if (!cleaned.startsWith('/')) {
    cleaned = '/' + cleaned;
  }
  if (cleaned.length > 1 && cleaned.endsWith('/')) {
    cleaned = cleaned.slice(0, -1);
  }
  return cleaned;
}

/**
 * Generates an absolute canonical URL from a pathname using the runtime origin
 * @param {string} path
 * @returns {string}
 */
export function buildCanonicalUrl(path) {
  const origin = getCanonicalOrigin();
  const normalizedPath = normalizePath(path);
  return origin ? `${origin}${normalizedPath}` : normalizedPath;
}

/**
 * Sets or updates a <meta> tag identified by attribute name and value
 * @param {string} attrName - 'name' or 'property'
 * @param {string} attrValue - e.g. 'description', 'og:title'
 * @param {string|null} content - text content, or null/empty to remove
 */
export function setMetaTag(attrName, attrValue, content) {
  if (typeof document === 'undefined') return;

  const selector = `meta[${attrName}="${attrValue}"]`;
  let tag = document.head.querySelector(selector);

  if (content !== null && content !== undefined && String(content).trim() !== '') {
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attrName, attrValue);
      tag.setAttribute('data-km-seo', 'true');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', String(content).trim());
  } else if (tag) {
    tag.parentNode.removeChild(tag);
  }
}

/**
 * Removes a meta tag if it exists
 * @param {string} attrName
 * @param {string} attrValue
 */
export function removeMetaTag(attrName, attrValue) {
  if (typeof document === 'undefined') return;
  const tag = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (tag && tag.parentNode) {
    tag.parentNode.removeChild(tag);
  }
}

/**
 * Sets, updates, or removes the <link rel="canonical"> tag
 * @param {string|null} url
 */
export function setCanonicalUrl(url) {
  if (typeof document === 'undefined') return;

  let canonicalTag = document.head.querySelector('link[rel="canonical"]');

  if (url && String(url).trim() !== '') {
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      canonicalTag.setAttribute('data-km-seo', 'true');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', String(url).trim());
  } else if (canonicalTag && canonicalTag.parentNode) {
    canonicalTag.parentNode.removeChild(canonicalTag);
  }
}

/**
 * Injects or updates the Schema.org JSON-LD script element
 * @param {object|null} data
 */
export function setJsonLd(data) {
  if (typeof document === 'undefined') return;

  let script = document.getElementById(JSONLD_SCRIPT_ID);

  if (data && typeof data === 'object') {
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = JSONLD_SCRIPT_ID;
      script.setAttribute('data-km-seo', 'true');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data, null, 2);
  } else if (script && script.parentNode) {
    script.parentNode.removeChild(script);
  }
}

/**
 * Removes all managed Open Graph and Twitter tags from document.head
 */
export function clearSocialMeta() {
  const ogProps = ['og:site_name', 'og:title', 'og:description', 'og:type', 'og:url', 'og:image'];
  const twNames = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];

  ogProps.forEach((prop) => removeMetaTag('property', prop));
  twNames.forEach((name) => removeMetaTag('name', name));
}

/**
 * Updates SEO metadata for the /projects listing route
 */
export function updateProjectsListingSEO() {
  const title = 'Projects — KodeMates';
  const description =
    'Explore software systems and digital products built to solve real operational problems.';
  const canonicalUrl = buildCanonicalUrl('/projects');

  // Title
  document.title = title;

  // Description
  setMetaTag('name', 'description', description);

  // Canonical
  setCanonicalUrl(canonicalUrl);

  // Remove any previously set robots noindex
  removeMetaTag('name', 'robots');

  // Open Graph
  setMetaTag('property', 'og:site_name', 'KodeMates');
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:type', 'website');
  setMetaTag('property', 'og:url', canonicalUrl);
  removeMetaTag('property', 'og:image'); // No fabricated image

  // Twitter Card
  setMetaTag('name', 'twitter:card', 'summary');
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);
  removeMetaTag('name', 'twitter:image');

  // Structured Data (Conservative CollectionPage)
  setJsonLd({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: canonicalUrl
  });
}

/**
 * Updates SEO metadata for an individual project case study (/projects/:slug)
 * @param {object} project - Valid project schema object
 */
export function updateProjectCaseStudySEO(project) {
  if (!project || !project.slug) {
    updateProjectNotFoundSEO(project ? project.slug : '');
    return;
  }

  // 1. Title Resolution
  let pageTitle = '';
  if (project.seo && typeof project.seo.title === 'string' && project.seo.title.trim()) {
    const rawTitle = project.seo.title.trim();
    if (!rawTitle.toLowerCase().includes('kodemates') && !rawTitle.toLowerCase().includes('kodmates')) {
      pageTitle = `${rawTitle} — KodeMates`;
    } else {
      pageTitle = rawTitle;
    }
  } else {
    pageTitle = `${project.title || 'Project'} — KodeMates`;
  }
  document.title = pageTitle;

  // 2. Description Resolution (Verified only)
  let description = '';
  if (project.seo && typeof project.seo.description === 'string' && project.seo.description.trim()) {
    description = project.seo.description.trim();
  } else if (typeof project.shortDescription === 'string' && project.shortDescription.trim()) {
    description = project.shortDescription.trim();
  } else if (typeof project.tagline === 'string' && project.tagline.trim()) {
    description = project.tagline.trim();
  }

  setMetaTag('name', 'description', description || null);

  // 3. Image Resolution (Verified only - never placeholder)
  let verifiedImage = null;
  if (project.seo && typeof project.seo.image === 'string' && project.seo.image.trim()) {
    const imgStr = project.seo.image.trim();
    const origin = getCanonicalOrigin();
    verifiedImage = imgStr.startsWith('http') ? imgStr : `${origin}${normalizePath(imgStr)}`;
  } else if (Array.isArray(project.screenshots) && project.screenshots.length > 0 && project.screenshots[0]) {
    const rawFirst = project.screenshots[0];
    const src = typeof rawFirst === 'string' ? rawFirst.trim() : rawFirst.src ? rawFirst.src.trim() : '';
    if (src) {
      const origin = getCanonicalOrigin();
      verifiedImage = src.startsWith('http') ? src : `${origin}${normalizePath(src)}`;
    }
  }

  // 4. Canonical URL
  const canonicalUrl = buildCanonicalUrl(`/projects/${project.slug}`);
  setCanonicalUrl(canonicalUrl);

  // 5. Robots: Ensure indexable
  removeMetaTag('name', 'robots');

  // 6. Open Graph
  setMetaTag('property', 'og:site_name', 'KodeMates');
  setMetaTag('property', 'og:title', pageTitle);
  setMetaTag('property', 'og:description', description || null);
  setMetaTag('property', 'og:type', 'article');
  setMetaTag('property', 'og:url', canonicalUrl);
  if (verifiedImage) {
    setMetaTag('property', 'og:image', verifiedImage);
  } else {
    removeMetaTag('property', 'og:image');
  }

  // 7. Twitter Card
  setMetaTag('name', 'twitter:card', verifiedImage ? 'summary_large_image' : 'summary');
  setMetaTag('name', 'twitter:title', pageTitle);
  setMetaTag('name', 'twitter:description', description || null);
  if (verifiedImage) {
    setMetaTag('name', 'twitter:image', verifiedImage);
  } else {
    removeMetaTag('name', 'twitter:image');
  }

  // 8. Structured Data (Conservative CreativeWork schema)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title || 'Project',
    url: canonicalUrl
  };
  if (description) {
    structuredData.description = description;
  }
  if (verifiedImage) {
    structuredData.image = verifiedImage;
  }
  setJsonLd(structuredData);
}

/**
 * Updates SEO metadata for unknown/not-found project routes (/projects/nonexistent)
 * Prevents misleading indexation, removes project canonical & JSON-LD
 * @param {string} slug
 */
export function updateProjectNotFoundSEO(slug = '') {
  document.title = 'Project Not Found — KodeMates';

  // Instruct search engines not to index unknown project URLs
  setMetaTag('name', 'robots', 'noindex, nofollow');

  // Clear description or remove project-specific claims
  removeMetaTag('name', 'description');

  // Remove canonical URL (must NOT pretend the project exists)
  setCanonicalUrl(null);

  // Clear Open Graph & Twitter metadata
  clearSocialMeta();

  // Remove structured data
  setJsonLd(null);
}

/**
 * Resets SEO metadata back to site default when navigating away from projects
 */
export function resetProjectSEO() {
  document.title = DEFAULT_HOME_TITLE;
  setMetaTag('name', 'description', DEFAULT_HOME_DESCRIPTION);
  setCanonicalUrl(null);
  removeMetaTag('name', 'robots');
  clearSocialMeta();
  setJsonLd(null);
}

export default {
  getCanonicalOrigin,
  normalizePath,
  buildCanonicalUrl,
  setMetaTag,
  removeMetaTag,
  setCanonicalUrl,
  setJsonLd,
  clearSocialMeta,
  updateProjectsListingSEO,
  updateProjectCaseStudySEO,
  updateProjectNotFoundSEO,
  resetProjectSEO
};
