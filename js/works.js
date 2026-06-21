/* ═══════════════════════════════════════════════════════════
   WORKS — Project cards stagger + category filter
═══════════════════════════════════════════════════════════ */

export function initProjectCards() {
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
    },
  });
}

export function initWorksFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.project-card');
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
