
document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('primary-menu');
  const header = document.querySelector('.site-header');
  const yearEl = document.getElementById('year');
  yearEl.textContent = new Date().getFullYear();

  navToggle.addEventListener('click', function () {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    if (menu.hasAttribute('hidden')) {
      menu.removeAttribute('hidden');
    } else {
      menu.setAttribute('hidden', '');
    }
  });

  document.addEventListener('click', function (e) {
    if (!header.contains(e.target) && !menu.hasAttribute('hidden')) {
      menu.setAttribute('hidden', '');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({behavior: 'smooth', block: 'start'});
        if (!menu.hasAttribute('hidden')) {
          menu.setAttribute('hidden', '');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
});