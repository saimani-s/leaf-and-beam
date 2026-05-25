document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    function toggleMenu() {
        navLinks.classList.toggle('active');
        if (hamburger) {
            hamburger.classList.toggle('active');
            const isExpanded = navLinks.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
        }
    }

    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
    }

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (hamburger) {
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Form submission logic
    const leadForm = document.getElementById('leadForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');

    // Google Apps Script endpoint
    const SUBMIT_URL = 'https://script.google.com/macros/s/AKfycbzIUbbg9ouexShuG5K_8YIfSWoIJe3QBfT0QHJiDFXSPWS2hcBhehQVbYdFr-57eP8k9Q/exec';

    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Basic UI feedback
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            formMessage.className = 'form-message';
            formMessage.textContent = '';

            const formData = new FormData(leadForm);

            try {
                await fetch(SUBMIT_URL, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors'
                });

                // With no-cors, we assume success if no network error is thrown
                formMessage.textContent = "Thank you! We'll get back to you shortly.";
                formMessage.classList.add('success');
                leadForm.reset();
            } catch (error) {
                console.warn(error);
                formMessage.textContent = 'Oops! Something went wrong. Please try again.';
                formMessage.classList.add('error');
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Dynamic scrolling tab title (Left to Right)
    let previousTitle = document.title;
    let scrollInterval;

    window.addEventListener('blur', () => {
        previousTitle = document.title;
        let scrollText = "Please visit again! • ";

        scrollInterval = setInterval(() => {
            // Move last character to the front to scroll left-to-right
            scrollText = scrollText.slice(-1) + scrollText.slice(0, -1);
            document.title = scrollText;
        }, 250);
    });

    window.addEventListener('focus', () => {
        clearInterval(scrollInterval);
        document.title = previousTitle;
    });
});


