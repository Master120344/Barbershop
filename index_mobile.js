document.addEventListener('DOMContentLoaded', () => {

    // Slick Carousel Initialization
    $(document).ready(function(){
        $('.gallery-carousel').slick({
            dots: true,
            infinite: true,
            speed: 800,
            slidesToShow: 1, // Show one item at a time on mobile
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 4000,
            centerMode: true, // Center the current item
            centerPadding: '0px', // No padding around the center item
            responsive: [
                // You can add breakpoints here if needed, but for a mobile-first approach,
                // the default settings above should be sufficient for small screens.
                // Example for tablets:
                // {
                //     breakpoint: 768,
                //     settings: {
                //         slidesToShow: 2,
                //         slidesToScroll: 1,
                //         centerMode: false, // Disable center mode on larger screens if desired
                //     }
                // }
            ]
        });
    });

    // Smooth Scrolling for Anchor Links
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

    // Mobile Navigation Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const icon = mobileNavToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        // Close mobile menu when a link is clicked
        document.querySelectorAll('.main-nav ul li a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    const icon = mobileNavToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // Prevent default submission first
            event.preventDefault();

            let formIsValid = true;
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            // Clear previous errors
            clearFormErrors();

            // Validate Name
            if (nameInput.value.trim() === '') {
                displayFormError(nameInput, 'Please enter your full name.');
                formIsValid = false;
            }

            // Validate Email
            const emailValue = emailInput.value.trim();
            if (emailValue === '') {
                displayFormError(emailInput, 'Please enter your email address.');
                formIsValid = false;
            } else if (!isValidEmail(emailValue)) {
                displayFormError(emailInput, 'Please enter a valid email address.');
                formIsValid = false;
            }

            // Validate Message
            if (messageInput.value.trim() === '') {
                displayFormError(messageInput, 'Please leave us a message.');
                formIsValid = false;
            }

            // If the form is valid, proceed with submission (e.g., using Fetch API or AJAX)
            // For now, we'll just show a success alert and reset the form.
            if (formIsValid) {
                alert('Form submitted successfully! We will be in touch shortly.');
                contactForm.reset(); // Resets the form fields
            }
        });
    }

    function isValidEmail(email) {
        // Basic email validation regex
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    function displayFormError(inputElement, message) {
        const parent = inputElement.closest('.form-row, .form-group'); // Find the parent div containing the input
        if (!parent) return;

        let errorSpan = parent.querySelector('.error-message');
        if (!errorSpan) {
            errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            parent.appendChild(errorSpan);
        }
        errorSpan.textContent = message;
        inputElement.classList.add('input-error'); // Add class for styling
    }

    function clearFormErrors() {
        document.querySelectorAll('.error-message').forEach(span => span.remove());
        document.querySelectorAll('.input-error').forEach(input => {
            input.classList.remove('input-error');
        });
    }
});