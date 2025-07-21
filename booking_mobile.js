document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
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

    // --- Helper Functions ---
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

    const formatPhoneNumber = (value) => {
        if (!value) return '';
        // Remove all non-digit characters
        const digits = value.replace(/\D/g, '');
        // Apply formatting: XXX-XXX-XXXX
        if (digits.length <= 3) {
            return digits;
        } else if (digits.length <= 6) {
            return `${digits.substring(0, 3)}-${digits.substring(3)}`;
        } else {
            return `${digits.substring(0, 3)}-${digits.substring(3, 6)}-${digits.substring(6, 10)}`;
        }
    };

    const updateCharCounter = () => {
        const maxLength = parseInt(commentsTextarea.getAttribute('maxlength'), 10);
        const currentLength = commentsTextarea.value.length;
        if (charCounter) {
            charCounter.textContent = `${currentLength} / ${maxLength}`;
        }
    };

    // --- Navigation Functionality ---
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

    // --- Form Input Validation ---
    const inputsToValidate = [phoneInput, appointmentForm.fullName, appointmentForm.email, bookingDateInput, bookingTimeInput];

    const validateInput = (input) => {
        const value = input.value.trim();
        let isValid = true;

        if (input.id === 'fullName') {
            if (value === '') { showError(input, 'Full name is required.'); isValid = false; }
            else if (!/^[a-zA-Z\s'-]+$/.test(value)) { showError(input, 'Please enter a valid name.'); isValid = false; }
        } else if (input.id === 'email') {
            if (value === '') { showError(input, 'Email address is required.'); isValid = false; }
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { showError(input, 'Please enter a valid email address.'); isValid = false; }
        } else if (input.id === 'phone') {
            if (value === '') { showError(input, 'Phone number is required.'); isValid = false; }
            else if (!/^\d{3}-\d{3}-\d{4}$/.test(value)) { showError(input, 'Use format 123-456-7890.'); isValid = false; } // Validate formatted
        } else if (input.id === 'bookingDate') {
            if (value === '') { showError(input, 'Please select a date.'); isValid = false; }
            else {
                const selectedDate = new Date(value);
                const today = new Date(); today.setHours(0, 0, 0, 0);
                if (selectedDate < today) { showError(input, 'Date cannot be in the past.'); isValid = false; }
            }
        } else if (input.id === 'bookingTime') {
            if (value === '') { showError(input, 'Please select a time.'); isValid = false; }
            else {
                const [hours, minutes] = value.split(':').map(Number);
                if (hours < 9 || (hours === 18 && minutes > 0) || hours > 18) { showError(input, 'Select between 9 AM and 6 PM.'); isValid = false; }
            }
        }
        
        if (isValid) { removeError(input); }
        return isValid;
    };

    // Add event listeners for real-time validation
    inputsToValidate.forEach(input => {
        input.addEventListener('input', () => {
            if (input.id === 'phone') {
                input.value = formatPhoneNumber(input.value); // Format as typing
            }
            validateInput(input);
        });
        input.addEventListener('change', () => validateInput(input));
        input.addEventListener('blur', () => validateInput(input));
    });

    // --- Load Selected Services ---
    const loadSelectedServices = () => {
        const storedServices = localStorage.getItem(localStorageKey);
        if (storedServices) {
            const selectedServices = JSON.parse(storedServices);
            
            if (selectedServicesInput) {
                selectedServicesInput.value = selectedServices.join(', ');
            }

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
                    servicesListDisplay.innerHTML = '<p class="no-services-message">No services selected. Please return to the <a href="services_mobile.html">Services page</a> to make your selection.</p>';
                    if (submitButton) submitButton.disabled = true;
                }
            }
        } else {
            if (servicesListDisplay) {
                servicesListDisplay.innerHTML = '<p class="no-services-message">No services selected. Please return to the <a href="services_mobile.html">Services page</a> to make your selection.</p>';
            }
            if (submitButton) submitButton.disabled = true;
        }
    };

    // --- Form Submission Handling ---
    appointmentForm.addEventListener('submit', (event) => {
        event.preventDefault();

        let isFormValid = true;
        inputsToValidate.forEach(input => {
            if (!validateInput(input)) {
                isFormValid = false;
            }
        });

        const selectedServices = localStorage.getItem(localStorageKey);
        if (!selectedServices || JSON.parse(selectedServices).length === 0) {
            if (servicesListDisplay) {
                servicesListDisplay.innerHTML = '<p class="no-services-message error-message">No services selected. Please return to the <a href="services_mobile.html">Services page</a> to make your selection.</p>';
            }
            isFormValid = false;
        }

        if (isFormValid) {
            submitButton.querySelector('.button-text').style.display = 'none';
            submitButton.querySelector('.button-loader').style.display = 'block';
            submitButton.disabled = true;

            // Simulate form submission: use Fetch API to send data to process_booking.php
            const formData = new FormData(appointmentForm);
            
            fetch('process_booking.php', { // Make sure this path is correct relative to your HTML file
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Clear localStorage after successful submission
                    localStorage.removeItem(localStorageKey);
                    
                    responseMessageDiv.textContent = data.message;
                    responseMessageDiv.classList.add('success');
                    responseMessageDiv.style.display = 'block';

                    appointmentForm.reset();
                    if (selectedServicesInput) selectedServicesInput.value = '';
                    if (servicesListDisplay) servicesListDisplay.innerHTML = '';
                    updateCharCounter();
                    
                    // Reset button visibility
                    submitButton.querySelector('.button-text').style.display = 'inline-block';
                    submitButton.querySelector('.button-loader').style.display = 'none';
                    // The button will be re-enabled by the form reset, but we can also set it explicitly if needed.
                    submitButton.disabled = false; 

                } else {
                    responseMessageDiv.textContent = data.message;
                    responseMessageDiv.classList.add('error');
                    responseMessageDiv.style.display = 'block';
                    
                    submitButton.querySelector('.button-text').style.display = 'inline-block';
                    submitButton.querySelector('.button-loader').style.display = 'none';
                    submitButton.disabled = false; 
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                responseMessageDiv.textContent = 'An unexpected error occurred. Please try again.';
                responseMessageDiv.classList.add('error');
                responseMessageDiv.style.display = 'block';
                
                submitButton.querySelector('.button-text').style.display = 'inline-block';
                submitButton.querySelector('.button-loader').style.display = 'none';
                submitButton.disabled = false; 
            });
        }
    });

    // --- Initialize Calendar ---
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek', // Start with a weekly view
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        editable: false, // Cannot edit events by drag/drop
        selectable: true, // Allows clicking/dragging to select slots
        dayMaxEvents: true, // Allow "more" link when too many events
        slotDuration: '00:15:00', // Standard 15 minute slots for barber shops is common
        slotLabelFormat: {
            hour: 'numeric',
            minute: '2-minute',
            omitZeroMinute: false,
            meridiem: 'short'
        },
        // Fetch events from your PHP API
        events: 'get_availability.php', // Make sure this path is correct

        eventContent: function(arg) {
            // Customize event display
            let italicEl = document.createElement('em');
            if (arg.event.classNames.includes('fc-event-booked')) {
                italicEl.innerText = 'Booked'; // Display 'Booked' for red slots
            } else if (arg.event.classNames.includes('fc-event-available')) {
                italicEl.innerText = 'Available'; // Display 'Available' for green slots
            } else {
                italicEl.innerText = arg.event.title || 'Event'; // Fallback for any other event types
            }
            
            // Use background color for the whole event
            arg.el.style.backgroundColor = arg.event.backgroundColor;
            arg.el.style.borderColor = arg.event.borderColor;

            return {
                domNodes: [italicEl]
            };
        },

        // Handle clicking on an available slot to pre-fill booking form
        slotClick: function(info) {
            // Check if the clicked slot is available (has 'fc-event-available' class)
            if (info.dayEl.classList.contains('fc-event-available') || info.dayEl.classList.contains('fc-timegrid-slot') && !info.dayEl.closest('.fc-event')) {
                // Set date and time inputs
                bookingDateInput.value = info.dateStr.split('T')[0]; // YYYY-MM-DD
                bookingTimeInput.value = info.dateStr.split('T')[1].slice(0, 5); // HH:MM

                // Trigger validation or show a message that fields are updated
                // Optional: You might want to scroll to the form
                document.getElementById('appointment-form').scrollIntoView({ behavior: 'smooth' });
            } else {
                // If it's a booked slot, maybe show a message
                alert('This slot is already booked.');
            }
        },
        
        // This handles clicking on days too, useful for setting just the date
        dateClick: function(info) {
            // If the user clicks a day without selecting a time, set the date
            // Ensure it's not already a booked day based on the event color
             if (info.dayEl.style.backgroundColor !== 'rgb(255, 107, 107)') { // Check if background is NOT red (booked)
                bookingDateInput.value = info.dateStr;
                // Keep the time input as is, or reset it
                // bookingTimeInput.value = ''; 
                document.getElementById('appointment-form').scrollIntoView({ behavior: 'smooth' });
             } else {
                 alert('This day is fully booked.');
             }
        }
    });

    // --- Initialize ---
    calendar.render();
    loadSelectedServices();
    updateCharCounter(); // Initialize counter

    // Update phone input formatting on blur if not already formatted
    if (phoneInput) {
        phoneInput.addEventListener('blur', () => {
            if (phoneInput.value) {
                phoneInput.value = formatPhoneNumber(phoneInput.value);
            }
        });
    }
});