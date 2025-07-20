// booking.js
document.addEventListener('DOMContentLoaded', () => {
    // Optional: Add any JavaScript functionality for the booking form here.
    // For example, date validation, dynamic service price display, or form submission handling.

    const bookingForm = document.getElementById('bookingForm');
    const serviceSelect = document.getElementById('service');
    const priceDisplay = document.querySelector('.service-price-display'); // If you add a dynamic display

    // Example: Basic form validation on submit
    if (bookingForm) {
        bookingForm.addEventListener('submit', (event) => {
            // Prevent default submission for now to demonstrate
            // event.preventDefault();

            // Add your custom validation logic here
            // e.g., check if date is in the future, time is within business hours etc.

            // If all validation passes, you can allow submission or handle it via AJAX
            // alert('Booking submitted successfully! (In a real app, this would send data)');
            // window.location.href = 'booking-confirmation.html'; // Redirect to a confirmation page
        });
    }

    // Optional: Update price display dynamically if you have such an element
    if (serviceSelect && priceDisplay) {
        serviceSelect.addEventListener('change', (e) => {
            const selectedService = e.target.value;
            const selectedOption = e.target.options[e.target.selectedIndex];
            const priceText = selectedOption.text.match(/(\$[\d,]+)/); // Extract price from option text

            if (priceText) {
                priceDisplay.textContent = priceText[0];
            } else {
                priceDisplay.textContent = ''; // Clear if no price found
            }
        });
    }
});