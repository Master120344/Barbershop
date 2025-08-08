document.addEventListener('DOMContentLoaded', function () {
    var navToggle = document.getElementById('navToggle');
    var nav = document.getElementById('mainNav');
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    function openNav() {
        nav.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
    }
    function closeNav() {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    }

    navToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        if (nav.classList.contains('open')) closeNav(); else openNav();
    });

    document.addEventListener('click', function (e) {
        if (!nav.contains(e.target) && !navToggle.contains(e.target)) closeNav();
    });

    document.querySelectorAll('a[href^="index_mobile.html#"], a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = link.getAttribute('href');
            if (href && href.indexOf('#') > -1) {
                var idx = href.indexOf('#');
                var hash = href.slice(idx + 1);
                var target = document.getElementById(hash);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    closeNav();
                }
            }
        });
    });

    var images = document.querySelectorAll('img');
    images.forEach(function (img) {
        if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    });

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!prefersReduced || !prefersReduced.matches) {
        window.addEventListener('scroll', throttle(handleScroll, 150));
    }
    function handleScroll() {
        var header = document.querySelector('.site-header');
        if (!header) return;
        if (window.scrollY > 20) header.classList.add('scrolled'); else header.classList.remove('scrolled');
    }
    function throttle(fn, wait) {
        var time = Date.now();
        return function () {
            if ((time + wait - Date.now()) < 0) {
                fn();
                time = Date.now();
            }
        };
    }
});