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

const TIMING = {
  slotPause: 180,
  slotOpen: 0.82,
  blankHold: 190,
  iconIn: 0.42,
  iconHold: 170,
  iconOut: 0.36,
  iconGap: 70,
  slotClose: 0.82,
  outroPause: 190,
};

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
  gsap.set([...wordParts], { y: 18 });
  gsap.set(logoBox, { y: -10 });
  gsap.set(bird,    { y: 14 });
  gsap.set(iconSlot, { opacity: 1, width: 0 });

  // Phase 1: logo + text + bird appear
  await new Promise(res => {
    gsap.timeline({ onComplete: res, delay: 0.1 })
      .to(logoBox,   { opacity: 1, y: 0, duration: 0.8, ease: 'sine.out' })
      .to(wordParts, { opacity: 1, y: 0, duration: 0.95, stagger: 0.06, ease: 'sine.out' }, '-=0.35')
      .to(bird,      { opacity: 1, y: 0, duration: 0.9,  ease: 'sine.out' }, '-=0.55');
  });

  const iconSize = `${iconSlot.getBoundingClientRect().height}px`;

  // Phase 2: open the word, cycle icons, then close back to "loading"
  await wait(TIMING.slotPause);
  await tween(iconSlot, { width: iconSize, duration: TIMING.slotOpen, ease: 'sine.inOut' });
  await wait(TIMING.blankHold);

  for (const svg of svgs) {
    const currentIcon = svg.cloneNode(true);
    iconSlot.replaceChildren(currentIcon);

    await fromTo(
      currentIcon,
      { opacity: 0, y: 10, scale: 0.96 },
      { opacity: 1, y: 0,  scale: 1, duration: TIMING.iconIn, ease: 'sine.out' }
    );
    await wait(TIMING.iconHold);
    await tween(currentIcon, {
      opacity: 0,
      y: -10,
      scale: 0.98,
      duration: TIMING.iconOut,
      ease: 'sine.inOut',
    });
    await wait(TIMING.iconGap);
  }

  iconSlot.replaceChildren();
  await wait(TIMING.blankHold);
  await tween(iconSlot, { width: 0, duration: TIMING.slotClose, ease: 'sine.inOut' });

  // Phase 3: brief pause on "loading", then fade the whole loader out
  await wait(TIMING.outroPause);
  await tween(loader, { opacity: 0, duration: 0.9, ease: 'sine.inOut' });

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
