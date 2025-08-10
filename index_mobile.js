document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const yearEl = document.getElementById('year');

    // Set current year in footer
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // --- Hamburger Menu Logic ---
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // If it's an anchor link, scroll smoothly
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }

                // Always close the menu after a click
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
});