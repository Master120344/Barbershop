document.addEventListener('DOMContentLoaded', function () {
    // --- Hamburger Menu Logic ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // --- Form Logic ---
    const form = document.getElementById('appointment-form');
    const submitButton = form.querySelector('.cta-button');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonLoader = submitButton.querySelector('.button-loader');
    const responseMessageContainer = document.getElementById('form-response-message');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validateForm()) {
            // Shake the button slightly if validation fails
            submitButton.style.animation = 'shake 0.5s';
            setTimeout(() => { submitButton.style.animation = '' }, 500);
            return;
        }

        setLoading(true);
        const formData = new FormData(form);

        fetch('process_booking.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            handleResponse(data);
        })
        .catch(error => {
            handleResponse({ success: false, message: 'A network error occurred. Please try again.' });
            console.error('Error:', error);
        })
        .finally(() => {
            setLoading(false);
        });
    });

    function validateForm() {
        let isValid = true;
        form.querySelectorAll('[required]').forEach(input => {
            const errorContainer = input.closest('.form-group, .form-group-inline .form-group').querySelector('.error-message');
            clearError(input, errorContainer); // Clear previous errors first

            if (input.value.trim() === '') {
                isValid = false;
                showError(input, errorContainer, 'This field is required.');
            } else if (input.type === 'email' && !/\S+@\S+\.\S+/.test(input.value)) {
                isValid = false;
                showError(input, errorContainer, 'Please enter a valid email address.');
            } else if (input.type === 'tel' && !/^[0-9\s-()+.]{10,}$/.test(input.value)) { // More flexible phone validation
                isValid = false;
                showError(input, errorContainer, 'Please enter a valid phone number.');
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
        responseMessageContainer.className = 'response-message'; // Reset classes
        responseMessageContainer.style.display = 'block';
        responseMessageContainer.textContent = data.message;

        if (data.success) {
            responseMessageContainer.classList.add('success');
            form.reset();
            form.style.display = 'none';
            document.querySelector('.form-intro').textContent = "We've received your request!";
        } else {
            responseMessageContainer.classList.add('error');
        }
    }
});