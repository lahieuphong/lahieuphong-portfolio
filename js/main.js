/* ═══════════════════════════════════════════════════════════
   MAIN.JS — Entry point
   Imports all modules and runs them after DOM is ready
═══════════════════════════════════════════════════════════ */

import { initLoader }                          from './loader.js';
import { initCursor }                          from './cursor.js';
import { initNav }                             from './nav.js';
import { initScrollReveals, initHeroParallax } from './animations.js';
import { initProjectCards, initWorksFilter }   from './works.js';
import { initMarquee }                         from './marquee.js';
import { initSmoothScroll }                    from './utils.js';
import { initThreeClouds }                     from './three-clouds.js';
import { gsap }                                from 'gsap';
import { ScrollTrigger }                       from 'gsap/ScrollTrigger';

export async function initPortfolio() {
  gsap.registerPlugin(ScrollTrigger);

  initThreeClouds();

  // initLoader is async: it fetches SVG files before animating
  await initLoader();

  initCursor();
  initNav();
  initScrollReveals();
  initHeroParallax();
  initProjectCards();
  initWorksFilter();
  initMarquee();
  initSmoothScroll();
}
