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
  logoCenterHold: 120,
  logoRise: 0.72,
  slotPause: 180,
  slotOpen: 0.82,
  blankHold: 130,
  iconIn: 0.18,
  iconHold: 70,
  iconOut: 0.16,
  iconGap: 18,
  wordSqueeze: 0.3,
  wordRelease: 0.36,
  slotClose: 0.82,
  outroPause: 190,
  outroSink: 0.62,
};

const BIRD_BAR_STYLE = {
  idleStroke: '#B8A898',
  activeStroke: '#1C1209',
  idleWidth: 2.7,
  activeWidth: 3.8,
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
  const logoTop   = loader.querySelector('.loader__top');
  const word      = loader.querySelector('.loader__word');
  const wordParts = loader.querySelectorAll('.loader__word-part');
  const iconSlot  = loader.querySelector('.loader__word-icon');
  const bird      = loader.querySelector('.loader__bird');
  const birdBars  = bird ? [...bird.querySelectorAll('path')] : [];
  let wordSqueezeX = 0;
  const setWordSqueeze = (amount, duration) => new Promise(res => {
    const [loadPart, ingPart] = wordParts;
    if (!loadPart || !ingPart) {
      res();
      return;
    }

    gsap.timeline({ onComplete: res })
      .to(loadPart, {
        x: wordSqueezeX * amount,
        duration,
        ease: 'sine.inOut',
        overwrite: 'auto',
      }, 0)
      .to(ingPart, {
        x: -wordSqueezeX * amount,
        duration,
        ease: 'sine.inOut',
        overwrite: 'auto',
      }, 0);
  });
  const setActiveBirdBars = count => {
    birdBars.forEach((bar, index) => {
      const isActive = index >= birdBars.length - count;
      bar.classList.toggle('is-active', isActive);
      bar.setAttribute('stroke', isActive ? BIRD_BAR_STYLE.activeStroke : BIRD_BAR_STYLE.idleStroke);
      bar.setAttribute('stroke-width', isActive ? BIRD_BAR_STYLE.activeWidth : BIRD_BAR_STYLE.idleWidth);
      gsap.to(bar, {
        stroke: isActive ? BIRD_BAR_STYLE.activeStroke : BIRD_BAR_STYLE.idleStroke,
        strokeWidth: isActive ? BIRD_BAR_STYLE.activeWidth : BIRD_BAR_STYLE.idleWidth,
        opacity: isActive ? 1 : 0.45,
        duration: 0.24,
        ease: 'sine.out',
        overwrite: true,
      });
    });
  };

  const getLogoCenterOffset = () => {
    if (!logoBox) return 0;
    const rect = logoBox.getBoundingClientRect();
    return window.innerHeight / 2 - (rect.top + rect.height / 2);
  };

  gsap.set([logoBox, ...wordParts, bird], { opacity: 0 });
  gsap.set(logoTop, { y: getLogoCenterOffset() });
  gsap.set(word, { y: 0 });
  gsap.set([...wordParts], { x: 0, y: 18 });
  gsap.set(logoBox, { y: 0 });
  gsap.set(bird,    { y: 14 });
  gsap.set(iconSlot, { opacity: 1, width: 0 });
  setActiveBirdBars(0);

  // Phase 1: show the logo at center, move it to the top, then reveal the loader marks
  await new Promise(res => {
    gsap.timeline({ onComplete: res, delay: 0.08 })
      .to(logoBox, {
        opacity: 1,
        duration: 0.5,
        ease: 'sine.out',
      })
      .to({}, { duration: TIMING.logoCenterHold / 1000 })
      .to(logoTop, {
        y: 0,
        duration: TIMING.logoRise,
        ease: 'sine.inOut',
      })
      .to(wordParts, {
        opacity: 1,
        y: 0,
        duration: 0.95,
        stagger: 0.06,
        ease: 'sine.out',
      }, '-=0.16')
      .to(bird, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'sine.out',
      }, '-=0.62');
  });

  const iconHeight = iconSlot.getBoundingClientRect().height;
  const iconSize = `${iconHeight}px`;
  wordSqueezeX = Math.min(9, Math.max(4, iconHeight * 0.055));

  // Phase 2: open the word, cycle icons, then close back to "loading"
  await wait(TIMING.slotPause);
  await tween(iconSlot, { width: iconSize, duration: TIMING.slotOpen, ease: 'sine.inOut' });
  await wait(TIMING.blankHold);

  for (const [index, svg] of svgs.entries()) {
    const currentIcon = svg.cloneNode(true);
    iconSlot.replaceChildren(currentIcon);
    setActiveBirdBars(index + 1);

    const iconIn = fromTo(
      currentIcon,
      { opacity: 0, y: 10, scale: 0.96 },
      { opacity: 1, y: 0,  scale: 1, duration: TIMING.iconIn, ease: 'sine.out' }
    );

    if (index === 0) {
      await iconIn;
    } else {
      await Promise.all([
        iconIn,
        setWordSqueeze(0, TIMING.wordRelease),
      ]);
    }

    await wait(TIMING.iconHold);
    const iconOut = tween(currentIcon, {
      opacity: 0,
      y: -10,
      scale: 0.98,
      duration: TIMING.iconOut,
      ease: 'sine.inOut',
    });

    if (index === svgs.length - 1) {
      await iconOut;
    } else {
      await Promise.all([
        iconOut,
        setWordSqueeze(1, TIMING.wordSqueeze),
      ]);
    }

    await wait(TIMING.iconGap);
  }

  iconSlot.replaceChildren();
  await wait(TIMING.blankHold);
  await tween(iconSlot, { width: 0, duration: TIMING.slotClose, ease: 'sine.inOut' });

  // Phase 3: brief pause on "loading", sink the loader marks, then fade out
  await wait(TIMING.outroPause);
  await new Promise(res => {
    gsap.timeline({ onComplete: res })
      .to([word, bird].filter(Boolean), {
        opacity: 0,
        y: 46,
        duration: TIMING.outroSink,
        ease: 'sine.inOut',
        stagger: 0.06,
      });
  });
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
