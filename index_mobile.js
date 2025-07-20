// index_mobile.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth Scrolling for Anchor Links ---
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

    // --- Mobile Navigation Toggle ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('nav ul');

    if (mobileNavToggle && navMenu) {
        mobileNavToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileNavToggle.querySelector('i').classList.toggle('fa-times'); // Change icon to 'X'
        });

        // Close menu when a link is clicked
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileNavToggle.querySelector('i').classList.remove('fa-times');
                mobileNavToggle.querySelector('i').classList.add('fa-bars');
            });
        });
    }

    // --- Hero Video Playback Control ---
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        // Ensure video plays on user interaction if autoplay is blocked
        const heroSection = document.querySelector('.hero-section');
        heroSection.addEventListener('click', () => {
            if (heroVideo.paused && heroVideo.readyState >= 2) {
                heroVideo.play().catch(error => {
                    // Autoplay might still be blocked by browser policies
                    console.log("Autoplay was prevented:", error);
                });
            }
        });
    }

    // --- Fade-in Animation on Scroll ---
    const fadeElements = document.querySelectorAll('.fade-in-element');
    if (fadeElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Optional: unobserve after it's visible to improve performance
                    // observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        fadeElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- Slick Carousel Initialization (if you decide to use it for testimonials or gallery) ---
    // Example: If you had testimonials in a div with class "testimonial-slider"
    /*
    $(document).ready(function(){
        $('.testimonial-slider').slick({
            dots: true,
            infinite: true,
            speed: 500,
            fade: true, // or false for slide effect
            cssEase: 'linear',
            autoplay: true,
            autoplaySpeed: 5000,
            prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-chevron-left"></i></button>',
            nextArrow: '<button type="button" class="slick-next"><i class="fas fa-chevron-right"></i></button>'
        });
    });
    */

    // --- Gallery Item Lightbox (Conceptual) ---
    // You would typically use a library like Featherlight, Magnific Popup, or similar.
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                // Logic to open a modal with the image using a library or custom implementation
                console.log('Gallery image clicked:', item.querySelector('img').src);
                // Example: Open a simple alert with the image source
                alert('Image Source: ' + item.querySelector('img').src);
            });
        });
    }

    // --- Form Validation (Basic HTML5 and JS for custom messages) ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // Prevent default submission
            event.preventDefault();

            // Basic client-side validation for required fields
            let formIsValid = true;
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            // Clear previous error messages
            clearErrorMessages();

            // Check for empty fields
            if (nameInput.value.trim() === '') {
                displayError(nameInput, 'Name is required.');
                formIsValid = false;
            }
            if (emailInput.value.trim() === '') {
                displayError(emailInput, 'Email is required.');
                formIsValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                displayError(emailInput, 'Please enter a valid email address.');
                formIsValid = false;
            }
            if (messageInput.value.trim() === '') {
                displayError(messageInput, 'Message is required.');
                formIsValid = false;
            }

            if (formIsValid) {
                // Submit the form programmatically if valid
                // In a real application, you would use fetch() or XMLHttpRequest
                // to send the form data to your server.
                alert('Form submitted successfully! (In a real app, this would send data to the server)');
                contactForm.reset(); // Reset the form
            }
        });
    }

    // Helper function to validate email format
    function isValidEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailPattern.test(email);
    }

    // Helper function to display an error message next to an input field
    function displayError(inputElement, message) {
        const formGroup = inputElement.closest('.form-group');
        if (!formGroup) return;

        const errorSpan = formGroup.querySelector('.error-message');
        if (!errorSpan) {
            const newErrorSpan = document.createElement('span');
            newErrorSpan.className = 'error-message';
            newErrorSpan.style.color = 'red';
            newErrorSpan.style.fontSize = '0.85rem';
            newErrorSpan.textContent = message;
            formGroup.appendChild(newErrorSpan);
        } else {
            errorSpan.textContent = message;
        }
        inputElement.classList.add('input-error'); // Add error class for styling
    }

    // Helper function to clear all error messages and classes
    function clearErrorMessages() {
        document.querySelectorAll('.error-message').forEach(span => span.remove());
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
            input.classList.remove('input-error');
        });
    }

    // --- Placeholder for initial logo animation ---
    // This would typically involve more complex JavaScript or CSS animations.
    // For example, a CSS animation class could be added to the logo container.
    // Example:
    // const logo = document.querySelector('.logo-animation img');
    // if (logo) {
    //     logo.style.animation = 'logoShow 1s ease-out forwards';
    // }
    // @keyframes logoShow { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }

});