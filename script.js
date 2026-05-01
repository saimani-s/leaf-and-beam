document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    function toggleMenu() {
        navLinks.classList.toggle('active');
        const isExpanded = navLinks.classList.contains('active');
        if (hamburger) hamburger.setAttribute('aria-expanded', isExpanded);
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
        });
    });

    // Form submission logic
    const leadForm = document.getElementById('leadForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');

    // Google Apps Script endpoint
    const SUBMIT_URL = 'https://script.google.com/macros/s/AKfycbwEc2R9w0xW8FoXpppeF10DTa9x6m4m9geUOSq-ILKjNTGq76buXGJDlhhaPpuhwW_WPA/exec';

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

    // Dynamic tab title
    let previousTitle = document.title;
    window.addEventListener('blur', () => {
        previousTitle = document.title;
        document.title = '🌱 Please visit again!';
    });
    window.addEventListener('focus', () => {
        document.title = previousTitle;
    });
});
