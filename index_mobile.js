document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navUl = document.querySelector('nav ul');
    const navLinks = document.querySelectorAll('nav ul li a');

    // Toggle the mobile navigation menu
    hamburger.addEventListener('click', function () {
        navUl.classList.toggle('active');
    });

    // Close the menu when a navigation link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navUl.classList.remove('active');
        });
    });

    // Close the menu if the user clicks outside of it
    document.addEventListener('click', function (event) {
        if (!navUl.contains(event.target) && !hamburger.contains(event.target)) {
            navUl.classList.remove('active');
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
                    block: 'start'
                });
            }
        });
    });
});