document.addEventListener('DOMContentLoaded', function() {

    // --- Fade-in on Scroll Animation Logic ---

    // Select all elements that should be revealed on scroll
    const revealElements = document.querySelectorAll('.reveal');

    // Create an Intersection Observer
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // If the element is intersecting the viewport (i.e., visible)
            if (entry.isIntersecting) {
                // Add the 'visible' class to trigger the CSS animation
                entry.target.classList.add('visible');
                // Stop observing the element after it has been revealed
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // observes intersections relative to the viewport
        threshold: 0.1, // triggers the animation when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // starts the animation a little sooner
    });

    // Attach the observer to each element
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

});
