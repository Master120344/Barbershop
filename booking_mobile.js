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
2. booking_mobile.js (Full Content - No Excessive Comments, in a Box):
<pre><code class="language-javascript">document.addEventListener('DOMContentLoaded', () => {
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

const loadSelectedServices = () => {
try {
const storedServices = localStorage.getItem(localStorageKey);
if (storedServices) {
const selectedServices = JSON.parse(storedServices);
if (selectedServicesInput) {
selectedServicesInput.value = selectedServices.join(', ');
}
if (servicesListDisplay) {
servicesListDisplay.innerHTML = selectedServices.length > 0
? '<ul>' + selectedServices.map(service => `<li>${service}</li>`).join('') + '</ul>'
: '<p class="no-services-message">No services selected. Please return to the <a href="services_mobile.html">Services page</a> to choose.</p>';
submitButton.disabled = selectedServices.length === 0;
}
} else {
if (servicesListDisplay) {
servicesListDisplay.innerHTML = '<p class="no-services-message">No services selected. Please return to the <a href="services_mobile.html">Services page</a> to choose.</p>';
}
submitButton.disabled = true;
}
} catch (error) {
console.error("Error loading services on booking page:", error);
if (servicesListDisplay) {
servicesListDisplay.innerHTML = '<p class="no-services-message error-message">Error loading selected services.</p>';
}
submitButton.disabled = true;
}
};

const formatPhoneNumber = (value) => {
if (!value) return '';
const digits = value.replace(/\D/g, '');
if (digits.length <= 3) return digits;
if (digits.length <= 6) return `${digits.substring(0, 3)}-${digits.substring(3)}`;
return `${digits.substring(0, 3)}-${digits.substring(3, 6)}-${digits.substring(6, 10)}`;
};

const validateInput = (input, regex, errorMessage) => {
const isValid = regex.test(input.value.trim());
const errorDiv = document.querySelector(`.error-message\[data-for="${input.id}"\]`);
if (errorDiv) {
errorDiv.textContent = isValid ? '' : errorMessage;
}
input.classList.toggle('invalid', !isValid);
return isValid;
};

if (phoneInput) {
phoneInput.addEventListener('input', () => phoneInput.value = formatPhoneNumber(phoneInput.value));
}

const nameRegex = /^[a-zA-Z\s'-]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
const timeRegex = /^([0-1]?[0-9]|2?[0-3]):([0-5]?[0-9])$/;

if (appointmentForm) {
appointmentForm.addEventListener('submit', (event) => {
let allValid = true;
allValid &= validateInput(appointmentForm.fullName, nameRegex, 'Please enter a valid name.');
allValid &= validateInput(appointmentForm.email, emailRegex, 'Please enter a valid email.');
if (phoneInput) allValid &= validateInput(phoneInput, phoneRegex, 'Use format 123-456-7890.');
if (bookingDateInput) allValid &= bookingDateInput.value !== '';
if (bookingTimeInput) allValid &= validateInput(bookingTimeInput, timeRegex, 'Use HH:MM format (e.g., 09:00).') && parseInt(bookingTimeInput.value.split(':')[0]) >= 9 && parseInt(bookingTimeInput.value.split(':')[0]) <= 17;

const storedServices = localStorage.getItem(localStorageKey);
if (!storedServices || JSON.parse(storedServices).length === 0) {
if (servicesListDisplay) {
servicesListDisplay.innerHTML = '<p class="no-services-message error-message">No services selected. Please return to the <a href="services_mobile.html">Services page</a> to make your selection.</p>';
}
allValid = false;
}

if (!allValid) {
event.preventDefault();
return;
}

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
responseMessageDiv.textContent = data.message;
responseMessageDiv.className = `response-message ${data.success ? 'success' : 'error'}`;
responseMessageDiv.style.display = 'block';
if (data.success) {
localStorage.removeItem(localStorageKey);
appointmentForm.reset();
if (servicesListDisplay) {
servicesListDisplay.innerHTML = '<p class="no-services-message">No services selected.</p>';
}
submitButton.disabled = true;
} else {
submitButton.disabled = false;
}
submitButton.querySelector('.button-text').style.display = 'inline-block';
submitButton.querySelector('.button-loader').style.display = 'none';
})
.catch(error => {
console.error("Form submission error:", error);
responseMessageDiv.textContent = 'An error occurred. Please try again later.';
responseMessageDiv.className = 'response-message error';
responseMessageDiv.style.display = 'block';
submitButton.disabled = false;
submitButton.querySelector('.button-text').style.display = 'inline-block';
submitButton.querySelector('.button-loader').style.display = 'none';
});
event.preventDefault();
});
}

loadSelectedServices();

if (commentsTextarea && charCounter) {
const updateCounter = () => {
const maxLength = parseInt(commentsTextarea.getAttribute('maxlength'), 10);
const currentLength = commentsTextarea.value.length;
charCounter.textContent = `${currentLength} / ${maxLength}`;
};
commentsTextarea.addEventListener('input', updateCounter);
updateCounter();
}

const calendarEl = document.getElementById('calendar');
if (calendarEl) {
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
slotLabelFormat: { hour: 'numeric', minute: '2-minute', omitZeroMinute: false, meridiem: 'short' },
events: 'get_availability.php',
eventContent: function(arg) {
let italicEl = document.createElement('em');
italicEl.innerText = arg.event.title;
return { domNodes: [italicEl] };
},
slotClick: function(info) {
bookingDateInput.value = info.dateStr.split('T')[0];
bookingTimeInput.value = info.dateStr.split('T')[1].slice(0, 5);
document.getElementById('appointment-form').scrollIntoView({ behavior: 'smooth' });
},
dateClick: function(info) {
bookingDateInput.value = info.dateStr;
document.getElementById('appointment-form').scrollIntoView({ behavior: 'smooth' });
}
});
calendar.render();
}
});
</code></pre>