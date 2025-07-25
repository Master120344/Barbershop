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
    const phoneInput = document.getElementById('phone');
    const bookingDateInput = document.getElementById('bookingDate');
    const bookingTimeInput = document.getElementById('bookingTime');

    const localStorageKey = 'cleanCutzSelectedServices';

    // --- Hamburger Menu Logic ---
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // --- Load Selected Services from Previous Page ---
    const loadSelectedServices = () => {
        try {
            const storedServices = localStorage.getItem(localStorageKey);
            let selectedServices = [];
            if (storedServices) {
                selectedServices = JSON.parse(storedServices);
            }

            if (selectedServicesInput) {
                selectedServicesInput.value = selectedServices.join(', ');
            }

            if (servicesListDisplay) {
                if (selectedServices.length > 0) {
                    servicesListDisplay.innerHTML = '<ul>' + selectedServices.map(service => `<li>${service}</li>`).join('') + '</ul>';
                    submitButton.disabled = false;
                } else {
                    servicesListDisplay.innerHTML = '<p class="no-services-message">No services selected. Please return to the <a href="services_mobile.html">Services page</a> to choose.</p>';
                    submitButton.disabled = true;
                }
            }
        } catch (error) {
            console.error("Error loading services on booking page:", error);
            if (servicesListDisplay) {
                servicesListDisplay.innerHTML = '<p class="no-services-message error-message">Error loading selected services.</p>';
            }
            if(submitButton) submitButton.disabled = true;
        }
    };

    // --- Phone Number Formatting ---
    const formatPhoneNumber = (value) => {
        if (!value) return '';
        const digits = value.replace(/\D/g, '');
        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `${digits.substring(0, 3)}-${digits.substring(3)}`;
        return `${digits.substring(0, 3)}-${digits.substring(3, 6)}-${digits.substring(6, 10)}`;
    };

    if (phoneInput) {
        phoneInput.addEventListener('input', () => phoneInput.value = formatPhoneNumber(phoneInput.value));
    }

    // --- Input Validation ---
    const validateField = (field, condition, errorMessage) => {
        const errorDiv = document.querySelector(`.error-message[data-for="${field.id}"]`);
        const isValid = condition;

        if (errorDiv) {
            errorDiv.textContent = isValid ? '' : errorMessage;
        }
        field.classList.toggle('invalid', !isValid);
        return isValid;
    };
    
    // --- Set Minimum Date for Date Input ---
    if (bookingDateInput) {
        const today = new Date().toISOString().split('T')[0];
        bookingDateInput.setAttribute('min', today);
    }

    // --- Form Submission Logic (Changed to mailto:) ---
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Always prevent default submission

            let isFormValid = true;

            isFormValid &= validateField(appointmentForm.fullName, appointmentForm.fullName.value.trim().length > 1, 'Please enter a valid name.');
            isFormValid &= validateField(appointmentForm.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(appointmentForm.email.value), 'Please enter a valid email.');
            isFormValid &= validateField(phoneInput, /^\d{3}-\d{3}-\d{4}$/.test(phoneInput.value), 'Use format 123-456-7890.');
            isFormValid &= validateField(bookingDateInput, bookingDateInput.value !== '', 'Please select a date.');
            isFormValid &= validateField(bookingTimeInput, bookingTimeInput.value !== '', 'Please select a time.');
            
            // Check if services are selected
            const storedServices = localStorage.getItem(localStorageKey);
            const services = storedServices ? JSON.parse(storedServices) : [];
            if (services.length === 0) {
                 if (servicesListDisplay) {
                    servicesListDisplay.innerHTML = '<p class="no-services-message error-message">No services selected. Please go back and choose.</p>';
                }
                isFormValid = false;
            }

            if (!isFormValid) {
                return; // Stop if form is invalid
            }

            // --- Construct mailto link ---
            const yourBusinessEmail = 'your-email@example.com'; // IMPORTANT: Change this to your actual email address
            const subject = `New Booking Request from ${appointmentForm.fullName.value}`;
            
            const body = `
A new appointment has been requested. Please confirm with the client.

--- Client Details ---
Name: ${appointmentForm.fullName.value}
Email: ${appointmentForm.email.value}
Phone: ${phoneInput.value}

--- Appointment Details ---
Requested Date: ${bookingDateInput.value}
Requested Time: ${bookingTimeInput.value}

--- Selected Services ---
${services.join('\n')}

--- Additional Notes ---
${commentsTextarea.value || 'None'}
            `;
            
            // Encode the subject and body for the URL
            const mailtoLink = `mailto:${yourBusinessEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // Show success message and redirect
            responseMessageDiv.textContent = 'Your booking request is ready! Redirecting to your email client to send...';
            responseMessageDiv.className = 'response-message success';
            responseMessageDiv.style.display = 'block';

            // Redirect to email client after a short delay
            setTimeout(() => {
                window.location.href = mailtoLink;
                appointmentForm.reset();
                localStorage.removeItem(localStorageKey);
                loadSelectedServices(); // Refresh UI
            }, 2500);
        });
    }

    // --- Character Counter for Textarea ---
    if (commentsTextarea && charCounter) {
        const updateCounter = () => {
            const maxLength = parseInt(commentsTextarea.getAttribute('maxlength'), 10);
            const currentLength = commentsTextarea.value.length;
            charCounter.textContent = `${currentLength} / ${maxLength}`;
        };
        commentsTextarea.addEventListener('input', updateCounter);
        updateCounter(); // Initial call
    }

    // Initial load of services when the page is ready
    loadSelectedServices();
});