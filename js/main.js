/**
 * Main JavaScript
 * Handles entry screen, navigation, scroll animations, and WhatsApp RSVP
 */

(function () {
    'use strict';

    // ==================== DOM ELEMENTS ====================
    const entryScreen = document.getElementById('entry-screen');
    const enterBtn = document.getElementById('enter-btn');
    const mainContent = document.getElementById('main-content');
    const guestPass = document.getElementById('guest-pass');
    const floatingNav = document.getElementById('floating-nav');

    // RSVP Elements
    const confirmBrideBtn = document.getElementById('confirm-bride');
    const confirmGroomBtn = document.getElementById('confirm-groom');
    const whatsappModal = document.getElementById('whatsapp-modal');
    const pendingModal = document.getElementById('pending-modal');
    const modalClose = document.getElementById('modal-close');
    const pendingClose = document.getElementById('pending-close');
    const pendingOk = document.getElementById('pending-ok');
    const rsvpForm = document.getElementById('rsvp-form');

    // ==================== CONFIGURATION ====================
    const config = {
        brideWhatsApp: '529613030443',
        groomWhatsApp: null, // Pending
        eventDate: '15 de marzo de 2026',
        eventTime: '5:00 pm'
    };

    // ==================== URL PARAMETER FOR GUEST PASS ====================
    function initGuestPass() {
        const urlParams = new URLSearchParams(window.location.search);
        const pase = urlParams.get('pase');

        if (pase && guestPass) {
            guestPass.textContent = `Pase para: ${decodeURIComponent(pase.replace(/\+/g, ' '))}`;
        }
    }

    // ==================== ENTRY SCREEN ====================
    function initEntryScreen() {
        if (!enterBtn || !entryScreen || !mainContent) return;

        enterBtn.addEventListener('click', () => {
            // Fade out entry screen
            entryScreen.classList.add('fade-out');

            // Show main content after transition
            setTimeout(() => {
                entryScreen.style.display = 'none';
                mainContent.classList.remove('hidden');

                // Trigger show animation
                requestAnimationFrame(() => {
                    mainContent.classList.add('show');
                    // Trigger scroll animations for visible elements
                    checkScrollAnimations();
                });
            }, 800);
        });
    }

    // ==================== FLOATING NAVIGATION ====================
    function initFloatingNav() {
        if (!floatingNav) return;

        let lastScrollY = window.scrollY;
        const heroSection = document.getElementById('hero');
        const heroHeight = heroSection?.offsetHeight || 500;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            // Show nav after scrolling past hero
            if (currentScrollY > heroHeight - 100) {
                floatingNav.classList.add('visible');
            } else {
                floatingNav.classList.remove('visible');
            }

            lastScrollY = currentScrollY;
        }, { passive: true });

        // Smooth scroll for nav links
        const navLinks = floatingNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    const navHeight = floatingNav.offsetHeight;
                    const targetPosition = targetSection.offsetTop - navHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ==================== SCROLL ANIMATIONS ====================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optionally unobserve after animation
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => observer.observe(el));
    }

    function checkScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                el.classList.add('visible');
            }
        });
    }

    // ==================== MODALS ====================
    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function initModals() {
        // Close buttons
        modalClose?.addEventListener('click', () => closeModal(whatsappModal));
        pendingClose?.addEventListener('click', () => closeModal(pendingModal));
        pendingOk?.addEventListener('click', () => closeModal(pendingModal));

        // Click overlay to close
        whatsappModal?.querySelector('.modal-overlay')?.addEventListener('click', () => closeModal(whatsappModal));
        pendingModal?.querySelector('.modal-overlay')?.addEventListener('click', () => closeModal(pendingModal));

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal(whatsappModal);
                closeModal(pendingModal);
            }
        });
    }

    // ==================== RSVP / WHATSAPP ====================
    function initRSVP() {
        // Bride button - Opens form modal
        confirmBrideBtn?.addEventListener('click', () => {
            openModal(whatsappModal);
        });

        // Groom button - Shows pending modal
        confirmGroomBtn?.addEventListener('click', () => {
            openModal(pendingModal);
        });

        // Form submission
        rsvpForm?.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('guest-name')?.value.trim();
            const guests = document.getElementById('guest-count')?.value;
            const note = document.getElementById('guest-note')?.value.trim();

            if (!name || !guests) {
                alert('Por favor completa los campos requeridos.');
                return;
            }

            // Build WhatsApp message
            const message = buildWhatsAppMessage(name, guests, note);
            const whatsappUrl = `https://wa.me/${config.brideWhatsApp}?text=${encodeURIComponent(message)}`;

            // Open WhatsApp
            window.open(whatsappUrl, '_blank');

            // Close modal and reset form
            closeModal(whatsappModal);
            rsvpForm.reset();
        });
    }

    function buildWhatsAppMessage(name, guests, note) {
        let message = `Hola, soy ${name}. Confirmo mi asistencia a la boda de Abidan y Betsaida el ${config.eventDate} a las ${config.eventTime}. Asistiremos ${guests} persona(s).`;

        if (note) {
            message += ` Nota: ${note}`;
        }

        message += ' ¡Muchas gracias!';

        return message;
    }

    // ==================== LAZY LOADING IMAGES ====================
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    // ==================== INITIALIZATION ====================
    function init() {
        initGuestPass();
        initEntryScreen();
        initFloatingNav();
        initScrollAnimations();
        initModals();
        initRSVP();
        initLazyLoading();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
