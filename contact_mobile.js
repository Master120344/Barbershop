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

    // --- Contact Form Submission (Placeholder) ---
    const contactForm = document.getElementById('contact-form');
    const formResponseMessage = document.getElementById('form-response-message');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission

            // Basic validation
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');

            let isValid = true;

            // Clear previous error states
            contactForm.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
                input.style.borderColor = '#444'; // Reset border color
            });
            formResponseMessage.style.display = 'none';

            // Check if fields are empty
            if (nameInput.value.trim() === '') {
                nameInput.style.borderColor = 'var(--error-color)';
                isValid = false;
            }
            if (emailInput.value.trim() === '' || !isValidEmail(emailInput.value)) {
                emailInput.style.borderColor = 'var(--error-color)';
                isValid = false;
            }
            if (subjectInput.value.trim() === '') {
                subjectInput.style.borderColor = 'var(--error-color)';
                isValid = false;
            }
            if (messageInput.value.trim() === '') {
                messageInput.style.borderColor = 'var(--error-color)';
                isValid = false;
            }

            if (!isValid) {
                showResponseMessage('Please fill in all required fields.', 'error');
                return;
            }

            // Simulate sending the form data
            // In a real application, you would use fetch() to send this to a backend script (e.g., PHP, Node.js)
            console.log('Form data submitted:', {
                name: nameInput.value,
                email: emailInput.value,
                subject: subjectInput.value,
                message: messageInput.value
            });

            // Simulate success response
            setTimeout(() => {
                showResponseMessage('Thank you! Your message has been sent.', 'success');
                contactForm.reset(); // Clear the form
            }, 1500); // Simulate network delay
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showResponseMessage(message, type) {
        formResponseMessage.textContent = message;
        formResponseMessage.className = 'response-message ' + type; // Add 'success' or 'error' class
        formResponseMessage.style.display = 'block';
    }
});