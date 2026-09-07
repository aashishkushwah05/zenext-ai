// Zenext.ai — Phase 1 interactions
// Scope: nav scroll state, mobile menu toggle, smooth-scroll close-on-click.

(function () {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const heroSection = document.querySelector('.hero');
  const heroReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Add a solid/blurred background to the nav once the page has scrolled
  // past the top, so the hero can stay full-bleed at load. Also gives
  // the hero a very subtle depth/fade as it scrolls out of view, so the
  // next section doesn't just cut in abruptly.
  function updateNavState() {
    if (window.scrollY > 12) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }

    if (heroSection && !heroReduceMotion) {
      const progress = Math.min(window.scrollY / heroSection.offsetHeight, 1);
      heroSection.style.setProperty('--hero-scroll', progress.toFixed(3));
    }
  }

  updateNavState();
  window.addEventListener('scroll', updateNavState, { passive: true });

  // Home hero video: start immediately instead of waiting for scroll/interaction.
  // Muted + playsinline keeps it compatible with modern mobile autoplay rules.
  const homeHeroVideo = document.getElementById('homeHeroVideo');
  if (homeHeroVideo) {
    const startHeroVideo = () => {
      homeHeroVideo.muted = true;
      homeHeroVideo.playsInline = true;
      const playAttempt = homeHeroVideo.play();
      if (playAttempt && typeof playAttempt.catch === 'function') playAttempt.catch(() => {});
    };
    if (homeHeroVideo.readyState >= 2) startHeroVideo();
    else homeHeroVideo.addEventListener('canplay', startHeroVideo, { once: true });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) startHeroVideo();
    });
    window.addEventListener('pageshow', startHeroVideo);
  }

  // Mobile menu toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close the mobile menu after a link is tapped
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Footer year
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Hero visual: extremely subtle mouse-based depth on desktop only.
  // Skipped entirely on touch devices and for prefers-reduced-motion.
  const heroVisual = document.getElementById('heroVisual');
  const heroFrame = heroVisual ? heroVisual.querySelector('.hero-frame') : null;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  if (heroVisual && heroFrame && !reduceMotion && !isTouch) {
    heroVisual.classList.add('has-parallax');
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroFrame.style.transform = `rotateY(${x * 4}deg) rotateX(${-y * 4}deg) scale(1.01)`;
    });
    heroVisual.addEventListener('mouseleave', () => {
      heroFrame.style.transform = '';
    });
  }

  // Service card videos: if the source file is missing, unsupported,
  // or fails to load, fall back to the original CSS/SVG animation.
  // Event-based (not a blind timeout) so a slow-but-successful load
  // never gets mistaken for a failure.
  document.querySelectorAll('[data-video-fallback]').forEach((wrap) => {
    const video = wrap.querySelector('[data-video-src]');
    if (!video) return;

    let settled = false;

    const markFailed = () => {
      if (settled) return;
      settled = true;
      wrap.classList.add('video-failed');
    };

    const markOk = () => {
      settled = true;
      wrap.classList.remove('video-failed');
    };

    video.addEventListener('error', markFailed, true);
    video.addEventListener('loadeddata', markOk);
    video.addEventListener('canplay', markOk);

    // Safety net for anything that neither fires an error nor ever
    // produces playable data (e.g. a stalled request).
    setTimeout(() => {
      if (!settled) markFailed();
    }, 4000);
  });
})();
