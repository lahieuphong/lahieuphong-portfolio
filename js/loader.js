/* ═══════════════════════════════════════════════════════════
   LOADER — Loading screen animation + hero entrance
   Icons cycle one-by-one inside "load[icon]ing" text,
   inspired by the UNESCO museum loading experience.
═══════════════════════════════════════════════════════════ */

import { fetchSVG, injectSVGs } from './svg-loader.js';

const ICONS = [
  'assets/svg/icon-plant.svg',
  'assets/svg/icon-mushroom.svg',
  'assets/svg/icon-book.svg',
  'assets/svg/icon-stool.svg',
  'assets/svg/icon-column.svg',
  'assets/svg/icon-amphora.svg',
  'assets/svg/icon-drum.svg',
  'assets/svg/icon-helmet.svg',
  'assets/svg/icon-frame.svg',
  'assets/svg/icon-face.svg',
];

const tween  = (el, vars)       => new Promise(res => gsap.to(el, { ...vars, onComplete: res }));
const fromTo = (el, from, to)   => new Promise(res => gsap.fromTo(el, from, { ...to, onComplete: res }));
const wait   = ms               => new Promise(res => setTimeout(res, ms));

export async function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  document.body.style.overflow = 'hidden';

  // Inject bird SVG (only static declarative SVG remaining)
  await injectSVGs(loader);

  // Pre-fetch all icons in parallel
  const svgs = (
    await Promise.all(ICONS.map(src => fetchSVG(src).catch(() => null)))
  ).filter(Boolean);

  const logoBox   = loader.querySelector('.loader__logo-box');
  const wordParts = loader.querySelectorAll('.loader__word-part');
  const iconSlot  = loader.querySelector('.loader__word-icon');
  const bird      = loader.querySelector('.loader__bird');

  gsap.set([logoBox, ...wordParts, bird], { opacity: 0 });
  gsap.set([...wordParts], { y: 30 });
  gsap.set(logoBox, { y: -16 });
  gsap.set(bird,    { y: 20 });
  gsap.set(iconSlot, { opacity: 0 });

  // Phase 1: logo + text + bird appear
  await new Promise(res => {
    gsap.timeline({ onComplete: res, delay: 0.1 })
      .to(logoBox,   { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
      .to(wordParts, { opacity: 1, y: 0, duration: 0.75, stagger: 0.08, ease: 'power3.out' }, '-=0.2')
      .to(bird,      { opacity: 1, y: 0, duration: 0.7,  ease: 'power3.out' }, '-=0.4');
  });

  // Phase 2: cycle icons — each bounces in, pauses, bounces out
  for (const svg of svgs) {
    iconSlot.innerHTML = '';
    iconSlot.appendChild(svg.cloneNode(true));

    await fromTo(
      iconSlot,
      { opacity: 0, y: 28, scale: 0.78 },
      { opacity: 1, y: 0,  scale: 1,    duration: 0.22, ease: 'back.out(1.8)' }
    );
    await wait(185);
    await tween(iconSlot, { opacity: 0, y: -28, scale: 0.85, duration: 0.16, ease: 'power2.in' });
  }

  // Phase 3: brief pause then fade the whole loader out
  await wait(200);
  await tween(loader, { opacity: 0, duration: 0.7, ease: 'power2.inOut' });

  loader.style.display = 'none';
  document.body.style.overflow = '';
  heroEntrance();
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
