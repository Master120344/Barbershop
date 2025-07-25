<pre><code class="language-javascript">document.addEventListener('DOMContentLoaded', () => {
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
try {
const storedServices = localStorage.getItem(localStorageKey);
if (storedServices) {
selectedServices = JSON.parse(storedServices);
}
} catch (error) {
console.error("Error loading selected services from localStorage:", error);
selectedServices = [];
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
proceedButton.classList.add('active');
} else {
proceedButton.classList.remove('active');
}
}
};

// Add event listeners to service cards for selection
serviceCards.forEach(card => {
card.addEventListener('click', () => {
const serviceName = card.getAttribute('data-service');

if (selectedServices.includes(serviceName)) {
selectedServices = selectedServices.filter(service => service !== serviceName);
} else {
selectedServices.push(serviceName);
}

try {
localStorage.setItem(localStorageKey, JSON.stringify(selectedServices));
} catch (error) {
console.error("Error saving selected services to localStorage:", error);
}
updateUIForSelectedServices();
});
});

// Initialize UI based on loaded services
updateUIForSelectedServices();

// Handle "Proceed to Booking" button click
if (proceedButton) {
proceedButton.addEventListener('click', () => {
if (selectedServices.length > 0) {
window.location.href = 'booking_mobile.html';
}
});
}
});
</code></pre>