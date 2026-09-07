(() => {
  const showTip = () => {
    const tip = document.querySelector('.whatsapp-btn__tip');
    if (!tip) return;
    requestAnimationFrame(() => tip.classList.add('is-visible'));
    window.setTimeout(() => tip.classList.remove('is-visible'), 3600);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(showTip, 450), { once: true });
  else setTimeout(showTip, 450);
})();
