document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navUl = document.querySelector('nav ul');
    const navLinks = document.querySelectorAll('nav ul li a');

    // Toggle the mobile navigation menu
    hamburger.addEventListener('click', function () {
        navUl.classList.toggle('active');
        // Optional: Add animation class to hamburger lines if you want them to change icon (e.g., to an 'X')
        // hamburger.classList.toggle('is-active'); 
    });

    // Close the menu when a navigation link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navUl.classList.remove('active');
            // If you have the hamburger animation class, remove it here too
            // hamburger.classList.remove('is-active');
        });
    });

    // Close the menu if the user clicks outside of it
    document.addEventListener('click', function (event) {
        // Check if the click was outside the nav menu and not on the hamburger icon itself
        if (!navUl.contains(event.target) && !hamburger.contains(event.target)) {
            navUl.classList.remove('active');
            // Remove hamburger animation class if applied
            // hamburger.classList.remove('is-active');
        }
    });

    // Smooth scrolling for navigation links to sections
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' // Scrolls to the top of the element
                });
            }
        });
    });
});