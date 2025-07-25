<!-- booking_mobile.js -->
<pre><code class="language-javascript">document.addEventListener('DOMContentLoaded', () => {
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
const errorDiv = document.querySelector(`.error-message\[data-for="${input.id}"\]`);
if (errorDiv) {
errorDiv.textContent = message;
}
input.classList.add('invalid');
};

const removeError = (input) => {
const errorDiv = document.querySelector(`.error-message\[data-for="${input.id}"\]`);
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
const \[hours, minutes\] = value.split(':').map(Number);
if (hours < 9 || (hours === 18 && minutes > 0) || hours > 18) { showError(input, 'Select between 9 AM and 6 PM.'); isValid = false; }
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

if (!commentsTextarea.value.trim()) {
commentsTextarea.value = `Services requested: ${selectedServices.join(', ')}.`;
updateCharCounter();
}
if (submitButton) submitButton.disabled = false; // Enable submit if services are selected
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

const storedServices = localStorage.getItem(localStorageKey);
if (!storedServices || JSON.parse(storedServices).length === 0) {
if (servicesListDisplay) {
servicesListDisplay.innerHTML = '<p class="no-services-message error-message">No services selected. Please return to the <a href="services_mobile.html">Services page</a> to make your selection.</p>';
}
isFormValid = false;
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
localStorage.removeItem(localStorageKey);
responseMessageDiv.textContent = data.message;
responseMessageDiv.classList.add('success');
responseMessageDiv.style.display = 'block';

appointmentForm.reset();
if (selectedServicesInput) selectedServicesInput.value = '';
if (servicesListDisplay) servicesListDisplay.innerHTML = '<p class="no-services-message">No services selected. Please return to the <a href="services_mobile.html">Services page</a> to make your selection.</p>';
updateCharCounter();

submitButton.querySelector('.button-text').style.display = 'inline-block';
submitButton.querySelector('.button-loader').style.display = 'none';
submitButton.disabled = true;

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
events: 'get_availability.php', // Keep this for now, we'll adjust the PHP later

eventContent: function(arg) {
let italicEl = document.createElement('em');
if (arg.event.classNames.includes('fc-event-booked')) {
italicEl.innerText = 'Booked';
} else if (arg.event.classNames.includes('fc-event-available')) {
italicEl.innerText = 'Available';
} else {
italicEl.innerText = arg.event.title || 'Event';
}

arg.el.style.backgroundColor = arg.event.backgroundColor;
arg.el.style.borderColor = arg.event.borderColor;

return {
domNodes: [italicEl]
};
},

slotClick: function(info) {
if (info.dayEl.classList.contains('fc-event-available') || info.dayEl.classList.contains('fc-timegrid-slot') && !info.dayEl.closest('.fc-event')) {
bookingDateInput.value = info.dateStr.split('T')[0];
bookingTimeInput.value = info.dateStr.split('T')[1].slice(0, 5);
document.getElementById('appointment-form').scrollIntoView({ behavior: 'smooth' });
} else {
alert('This slot is already booked.');
}
},

dateClick: function(info) {
if (info.dayEl.style.backgroundColor !== 'rgb(255, 107, 107)') {
bookingDateInput.value = info.dateStr;
document.getElementById('appointment-form').scrollIntoView({ behavior: 'smooth' });
} else {
alert('This day is fully booked.');
}
}
});

// --- Initialize ---
calendar.render();
loadSelectedServices();
updateCharCounter();

if (phoneInput) {
phoneInput.addEventListener('blur', () => {
if (phoneInput.value) {
phoneInput.value = formatPhoneNumber(phoneInput.value);
}
});
}
});
</code></pre>