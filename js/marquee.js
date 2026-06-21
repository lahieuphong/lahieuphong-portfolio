/* ═══════════════════════════════════════════════════════════
   MARQUEE — Pause scrolling text on hover
═══════════════════════════════════════════════════════════ */

export function initMarquee() {
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
