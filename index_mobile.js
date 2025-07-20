// index_mobile.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Slick Carousel Initialization ---
    $(document).ready(function(){
        // Gallery Carousel
        $('.gallery-carousel').slick({
            dots: true,
            infinite: true,
            speed: 800,
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 4000,
            centerMode: true, // Center the active slide
            centerPadding: '0px', // Padding for center mode
            responsive: [
                {
                    breakpoint: 1200, // Medium screens
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: true,
                        centerMode: false, // Disable center mode on smaller screens
                    }
                },
                {
                    breakpoint: 768, // Small screens
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: true,
                        centerMode: true, // Re-enable center mode for single slide
                        centerPadding: '0px',
                    }
                }
            ]
        });
    });

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
    const mainNav = document.querySelector('.main-nav');

    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            // Toggle icon between bars and close
            const icon = mobileNavToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        // Close mobile menu when a navigation link is clicked
        document.querySelectorAll('.main-nav ul li a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                const icon = mobileNavToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // --- Hero Video Autoplay Control ---
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        // Attempt to play the video
        const playPromise = heroVideo.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Video playback started successfully.
                // You can add any callbacks here if needed.
            })
            .catch(error => {
                // Autoplay was prevented or failed.
                console.log("Video autoplay failed:", error);
                // Optionally, display a placeholder image or a play button.
            });
        }
    }

    // --- Element Fade-in on Scroll ---
    const observerOptions = {
        root: null, // relative to viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    // Select all elements that should fade in
    document.querySelectorAll('.services-section, .gallery-section, .about-craft, .local-artist-feature, .contact-section').forEach(section => {
        // Add a class to sections that should animate when they become visible
        // For example, you can add a wrapper div around content inside sections and apply the fade-in class to it.
        // For simplicity here, we'll assume sections themselves can animate.
        // A more robust solution would target specific elements *within* sections.
        if (!section.classList.contains('hero-section')) { // Don't reanimate hero
            observer.observe(section);
        }
    });

    // --- Contact Form Validation ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            let formIsValid = true;
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            // Clear previous error states
            clearFormErrors();

            // Name validation
            if (nameInput.value.trim() === '') {
                displayFormError(nameInput, 'Please enter your full name.');
                formIsValid = false;
            }

            // Email validation
            const emailValue = emailInput.value.trim();
            if (emailValue === '') {
                displayFormError(emailInput, 'Please enter your email address.');
                formIsValid = false;
            } else if (!isValidEmail(emailValue)) {
                displayFormError(emailInput, 'Please enter a valid email address (e.g., user@example.com).');
                formIsValid = false;
            }

            // Message validation
            if (messageInput.value.trim() === '') {
                displayFormError(messageInput, 'Please leave us a message.');
                formIsValid = false;
            }

            // If the form is valid, proceed with submission (e.g., AJAX)
            if (formIsValid) {
                // In a real-world scenario, you would send this data to a server.
                // For this template, we'll just show an alert.
                alert('Form submitted successfully! We will be in touch shortly.');
                contactForm.reset(); // Reset the form fields
            }
        });
    }

    // Helper function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    // Helper function to display error messages for form inputs
    function displayFormError(inputElement, message) {
        const formGroup = inputElement.closest('.form-row, .form-group'); // Find the parent container
        if (!formGroup) return;

        // Check if an error message already exists
        let errorSpan = formGroup.querySelector('.error-message');
        if (!errorSpan) {
            errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            errorSpan.style.color = 'var(--secondary-color)'; // Use secondary color for errors
            errorSpan.style.fontSize = '0.85rem';
            errorSpan.style.display = 'block'; // Make it a block element
            errorSpan.style.marginTop = '5px';
            formGroup.appendChild(errorSpan);
        }
        errorSpan.textContent = message;
        inputElement.classList.add('input-error'); // Add a class for styling the input
        inputElement.style.borderColor = 'var(--secondary-color)'; // Highlight border
    }

    // Helper function to clear all error messages and styles
    function clearFormErrors() {
        document.querySelectorAll('.error-message').forEach(span => span.remove());
        document.querySelectorAll('.input-error').forEach(input => {
            input.classList.remove('input-error');
            input.style.borderColor = '#e0e0e0'; // Reset border color
        });
    }

});```

---

**Key Enhancements in this Version:**

1.  **Visual Focus:**
    *   **Hero Section:** Implemented a split layout with a main image, a background overlay, and two smaller detail images for a more dynamic look. The text content is structured for impact.
    *   **Service Cards:** Each service now has a dedicated image, a price tag, and a clear "Explore" link, making them more informative and visually appealing.
    *   **Gallery:** Utilizes Slick Carousel for a professional image slider experience, complete with navigation arrows and dots. Captions are added to each image.
    *   **About Section:** Features a more engaging layout with multiple images and a distinct dark background to differentiate it.
    *   **Contact Section:** A cleaner layout with distinct sections for the form and contact details, with improved input styling.
    *   **Footer:** A more structured footer with multiple columns for navigation, services, and contact information.

2.  **Professional Typography:** Uses 'DM Sans' for body text and 'Playfair Display' for headings, providing a sophisticated contrast.

3.  **Color Palette:** Refined the color scheme to lean towards sophisticated blues, greys, and a warm secondary orange/caramel, creating a modern yet inviting barbershop feel.

4.  **Robust Code:**
    *   **HTML:** Semantic HTML5 structure, organized sections, and meaningful class names.
    *   **CSS:** Uses CSS Variables for easy theming, more detailed responsive adjustments, and a cleaner cascade. Includes styling for Slick Carousel and a basic fade-in animation.
    *   **JavaScript:** Includes Slick Carousel integration, smooth scrolling, a functional mobile navigation toggle, and basic contact form validation with visual feedback.

5.  **Placeholder Content:** More descriptive placeholder image paths (`assets/images/...`) are used, assuming you'll have an `assets` folder structure.

Remember to create the `assets` folder with its subfolders (`images`, `videos`) and place your actual image files there, adjusting the paths in the HTML and CSS accordingly.