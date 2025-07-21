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

        // Phone number auto-formatting
        phoneInput.addEventListener('input', (e) => {
            let input = e.target.value.replace(/\D/g, ''); // Remove all non-digits
            input = input.substring(0, 10); // Only take the first 10 digits
            
            let formattedInput = '';
            if (input.length > 6) {
                formattedInput = `${input.substring(0, 3)}-${input.substring(3, 6)}-${input.substring(6, 10)}`;
            } else if (input.length > 3) {
                formattedInput = `${input.substring(0, 3)}-${input.substring(3, 6)}`;
            } else if (input.length > 0) {
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
            e.preventDefault();
            if (!validateForm()) return;

            setLoading(true);
            const formData = new FormData(form);

            fetch('process_booking.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => handleResponse(data))
            .catch(error => {
                handleResponse({ success: false, message: 'A network error occurred. Please try again.' });
                console.error('Error:', error);
            })
            .finally(() => setLoading(false));
        });

        function validateForm() {
            let isValid = true;
            form.querySelectorAll('[required]').forEach(input => {
                const errorContainer = input.closest('.form-group, .form-group-inline .form-group').querySelector('.error-message');
                clearError(input, errorContainer);

                if (input.value.trim() === '') {
                    isValid = false;
                    showError(input, errorContainer, 'This field is required.');
                } else if (input.id === 'phone' && input.value.length < 12) { // 10 digits + 2 dashes
                     isValid = false;
                     showError(input, errorContainer, 'Please enter a full 10-digit phone number.');
                }
            });
            return isValid;
        }

        function showError(input, container, message) {
            container.textContent = message;
            input.classList.add('invalid');
        }

        function clearError(input, container) {
            container.textContent = '';
            input.classList.remove('invalid');
        }

        function setLoading(isLoading) {
            submitButton.disabled = isLoading;
            buttonText.style.display = isLoading ? 'none' : 'block';
            buttonLoader.style.display = isLoading ? 'block' : 'none';
        }

        function handleResponse(data) {
            responseMessageContainer.className = 'response-message';
            responseMessageContainer.style.display = 'block';
            responseMessageContainer.textContent = data.message;

            if (data.success) {
                responseMessageContainer.classList.add('success');
                form.reset();
                charCounter.textContent = '0 / 1000'; // Reset counter
                form.style.display = 'none';
                document.querySelector('.form-intro').textContent = "We've received your request!";
            } else {
                responseMessageContainer.classList.add('error');
            }
        }
    }
});