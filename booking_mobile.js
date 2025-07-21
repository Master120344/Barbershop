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
    const calendarSection = document.getElementById('availability-calendar-section'); // Get the calendar section

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
        const digits = value.replace(/\D/g, '');
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
            else if (!/^\d{3}-\d{3}-\d{4}$/.test(value)) { showError(input, 'Use format 123-456-7890.'); isValid = false; }
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
                if (hours < 9 || hours >= 18 || (hours === 18 && minutes > 0)) { showError(input, 'Select between 9 AM and 6 PM.'); isValid = false; }
            }
        }
        
        if (isValid) { removeError(input); }
        return isValid;
    };

    inputsToValidate.forEach(input => {
        input.addEventListener('input', () => {
            if (input.id === 'phone') {
                input.value = formatPhoneNumber(input.value);
            }
            validateInput(input);
        });
        input.addEventListener('change', () => validateInput(input));
        input.addEventListener('blur', () => validateInput(input));
    });

    // --- Load Selected Services ---
    let selectedServices = []; // Initialize here

    const loadSelectedServices = () => {
        const storedServices = localStorage.getItem(localStorageKey);
        if (storedServices) {
            selectedServices = JSON.parse(storedServices);
        } else {
            selectedServices = [];
        }

        if (selectedServicesInput) {
            selectedServicesInput.value = selectedServices.join(', ');
        }

        if (servicesListDisplay) {
            if (selectedServices.length > 0) {
                servicesListDisplay.innerHTML = '<ul>' +
                    selectedServices.map(service => `<li>${service}</li>`).join('') +
                    '</ul>';
                
                if (!commentsTextarea.value.trim()) {
                    commentsTextarea.value = `Services requested: ${selectedServices.join(', ')}.`;
                    updateCharCounter();
                }
                // Show the calendar section ONLY if services are selected
                if (calendarSection) {
                    calendarSection.classList.add('visible');
                }
            } else {
                servicesListDisplay.innerHTML = '<p class="no-services-message">No services selected. Please return to the <a href="services_mobile.html">Services page</a> to choose.</p>';
                if (submitButton) submitButton.disabled = true;
                // Hide calendar section if no services selected
                if (calendarSection) {
                    calendarSection.classList.remove('visible');
                }
            }
        }
        // Re-validate the hidden input if services are selected
        validateInput(selectedServicesInput);
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

        if (!selectedServicesInput.value) { // Check if services are actually selected and passed
            showError(selectedServicesInput, 'Please select at least one service.');
            isFormValid = false;
        } else {
            removeError(selectedServicesInput);
        }

        if (isFormValid) {
            submitButton.querySelector('.button-text').style.display = 'none';
            submitButton.querySelector('.button-loader').style.display = 'block';
            submitButton.disabled = true;

            const formData = new FormData(appointmentForm);
            
            fetch('process_booking.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.removeItem(localStorageKey); // Clear selection on successful booking
                    
                    responseMessageDiv.textContent = data.message;
                    responseMessageDiv.classList.add('success');
                    responseMessageDiv.style.display = 'block';

                    appointmentForm.reset();
                    if (selectedServicesInput) selectedServicesInput.value = '';
                    if (servicesListDisplay) servicesListDisplay.innerHTML = '';
                    updateCharCounter();
                    if (calendarSection) calendarSection.classList.remove('visible'); // Hide calendar again

                    submitButton.querySelector('.button-text').style.display = 'inline-block';
                    submitButton.querySelector('.button-loader').style.display = 'none';
                    submitButton.disabled = false; 
                    
                } else {
                    if (data.errors) {
                        Object.keys(data.errors).forEach(field => {
                            const inputElement = document.getElementById(field);
                            if (inputElement) {
                                showError(inputElement, data.errors[field]);
                            }
                        });
                        responseMessageDiv.textContent = 'Please correct the errors.';
                        responseMessageDiv.classList.add('error');
                        responseMessageDiv.style.display = 'block';
                    } else {
                        responseMessageDiv.textContent = data.message || 'An error occurred.';
                        responseMessageDiv.classList.add('error');
                        responseMessageDiv.style.display = 'block';
                    }
                    
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
        initialView: 'timeGridWeek',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        editable: false,
        selectable: true, 
        dayMaxEvents: true, 
        slotDuration: '00:15:00',
        slotLabelFormat: {
            hour: 'numeric',
            minute: '2-minute',
            omitZeroMinute: false,
            meridiem: 'short'
        },
        events: 'get_availability.php',

        eventContent: function(arg) {
            let innerHtml = '';
            if (arg.event.classNames.includes('fc-event-booked')) {
                innerHtml = '<div class="fc-event-text">Booked</div>';
            } else if (arg.event.classNames.includes('fc-event-available')) {
                innerHtml = '<div class="fc-event-text">Available</div>';
            } else {
                innerHtml = '<div class="fc-event-text">' + (arg.event.title || 'Event') + '</div>';
            }
            return { html: innerHtml };
        },

        slotClick: function(info) {
            const clickedDateStr = info.dateStr; 
            const clickedDate = new Date(clickedDateStr);
            
            let isSlotBooked = false;
            const eventsInRange = calendar.getEvents();
            for (const event of eventsInRange) {
                const eventStart = new Date(event.start);
                const eventEnd = new Date(event.end);

                if (clickedDate >= eventStart && clickedDate < eventEnd && event.classNames.includes('fc-event-booked')) {
                    isSlotBooked = true;
                    break;
                }
            }

            if (!isSlotBooked) {
                bookingDateInput.value = clickedDateStr.split('T')[0];
                bookingTimeInput.value = clickedDateStr.split('T')[1].slice(0, 5);
                
                validateInput(bookingDateInput);
                validateInput(bookingTimeInput);

                document.getElementById('appointment-form').scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('This slot is already booked.');
            }
        },

        dateClick: function(info) {
            const clickedDateStr = info.dateStr;
            const clickedDate = new Date(clickedDateStr);

            if (calendarSection && calendarSection.classList.contains('visible')) {
                bookingDateInput.value = clickedDateStr;
                bookingTimeInput.value = ''; // Clear time when date changes
                validateInput(bookingDateInput);
                document.getElementById('appointment-form').scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // --- Initialize ---
    calendar.render();
    loadSelectedServices(); // Load services first to determine calendar visibility
    updateCharCounter(); 

    if (phoneInput) {
        phoneInput.addEventListener('blur', () => {
            if (phoneInput.value) {
                phoneInput.value = formatPhoneNumber(phoneInput.value);
            }
        });
    }
});