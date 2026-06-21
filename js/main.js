/* ═══════════════════════════════════════════════════════════
   MAIN.JS — Portfolio Animations
   Requires: GSAP + ScrollTrigger (loaded via CDN in HTML)
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── GSAP init ─────────────────────────────────────────
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // ─── 1. LOADER ─────────────────────────────────────────
  initLoader();

  // ─── 2. CUSTOM CURSOR ──────────────────────────────────
  initCursor();

  // ─── 3. NAVIGATION ─────────────────────────────────────
  initNav();

  // ─── 4. SCROLL REVEALS ─────────────────────────────────
  initScrollReveals();

  // ─── 5. HERO PARALLAX ──────────────────────────────────
  initHeroParallax();

  // ─── 6. PROJECT CARDS ──────────────────────────────────
  initProjectCards();

  // ─── 7. WORKS FILTER ───────────────────────────────────
  initWorksFilter();

  // ─── 8. MARQUEE ────────────────────────────────────────
  initMarquee();

  // ─── 9. SMOOTH ANCHOR SCROLL ───────────────────────────
  initSmoothScroll();

});

/* ═══════════════════════════════════════════════════════════
   LOADER
═══════════════════════════════════════════════════════════ */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const tl = gsap.timeline({
    delay: 0.2,
    onComplete: () => {
      loader.classList.add('loader--hidden');
      document.body.style.overflow = '';
      // Trigger hero entrance after loader
      heroEntrance();
    }
  });

  document.body.style.overflow = 'hidden';

  tl.to(loader, {
    duration: 1.8,
    ease: 'none',
  });
}

/* ═══════════════════════════════════════════════════════════
   HERO ENTRANCE
═══════════════════════════════════════════════════════════ */
function heroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hero__eyebrow', { y: 20, opacity: 0, duration: 0.8 })
    .from('.hero__title-line', { y: '100%', opacity: 0, duration: 1.1, stagger: 0.12 }, '-=0.4')
    .from('.hero__subtitle', { y: 20, opacity: 0, duration: 0.8 }, '-=0.5')
    .from('.hero__cta .btn', { y: 20, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.4')
    .from('.hero__scroll-hint', { opacity: 0, duration: 0.6 }, '-=0.2')
    .from('.hero__bg-text', { opacity: 0, duration: 1.2 }, '-=1.2');
}

/* ═══════════════════════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════════════════════ */
function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  const dot  = cursor.querySelector('.cursor__dot');
  const ring = cursor.querySelector('.cursor__ring');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    gsap.to(dot, {
      x: mouseX,
      y: mouseY,
      duration: 0.08,
      ease: 'none',
    });
  });

  // Lerp ring for smooth lag effect
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    gsap.set(ring, { x: ringX, y: ringY });
    raf = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover state on interactive elements
  const hoverTargets = 'a, button, .project-card, .filter-btn, [data-cursor-hover]';

  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hovered'));
  });

  // Hide when leaving viewport
  document.addEventListener('mouseleave', () => {
    gsap.to(cursor, { opacity: 0, duration: 0.3 });
  });
  document.addEventListener('mouseenter', () => {
    gsap.to(cursor, { opacity: 1, duration: 0.3 });
  });
}

/* ═══════════════════════════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════════════════════════ */
function initNav() {
  const nav = document.getElementById('nav');
  const menuBtn = nav?.querySelector('.nav__menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!nav) return;

  // Scroll state
  ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    toggleClass: { className: 'nav--scrolled', targets: '#nav' },
  });

  // Hide/show on scroll direction
  let lastY = 0;
  ScrollTrigger.create({
    start: 'top -200',
    end: 99999,
    onUpdate: (self) => {
      const currentY = self.scroll();
      if (currentY > lastY && currentY > 200) {
        gsap.to(nav, { yPercent: -100, duration: 0.4, ease: 'power2.inOut' });
      } else {
        gsap.to(nav, { yPercent: 0, duration: 0.4, ease: 'power2.inOut' });
      }
      lastY = currentY;
    }
  });

  // Mobile menu toggle
  if (menuBtn && mobileMenu) {
    let isOpen = false;
    menuBtn.addEventListener('click', () => {
      isOpen = !isOpen;
      mobileMenu.classList.toggle('is-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      animateMenuBtn(menuBtn, isOpen);
    });

    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
      link.addEventListener('click', () => {
        isOpen = false;
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
        animateMenuBtn(menuBtn, false);
      });
    });
  }
}

function animateMenuBtn(btn, isOpen) {
  const spans = btn.querySelectorAll('span');
  if (isOpen) {
    gsap.to(spans[0], { rotate: 45, y: 7, duration: 0.3, ease: 'power2.out' });
    gsap.to(spans[1], { rotate: -45, y: -7, duration: 0.3, ease: 'power2.out' });
  } else {
    gsap.to(spans, { rotate: 0, y: 0, duration: 0.3, ease: 'power2.out' });
  }
}

/* ═══════════════════════════════════════════════════════════
   SCROLL REVEALS (IntersectionObserver fallback for non-GSAP)
═══════════════════════════════════════════════════════════ */
function initScrollReveals() {
  // Using GSAP ScrollTrigger for reveal-* classes
  const items = document.querySelectorAll('.reveal-text, .reveal-line, .reveal-scale, .reveal-up');

  items.forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => el.classList.add('is-visible'),
      once: true,
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   HERO PARALLAX
═══════════════════════════════════════════════════════════ */
function initHeroParallax() {
  const bgText = document.querySelector('.hero__bg-text');
  const heroMedia = document.querySelector('.hero__media');
  if (!bgText) return;

  gsap.to(bgText, {
    y: 120,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    }
  });

  if (heroMedia) {
    gsap.to(heroMedia, {
      y: 80,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   PROJECT CARDS — stagger on scroll
═══════════════════════════════════════════════════════════ */
function initProjectCards() {
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;

  gsap.from(cards, {
    y: 60,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.works__grid',
      start: 'top 80%',
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   WORKS FILTER
═══════════════════════════════════════════════════════════ */
function initWorksFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        gsap.to(card, {
          opacity: match ? 1 : 0.2,
          scale:   match ? 1 : 0.97,
          duration: 0.4,
          ease: 'power2.out',
        });
        card.style.pointerEvents = match ? '' : 'none';
      });
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   MARQUEE — pause on hover
═══════════════════════════════════════════════════════════ */
function initMarquee() {
  const track = document.querySelector('.marquee__track');
  if (!track) return;

  const marqueeEl = track.closest('.marquee');

  marqueeEl?.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  marqueeEl?.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
}

/* ═══════════════════════════════════════════════════════════
   SMOOTH ANCHOR SCROLL
═══════════════════════════════════════════════════════════ */
function initSmoothScroll() {
  const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const offsetTop = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    });
  });
}
