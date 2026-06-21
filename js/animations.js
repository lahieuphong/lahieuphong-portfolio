/* ═══════════════════════════════════════════════════════════
   ANIMATIONS — Scroll reveals + hero parallax
═══════════════════════════════════════════════════════════ */

export function initScrollReveals() {
  const REVEAL_SELECTOR = '.reveal-text, .reveal-line, .reveal-scale, .reveal-up';

  document.querySelectorAll(REVEAL_SELECTOR).forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => el.classList.add('is-visible'),
    });
  });
}

export function initHeroParallax() {
  const bgText   = document.querySelector('.hero__bg-text');
  const heroMedia = document.querySelector('.hero__media');
  if (!bgText) return;

  const scrollConfig = {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  };

  gsap.to(bgText,    { y: 120, ease: 'none', scrollTrigger: scrollConfig });
  if (heroMedia) {
    gsap.to(heroMedia, { y: 80,  ease: 'none', scrollTrigger: scrollConfig });
  }
}
