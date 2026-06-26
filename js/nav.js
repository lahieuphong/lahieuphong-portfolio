/* ═══════════════════════════════════════════════════════════
   NAV — Scroll behavior + mobile menu toggle
═══════════════════════════════════════════════════════════ */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initNav() {
  const nav        = document.getElementById('nav');
  const menuBtn    = nav?.querySelector('.nav__menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!nav) return;

  // Add .nav--scrolled class when page scrolls past 80px
  ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    toggleClass: { className: 'nav--scrolled', targets: '#nav' },
  });

  // Hide nav on scroll down, show on scroll up
  let lastY = 0;
  ScrollTrigger.create({
    start: 'top -200',
    end: 99999,
    onUpdate: (self) => {
      const y = self.scroll();
      gsap.to(nav, {
        yPercent: y > lastY && y > 200 ? -100 : 0,
        duration: 0.4,
        ease: 'power2.inOut',
      });
      lastY = y;
    },
  });

  // Mobile menu toggle
  if (!menuBtn || !mobileMenu) return;

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

function animateMenuBtn(btn, isOpen) {
  const [top, bottom] = btn.querySelectorAll('span');
  if (isOpen) {
    gsap.to(top,    { rotate: 45,  y:  7, duration: 0.3, ease: 'power2.out' });
    gsap.to(bottom, { rotate: -45, y: -7, duration: 0.3, ease: 'power2.out' });
  } else {
    gsap.to([top, bottom], { rotate: 0, y: 0, duration: 0.3, ease: 'power2.out' });
  }
}
