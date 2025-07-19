document.addEventListener('DOMContentLoaded', function() {

    const header = document.getElementById('main-header');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const scrollElements = document.querySelectorAll('.animate-on-scroll');

    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    const toggleMobileNav = () => {
        const isNavActive = mobileNav.classList.contains('is-active');
        hamburgerBtn.classList.toggle('is-active', !isNavActive);
        mobileNav.classList.toggle('is-active', !isNavActive);
        document.body.style.overflow = !isNavActive ? 'hidden' : 'auto';
    };

    const handleMobileNavClick = (e) => {
        if (e.target.tagName === 'A') {
            toggleMobileNav();
        }
    };

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('is-visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    };

    window.addEventListener('scroll', () => {
        handleHeaderScroll();
        handleScrollAnimation();
    });

    hamburgerBtn.addEventListener('click', toggleMobileNav);
    mobileNav.addEventListener('click', handleMobileNavClick);

    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('.newsletter-input');
            const button = newsletterForm.querySelector('button');

            if (input.value && input.checkValidity()) {
                button.textContent = 'Thank You!';
                input.value = '';
                setTimeout(() => {
                    button.textContent = 'Subscribe';
                }, 3000);
            } else {
                button.textContent = 'Invalid Email';
                 setTimeout(() => {
                    button.textContent = 'Subscribe';
                }, 2000);
            }
        });
    }

    const logo = document.querySelector('.logo-title');
    if(logo) {
        logo.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Initial check for animations on page load
    handleScrollAnimation();
});
