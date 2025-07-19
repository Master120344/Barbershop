document.addEventListener('DOMContentLoaded', function() {

    // --- Side Navigation Menu Logic ---
    const menuIcon = document.getElementById('menu-icon');
    const sideNav = document.getElementById('side-nav');
    const overlay = document.getElementById('overlay');
    const navLinks = document.querySelectorAll('.nav-link');

    // Function to open the menu
    function openMenu() {
        sideNav.classList.add('open');
        overlay.classList.add('show');
    }

    // Function to close the menu
    function closeMenu() {
        sideNav.classList.remove('open');
        overlay.classList.remove('show');
    }

    // Event listener for the menu icon
    menuIcon.addEventListener('click', openMenu);

    // Event listener for the overlay (to close menu when clicking outside)
    overlay.addEventListener('click', closeMenu);

    // Event listeners for each nav link to close menu on click
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });


    // --- Fade-in on Scroll Animation ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing the element once it's visible
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // observes intersections relative to the viewport
        threshold: 0.1 // triggers when 10% of the element is visible
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

});
