document.addEventListener('DOMContentLoaded', function () {
    // --- Hamburger Menu Logic ---
    const hamburger = document.querySelector('.hamburger');
    const navUl = document.querySelector('nav ul');

    hamburger.addEventListener('click', function () {
        navUl.classList.toggle('active');
    });
    
    document.addEventListener('click', function (event) {
        if (!navUl.contains(event.target) && !hamburger.contains(event.target)) {
            navUl.classList.remove('active');
        }
    });

    // --- Form Validation Logic ---
    const form = document.getElementById('appointment-form');
    const successMessage = document.getElementById('form-success-message');

    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent default submission
        
        let isValid = validateForm();

        if (isValid) {
            // This is where you would typically send data to a server (e.g., using fetch)
            // For now, we'll just simulate a successful submission.
            
            form.style.display = 'none'; // Hide the form
            successMessage.textContent = 'Thank you! Your appointment request has been sent. We will contact you shortly to confirm.';
            successMessage.style.display = 'block'; // Show success message
            window.scrollTo(0, 0); // Scroll to the top
        }
    });

    function validateForm() {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], select[required]');

        inputs.forEach(input => {
            const errorContainer = input.parentElement.querySelector('.error-message');
            
            if (input.value.trim() === '') {
                isValid = false;
                input.classList.add('invalid');
                errorContainer.textContent = 'This field is required.';
            } else if (input.type === 'email' && !isValidEmail(input.value)) {
                isValid = false;
                input.classList.add('invalid');
                errorContainer.textContent = 'Please enter a valid email address.';
            } else if (input.type === 'tel' && !isValidPhone(input.value)) {
                isValid = false;
                input.classList.add('invalid');
                errorContainer.textContent = 'Please enter a valid phone number.';
            } else if (input.type === 'date' && isDateInPast(input.value)) {
                isValid = false;
                input.classList.add('invalid');
                errorContainer.textContent = 'Please select a future date.';
            } else {
                input.classList.remove('invalid');
                errorContainer.textContent = '';
            }
        });

        return isValid;
    }

    function isValidEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function isValidPhone(phone) {
        // Simple regex for common phone formats
        const re = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
        return re.test(phone);
    }
    
    function isDateInPast(dateString) {
        const selectedDate = new Date(dateString + 'T00:00:00'); // Use local timezone
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set today's time to midnight
        return selectedDate < today;
    }
});