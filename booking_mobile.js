document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const appointmentForm = document.getElementById('appointment-form');
    const servicesListDisplay = document.getElementById('services-list-display');
    const selectedServicesInput = document.getElementById('selectedServicesInput');
    const commentsTextarea = document.getElementById('comments');
    const charCounter = document.querySelector('.char-counter');
    const submitButton = document.getElementById('submit-booking-button');
    const responseMessageDiv = document.getElementById('form-response-message');

    const localStorageKey = 'cleanCutzSelectedServices';

    // --- Hamburger Menu Functionality ---
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close nav menu when a link is clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // --- Load Selected Services from LocalStorage ---
    const loadSelectedServices = () => {
        const storedServices = localStorage.getItem(localStorageKey);
        if (storedServices) {
            const selectedServices = JSON.parse(storedServices);
            
            // Update the hidden input for form submission
            if (selectedServicesInput) {
                selectedServicesInput.value = selectedServices.join(', ');
            }

            // Display the selected services in the summary area
            if (servicesListDisplay) {
                if (selectedServices.length > 0) {
                    servicesListDisplay.innerHTML = '<ul>' +
                        selectedServices.map(service => `<li>${service}</li>`).join('') +
                        '</ul>';
                    
                    // Pre-fill comments if they are empty
                    if (!commentsTextarea.value.trim()) {
                        commentsTextarea.value = `Services requested: ${selectedServices.join(', ')}.`;
                        updateCharCounter();
                    }
                } else {
                    // If no services were selected, prompt user to go back
                    servicesListDisplay.innerHTML = '<p class="no-services-message">No services selected. Please return to the <a href="services_mobile.html">Services page</a> to make your selection.</p>';
                    // Disable the form if no services are selected
                    if (submitButton) submitButton.disabled = true;
                }
            }
        } else {
             // If no services found in localStorage, prompt user to go back
            if (servicesListDisplay) {
                servicesListDisplay.innerHTML = '<p class="no-services-message">No services selected. Please return to the <a href="services_mobile.html">Services page</a> to make your selection.</p>';
            }
            if (submitButton) submitButton.disabled = true;
        }
    };

    // --- Form Validation Logic ---
    const formGroups = document.querySelectorAll('.form-group');
    const inputsToValidate = document.querySelectorAll('#appointment-form input[required], #appointment-form select[required], #appointment-form textarea[required]');

    const showError = (input, message) => {
        const errorDiv = document.querySelector(`.error-message[data-for="${input.id}"]`);
        if (errorDiv) {
            errorDiv.textContent = message;
        }
        input.classList.add('invalid');
    };

    const removeError = (input) => {
        const errorDiv = document.querySelector(`.error-message[data-for="${input.id}"]`);
        if (errorDiv) {
            errorDiv.textContent = '';
        }
        input.classList.remove('invalid');
    };

    const validateInput = (input) => {
        const value = input.value.trim();
        let isValid = true;

        if (input.id === 'fullName') { // Full Name
            if (value === '') {
                showError(input, 'Full name is required.');
                isValid = false;
            } else if (!/^[a-zA-Z\s'-]+$/.test(value)) { // Allows letters, spaces, hyphens, apostrophes
                showError(input, 'Please enter a valid name.');
                isValid = false;
            }
        } else if (input.id === 'email') { // Email
            if (value === '') {
                showError(input, 'Email address is required.');
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                showError(input, 'Please enter a valid email address.');
                isValid = false;
            }
        } else if (input.id === 'phone') { // Phone Number
            if (value === '') {
                showError(input, 'Phone number is required.');
                isValid = false;
            } else if (!/^\d{3}-?\d{3}-?\d{4}$/.test(value)) {
                showError(input, 'Use format 123-456-7890.');
                isValid = false;
            }
        } else if (input.id === 'bookingDate') { // Date
            if (value === '') {
                showError(input, 'Please select a date.');
                isValid = false;
            } else {
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Start of today
                if (selectedDate < today) {
                    showError(input, 'Date cannot be in the past.');
                    isValid = false;
                }
            }
        } else if (input.id === 'bookingTime') { // Time
            if (value === '') {
                showError(input, 'Please select a time.');
                isValid = false;
            } else {
                const [hours, minutes] = value.split(':').map(Number);
                if (hours < 9 || (hours === 18 && minutes > 0) || hours > 18) {
                    showError(input, 'Select between 9 AM and 6 PM.');
                    isValid = false;
                }
            }
        }
        
        if (isValid) {
            removeError(input);
        }
        return isValid;
    };

    // Add event listeners for real-time validation
    inputsToValidate.forEach(input => {
        input.addEventListener('input', () => validateInput(input));
        input.addEventListener('change', () => validateInput(input)); // For date/time inputs
        input.addEventListener('blur', () => validateInput(input)); // Validate on blur as well
    });

    // Character counter for comments
    const updateCharCounter = () => {
        const maxLength = parseInt(commentsTextarea.getAttribute('maxlength'), 10);
        const currentLength = commentsTextarea.value.length;
        if (charCounter) {
            charCounter.textContent = `${currentLength} / ${maxLength}`;
        }
    };
    if (commentsTextarea) {
        commentsTextarea.addEventListener('input', updateCharCounter);
        updateCharCounter(); // Initialize counter on load
    }

    // --- Form Submission Handling ---
    appointmentForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        let isFormValid = true;
        inputsToValidate.forEach(input => {
            if (!validateInput(input)) {
                isFormValid = false;
            }
        });

        // Check if services were actually selected
        const selectedServices = localStorage.getItem(localStorageKey);
        if (!selectedServices || JSON.parse(selectedServices).length === 0) {
            if (servicesListDisplay) {
                servicesListDisplay.innerHTML = '<p class="no-services-message error-message">No services selected. Please return to the <a href="services_mobile.html">Services page</a> to make your selection.</p>';
            }
            isFormValid = false;
        }

        if (isFormValid) {
            // Disable button and show loader
            submitButton.querySelector('.button-text').style.display = 'none';
            submitButton.querySelector('.button-loader').style.display = 'block';
            submitButton.disabled = true;

            // Simulate form submission (replace with actual AJAX if you have a backend)
            setTimeout(() => {
                // Clear localStorage after successful (simulated) submission
                localStorage.removeItem(localStorageKey);
                
                // Show success message
                responseMessageDiv.textContent = 'Booking request received! We will contact you shortly to confirm your appointment.';
                responseMessageDiv.classList.add('success');
                responseMessageDiv.style.display = 'block';

                // Clear the form fields
                appointmentForm.reset();
                if (selectedServicesInput) selectedServicesInput.value = ''; // Clear hidden input
                if (servicesListDisplay) servicesListDisplay.innerHTML = ''; // Clear summary display
                updateCharCounter(); // Reset counter
                
                // Hide loader and re-enable button (optional, as form is cleared)
                submitButton.querySelector('.button-text').style.display = 'inline-block';
                submitButton.querySelector('.button-loader').style.display = 'none';
                
                // Re-enable button if needed, or leave it disabled
                // submitButton.disabled = false; 

            }, 1500); // Simulate network delay
        } else {
            console.log("Form is invalid.");
        }
    });

    // Initial load of selected services and validation setup
    loadSelectedServices();
});