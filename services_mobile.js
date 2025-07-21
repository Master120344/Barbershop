document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const serviceCards = document.querySelectorAll('.service-card');
    const proceedButton = document.getElementById('proceed-to-booking');
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

    // --- Service Selection Logic ---
    let selectedServices = [];

    // Load initial selection from localStorage
    const storedServices = localStorage.getItem(localStorageKey);
    if (storedServices) {
        selectedServices = JSON.parse(storedServices);
    }

    // Function to update the UI based on selected services
    const updateUIForSelectedServices = () => {
        serviceCards.forEach(card => {
            const serviceName = card.getAttribute('data-service');
            if (selectedServices.includes(serviceName)) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });

        // Enable/disable proceed button
        if (proceedButton) {
            proceedButton.disabled = selectedServices.length === 0;
            if (selectedServices.length > 0) {
                proceedButton.style.opacity = '1';
                proceedButton.style.cursor = 'pointer';
            } else {
                proceedButton.style.opacity = '0.7';
                proceedButton.style.cursor = 'not-allowed';
            }
        }
    };

    // Add event listeners to service cards for selection
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const serviceName = card.getAttribute('data-service');

            if (selectedServices.includes(serviceName)) {
                // Remove service if already selected
                selectedServices = selectedServices.filter(service => service !== serviceName);
            } else {
                // Add service if not selected
                selectedServices.push(serviceName);
            }
            
            // Update localStorage
            localStorage.setItem(localStorageKey, JSON.stringify(selectedServices));
            
            // Update UI
            updateUIForSelectedServices();
        });
    });

    // Initialize UI based on loaded services
    updateUIForSelectedServices();

    // Handle "Proceed to Booking" button click
    if (proceedButton) {
        proceedButton.addEventListener('click', () => {
            if (selectedServices.length > 0) {
                // Services are already saved in localStorage, so just redirect
                window.location.href = 'booking_mobile.html';
            }
        });
    }
});