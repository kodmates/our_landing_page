/**
 * Services SEO & Metadata Management
 *
 * Implements route-aware SEO, document.title, meta descriptions,
 * Open Graph, Twitter cards, and Schema.org structured data for the Services page.
 * Strictly adheres to verified company data and zero-fabrication standards.
 */

const DEFAULT_TITLE = 'Kodmates — Building Digital Systems for the Real World';
const DEFAULT_DESCRIPTION =
  'We design and develop software, web applications, Android apps and business systems that solve real operational problems.';

const SERVICES_TITLE = 'Services — Digital Solutions & Software Engineering | KodMates';
const SERVICES_DESCRIPTION =
  'Explore KodMates services: Custom Web Development, Native Android Apps, RESTful API Backends, UI/UX Design, Cloud Deployments, and Business Software Automations.';

const JSONLD_SCRIPT_ID = 'km-services-jsonld';

export function updateServicesSEO() {
  if (typeof document === 'undefined') return;

  // Title
  document.title = SERVICES_TITLE;

  // Meta Description
  let descMeta = document.querySelector('meta[name="description"]');
  if (!descMeta) {
    descMeta = document.createElement('meta');
    descMeta.setAttribute('name', 'description');
    document.head.appendChild(descMeta);
  }
  descMeta.setAttribute('content', SERVICES_DESCRIPTION);

  // Canonical
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  const origin = window.location.origin.replace(/\/+$/, '');
  canonicalLink.setAttribute('href', `${origin}/services`);

  // Open Graph Title & Description
  setMetaTag('property', 'og:title', SERVICES_TITLE);
  setMetaTag('property', 'og:description', SERVICES_DESCRIPTION);
  setMetaTag('property', 'og:url', `${origin}/services`);
  setMetaTag('property', 'og:type', 'website');

  // Twitter
  setMetaTag('name', 'twitter:title', SERVICES_TITLE);
  setMetaTag('name', 'twitter:description', SERVICES_DESCRIPTION);

  // Schema.org Structured Data
  let jsonLdEl = document.getElementById(JSONLD_SCRIPT_ID);
  if (!jsonLdEl) {
    jsonLdEl = document.createElement('script');
    jsonLdEl.id = JSONLD_SCRIPT_ID;
    jsonLdEl.type = 'application/ld+json';
    document.head.appendChild(jsonLdEl);
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Software Development & Digital Solutions',
    provider: {
      '@type': 'Organization',
      name: 'KodMates',
      url: origin
    },
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'KodMates Engineering Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Web Development' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Mobile App Development' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'UI/UX Design' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Backend & API Development' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Cloud & Deployment' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Business Software & Automation' } }
      ]
    }
  };

  jsonLdEl.textContent = JSON.stringify(structuredData);
}

export function resetServicesSEO() {
  if (typeof document === 'undefined') return;

  document.title = DEFAULT_TITLE;

  const descMeta = document.querySelector('meta[name="description"]');
  if (descMeta) {
    descMeta.setAttribute('content', DEFAULT_DESCRIPTION);
  }

  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink) {
    const origin = window.location.origin.replace(/\/+$/, '');
    canonicalLink.setAttribute('href', `${origin}/`);
  }

  const jsonLdEl = document.getElementById(JSONLD_SCRIPT_ID);
  if (jsonLdEl && jsonLdEl.parentNode) {
    jsonLdEl.parentNode.removeChild(jsonLdEl);
  }
}

function setMetaTag(attrName, attrVal, content) {
  let el = document.querySelector(`meta[${attrName}="${attrVal}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrVal);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}
