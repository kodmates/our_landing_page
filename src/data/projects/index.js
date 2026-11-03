import { gatepass } from './gatepass.js';
import { korocraft } from './korocraft.js';
import { asuti } from './asuti.js';
import { beast } from './beast.js';
import { tinytots } from './tinytots.js';

/**
 * Complete list of registered projects
 */
export const projects = [
  gatepass,
  korocraft,
  asuti,
  beast,
  tinytots
];

/**
 * Retrieve a project by its unique slug
 * @param {string} slug - Project slug (e.g. 'gatepass')
 * @returns {object|null} Project data object or null if not found
 */
export function getProjectBySlug(slug) {
  if (!slug || typeof slug !== 'string') return null;
  return projects.find((p) => p.slug.toLowerCase() === slug.trim().toLowerCase()) || null;
}

/**
 * Retrieve all featured projects
 * @returns {Array<object>} List of featured projects
 */
export function getFeaturedProjects() {
  return projects.filter((p) => Boolean(p.featured));
}

// Re-export individual projects for direct access if needed
export {
  gatepass,
  korocraft,
  asuti,
  beast,
  tinytots
};

// Default export for `import projects from '../data/projects/index.js'`
export default projects;
