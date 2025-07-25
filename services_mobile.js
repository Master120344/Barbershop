<pre><code class="language-javascript">document.addEventListener('DOMContentLoaded', () => {
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const serviceCards = document.querySelectorAll('.service-card');
const proceedButton = document.getElementById('proceed-to-booking');
const localStorageKey = 'cleanCutzSelectedServices';

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

let selectedServices = [];

try {
const storedServices = localStorage.getItem(localStorageKey);
if (storedServices) {
selectedServices = JSON.parse(storedServices);
}
} catch (error) {
console.error("Error loading from localStorage:", error);
}

const updateUI = () => {
serviceCards.forEach(card => {
const serviceName = card.getAttribute('data-service');
if (selectedServices.includes(serviceName)) {
card.classList.add('selected');
} else {
card.classList.remove('selected');
}
});

if (proceedButton) {
proceedButton.disabled = selectedServices.length === 0;
proceedButton.classList.toggle('active', selectedServices.length > 0);
}
};

serviceCards.forEach(card => {
card.addEventListener('click', () => {
const serviceName = card.getAttribute('data-service');
selectedServices = selectedServices.includes(serviceName)
? selectedServices.filter(service => service !== serviceName)
: [...selectedServices, serviceName];
try {
localStorage.setItem(localStorageKey, JSON.stringify(selectedServices));
} catch (error) {
console.error("Error saving to localStorage:", error);
}
updateUI();
});
});

updateUI();

if (proceedButton) {
proceedButton.addEventListener('click', () => {
if (selectedServices.length > 0) {
window.location.href = 'booking_mobile.html';
}
});
}
});
</code></pre>