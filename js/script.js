/* ============================================
   ELNILE - Main JavaScript
   Handles: Slider, Language Toggle, Mobile Menu, Header Scroll,
            Stats Counter, Testimonials, Scroll Reveal
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============ HEADER SCROLL EFFECT ============
    const header = document.getElementById('main-header');

    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll(); // Initial check


    // ============ MOBILE MENU ============
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        }
    });


    // ============ HERO SLIDER ============
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    let currentSlide = 0;
    let slideInterval;
    const SLIDE_DURATION = 6000; // 6 seconds per slide

    if (slides.length > 0) {
        const goToSlide = (index) => {
            // Remove active from all
            slides.forEach(slide => {
                slide.classList.remove('active');
                // Reset animations by forcing reflow on title/subtitle
                const title = slide.querySelector('.hero-title');
                const subtitle = slide.querySelector('.hero-subtitle');
                if (title) {
                    title.style.animation = 'none';
                    title.offsetHeight; // trigger reflow
                    title.style.animation = '';
                }
                if (subtitle) {
                    subtitle.style.animation = 'none';
                    subtitle.offsetHeight; // trigger reflow
                    subtitle.style.animation = '';
                }
            });
            dots.forEach(dot => dot.classList.remove('active'));

            // Set new active
            currentSlide = index;
            slides[currentSlide].classList.add('active');
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');
        };

        const nextSlide = () => {
            const next = (currentSlide + 1) % slides.length;
            goToSlide(next);
        };

        const prevSlide = () => {
            const prev = (currentSlide - 1 + slides.length) % slides.length;
            goToSlide(prev);
        };

        // Auto-play
        const startAutoPlay = () => {
            stopAutoPlay();
            slideInterval = setInterval(nextSlide, SLIDE_DURATION);
        };

        const stopAutoPlay = () => {
            if (slideInterval) {
                clearInterval(slideInterval);
            }
        };

        // Arrow buttons
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                startAutoPlay(); // Reset timer after manual interaction
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                startAutoPlay();
            });
        }

        // Dot navigation
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const slideIndex = parseInt(dot.dataset.slide);
                goToSlide(slideIndex);
                startAutoPlay();
            });
        });

        // Touch / Swipe support for slider
        let touchStartX = 0;
        let touchEndX = 0;
        const heroSection = document.getElementById('hero');

        if (heroSection) {
            heroSection.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            heroSection.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                const isRTL = document.documentElement.dir === 'rtl';

                if (Math.abs(diff) > 50) { // Minimum swipe distance
                    if (isRTL) {
                        // RTL: swipe left = prev, swipe right = next
                        if (diff > 0) prevSlide();
                        else nextSlide();
                    } else {
                        // LTR: swipe left = next, swipe right = prev
                        if (diff > 0) nextSlide();
                        else prevSlide();
                    }
                    startAutoPlay();
                }
            }, { passive: true });

            // Pause on hover (desktop)
            heroSection.addEventListener('mouseenter', stopAutoPlay);
            heroSection.addEventListener('mouseleave', startAutoPlay);
        }

        // Start auto-play
        startAutoPlay();
    }



    // ============ STATS COUNTER ANIMATION ============
    const statCards = document.querySelectorAll('.stat-card');
    let statsAnimated = false;

    const animateCounter = (element, target, duration = 2000) => {
        const start = 0;
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

    const handleStatsAnimation = () => {
        if (statsAnimated) return;

        const statsSection = document.getElementById('stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;

        if (isVisible) {
            statsAnimated = true;
            statCards.forEach((card, index) => {
                const target = parseInt(card.dataset.target);
                const numberEl = card.querySelector('.stat-number');
                // Stagger the animation start
                setTimeout(() => {
                    animateCounter(numberEl, target, 2000);
                }, index * 200);
            });
        }
    };

    window.addEventListener('scroll', handleStatsAnimation, { passive: true });
    handleStatsAnimation(); // Check on load


    // ============ TESTIMONIALS SLIDER ============
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialPrev = document.getElementById('testimonial-prev');
    const testimonialNext = document.getElementById('testimonial-next');
    let currentTestimonial = 0;
    let testimonialInterval;

    if (testimonialCards.length > 0) {
        const goToTestimonial = (index) => {
            testimonialCards.forEach(card => {
                card.classList.remove('active');
            });
            currentTestimonial = index;
            testimonialCards[currentTestimonial].classList.add('active');
        };

        const nextTestimonial = () => {
            const next = (currentTestimonial + 1) % testimonialCards.length;
            goToTestimonial(next);
        };

        const prevTestimonial = () => {
            const prev = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
            goToTestimonial(prev);
        };

        // Auto-play testimonials
        const startTestimonialAutoPlay = () => {
            stopTestimonialAutoPlay();
            testimonialInterval = setInterval(nextTestimonial, 5000);
        };

        const stopTestimonialAutoPlay = () => {
            if (testimonialInterval) {
                clearInterval(testimonialInterval);
            }
        };

        if (testimonialNext) {
            testimonialNext.addEventListener('click', () => {
                nextTestimonial();
                startTestimonialAutoPlay();
            });
        }

        if (testimonialPrev) {
            testimonialPrev.addEventListener('click', () => {
                prevTestimonial();
                startTestimonialAutoPlay();
            });
        }

        // Touch support for testimonials
        const testimonialsWrapper = document.querySelector('.testimonials-slider-wrapper');
        if (testimonialsWrapper) {
            let tTouchStartX = 0;

            testimonialsWrapper.addEventListener('touchstart', (e) => {
                tTouchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            testimonialsWrapper.addEventListener('touchend', (e) => {
                const diff = tTouchStartX - e.changedTouches[0].screenX;
                const isRTL = document.documentElement.dir === 'rtl';

                if (Math.abs(diff) > 50) {
                    if (isRTL) {
                        if (diff > 0) prevTestimonial();
                        else nextTestimonial();
                    } else {
                        if (diff > 0) nextTestimonial();
                        else prevTestimonial();
                    }
                    startTestimonialAutoPlay();
                }
            }, { passive: true });

            testimonialsWrapper.addEventListener('mouseenter', stopTestimonialAutoPlay);
            testimonialsWrapper.addEventListener('mouseleave', startTestimonialAutoPlay);
        }

        startTestimonialAutoPlay();
    }


    // ============ SCROLL REVEAL ANIMATION ============
    const revealElements = document.querySelectorAll(
        '.stat-card, .about-image-wrapper, .about-content, .service-card, .why-card, .section-header, .testimonials-slider-wrapper, .testimonials-cta, .partners-marquee-wrapper'
    );

    // Add reveal class to elements
    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const handleScrollReveal = () => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.88;

            if (isVisible) {
                el.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', handleScrollReveal, { passive: true });
    // Initial check with small delay for page load
    setTimeout(handleScrollReveal, 100);


    // ============ LANGUAGE TOGGLE (PERSISTENT & GLOBAL) ============
    const langToggle = document.getElementById('lang-toggle');
    const langText = langToggle ? langToggle.querySelector('.lang-text') : null;
    let currentLang = localStorage.getItem('elnile_lang') || 'ar'; // Default Arabic

    const applyLanguage = (lang) => {
        const htmlEl = document.documentElement;
        currentLang = lang;
        localStorage.setItem('elnile_lang', lang);

        if (lang === 'en') {
            htmlEl.setAttribute('lang', 'en');
            htmlEl.setAttribute('dir', 'ltr');
            document.body.classList.add('lang-en');
            if (langText) langText.textContent = 'العربية';

            // Update all translatable elements
            document.querySelectorAll('[data-en]').forEach(el => {
                // Skip elements that have child elements we need to preserve
                if (el.querySelector('i') || el.querySelector('span.heading-dot')) {
                    // Only update text nodes, preserve child elements
                    const childElements = Array.from(el.children);
                    el.textContent = el.dataset.en;
                    childElements.forEach(child => el.appendChild(child));
                } else {
                    el.textContent = el.dataset.en;
                }
            });

        } else {
            htmlEl.setAttribute('lang', 'ar');
            htmlEl.setAttribute('dir', 'rtl');
            document.body.classList.remove('lang-en');
            if (langText) langText.textContent = 'English';

            // Update all translatable elements
            document.querySelectorAll('[data-ar]').forEach(el => {
                if (el.querySelector('i') || el.querySelector('span.heading-dot')) {
                    const childElements = Array.from(el.children);
                    el.textContent = el.dataset.ar;
                    childElements.forEach(child => el.appendChild(child));
                } else {
                    el.textContent = el.dataset.ar;
                }
            });
        }
    };

    // Initial check on load
    applyLanguage(currentLang);

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            applyLanguage(currentLang === 'ar' ? 'en' : 'ar');
        });
    }


    // ============ ACTIVE NAV LINK ON SCROLL ============
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link');

    const handleActiveNav = () => {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinksAll.forEach(link => {
                    link.classList.remove('active');
                    const href = link.getAttribute('href');
                    if (href === `#${sectionId}` || (sectionId === 'hero' && href === '#')) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', handleActiveNav, { passive: true });


    // ============ SMOOTH SCROLL FOR NAV LINKS ============
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target && header) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            } else if (href === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });


    // ============ PARTNERS MARQUEE PAUSE ON HOVER ============
    document.querySelectorAll('.partners-track').forEach(track => {
        track.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });
        track.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });
    });


});
