// Zenext.ai — Blog article pages
// Scope: scroll-reveal for sections/flow-diagrams/cards, and animating
// the CSS bar chart (Digital Advertising article) into view once.

(function () {
  const revealTargets = document.querySelectorAll('.reveal, .flow-diagram');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  // Animated bar chart
  const chart = document.querySelector('.bar-chart');
  if (chart && 'IntersectionObserver' in window) {
    const chartObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          chartObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    chartObserver.observe(chart);
  } else if (chart) {
    chart.classList.add('is-visible');
  }
})();
