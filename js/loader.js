/* ═══════════════════════════════════════════════════════════
   LOADER — Loading screen animation + hero entrance
═══════════════════════════════════════════════════════════ */

import { injectSVGs } from './svg-loader.js';

export async function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  document.body.style.overflow = 'hidden';

  // Fetch and inject external SVGs before animating
  await injectSVGs(loader);

  const logoBox   = loader.querySelector('.loader__logo-box');
  const wordParts = loader.querySelectorAll('.loader__word-part');
  const wordIcon  = loader.querySelector('.loader__word-icon');
  const bird      = loader.querySelector('.loader__bird');

  gsap.set([logoBox, wordParts, wordIcon, bird], { opacity: 0 });
  gsap.set([wordParts, wordIcon], { y: 30 });
  gsap.set(logoBox, { y: -16 });
  gsap.set(bird,    { y: 20 });

  const tl = gsap.timeline({
    delay: 0.1,
    onComplete: () => {
      gsap.to(loader, {
        opacity: 0,
        duration: 0.7,
        ease: 'power2.inOut',
        delay: 0.4,
        onComplete: () => {
          loader.style.display = 'none';
          document.body.style.overflow = '';
          heroEntrance();
        },
      });
    },
  });

  tl.to(logoBox, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
    .to([wordParts, wordIcon], {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.06,
      ease: 'power3.out',
    }, '-=0.2')
    .to(bird,   { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .to({}, { duration: 1.2 });
}

function heroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hero__eyebrow',     { y: 20,     opacity: 0, duration: 0.8 })
    .from('.hero__title-line',  { y: '100%', opacity: 0, duration: 1.1, stagger: 0.12 }, '-=0.4')
    .from('.hero__subtitle',    { y: 20,     opacity: 0, duration: 0.8 }, '-=0.5')
    .from('.hero__cta .btn',    { y: 20,     opacity: 0, duration: 0.7, stagger: 0.1  }, '-=0.4')
    .from('.hero__scroll-hint', { opacity: 0, duration: 0.6 }, '-=0.2')
    .from('.hero__bg-text',     { opacity: 0, duration: 1.2 }, '-=1.2');
}
