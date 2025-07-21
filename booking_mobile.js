document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('appointment-form');
    const submitButton = form.querySelector('.cta-button');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonLoader = submitButton.querySelector('.button-loader');
    const responseMessageContainer = document.getElementById('form-response-message');

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
            if (input.value.trim() === '') {
                isValid = false;
                showError(input, errorContainer, 'This field is required.');
            } else if (input.type === 'email' && !/\S+@\S+\.\S+/.test(input.value)) {
                isValid = false;
                showError(input, errorContainer, 'Please enter a valid email address.');
            } else {
                clearError(input, errorContainer);
            }
        });
        return isValid;
    }

    function showError(input, container, message) {
        container.textContent = message;
        input.style.borderColor = 'var(--error-color)';
    }

    function clearError(input, container) {
        container.textContent = '';
        input.style.borderColor = '';
    }

    function setLoading(isLoading) {
        if (isLoading) {
            submitButton.disabled = true;
            buttonText.style.display = 'none';
            buttonLoader.style.display = 'block';
        } else {
            submitButton.disabled = false;
            buttonText.style.display = 'block';
            buttonLoader.style.display = 'none';
        }
    }

    function handleResponse(data) {
        responseMessageContainer.className = 'response-message'; // Reset classes
        responseMessageContainer.style.display = 'block';
        responseMessageContainer.textContent = data.message;

        if (data.success) {
            responseMessageContainer.classList.add('success');
            form.reset();
            form.style.display = 'none'; // Hide form on success
            document.querySelector('.form-intro').style.display = 'none'; // Hide intro text
        } else {
            responseMessageContainer.classList.add('error');
        }
    }
    
    // --- Hamburger Menu Logic (from index_mobile.js) ---
    const hamburger = document.querySelector('.hamburger');
    const navUl = document.querySelector('nav ul');
    if(hamburger) {
        hamburger.addEventListener('click', () => navUl.classList.toggle('active'));
    }
});