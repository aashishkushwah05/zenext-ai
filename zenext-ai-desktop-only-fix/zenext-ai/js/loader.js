// Zenext.ai — Loading screen / brand reveal
// Scope: drives the progress fill, waits for the page to actually be
// ready, then removes the loader with a short exit transition and
// restores scrolling. Fails safe: if anything goes wrong, the loader
// is removed rather than left blocking the site.

(function () {
  const loader = document.getElementById('loader');
  const fill = document.getElementById('loaderFill');
  const body = document.body;

  if (!loader) return;

  // Respect users who've asked for less motion: skip straight to a
  // near-instant reveal instead of the full sequence.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const MIN_VISIBLE_MS = reduceMotion ? 150 : 700; // don't flash, but don't stall either
  const EXIT_MS = reduceMotion ? 200 : 450;
  const startTime = performance.now();

  let pageReady = false;
  let finished = false;

  function fillBar(percent) {
    if (fill) fill.style.width = percent + '%';
  }

  // Nudge the bar forward while we wait, so it never looks stalled at 0%
  // even if the load event takes a moment (slow network, large assets).
  fillBar(15);
  const nudge = setTimeout(() => fillBar(65), reduceMotion ? 0 : 250);

  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(nudge);
    fillBar(100);

    const elapsed = performance.now() - startTime;
    const wait = Math.max(MIN_VISIBLE_MS - elapsed, 0);

    setTimeout(() => {
      loader.classList.add('is-exiting');
      // Let the small fade-up on the mark/word play briefly before the
      // whole panel dissolves, so the exit reads as one motion, not a cut.
      setTimeout(() => {
        loader.classList.add('is-hidden');
        body.classList.remove('is-loading');
      }, reduceMotion ? 0 : 120);

      // Clean up entirely once the exit transition has finished.
      setTimeout(() => {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 120 + EXIT_MS);
    }, wait);
  }

  function onPageReady() {
    if (pageReady) return;
    pageReady = true;
    finish();
  }

  if (document.readyState === 'complete') {
    onPageReady();
  } else {
    window.addEventListener('load', onPageReady);
  }

  // Safety net: never let the loader block the site for more than a
  // couple of seconds, even if the load event never fires as expected.
  setTimeout(onPageReady, 2500);
})();
