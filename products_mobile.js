document.addEventListener('DOMContentLoaded', function () {
    // --- Hamburger Menu Logic ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu ul li a');

    hamburger.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from bubbling up to document
        navMenu.classList.toggle('active');
        // Optional: Add animation class to hamburger lines
        hamburger.classList.toggle('is-active');
    });

    // Close menu if clicking on a navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('is-active');
        });
    });

    // Close menu if clicking outside of it
    document.addEventListener('click', (event) => {
        // Check if the click is outside the navMenu AND outside the hamburger icon
        if (navMenu.classList.contains('active') && !navMenu.contains(event.target) && !hamburger.contains(event.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('is-active');
        }
    });

    // --- Add to Cart Functionality (Placeholder) ---
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            // Prevent default button action if any
            event.preventDefault();

            // Get product details (example)
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;

            // Here you would typically:
            // 1. Add the item to a shopping cart (e.g., using localStorage or sending to a backend)
            // 2. Provide visual feedback to the user (e.g., a "Added!" message, update cart icon)

            console.log(`Added to cart: ${productName} - ${productPrice}`);

            // Simple visual feedback: change button text temporarily
            const originalText = this.textContent;
            this.textContent = 'Added!';
            this.disabled = true; // Disable button briefly
            this.style.backgroundColor = 'var(--success-color)'; // Green background
            this.style.color = '#000'; // Black text

            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
                this.style.backgroundColor = ''; // Reset to original style
                this.style.color = '';
            }, 1500); // Reset after 1.5 seconds
        });
    });

    // Optional: Add subtle animations on scroll for product cards
    const productCards = document.querySelectorAll('.product-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Unobserve after first animation to save performance
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    productCards.forEach(card => {
        observer.observe(card);
    });
});

// Optional: Add CSS for the hamburger animation if desired
/*
.hamburger.is-active .line:nth-child(1) {
    transform: translateY(9px) rotate(45deg);
}
.hamburger.is-active .line:nth-child(2) {
    opacity: 0;
}
.hamburger.is-active .line:nth-child(3) {
    transform: translateY(-9px) rotate(-45deg);
}
*/```