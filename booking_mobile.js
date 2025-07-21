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

    // --- Load Selected Services (FIXED) ---
    let selectedServices = []; // Initialize here for calendar logic

    const loadSelectedServices = () => {
        const storedServices = localStorage.getItem(localStorageKey);
        if (storedServices) {
            selectedServices = JSON.parse(storedServices); // Use the global 'selectedServices' array
        } else {
            selectedServices = []; // Ensure it's empty if nothing is stored
        }

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
                // Show the calendar section if services are selected
                if (calendarSection) {
                    calendarSection.classList.add('visible');
                }
            } else {
                servicesListDisplay.innerHTML = '<p class="no-services-message">No services selected. Please return to the <a href="services_mobile.html">Services page</a> to make your selection.</p>';
                if (submitButton) submitButton.disabled = true;
                // Hide the calendar section if no services are selected
                if (calendarSection) {
                    calendarSection.classList.remove('visible');
                }
            }
        }
        // Re-validate the selectedServicesInput (which should now have a value if services are selected)
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

        // Also ensure services are selected (hidden input needs to be valid too)
        if (!selectedServicesInput.value) {
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
                    // Hide calendar and reset button state
                    if (calendarSection) calendarSection.classList.remove('visible');

                    submitButton.querySelector('.button-text').style.display = 'inline-block';
                    submitButton.querySelector('.button-loader').style.display = 'none';
                    submitButton.disabled = false; 
                    
                    // Clear and re-render calendar to show newly available slots might be complex here if it's dynamic
                    // For simplicity, we'll just reset the form and message.

                } else {
                    // Display specific validation errors if available
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
        slotDuration: '00:15:00', // 15 minute slots
        slotLabelFormat: {
            hour: 'numeric',
            minute: '2-minute',
            omitZeroMinute: false,
            meridiem: 'short'
        },
        events: 'get_availability.php',

        // Custom rendering for events to show text and colors clearly
        eventContent: function(arg) {
            let innerHtml = '';
            if (arg.event.classNames.includes('fc-event-booked')) {
                innerHtml = '<div class="fc-event-text">Booked</div>';
            } else if (arg.event.classNames.includes('fc-event-available')) {
                innerHtml = '<div class="fc-event-text">Available</div>';
            } else {
                innerHtml = '<div class="fc-event-text">' + (arg.event.title || 'Event') + '</div>';
            }
            return { html: innerHtml }; // Return HTML string for custom content
        },

        // Handle clicking on an available slot to pre-fill booking form
        slotClick: function(info) {
            // Check if the clicked slot is available (has 'fc-event-available' class)
            // The slot element might be a div, timegrid-slot, etc.
            // A more robust check is to see if it's NOT booked.
            // We can check if the slot's background is NOT the booked color.
            // Or if it doesn't contain a 'booked' element.
            
            // Check if the slot itself is considered available by not having a booked event within it.
            // This requires checking the DOM element or the event data.
            // For simplicity, let's rely on the JS logic that determines if an event *should* be rendered as available.
            // The most reliable way is to check if the event is NOT booked based on its class or color.
            // FullCalendar's `slotClick` might pass the `dayEl` and we can check its classes,
            // but the event structure itself is better. Let's assume if it's not booked, it's available.
            
            const clickedDateStr = info.dateStr; // This is in YYYY-MM-DDTHH:MM:SS format
            const clickedDate = new Date(clickedDateStr);
            
            // Check if this specific slot is currently marked as booked by querying the calendar's events
            const eventsInRange = calendar.getEvents();
            let isSlotBooked = false;
            for (const event of eventsInRange) {
                const eventStart = new Date(event.start);
                const eventEnd = new Date(event.end);

                // Check if the clicked slot's start time falls within any booked event's range
                if (clickedDate >= eventStart && clickedDate < eventEnd && event.classNames.includes('fc-event-booked')) {
                    isSlotBooked = true;
                    break;
                }
            }

            if (!isSlotBooked) {
                bookingDateInput.value = clickedDateStr.split('T')[0]; // YYYY-MM-DD
                bookingTimeInput.value = clickedDateStr.split('T')[1].slice(0, 5); // HH:MM
                
                // Trigger validation for date/time if they were already filled
                validateInput(bookingDateInput);
                validateInput(bookingTimeInput);

                // Scroll to the form
                document.getElementById('appointment-form').scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('This slot is already booked.');
            }
        },

        dateClick: function(info) {
            // If a user clicks a day, set the date and clear the time
            const clickedDateStr = info.dateStr;
            const clickedDate = new Date(clickedDateStr);

            // Check if the *entire day* is booked (e.g., no available slots on that day)
            // This is a simpler check: see if any event *starts* on that day and is red.
            // A more accurate check would involve iterating through all slots.
            
            let dayIsFullyBooked = false;
            const eventsForDay = calendar.getEvents();
            for (const event of eventsForDay) {
                 if (event.classNames.includes('fc-event-booked')) {
                    const eventStart = new Date(event.start);
                    const eventEnd = new Date(event.end);
                    // Check if any booked event falls on this date
                    if (clickedDate >= eventStart && clickedDate < eventEnd) {
                         // For simplicity, if any booked event exists, let's not make the day fully clickable for the form
                         // A better approach would be to check if ALL slots for that day are booked.
                         // For now, if it's booked at all, we might warn.
                         // But we still want to allow setting the date.
                         // Let's refine: If ANY slot is available, allow setting the date.
                         // A true "fully booked" check is complex. We'll assume if some slots are available, the day is usable.
                         
                         // The issue here is the "Check Availability" text. The calendar itself IS the availability display.
                         // The calendar should just be visible if services are selected.
                    }
                 }
            }

            // If services are selected and the calendar is visible, allow date selection.
            if (calendarSection && calendarSection.classList.contains('visible')) {
                bookingDateInput.value = clickedDateStr;
                // Optionally clear time, or leave it as is if user needs to pick it from the calendar
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

    // Initial formatting on phone input blur
    if (phoneInput) {
        phoneInput.addEventListener('blur', () => {
            if (phoneInput.value) {
                phoneInput.value = formatPhoneNumber(phoneInput.value);
            }
        });
    }
});