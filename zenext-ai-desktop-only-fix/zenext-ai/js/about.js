// Zenext.ai — About page interactions (Part 1)
// Scope: scroll-triggered reveal for the shared "journey" component
// (Problem / Vision / Approach) and the "Built to Evolve" node network.
// Lightweight IntersectionObserver only — no animation libraries.

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealOnce(selector, className) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add(className));
      return;
    }

    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(className);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    els.forEach((el) => io.observe(el));
  }

  revealOnce('.journey', 'is-visible');
  revealOnce('.evolve__network', 'is-visible');
  revealOnce('.reveal-up', 'is-visible');
})();
