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

    // Formspree endpoint
    const SUBMIT_URL = 'https://formspree.io/f/mkoygrgr'; // Replace YOUR_FORM_ID with your actual Formspree ID

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
                const response = await fetch(SUBMIT_URL, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: formData
                });

                if (response.ok) {
                    formMessage.textContent = "Thank you! We'll get back to you shortly.";
                    formMessage.classList.add('success');
                    leadForm.reset();
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.warn(error);
                formMessage.textContent = 'Oops! Something went wrong. Make sure the local server is running.';
                formMessage.classList.add('error');
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});
