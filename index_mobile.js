// index_mobile.js
document.addEventListener('DOMContentLoaded', () => {

    const body = document.body;
    const loader = document.querySelector('.loader');
    const menuButton = document.querySelector('.menu-button');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuContainer = document.querySelector('.menu-container'); // For magnetic effect
    const heroTitle = document.querySelector('.hero-title');

    // --- LOADER FADE OUT ---
    setTimeout(() => {
        if (loader) {
            loader.classList.add('loaded');
        }
    }, 2000); // Loader shown for 2 seconds

    // --- HERO TITLE CHARACTER REVEAL ANIMATION ---
    if (heroTitle) {
        const chars = heroTitle.querySelectorAll('.char');
        chars.forEach((char, index) => {
            char.style.animation = `revealChar 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`;
            char.style.animationDelay = `${index * 0.07 + 0.5}s`; // Staggered animation
        });
    }

    // --- MENU TOGGLE ---
    if (menuButton && navOverlay) {
        menuButton.addEventListener('click', () => {
            body.classList.toggle('nav-open');
            const isExpanded = body.classList.contains('nav-open');
            menuButton.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (body.classList.contains('nav-open')) {
                body.classList.remove('nav-open');
                menuButton.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // --- MAGNETIC EFFECT FOR MENU BUTTON ---
    if (menuContainer && menuButton) {
        menuContainer.addEventListener('mousemove', (e) => {
            const rect = menuContainer.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            // Apply a subtle magnetic pull effect
            menuButton.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        menuContainer.addEventListener('mouseleave', () => {
            menuButton.style.transform = 'translate(0, 0)';
        });
    }

    // --- SCROLL REVEAL ANIMATION ---
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible for performance
            }
        });
    }, {
        threshold: 0.15 // Trigger animation when 15% of the element is visible
    });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- SMOOTH SCROLLING FOR ANCHOR LINKS ---
    // Primarily handled by CSS 'scroll-behavior: smooth;', but JS can ensure robustness.
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Check if it's an internal anchor link
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault(); // Prevent default jump
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // --- Testimonial Slider Logic (Basic CSS-driven) ---
    // For more advanced slider functionality (arrows, dots, autoplay), a dedicated JS library would be needed.
    // The current setup relies on CSS `overflow-x: auto` and `scroll-snap-type`.

    // --- ACCESSIBILITY ---
    menuButton.setAttribute('aria-haspopup', 'true');
    menuButton.setAttribute('aria-controls', 'nav-overlay');
    menuButton.setAttribute('aria-expanded', 'false'); // Initial state
});