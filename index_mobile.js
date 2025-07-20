document.addEventListener('DOMContentLoaded', () => {

    // Slick Carousel Initialization
    $(document).ready(function(){
        $('.gallery-carousel').slick({
            dots: true,
            infinite: true,
            speed: 800,
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 4000,
            centerMode: true,
            centerPadding: '0px',
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: true,
                        centerMode: false,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: true,
                        centerMode: true,
                        centerPadding: '0px',
                    }
                }
            ]
        });
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile Navigation Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const icon = mobileNavToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        document.querySelectorAll('.main-nav ul li a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                const icon = mobileNavToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // Hero Video Autoplay Control
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        const playPromise = heroVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Video autoplay failed:", error);
            });
        }
    }

    // Element Fade-in on Scroll (Simplified)
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.services-section, .gallery-section, .about-craft, .local-artist-feature, .contact-section').forEach(section => {
        if (!section.classList.contains('hero-section')) {
            observer.observe(section);
        }
    });

    // Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            let formIsValid = true;
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            clearFormErrors();

            if (nameInput.value.trim() === '') {
                displayFormError(nameInput, 'Please enter your full name.');
                formIsValid = false;
            }

            const emailValue = emailInput.value.trim();
            if (emailValue === '') {
                displayFormError(emailInput, 'Please enter your email address.');
                formIsValid = false;
            } else if (!isValidEmail(emailValue)) {
                displayFormError(emailInput, 'Please enter a valid email address.');
                formIsValid = false;
            }

            if (messageInput.value.trim() === '') {
                displayFormError(messageInput, 'Please leave us a message.');
                formIsValid = false;
            }

            if (formIsValid) {
                alert('Form submitted successfully! We will be in touch shortly.');
                contactForm.reset();
            }
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    function displayFormError(inputElement, message) {
        const formGroup = inputElement.closest('.form-row, .form-group');
        if (!formGroup) return;

        let errorSpan = formGroup.querySelector('.error-message');
        if (!errorSpan) {
            errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            errorSpan.style.color = 'var(--secondary-color)';
            errorSpan.style.fontSize = '0.85rem';
            errorSpan.style.display = 'block';
            errorSpan.style.marginTop = '5px';
            formGroup.appendChild(errorSpan);
        }
        errorSpan.textContent = message;
        inputElement.classList.add('input-error');
        inputElement.style.borderColor = 'var(--secondary-color)';
    }

    function clearFormErrors() {
        document.querySelectorAll('.error-message').forEach(span => span.remove());
        document.querySelectorAll('.input-error').forEach(input => {
            input.classList.remove('input-error');
            input.style.borderColor = '#e0e0e0';
        });
    }
});