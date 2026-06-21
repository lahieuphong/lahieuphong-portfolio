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
  const bgText    = document.querySelector('.hero__bg-text');
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

  // Mouse parallax — each blob-wrap layer moves at a different depth
  const hero  = document.getElementById('hero');
  const wraps = hero ? [...hero.querySelectorAll('[data-parallax-depth]')] : [];
  if (!wraps.length) return;

  let tx = 0, ty = 0, cx = 0, cy = 0;
  const lerp = (a, b, t) => a + (b - a) * t;

  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    tx = (e.clientX - r.left) / r.width  - 0.5;
    ty = (e.clientY - r.top)  / r.height - 0.5;
  });
  hero.addEventListener('mouseleave', () => { tx = 0; ty = 0; });

  (function tick() {
    cx = lerp(cx, tx, 0.05);
    cy = lerp(cy, ty, 0.05);
    wraps.forEach(wrap => {
      const d = parseFloat(wrap.dataset.parallaxDepth) || 1;
      wrap.style.transform = `translate(${cx * d * 32}px, ${cy * d * 22}px)`;
    });
    requestAnimationFrame(tick);
  })();
}