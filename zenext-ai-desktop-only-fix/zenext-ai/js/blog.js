// Zenext.ai — Blog listing page
// Scope: category pill filtering + scroll-reveal for blog cards.

(function () {
  const track = document.getElementById('blogFilters');
  const grid = document.getElementById('blogGrid');
  const empty = document.getElementById('blogEmpty');
  if (!track || !grid) return;

  const buttons = Array.from(track.querySelectorAll('.blog-filter'));
  const cards = Array.from(grid.querySelectorAll('.blog-card'));

  function applyFilter(category) {
    let visibleCount = 0;
    cards.forEach((card) => {
      const match = category === 'all' || card.dataset.category === category;
      card.classList.toggle('is-hidden', !match);
      if (match) visibleCount += 1;
    });
    if (empty) empty.classList.toggle('is-visible', visibleCount === 0);
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      applyFilter(btn.dataset.filter);
    });
  });

  // Scroll reveal
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    cards.forEach((card) => observer.observe(card));
  } else {
    cards.forEach((card) => card.classList.add('is-visible'));
  }
})();
