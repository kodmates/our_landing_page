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

  if (container._reactRoot) {
    try {
      container._reactRoot.unmount();
    } catch (e) {
      // ignore
    }
    container._reactRoot = null;
  }

  const root = ReactDOM.createRoot(container);
  container._reactRoot = root;
  root.render(<HeroScene />);

  return {
    destroy: () => {
      setTimeout(() => {
        if (container._reactRoot === root) {
          try {
            root.unmount();
          } catch (e) {
            // ignore
          }
          container._reactRoot = null;
        }
      }, 0);
    }
  };
}

export default mountHeroScene;
