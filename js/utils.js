/* ═══════════════════════════════════════════════════════════
   UTILS — Smooth anchor scroll
═══════════════════════════════════════════════════════════ */

export function initSmoothScroll() {
  const navH = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
  ) || 80;

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
