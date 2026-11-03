/**
 * KodMates Main Application Entrypoint
 * Complete Unified SPA Integration:
 * - 3D Hero Ecosystem & Home Landing Architecture (Step 02)
 * - Header Navigation with Active Route State (Step 01)
 * - Engineering Services Directory & Deep Architecture (Harisankar)
 * - Projects Listing & Interactive 3D Case Studies (Harisankar)
 * - Contact Page, Consultation Form, & Verification Workflow (Aniket)
 * - Technical Blog Hub & Illustrated Architecture Guides (Aniket)
 * - Shared Structured Footer with Live Operational Telemetry
 */

import './styles/tokens.css';
import './styles/base.css';
import './styles/header.css';
import './styles/hero.css';
import './styles/sections.css';
import './styles/projects.css';
import './styles/project-case-study.css';
import './styles/services.css';
import './styles/contact.css';
import './styles/blog.css';
import './styles/blog-article.css';
import './styles/footer.css';

import { initHeader } from './components/Header.js';
import { initHero } from './components/Hero.js';
import { initProjectsSection } from './components/ProjectsSection.js';
import { initBlogSection } from './components/BlogSection.js';
import { initContactSection } from './components/ContactSection.js';
import { initFooterSection } from './components/FooterSection.js';

// Dedicated Sub-Page Controllers
import { initProjectsPage } from './pages/ProjectsPage.js';
import { initProjectCaseStudyPage } from './pages/ProjectCaseStudyPage.js';
import { initServicesPage } from './pages/ServicesPage.js';
import { initContactPage } from './pages/ContactPage.js';
import { initBlogPage } from './pages/BlogPage.js';
import { initBlogArticlePage } from './pages/BlogArticlePage.js';

// Data Registries & SEO Providers
import { getProjectBySlug } from './data/projects/index.js';
import { resetProjectSEO } from './components/projects/ProjectSEO.js';
import { resetServicesSEO } from './components/services/ServicesSEO.js';
import { resetBlogSEO } from './components/blog/BlogSEO.js';

// 1. Initialize Sticky Header
const header = initHeader({ activePage: 'Home' });

// 2. Initialize 3D Hero Ecosystem
const hero = initHero();

// 3. Initialize Homepage Section Listeners
initProjectsSection();
initBlogSection();
initContactSection();
initFooterSection();

// Active Sub-Page Controller State
let activeProjectsPage = null;
let activeCaseStudyPage = null;
let activeServicesPage = null;
let activeBlogPage = null;
let activeBlogArticlePage = null;
let activeContactPage = null;

function destroyActiveSubpages() {
  if (activeServicesPage) {
    activeServicesPage.destroy();
    activeServicesPage = null;
    resetServicesSEO();
  }
  if (activeProjectsPage) {
    activeProjectsPage.destroy();
    activeProjectsPage = null;
    resetProjectSEO();
  }
  if (activeCaseStudyPage) {
    activeCaseStudyPage.destroy();
    activeCaseStudyPage = null;
    resetProjectSEO();
  }
  if (activeBlogPage) {
    activeBlogPage.destroy();
    activeBlogPage = null;
    resetBlogSEO();
  }
  if (activeBlogArticlePage) {
    activeBlogArticlePage.destroy();
    activeBlogArticlePage = null;
    resetBlogSEO();
  }
  if (activeContactPage) {
    activeContactPage.destroy();
    activeContactPage = null;
  }
}

/**
 * Universal Route Parser
 * Supports clean URLs (/services, /projects, /blog, /contact, /projects/:slug, /blog/:slug)
 * and hash routing fallbacks (#/services, #services-page, #/projects/:slug, etc.)
 */
export function parseRoute() {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  // 1. Hash-based subpage routes
  if (hash.startsWith('#/projects/') || hash.startsWith('#projects/')) {
    const slug = hash.replace(/^#\/?projects\//, '').split('/')[0].split('?')[0];
    return { type: 'case-study', slug };
  }
  if (hash === '#/projects' || hash === '#projects-page') {
    return { type: 'projects-list' };
  }
  if (hash === '#/services' || hash === '#services-page') {
    return { type: 'services' };
  }
  if (hash.startsWith('#/blog/') || hash.startsWith('#blog/')) {
    const slug = hash.replace(/^#\/?blog\//, '').split('/')[0].split('?')[0];
    return { type: 'blog-article', slug };
  }
  if (hash === '#/blog' || hash === '#blog-page') {
    return { type: 'blog' };
  }
  if (hash === '#/contact' || hash === '#contact-page') {
    return { type: 'contact' };
  }

  // 2. Pathname-based subpage routes
  if (path.startsWith('/projects/')) {
    const slug = path.replace(/^\/projects\//, '').split('/')[0].split('?')[0];
    if (slug) {
      return { type: 'case-study', slug };
    }
    return { type: 'projects-list' };
  }
  if (path === '/projects' || path === '/projects/') {
    return { type: 'projects-list' };
  }

  if (path === '/services' || path === '/services/') {
    return { type: 'services' };
  }

  if (path.startsWith('/blog/')) {
    const slug = path.replace(/^\/blog\//, '').split('/')[0].split('?')[0];
    if (slug) {
      return { type: 'blog-article', slug };
    }
    return { type: 'blog' };
  }
  if (path === '/blog' || path === '/blog/') {
    return { type: 'blog' };
  }

  if (path === '/contact' || path === '/contact/') {
    return { type: 'contact' };
  }

  // 3. Homepage section routes (/process, /about)
  const cleanPath = path.replace(/\/$/, '');
  const sectionMatch = cleanPath.startsWith('/') ? cleanPath.substring(1) : '';
  if (['process', 'about', 'home'].includes(sectionMatch)) {
    return { type: 'home', hash: sectionMatch === 'home' ? null : sectionMatch };
  }

  // 4. Default home
  return { type: 'home', hash: hash ? hash.replace('#', '') : null };
}

/**
 * Universal Route Renderer
 * Mounts the appropriate full-page controller or restores the homepage ecosystem
 */
export function renderRoute() {
  const route = parseRoute();
  const heroEl = document.getElementById('hero');
  const mainContent = document.getElementById('main-content');
  const homeSections = document.querySelectorAll('.km-section');

  destroyActiveSubpages();

  if (route.type === 'services') {
    header.setActivePage('Services');
    if (heroEl) heroEl.style.display = 'none';
    homeSections.forEach(s => (s.style.display = 'none'));

    if (mainContent) {
      activeServicesPage = initServicesPage({ target: mainContent });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  } else if (route.type === 'projects-list') {
    header.setActivePage('Projects');
    if (heroEl) heroEl.style.display = 'none';
    homeSections.forEach(s => (s.style.display = 'none'));

    if (mainContent) {
      activeProjectsPage = initProjectsPage({ target: mainContent });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  } else if (route.type === 'case-study') {
    header.setActivePage('Projects');
    if (heroEl) heroEl.style.display = 'none';
    homeSections.forEach(s => (s.style.display = 'none'));

    if (mainContent) {
      const project = getProjectBySlug(route.slug);
      activeCaseStudyPage = initProjectCaseStudyPage({
        target: mainContent,
        project,
        slug: route.slug
      });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  } else if (route.type === 'blog') {
    header.setActivePage('Blog');
    if (heroEl) heroEl.style.display = 'none';
    homeSections.forEach(s => (s.style.display = 'none'));

    if (mainContent) {
      activeBlogPage = initBlogPage({ target: mainContent });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  } else if (route.type === 'blog-article') {
    header.setActivePage('Blog');
    if (heroEl) heroEl.style.display = 'none';
    homeSections.forEach(s => (s.style.display = 'none'));

    if (mainContent) {
      activeBlogArticlePage = initBlogArticlePage({ target: mainContent, slug: route.slug });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  } else if (route.type === 'contact') {
    header.setActivePage('Contact');
    if (heroEl) heroEl.style.display = 'none';
    homeSections.forEach(s => (s.style.display = 'none'));

    if (mainContent) {
      activeContactPage = initContactPage({ target: mainContent });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  } else {
    // HOME ROUTE: Restore 3D hero ecosystem and all homepage sections
    const activeSection = route.hash || 'Home';
    header.setActivePage(activeSection);

    if (heroEl) heroEl.style.display = '';
    homeSections.forEach(s => (s.style.display = ''));

    resetProjectSEO();
    resetServicesSEO();
    resetBlogSEO();

    if (route.hash) {
      const targetAnchor = document.getElementById(route.hash);
      if (targetAnchor) {
        setTimeout(() => {
          targetAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 60);
      }
    }
  }
}

/**
 * Client-Side Navigation Interceptor
 */
function setupNavigation() {
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const link = e.target.closest('a');
    if (!link) return;
    if (link.hasAttribute('download')) return;

    const href = link.getAttribute('href');
    const target = link.getAttribute('target');
    const targetId = link.getAttribute('data-nav-id') || link.getAttribute('data-mobile-nav-id');

    if (!href || target === '_blank') return;

    // Subpage routing checks
    const isServicesLink = href === '/services' || href === '/services/' || href === '#/services' || targetId === 'services';
    const isProjectsLink = href === '/projects' || href === '/projects/' || href === '#/projects' || targetId === 'projects';
    const isCaseStudyLink = href.startsWith('/projects/') || href.startsWith('#/projects/');
    const isBlogLink = href === '/blog' || href === '/blog/' || href === '#/blog' || href.startsWith('/blog?') || targetId === 'blog';
    const isBlogArticleLink = href.startsWith('/blog/') || href.startsWith('#/blog/') || Boolean(link.getAttribute('data-article-slug'));
    const isContactLink = href === '/contact' || href === '/contact/' || href === '#/contact' || targetId === 'contact';
    const isHomeLink = href === '/' || href === '#home' || href === '#/' || targetId === 'home';

    if (isCaseStudyLink) {
      e.preventDefault();
      const slug = href.replace(/^#?\/?projects\//, '').split('/')[0].split('?')[0];
      window.history.pushState({}, '', `/projects/${slug}`);
      renderRoute();
      return;
    }

    if (isBlogArticleLink) {
      e.preventDefault();
      const articleSlug = link.getAttribute('data-article-slug') || href.replace(/^#?\/?blog\//, '').split('/')[0].split('?')[0];
      window.history.pushState({}, '', `/blog/${articleSlug}`);
      renderRoute();
      return;
    }

    if (isServicesLink) {
      e.preventDefault();
      window.history.pushState({}, '', '/services');
      renderRoute();
      return;
    }

    if (isProjectsLink) {
      e.preventDefault();
      window.history.pushState({}, '', '/projects');
      renderRoute();
      return;
    }

    if (isBlogLink) {
      e.preventDefault();
      window.history.pushState({}, '', href.startsWith('/blog?') ? href : '/blog');
      renderRoute();
      return;
    }

    if (isContactLink) {
      e.preventDefault();
      window.history.pushState({}, '', '/contact');
      renderRoute();
      return;
    }

    if (isHomeLink) {
      e.preventDefault();
      if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
        window.history.pushState({}, '', '/');
        renderRoute();
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        header.setActivePage('Home');
      }
      return;
    }

    // Homepage Section Anchors (#services, #projects, #process, #about, #blog, #contact)
    if (href.startsWith('#') && !href.startsWith('#/')) {
      const anchorId = href.substring(1);
      const targetEl = document.getElementById(anchorId);

      // If currently on a subpage, navigate back to homepage anchor
      if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
        e.preventDefault();
        window.history.pushState({}, '', '/' + href);
        renderRoute();
        return;
      }

      if (targetEl) {
        e.preventDefault();
        window.history.pushState({}, '', href);
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        header.setActivePage(anchorId);
      }
    }
  });

  window.addEventListener('popstate', renderRoute);

  // IntersectionObserver Scroll-Spy to dynamically update active header state as user scrolls homepage
  const sectionIds = ['home', 'services', 'projects', 'process', 'about', 'blog', 'contact'];
  const sectionsToObserve = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sectionsToObserve.length > 0) {
    const scrollSpyObserver = new IntersectionObserver(
      (entries) => {
        const currentPath = window.location.pathname;
        if (currentPath !== '/' && currentPath !== '/index.html') return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            header.setActivePage(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
      }
    );

    sectionsToObserve.forEach(el => scrollSpyObserver.observe(el));
  }

  // Homepage Service card inquiry click handling
  document.querySelectorAll('.service-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      const card = link.closest('.service-card');
      const srvTitle = card ? card.querySelector('.service-title')?.textContent : '';
      const contactSelect = document.getElementById('contact-type');
      if (!contactSelect || !srvTitle) return;

      const options = Array.from(contactSelect.options);
      const match = options.find(opt => 
        srvTitle.toLowerCase().includes(opt.value.toLowerCase().split(' ')[0]) ||
        opt.textContent.toLowerCase().includes(srvTitle.toLowerCase().split(' ')[0])
      );
      if (match) {
        contactSelect.value = match.value;
      }

      const messageArea = document.getElementById('contact-message');
      if (messageArea && !messageArea.value) {
        messageArea.value = `Inquiring about ${srvTitle} engineering capabilities and architecture...`;
      }
    });
  });

  renderRoute();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupNavigation);
} else {
  setupNavigation();
}
