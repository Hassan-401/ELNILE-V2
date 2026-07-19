/* ============================================
   ELNILE - About Page JavaScript
   Stats counter animation + scroll reveal
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============ ABOUT PAGE STATS COUNTER ============
    const aboutStats = document.querySelectorAll('.about-stat');
    let aboutStatsAnimated = false;

    const animateCounter = (element, target, duration = 2000) => {
        const startTime = performance.now();
        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const currentValue = Math.floor(easedProgress * target);

            element.textContent = currentValue.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        requestAnimationFrame(update);
    };

    const handleAboutStatsAnimation = () => {
        if (aboutStatsAnimated) return;

        const statsSection = document.querySelector('.about-stats-section');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;

        if (isVisible) {
            aboutStatsAnimated = true;
            aboutStats.forEach((stat, index) => {
                const target = parseInt(stat.dataset.target);
                const numberEl = stat.querySelector('.about-stat-number');
                setTimeout(() => {
                    animateCounter(numberEl, target, 2200);
                }, index * 250);
            });
        }
    };

    window.addEventListener('scroll', handleAboutStatsAnimation, { passive: true });
    handleAboutStatsAnimation();


    // ============ SCROLL REVEAL FOR ABOUT PAGE ============
    const revealElements = document.querySelectorAll(
        '.about-welcome-image, .about-welcome-content, .license-card, .distinguish-card, .about-stat, .about-hero-content, .licenses-header'
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

});
