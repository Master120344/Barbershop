document.addEventListener('DOMContentLoaded', function() {

    // --- Interactive Gallery Tab Logic ---
    const galleryTabsContainer = document.querySelector('.gallery-tabs');
    const tabLinks = document.querySelectorAll('.tab-link');
    const galleryGrids = document.querySelectorAll('.gallery-grid');

    if (galleryTabsContainer) {
        galleryTabsContainer.addEventListener('click', (e) => {
            // Check if a tab button was clicked
            if (e.target.matches('.tab-link')) {
                const clickedTab = e.target;
                const targetGridId = clickedTab.dataset.tab;
                const targetGrid = document.getElementById(targetGridId);

                // Update active state on tab buttons
                tabLinks.forEach(link => link.classList.remove('active'));
                clickedTab.classList.add('active');

                // Update active state on gallery grids
                galleryGrids.forEach(grid => grid.classList.remove('active'));
                if (targetGrid) {
                    targetGrid.classList.add('active');
                }
            }
        });
    }

    // --- Fade-in on Scroll Animation Logic ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is in view
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

});
