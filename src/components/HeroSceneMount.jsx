/**
 * HeroScene Mounting Bridge
 * Allows the React Three Fiber HeroScene component to seamlessly mount
 * into any DOM container (such as #hero-3d-wrapper in the Vite SPA).
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import HeroScene from './HeroScene.jsx';

export function mountHeroScene(container) {
  if (!container) return null;

  // Dedicated child host element so React root doesn't conflict with existing container children
  let mountHost = container.querySelector('.hero-3d-canvas-host');
  if (!mountHost) {
    mountHost = document.createElement('div');
    mountHost.className = 'hero-3d-canvas-host';
    mountHost.style.cssText = 'position:relative;width:100%;height:100%;';
    container.appendChild(mountHost);
  }

  const fallback = container.querySelector('#hero-fallback');

  if (mountHost._reactRoot) {
    try {
      mountHost._reactRoot.unmount();
    } catch (e) {
      // ignore
    }
    mountHost._reactRoot = null;
  }

  const root = ReactDOM.createRoot(mountHost);
  mountHost._reactRoot = root;

  // Hide static fallback once React Canvas is active
  if (fallback) {
    fallback.style.display = 'none';
  }

  root.render(<HeroScene />);

  return {
    destroy: () => {
      setTimeout(() => {
        if (mountHost && mountHost._reactRoot === root) {
          try {
            root.unmount();
          } catch (e) {
            // ignore
          }
          mountHost._reactRoot = null;
          if (mountHost.parentNode) {
            mountHost.parentNode.removeChild(mountHost);
          }
        }
      }, 0);
    }
  };
}

export default mountHeroScene;
