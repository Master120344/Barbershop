document.addEventListener('DOMContentLoaded', () => {

    const body = document.body;
    const loader = document.querySelector('.loader');
    const menuButton = document.querySelector('.menu-button');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const heroTitle = document.querySelector('.hero-title');

    // --- LOADER ---
    window.addEventListener('load', () => {
        loader.classList.add('loaded');
    });

    // --- CHARACTER REVEAL ANIMATION ---
    const chars = heroTitle.querySelectorAll('.char');
    chars.forEach((char, index) => {
        char.style.animationDelay = `${index * 0.05 + 0.5}s`;
    });

    // --- MENU TOGGLE ---
    menuButton.addEventListener('click', () => {
        body.classList.toggle('nav-open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            body.classList.remove('nav-open');
        });
    });

    // --- MAGNETIC BUTTON ---
    const menuBtnContainer = document.querySelector('.menu-button-container');
    menuBtnContainer.addEventListener('mousemove', (e) => {
        const rect = menuBtnContainer.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        menuButton.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    menuBtnContainer.addEventListener('mouseleave', () => {
        menuButton.style.transform = 'translate(0, 0)';
    });

    // --- SCROLL REVEAL ---
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(el => {
        observer.observe(el);
    });
});