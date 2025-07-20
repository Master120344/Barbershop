document.addEventListener('DOMContentLoaded', () => {

    const body = document.body;
    const loader = document.querySelector('.loader');
    const menuButton = document.querySelector('.menu-button');
    const navOverlay = document.getElementById('nav-overlay'); // Use ID for consistency
    const navLinks = document.querySelectorAll('.nav-link');
    const heroTitle = document.querySelector('.hero-title');
    const menuButtonContainer = document.querySelector('.menu-button-container'); // Added for mouseleave effect

    // --- LOADER ---
    // Use setTimeout for a more controlled loader disappearance, ensuring it's fully rendered
    setTimeout(() => {
        if (loader) {
            loader.classList.add('loaded');
        }
    }, 1500); // Show loader for 1.5 seconds

    // --- CHARACTER REVEAL ANIMATION ---
    if (heroTitle) {
        const chars = heroTitle.querySelectorAll('.char');
        chars.forEach((char, index) => {
            // Ensure animation delay is applied correctly
            char.style.animation = `revealChar 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`;
            char.style.animationDelay = `${index * 0.06 + 0.5}s`; // Slightly adjusted delay
        });
    }

    // --- MENU TOGGLE ---
    if (menuButton && navOverlay) {
        menuButton.addEventListener('click', () => {
            body.classList.toggle('nav-open');
            // Add aria-expanded attribute for accessibility
            const isExpanded = body.classList.contains('nav-open');
            menuButton.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (body.classList.contains('nav-open')) {
                body.classList.remove('nav-open');
                menuButton.setAttribute('aria-expanded', 'false'); // Reset aria attribute
            }
        });
    });

    // --- MAGNETIC BUTTON EFFECT ---
    if (menuButtonContainer && menuButton) {
        menuButtonContainer.addEventListener('mousemove', (e) => {
            const rect = menuButtonContainer.getBoundingClientRect();
            // Calculate position relative to the center of the container
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            // Apply a subtle magnetic pull effect
            menuButton.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`; // Reduced intensity
        });

        menuButtonContainer.addEventListener('mouseleave', () => {
            // Reset transform when mouse leaves
            menuButton.style.transform = 'translate(0, 0)';
        });
    }

    // --- SCROLL REVEAL ANIMATION ---
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, {
        threshold: 0.15 // Trigger animation when 15% of the element is visible
    });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- SMOOTH SCROLLING (CSS-based is preferred, but JS can enhance) ---
    // The CSS `scroll-behavior: smooth;` on `html` element is the primary way now.
    // This JS is for fallback or additional control if needed, but the CSS handles it well.

    // Optional: Add smooth scroll to the scroll indicator link
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Optional: Smooth scrolling for nav links if CSS `scroll-behavior` doesn't cover all cases
    // (though it generally does for anchor links)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Check if the link is an internal anchor link
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault(); // Prevent default jump behavior
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // --- Add accessibility for menu button ---
    menuButton.setAttribute('aria-haspopup', 'true');
    menuButton.setAttribute('aria-controls', 'nav-overlay');
    menuButton.setAttribute('aria-expanded', 'false'); // Initial state

});