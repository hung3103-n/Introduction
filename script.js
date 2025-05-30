document.addEventListener('DOMContentLoaded', function() {
    function smoothScrollTo(selector) {
        const target = document.querySelector(selector);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            console.warn(`Scroll target not found: ${selector}`);
        }
    }

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function injectDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .revealed {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            .nav-links a.active {
                color: #e0e7ff;
            }
            
            .nav-links a.active::after {
                width: 100%;
            }
            
            .loaded {
                overflow-x: hidden;
            }
            
            .custom-cursor {
                display: none;
            }
            
            @media (min-width: 769px) {
                .custom-cursor {
                    display: block;
                }
                
                body {
                    cursor: none;
                }
                
                a, button, .btn {
                    cursor: none;
                }
            }

            .keyboard-nav *:focus {
                outline: 2px solid #fff;
                outline-offset: 2px;
            }
            
            .keyboard-nav .btn:focus {
                outline: 2px solid #4ecdc4;
            }
            
            @media (prefers-reduced-motion: reduce) {
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            smoothScrollTo(this.getAttribute('href'));
        });
    });

    const fadeInObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, fadeInObserverOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        fadeInObserver.observe(el);
    });

    const typingTexts = [
        'Full Stack Developer & UI/UX Designer',
        'Problem Solver & Code Enthusiast',
        'Creative Thinker & Tech Innovator',
        'Coffee Lover & Mountain Hiker'
    ];
    let typingTextIndex = 0;
    let typingCharIndex = 0;
    let typingIsDeleting = false;
    const heroTypingElement = document.querySelector('.hero p');

    function typeEffect() {
        if (!heroTypingElement) return;

        const currentText = typingTexts[typingTextIndex];
        
        if (typingIsDeleting) {
            heroTypingElement.textContent = currentText.substring(0, typingCharIndex - 1);
            typingCharIndex--;
        } else {
            heroTypingElement.textContent = currentText.substring(0, typingCharIndex + 1);
            typingCharIndex++;
        }

        let typeSpeed = typingIsDeleting ? 50 : 100;

        if (!typingIsDeleting && typingCharIndex === currentText.length) {
            typeSpeed = 2000;
            typingIsDeleting = true;
        } else if (typingIsDeleting && typingCharIndex === 0) {
            typingIsDeleting = false;
            typingTextIndex = (typingTextIndex + 1) % typingTexts.length;
            typeSpeed = 500;
        }

        setTimeout(typeEffect, typeSpeed);
    }

    setTimeout(() => {
        typeEffect();
    }, 3000);

    function handleParallax() {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.floating-shapes');
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.05;
            const yPos = scrolled * speed;
            shape.style.transform = `translateY(${yPos}px)`;
        });
    }

    window.addEventListener('scroll', throttle(handleParallax, 16));

    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255,255,255,0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 2;
        `;
        
        let rippleWrapper = button.querySelector('.ripple-wrapper');
        if (!rippleWrapper) {
            rippleWrapper = document.createElement('div');
            rippleWrapper.className = 'ripple-wrapper';
            rippleWrapper.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
                border-radius: inherit;
            `;
            button.appendChild(rippleWrapper);
        }
        
        rippleWrapper.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
                if (rippleWrapper.children.length === 0 && rippleWrapper.parentNode) {
                    rippleWrapper.remove();
                }
            }
        }, 600);
    }

    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', createRipple);
    });

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.skill-progress');
                progressBars.forEach(bar => {
                    bar.style.animation = 'none';
                    void bar.offsetWidth;
                    bar.style.animation = 'loadSkill 2s ease-out forwards';
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
        skillObserver.observe(skillsSection);
    }

    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 15px 30px rgba(0,0,0,0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });

    document.querySelectorAll('.contact-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) rotate(2deg) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0deg) scale(1)';
        });
    });

    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', throttle(updateActiveNav, 100));
    updateActiveNav();

    window.addEventListener('load', function() {
        document.body.classList.add('loaded');

        const heroElements = document.querySelectorAll('.hero h1, .hero p, .cta-buttons');
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200 + 500);
        });
    });

    const revealElements = document.querySelectorAll('.skill-card, .project-card, .contact-item');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });

    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            handleParallax();
            if (window.innerWidth <= 768) {
                const cursor = document.querySelector('.custom-cursor');
                if (cursor) cursor.remove();
                document.body.style.cursor = 'auto';
            } else {
                if (!document.querySelector('.custom-cursor')) {
                    addCursorEffect();
                }
            }
            updateActiveNav();
        }, 250);
    });

    function addCursorEffect() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.1s ease, background 0.2s ease;
            transform: translate(-50%, -50%);
        `;
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-card, .contact-item');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(2)';
                cursor.style.background = 'rgba(255, 255, 255, 0.5)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.background = 'rgba(255, 255, 255, 0.3)';
            });
        });
    }

    if (window.innerWidth > 768) {
        addCursorEffect();
    }

    function checkPerformanceAndAccessibility() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' || connection.saveData);
        
        const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (isSlowConnection || isLowEndDevice || prefersReducedMotion) {
            document.body.classList.add('reduced-animations');
            if (heroTypingElement) {
                heroTypingElement.textContent = typingTexts[0];
            }
            console.log('Reduced animations due to performance or user preference.');
        }
    }
    
    checkPerformanceAndAccessibility();

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
        if (e.key === 'Escape') {
            document.querySelectorAll('.active').forEach(el => {
                el.classList.remove('active');
            });
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });

    injectDynamicStyles();
    console.log('Personal Profile Website Loaded Successfully! 🚀');
});
