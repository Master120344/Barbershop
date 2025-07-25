document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const serviceCards = document.querySelectorAll('.service-card');
    const proceedButton = document.getElementById('proceed-to-booking');
    const localStorageKey = 'cleanCutzSelectedServices';

    // --- Hamburger Menu Logic ---
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // --- Service Selection Logic ---
    let selectedServices = [];

    // Load any previously selected services from localStorage when the page loads
    try {
        const storedServices = localStorage.getItem(localStorageKey);
        if (storedServices) {
            selectedServices = JSON.parse(storedServices);
        }
    } catch (error) {
        console.error("Error loading from localStorage:", error);
        selectedServices = []; // Reset on error
    }

    // Function to update the visual state of cards and the proceed button
    const updateUI = () => {
        serviceCards.forEach(card => {
            const serviceName = card.getAttribute('data-service');
            if (selectedServices.includes(serviceName)) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });

        // Enable or disable the "Proceed to Booking" button
        if (proceedButton) {
            const hasSelections = selectedServices.length > 0;
            proceedButton.disabled = !hasSelections;
            // Optionally add a class to the button for styling when active
            proceedButton.classList.toggle('active', hasSelections);
        }
    };

    // Add a click event listener to each service card
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const serviceName = card.getAttribute('data-service');

            // If the service is already selected, remove it. Otherwise, add it.
            if (selectedServices.includes(serviceName)) {
                selectedServices = selectedServices.filter(service => service !== serviceName);
            } else {
                selectedServices.push(serviceName);
            }

            // Save the updated list to localStorage
            try {
                localStorage.setItem(localStorageKey, JSON.stringify(selectedServices));
            } catch (error) {
                console.error("Error saving to localStorage:", error);
            }

            // Update the UI to reflect the change
            updateUI();
        });
    });

    // Navigate to the booking page when the button is clicked
    if (proceedButton) {
        proceedButton.addEventListener('click', () => {
            // Only proceed if at least one service is selected
            if (selectedServices.length > 0) {
                window.location.href = 'booking_mobile.html';
            }
        });
    }

    // Initial UI update when the page first loads
    updateUI();
});