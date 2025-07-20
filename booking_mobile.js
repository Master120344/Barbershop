// booking_mobile.js
document.addEventListener('DOMContentLoaded', () => {

    const bookingForm = document.getElementById('bookingForm');
    const serviceSelect = document.getElementById('service');
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');

    // Set today's date as the minimum selectable date
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    const minDateString = `${year}-${month}-${day}`;

    if (dateInput) {
        dateInput.setAttribute('min', minDateString);
    }

    // Optional: Basic validation or submission handling
    if (bookingForm) {
        bookingForm.addEventListener('submit', (event) => {
            // Prevent default submission for client-side demonstration
            // event.preventDefault();

            // Basic client-side checks (more robust validation often happens server-side)
            if (!serviceSelect.value) {
                alert('Please select a service.');
                return false; // Prevent form submission
            }
            if (!dateInput.value) {
                alert('Please select a date.');
                return false;
            }
            if (!timeInput.value) {
                alert('Please select a time.');
                return false;
            }

            // If all checks pass, you'd typically submit the form or send data via AJAX
            // For this example, we'll just show a confirmation.
            // alert('Your booking request has been submitted! We will confirm via email.');
            // window.location.href = 'booking-confirmation.html'; // Redirect to a confirmation page
        });
    }
});