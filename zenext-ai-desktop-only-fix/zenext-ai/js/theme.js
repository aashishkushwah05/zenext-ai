// Zenext.ai — Light / System / Dark theme picker
(function () {
  // Single site-wide key: the chosen theme should follow the visitor
  // across every page, not reset per page. First-time visitors (no
  // saved value yet) get Dark by default everywhere, including Home.
  const STORAGE_KEY = 'zenext-theme';
  const SITE_DEFAULT = document.documentElement.getAttribute('data-page-theme') === 'article-light' ? 'light' : 'dark';
  const ARTICLE_LIGHT_PAGE = document.documentElement.getAttribute('data-page-theme') === 'article-light';
  const root = document.documentElement;
  const buttons = document.querySelectorAll('[data-theme-toggle]');
  const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;

  function savedMode() {
    if (ARTICLE_LIGHT_PAGE) return SITE_DEFAULT;
    try { return localStorage.getItem(STORAGE_KEY) || SITE_DEFAULT; } catch (e) { return SITE_DEFAULT; }
  }
  function resolved(mode) {
    return mode === 'system' ? (media && media.matches ? 'light' : 'dark') : mode;
  }
  function apply(mode) {
    root.setAttribute('data-theme', resolved(mode));
    if (!ARTICLE_LIGHT_PAGE) { try { localStorage.setItem(STORAGE_KEY, mode); } catch (e) {} }
    document.querySelectorAll('.theme-menu__option').forEach((option) => {
      const active = option.dataset.themeMode === mode;
      option.classList.toggle('is-active', active);
      option.setAttribute('aria-checked', String(active));
    });
  }
  function closeAll(except) {
    document.querySelectorAll('.theme-menu.is-open').forEach((menu) => {
      if (menu !== except) menu.classList.remove('is-open');
    });
    buttons.forEach((button) => button.setAttribute('aria-expanded', 'false'));
  }
  function icon(type) {
    if (type === 'light') return '☀';
    if (type === 'system') return '▣';
    return '☾';
  }
  function buildMenu(button) {
    const menu = document.createElement('div');
    menu.className = 'theme-menu';
    menu.setAttribute('role', 'radiogroup');
    menu.setAttribute('aria-label', 'Choose theme');
    ['light', 'system', 'dark'].forEach((mode) => {
      const option = document.createElement('button');
      option.type = 'button'; option.className = 'theme-menu__option';
      option.dataset.themeMode = mode; option.setAttribute('role', 'radio');
      option.innerHTML = '<span class="theme-menu__icon" aria-hidden="true">' + icon(mode) + '</span><span>' + mode.charAt(0).toUpperCase() + mode.slice(1) + '</span><span class="theme-menu__check">✓</span>';
      option.addEventListener('click', () => { apply(mode); menu.classList.remove('is-open'); button.setAttribute('aria-expanded', 'false'); });
      menu.appendChild(option);
    });
    document.body.appendChild(menu);
    function position() {
      const rect = button.getBoundingClientRect();
      const width = 210;
      menu.style.top = (rect.bottom + 10) + 'px';
      menu.style.left = Math.max(12, Math.min(window.innerWidth - width - 12, rect.right - width)) + 'px';
    }
    button.addEventListener('click', (event) => {
      event.stopPropagation(); closeAll(menu); position(); menu.classList.toggle('is-open'); button.setAttribute('aria-expanded', String(menu.classList.contains('is-open'))); apply(savedMode());
    });
    window.addEventListener('resize', () => { if (menu.classList.contains('is-open')) position(); });
    return menu;
  }
  buttons.forEach(buildMenu);
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.theme-menu') && !event.target.closest('[data-theme-toggle]')) closeAll(null);
  });
  apply(savedMode());
  if (media) {
    const onChange = () => { if (savedMode() === 'system') apply('system'); };
    if (media.addEventListener) media.addEventListener('change', onChange); else media.addListener(onChange);
  }
})();
