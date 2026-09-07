// Zenext.ai — Project page interactions
// Scope: scroll-reveal, category filter, and subtle desktop-only
// parallax for the hero and project visuals. Follows the same
// IntersectionObserver + prefers-reduced-motion pattern used in
// main.js / services.js — no new animation library introduced.

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  /* ------------------------------------------------------------
     Scroll reveal — [data-reveal] elements and each .proj section
     ------------------------------------------------------------ */
  const revealTargets = document.querySelectorAll('[data-reveal], .proj');

  if ('IntersectionObserver' in window && revealTargets.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* ------------------------------------------------------------
     Category filter
     ------------------------------------------------------------ */
  const filterButtons = document.querySelectorAll('.proj-filter__btn');
  const projects = document.querySelectorAll('.proj');

  function applyFilter(category) {
    projects.forEach((proj) => {
      const matches = category === 'all' || proj.dataset.category === category;
      if (matches) {
        proj.classList.remove('is-hidden');
        requestAnimationFrame(() => proj.classList.remove('is-filtering'));
      } else {
        proj.classList.add('is-filtering');
        window.setTimeout(() => {
          if (proj.classList.contains('is-filtering')) proj.classList.add('is-hidden');
        }, 350);
      }
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.toggle('is-active', b === btn));
      applyFilter(btn.dataset.filter);
    });
  });

  /* ------------------------------------------------------------
     Hero — very subtle mouse-reactive orb/path movement (desktop only)
     ------------------------------------------------------------ */
  const hero = document.querySelector('.proj-hero');
  if (hero && !reduceMotion && !isTouch) {
    const orbs = hero.querySelectorAll('.proj-hero__orb');
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      orbs.forEach((orb, i) => {
        const strength = 10 + i * 6;
        orb.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
    });
    hero.addEventListener('mouseleave', () => {
      orbs.forEach((orb) => { orb.style.transform = ''; });
    });
  }

  /* ------------------------------------------------------------
     Project visuals — gentle depth tilt on desktop hover
     ------------------------------------------------------------ */
  if (!reduceMotion && !isTouch) {
    document.querySelectorAll('.proj__visual').forEach((visual) => {
      visual.addEventListener('mousemove', (e) => {
        const rect = visual.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        visual.style.transform = `rotateY(${x * 3}deg) rotateX(${-y * 3}deg)`;
      });
      visual.addEventListener('mouseleave', () => {
        visual.style.transform = '';
      });
    });
  }
})();
