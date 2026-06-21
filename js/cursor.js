/* ═══════════════════════════════════════════════════════════
   CURSOR — Custom cursor with lag ring effect
═══════════════════════════════════════════════════════════ */

export function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  const dot  = cursor.querySelector('.cursor__dot');
  const ring = cursor.querySelector('.cursor__ring');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.08, ease: 'none' });
  });

  // Lerp ring for smooth trailing effect
  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    gsap.set(ring, { x: ringX, y: ringY });
    requestAnimationFrame(animateRing);
  })();

  // Expand ring on hover over interactive elements
  const HOVER_SELECTOR = 'a, button, .project-card, .filter-btn, [data-cursor-hover]';
  document.querySelectorAll(HOVER_SELECTOR).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hovered'));
  });

  // Fade out/in when leaving/entering the viewport
  document.addEventListener('mouseleave', () => gsap.to(cursor, { opacity: 0, duration: 0.3 }));
  document.addEventListener('mouseenter', () => gsap.to(cursor, { opacity: 1, duration: 0.3 }));
}
