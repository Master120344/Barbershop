document.addEventListener('DOMContentLoaded', function () {
    // --- Hamburger Menu Logic ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from bubbling up to document
        navMenu.classList.toggle('active');
    });

    // Close menu if clicking outside of it
    document.addEventListener('click', (event) => {
        if (navMenu.classList.contains('active') && !navMenu.contains(event.target)) {
            navMenu.classList.remove('active');
        }
    });

    // --- Form Logic ---
    const form = document.getElementById('appointment-form');
    if (form) {
        const phoneInput = document.getElementById('phone');
        const commentsInput = document.getElementById('comments');
        const charCounter = document.querySelector('.char-counter');
        const submitButton = form.querySelector('.cta-button');
        const buttonText = submitButton.querySelector('.button-text');
        const buttonLoader = submitButton.querySelector('.button-loader');
        const responseMessageContainer = document.getElementById('form-response-message');

        // Phone number auto-formatting with dashes
        phoneInput.addEventListener('input', (e) => {
            let input = e.target.value.replace(/\D/g, ''); // Remove all non-digits
            // Limit to 10 digits for formatting
            if (input.length > 10) {
                input = input.substring(0, 10);
            }

            let formattedInput = '';
            if (input.length > 6) {
                formattedInput = `${input.substring(0, 3)}-${input.substring(3, 6)}-${input.substring(6, 10)}`;
            } else if (input.length > 3) {
                formattedInput = `${input.substring(0, 3)}-${input.substring(3, 6)}`;
            } else {
                formattedInput = input;
            }
            e.target.value = formattedInput;
        });

        // Character counter for comments
        commentsInput.addEventListener('input', () => {
            const count = commentsInput.value.length;
            charCounter.textContent = `${count} / 1000`;
        });

        // Form submission
        form.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent default submission

            // Before submitting, validate all fields
            if (!validateForm()) {
                return; // Stop submission if validation fails
            }

            setLoading(true); // Show loading state
            const formData = new FormData(form);

            // Simulate form submission (replace with actual fetch API call)
            // Example using fetch:
            fetch('process_booking.php', { // Replace with your actual PHP endpoint
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => handleResponse(data))
            .catch(error => {
                handleResponse({ success: false, message: 'An error occurred while processing your request. Please try again.' });
                console.error('Form submission error:', error);
            })
            .finally(() => setLoading(false)); // Hide loading state
        });

        function validateForm() {
            let isValid = true;
            // Clear previous errors before re-validating
            form.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(input => {
                const errorContainer = input.closest('.form-group, .form-group-inline .form-group').querySelector('.error-message');
                clearError(input, errorContainer);
            });

            // Validate each required field
            form.querySelectorAll('[required]').forEach(input => {
                const errorContainer = input.closest('.form-group, .form-group-inline .form-group').querySelector('.error-message');
                
                if (input.value.trim() === '') {
                    isValid = false;
                    showError(input, errorContainer, 'This field is required.');
                } else if (input.type === 'email' && !isValidEmail(input.value)) {
                    isValid = false;
                    showError(input, errorContainer, 'Please enter a valid email address.');
                } else if (input.id === 'phone') {
                    // Check if the phone number has the correct format (10 digits with dashes)
                    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
                    if (input.value.length < 12 || !phoneRegex.test(input.value)) {
                         isValid = false;
                         showError(input, errorContainer, 'Please enter a valid 10-digit phone number (e.g., 123-456-7890).');
                    }
                }
            });
            return isValid;
        }

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function showError(input, container, message) {
            if (container) {
                container.textContent = message;
            }
            input.classList.add('invalid');
        }

        function clearError(input, container) {
            if (container) {
                container.textContent = '';
            }
            input.classList.remove('invalid');
        }

        function setLoading(isLoading) {
            submitButton.disabled = isLoading;
            buttonText.style.display = isLoading ? 'none' : 'block';
            buttonLoader.style.display = isLoading ? 'block' : 'none';
        }

        function handleResponse(data) {
            responseMessageContainer.className = 'response-message'; // Reset classes
            responseMessageContainer.style.display = 'block';
            responseMessageContainer.textContent = data.message;

            if (data.success) {
                responseMessageContainer.classList.add('success');
                form.reset(); // Reset form fields
                // Reset character counter manually after reset
                if (charCounter) charCounter.textContent = '0 / 1000'; 
                // Hide form and update intro message
                form.style.display = 'none';
                const formIntro = document.querySelector('.form-intro');
                if (formIntro) {
                    formIntro.textContent = "We've received your request! We'll be in touch soon.";
                    formIntro.style.fontSize = '1.2rem'; // Make message slightly larger
                }
            } else {
                responseMessageContainer.classList.add('error');
            }
        }
    }
});