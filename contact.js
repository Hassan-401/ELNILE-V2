/* ============================================
   ELNILE - Contact Page JavaScript
   Map tab switching, form handling, scroll reveal
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============ MAP TAB SWITCHING ============
    const mapTabs = document.querySelectorAll('.map-tab');
    const mapFrames = document.querySelectorAll('.map-frame');

    mapTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const location = tab.dataset.location;

            // Update active tab
            mapTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show corresponding map
            mapFrames.forEach(frame => frame.classList.remove('active'));
            const targetMap = document.getElementById(`map-${location}`);
            if (targetMap) {
                targetMap.classList.add('active');
            }
        });
    });


    // ============ CONTACT FORM HANDLING ============
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('form-submit');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const phone = document.getElementById('contact-phone').value.trim();
            const subject = document.getElementById('contact-subject').value;
            const message = document.getElementById('contact-message').value.trim();

            // Basic validation
            if (!name || !email || !subject || !message) {
                // Shake the button
                submitBtn.style.animation = 'shake 0.4s ease';
                setTimeout(() => {
                    submitBtn.style.animation = '';
                }, 400);
                return;
            }

            // Success animation
            const btnSpan = submitBtn.querySelector('span');
            const btnIcon = submitBtn.querySelector('i');
            const originalText = btnSpan.textContent;
            const isArabic = document.documentElement.lang === 'ar';

            submitBtn.classList.add('success');
            btnSpan.textContent = isArabic ? 'تم الإرسال بنجاح!' : 'Sent Successfully!';
            btnIcon.className = 'fas fa-check';

            // Reset after 3 seconds
            setTimeout(() => {
                submitBtn.classList.remove('success');
                btnSpan.textContent = originalText;
                btnIcon.className = 'fas fa-paper-plane';
                contactForm.reset();
            }, 3000);
        });
    }


    // ============ SCROLL REVEAL ============
    const revealElements = document.querySelectorAll(
        '.contact-info-card, .contact-form-card, .map-container, .contact-hero-content, .map-header'
    );

    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const handleScrollReveal = () => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.88) {
                el.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', handleScrollReveal, { passive: true });
    setTimeout(handleScrollReveal, 100);


    // ============ PLACEHOLDER LANGUAGE SWITCH ============
    // Listen for language changes to update placeholders
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        const originalClick = langToggle.onclick;

        // Use MutationObserver to detect lang changes
        const observer = new MutationObserver(() => {
            const isEnglish = document.documentElement.lang === 'en';
            document.querySelectorAll('[data-placeholder-ar]').forEach(input => {
                input.placeholder = isEnglish
                    ? input.dataset.placeholderEn
                    : input.dataset.placeholderAr;
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['lang']
        });
    }

});
