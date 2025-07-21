document.addEventListener('DOMContentLoaded', function () {
    // --- Hamburger Menu Logic ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu ul li a');

    hamburger.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from bubbling up to document
        navMenu.classList.toggle('active');
        // Optional: Add animation class to hamburger lines if you add the CSS for it
        // hamburger.classList.toggle('is-active');
    });

    // Close menu if clicking on a navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            // hamburger.classList.remove('is-active');
        });
    });

    // Close menu if clicking outside of it
    document.addEventListener('click', (event) => {
        // Check if the click is outside the navMenu AND outside the hamburger icon
        if (navMenu.classList.contains('active') && !navMenu.contains(event.target) && !hamburger.contains(event.target)) {
            navMenu.classList.remove('active');
            // hamburger.classList.remove('is-active');
        }
    });

    // --- Optional: Scroll to section logic if needed (already handled by anchor links in HTML) ---
    // The HTML uses simple '#' links which browsers handle natively for scrolling.
    // If you wanted custom smooth scrolling for these links, you'd add that logic here,
    // similar to what was in the index_mobile.js for anchor links.

});