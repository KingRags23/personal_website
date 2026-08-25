// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Skill card animation on scroll
function animateSkillCards() {
    const skillCards = document.querySelectorAll('.skill-card');
    const skillsSection = document.querySelector('#skills');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.skill-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    if (skillsSection) {
        observer.observe(skillsSection);
        
        // Set initial state
        skillCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
    }
}

// Add interactive hover effects for skill cards
function addSkillCardInteractions() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(0, 255, 255, 0.2) 0%, transparent 70%);
                pointer-events: none;
                animation: skillRipple 0.6s ease-out forwards;
                transform: translate(-50%, -50%);
                z-index: 1;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Add click effect
        card.addEventListener('click', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
}

// Add CSS for skill card animations
const skillCardStyle = document.createElement('style');
skillCardStyle.textContent = `
    @keyframes skillRipple {
        0% {
            width: 0;
            height: 0;
            opacity: 0.8;
        }
        100% {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
    
    /* Enhanced skill card animations */
    .skill-card {
        cursor: pointer;
    }
    
    .skill-card:active {
        transform: translateY(-6px) scale(1.02) !important;
    }
    
    /* Staggered animation for skill categories */
    .skills-category:nth-child(1) .skill-card {
        animation-delay: 0.1s;
    }
    
    .skills-category:nth-child(2) .skill-card {
        animation-delay: 0.2s;
    }
    
    .skills-category:nth-child(3) .skill-card {
        animation-delay: 0.3s;
    }
    
    .skills-category:nth-child(4) .skill-card {
        animation-delay: 0.4s;
    }
    
    .skills-category:nth-child(5) .skill-card {
        animation-delay: 0.5s;
    }
`;
document.head.appendChild(skillCardStyle);

// Initialize skill card effects
document.addEventListener('DOMContentLoaded', function() {
    animateSkillCards();
    addSkillCardInteractions();
    initSkillRatings();
});

// Skill Rating System
function initSkillRatings() {
    // Define skill ratings (default is 5 stars, specified skills get 4 stars)
    const skillRatings = {
        'R': 4,
        'spaCy': 4,
        'Keras': 4,
        'LightGBM': 4,
        'SASS/SCSS': 4,
        'Redis': 4
    };
    
    const skillCards = document.querySelectorAll('.skill-card');
    
    // Prepare skill cards for flip animation
    skillCards.forEach(card => {
        prepareSkillCardForFlip(card);
        
        // Add click event to show rating overlay
        card.addEventListener('click', function(e) {
            e.stopPropagation();
            showSkillRating(this, skillRatings);
        });
    });
    
    // Close rating overlay when clicking outside (optional - remove this if you want cards to stay flipped)
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.skill-card') && !e.target.closest('.skills-section')) {
            // Uncomment the line below if you want clicking outside to close all cards
            // closeAllRatingOverlays();
        }
    });
}

function prepareSkillCardForFlip(skillCard) {
    // Get existing content
    const existingContent = skillCard.innerHTML;
    
    // Wrap existing content in a container
    skillCard.innerHTML = `
        <div class="skill-content">
            ${existingContent}
        </div>
    `;
}

function showSkillRating(skillCard, skillRatings) {
    // Check if this card is already flipped
    if (skillCard.classList.contains('flipped')) {
        // If already flipped, close it
        closeSkillRating(skillCard);
        return;
    }
    
    const skillName = skillCard.querySelector('span').textContent.trim();
    const rating = skillRatings[skillName] || 5; // Default to 5 stars
    
    // Add flip class to trigger animation
    skillCard.classList.add('flipped');
    
    // Create rating overlay
    const overlay = document.createElement('div');
    overlay.className = 'skill-rating-overlay';
    
    overlay.innerHTML = `
        <h4>${skillName}</h4>
        <div class="experience-label">Experience:</div>
        <div class="star-rating">
            ${generateStars(rating)}
        </div>
    `;
    
    skillCard.appendChild(overlay);
}

function generateStars(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHTML += '<i class="fas fa-star star filled"></i>';
        } else if (i - 0.5 === rating) {
            starsHTML += '<i class="fas fa-star-half-alt star half"></i>';
        } else {
            starsHTML += '<i class="far fa-star star"></i>';
        }
    }
    return starsHTML;
}

function closeSkillRating(skillCard) {
    const overlay = skillCard.querySelector('.skill-rating-overlay');
    if (overlay) {
        skillCard.classList.remove('flipped');
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}

function closeAllRatingOverlays() {
    const flippedCards = document.querySelectorAll('.skill-card.flipped');
    flippedCards.forEach(card => {
        closeSkillRating(card);
    });
}

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(237, 237, 239, 0.96)';
    } else {
        navbar.style.background = 'rgba(237, 237, 239, 0.86)';
    }
});

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Add active class style
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #19191a !important;
    }
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);

// Animated entrance for sections
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply initial styles and observe sections
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    sectionObserver.observe(section);
});

// Project card hover effects
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Form submission handling
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        
        const submitBtn = this.querySelector('.btn-primary');
        const originalText = submitBtn.textContent;
        const formData = new FormData(this);
        
        // Update button to show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        
        // Submit form using fetch API
        fetch('https://formspree.io/f/mvgaodqk', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Success - show success message
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.background = 'linear-gradient(45deg, #10b981, #059669)';
                
                // Reset form fields
                this.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.background = '#19191a';
                }, 3000);
                
                // Show success notification
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            
            // Error - show error message
            submitBtn.textContent = 'Failed to Send';
            submitBtn.style.background = 'linear-gradient(45deg, #ef4444, #dc2626)';
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.background = '#19191a';
            }, 3000);
            
            // Show error notification
            showNotification('Failed to send message. Please try again or email me directly.', 'error');
        });
    });
}

// Notification system
function showNotification(message, type) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add typing effect to the main heading
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing effect when about section is visible
const aboutSection = document.querySelector('#about');
const aboutTitle = document.querySelector('#about .highlight');
let typingInitialized = false;

const typingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !typingInitialized && aboutTitle) {
            const originalText = aboutTitle.textContent;
            typeWriter(aboutTitle, originalText, 150);
            typingInitialized = true;
        }
    });
}, {
    threshold: 0.5
});

if (aboutSection) {
    typingObserver.observe(aboutSection);
}

// AI/ML Neural Network Particle Effects
function enhanceNeuralParticles() {
    const particles = document.querySelectorAll('.diamond');
    
    particles.forEach((particle, index) => {
        // Add random animation delays for more organic movement
        particle.style.animationDelay = `-${Math.random() * 15}s`;
        
        // Create different particle types
        const particleTypes = ['node', 'data', 'signal'];
        const type = particleTypes[index % 3];
        
        switch(type) {
            case 'node':
                particle.style.background = '#00ffff';
                particle.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.4)';
                break;
            case 'data':
                particle.style.background = '#0080ff';
                particle.style.boxShadow = '0 0 8px rgba(0, 128, 255, 0.6), 0 0 16px rgba(0, 128, 255, 0.3)';
                break;
            case 'signal':
                particle.style.background = 'rgba(0, 255, 255, 0.6)';
                particle.style.boxShadow = '0 0 6px rgba(0, 255, 255, 0.4), 0 0 12px rgba(0, 255, 255, 0.2)';
                break;
        }
        
        // Add subtle pulsing effect
        particle.style.animation += `, particlePulse ${3 + Math.random() * 2}s ease-in-out infinite`;
    });
}

// Create dynamic neural connections
function createNeuralConnections() {
    const particles = document.querySelectorAll('.diamond');
    
    particles.forEach((particle, index) => {
        // Add connection lines that appear occasionally
        particle.addEventListener('animationiteration', function() {
            if (Math.random() > 0.7) { // 30% chance
                this.style.boxShadow += ', 0 0 30px rgba(0, 255, 255, 0.8)';
                
                setTimeout(() => {
                    this.style.boxShadow = this.style.boxShadow.replace(', 0 0 30px rgba(0, 255, 255, 0.8)', '');
                }, 500);
            }
        });
    });
}

// Add CSS for particle pulse animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particlePulse {
        0%, 100% {
            transform: scale(1);
            opacity: 0.7;
        }
        50% {
            transform: scale(1.2);
            opacity: 1;
        }
    }
    
    /* Enhanced neural network effect */
    .diamond:hover {
        animation-play-state: paused;
        transform: scale(1.5) !important;
        box-shadow: 0 0 20px rgba(0, 255, 255, 1), 0 0 40px rgba(0, 255, 255, 0.6) !important;
        z-index: 10;
    }
`;
document.head.appendChild(particleStyle);

// Initialize neural network effects
document.addEventListener('DOMContentLoaded', function() {
    enhanceNeuralParticles();
    createNeuralConnections();
    
    // Re-randomize particle properties every 45 seconds
    setInterval(enhanceNeuralParticles, 45000);
});

// Add interactive hover effects for particles
document.addEventListener('DOMContentLoaded', function() {
    const particles = document.querySelectorAll('.diamond');
    particles.forEach(particle => {
        particle.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
            this.style.transform = 'scale(1.8)';
            this.style.zIndex = '10';
        });
        
        particle.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
            this.style.transform = '';
            this.style.zIndex = '';
        });
    });
});

// Add glowing effect to contact form on focus
document.querySelectorAll('.form-group input, .form-group textarea').forEach(field => {
    field.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
        this.parentElement.style.transition = 'transform 0.3s ease';
    });
    
    field.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// Console message for developers
console.log(`
🚀 Welcome to my personal website!
💎 Built with vanilla HTML, CSS, and JavaScript
🎨 Featuring animated cyan diamonds and smooth scrolling
📧 Contact form powered by Formspree
✨ Made with passion and attention to detail

Feel free to reach out if you'd like to collaborate!
`);

// Add easter egg - Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg activated!
        document.body.style.animation = 'rainbow 2s infinite';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 10000);
        
        console.log('🌈 Easter egg activated! You found the secret!');
    }
});

// Image Carousel Functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
let autoSlideInterval;

function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current slide
    if (slides[index]) {
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }
}

function changeSlide(direction) {
    currentSlideIndex += direction;
    
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }
    
    showSlide(currentSlideIndex);
    resetAutoSlide();
}

function currentSlide(index) {
    currentSlideIndex = index - 1;
    showSlide(currentSlideIndex);
    resetAutoSlide();
}

function nextSlide() {
    changeSlide(1);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (slides.length > 1) {
        showSlide(0);
        startAutoSlide();
        
        // Pause auto-slide on hover
        const carousel = document.querySelector('.image-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
            carousel.addEventListener('mouseleave', startAutoSlide);
        }
    }
});

// Modern Interactive Background Effects
function createModernBackgroundEffects() {
    const orbs = document.querySelectorAll('.diamond');
    const animatedBg = document.querySelector('.animated-bg');
    
    // Mouse tracking for orb interactions
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        orbs.forEach((orb, index) => {
            const rect = orb.getBoundingClientRect();
            const orbCenterX = rect.left + rect.width / 2;
            const orbCenterY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(e.clientX - orbCenterX, 2) + 
                Math.pow(e.clientY - orbCenterY, 2)
            );
            
            // Create magnetic effect when mouse is near
            if (distance < 150) {
                const attraction = (150 - distance) / 150;
                const deltaX = (e.clientX - orbCenterX) * attraction * 0.1;
                const deltaY = (e.clientY - orbCenterY) * attraction * 0.1;
                
                orb.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${1 + attraction * 0.2})`;
                orb.style.boxShadow = `
                    0 0 ${40 + attraction * 20}px rgba(0, 255, 255, ${0.2 + attraction * 0.3}),
                    inset 0 0 ${40 + attraction * 20}px rgba(0, 255, 255, ${0.1 + attraction * 0.2})
                `;
            } else {
                orb.style.transform = '';
                orb.style.boxShadow = '';
            }
        });
        
        // Dynamic background gradient based on mouse position
        const hue1 = Math.floor(mouseX * 60 + 180); // Blue to cyan range
        const hue2 = Math.floor(mouseY * 60 + 240); // Blue to purple range
        
        animatedBg.style.background = `
            linear-gradient(135deg, 
                hsl(${hue1}, 70%, 8%) 0%, 
                hsl(${hue2}, 60%, 15%) 30%, 
                hsl(${(hue1 + hue2) / 2}, 65%, 18%) 70%, 
                hsl(${hue1 - 20}, 75%, 5%) 100%
            )
        `;
    });
    
    // Add click ripple effects
    document.addEventListener('click', (e) => {
        createRippleEffect(e.clientX, e.clientY);
    });
}

// Create ripple effect on click
function createRippleEffect(x, y) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, transparent 70%);
        pointer-events: none;
        z-index: 1000;
        animation: rippleExpand 1s ease-out forwards;
        transform: translate(-50%, -50%);
    `;
    
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 1000);
}

// Add CSS for ripple animation
const modernEffectsStyle = document.createElement('style');
modernEffectsStyle.textContent = `
    @keyframes rippleExpand {
        0% {
            width: 0;
            height: 0;
            opacity: 0.8;
        }
        50% {
            opacity: 0.4;
        }
        100% {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }
    
    /* Enhanced orb hover effects */
    .diamond:hover {
        animation-play-state: paused;
        transform: scale(1.3) !important;
        box-shadow: 
            0 0 60px rgba(0, 255, 255, 0.4),
            inset 0 0 60px rgba(0, 255, 255, 0.2),
            0 0 100px rgba(0, 255, 255, 0.1) !important;
        z-index: 10;
        backdrop-filter: blur(30px);
    }
    
    /* Scroll-based parallax effects */
    .animated-bg::before {
        transition: transform 0.1s ease-out;
    }
    
    .animated-bg::after {
        transition: transform 0.1s ease-out;
    }
    
    /* Dynamic color transitions */
    .animated-bg {
        transition: background 0.3s ease-out;
    }
    
    /* Floating animation enhancements */
    @keyframes floatOrbEnhanced {
        0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            filter: hue-rotate(0deg);
        }
        25% {
            transform: translate(30px, -40px) rotate(90deg) scale(1.1);
            filter: hue-rotate(90deg);
        }
        50% {
            transform: translate(-20px, -80px) rotate(180deg) scale(0.9);
            filter: hue-rotate(180deg);
        }
        75% {
            transform: translate(-40px, -20px) rotate(270deg) scale(1.05);
            filter: hue-rotate(270deg);
        }
    }
`;
document.head.appendChild(modernEffectsStyle);

// Scroll-based parallax effects
function addScrollParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        const rate2 = scrolled * -0.3;
        
        const bgBefore = document.querySelector('.animated-bg::before');
        const bgAfter = document.querySelector('.animated-bg::after');
        
        // Apply parallax to background layers
        document.documentElement.style.setProperty('--scroll-offset', `${rate}px`);
        document.documentElement.style.setProperty('--scroll-offset-2', `${rate2}px`);
        
        // Move orbs slightly based on scroll
        const orbs = document.querySelectorAll('.diamond');
        orbs.forEach((orb, index) => {
            const speed = 0.1 + (index * 0.05);
            orb.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Enhanced color cycling for orbs
function addColorCycling() {
    const orbs = document.querySelectorAll('.diamond');
    
    setInterval(() => {
        orbs.forEach((orb, index) => {
            const hue = (Date.now() / 50 + index * 60) % 360;
            const saturation = 50 + Math.sin(Date.now() / 1000 + index) * 20;
            const lightness = 50 + Math.cos(Date.now() / 1500 + index) * 10;
            
            orb.style.filter = `hue-rotate(${hue}deg) saturate(${saturation}%) brightness(${lightness}%)`;
        });
    }, 100);
}

// Initialize all modern effects
document.addEventListener('DOMContentLoaded', function() {
    initGridBackground();
});

// Back to Top Button Functionality
function initBackToTopButton() {
    const backToTopBtn = document.getElementById('backToTop');
    const aboutSection = document.getElementById('about');
    
    if (!backToTopBtn || !aboutSection) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Smooth scroll to About Me section when clicked
    backToTopBtn.addEventListener('click', () => {
        const aboutSectionTop = aboutSection.offsetTop - 70; // Account for fixed navbar
        
        window.scrollTo({
            top: aboutSectionTop,
            behavior: 'smooth'
        });
        
        // Add a little bounce effect to the button
        backToTopBtn.style.transform = 'translateY(-5px) scale(0.95)';
        setTimeout(() => {
            backToTopBtn.style.transform = '';
        }, 150);
    });
}

// Scroll progress bar removed for better performance
function initScrollProgress() {
    // Function disabled for performance
}

document.addEventListener('DOMContentLoaded', function() {
    initBackToTopButton();
    animateSkillCards();
    addSkillCardInteractions();
    initInvolvementCarousel();
});

function initInvolvementCarousel() {
    const root = document.querySelector('.involvement-carousel');
    if (!root) return;

    const cards = [...root.querySelectorAll('.involvement-card')];
    const prevBtn = root.querySelector('.involvement-nav.prev');
    const nextBtn = root.querySelector('.involvement-nav.next');
    const dotsWrap = root.querySelector('.involvement-dots');
    const count = cards.length;
    if (!count) return;

    let index = 0;
    let autoTimer;

    cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'involvement-dot';
        dot.setAttribute('aria-label', `Show involvement ${i + 1} of ${count}`);
        dot.addEventListener('click', () => {
            goTo(i);
            restartAuto();
        });
        dotsWrap.appendChild(dot);
    });

    const dots = [...dotsWrap.querySelectorAll('.involvement-dot')];

    function goTo(nextIndex) {
        index = ((nextIndex % count) + count) % count;
        const prev = (index - 1 + count) % count;
        const next = (index + 1) % count;

        cards.forEach((card, i) => {
            card.classList.remove('is-active', 'is-prev', 'is-next');
            if (i === index) card.classList.add('is-active');
            else if (i === prev) card.classList.add('is-prev');
            else if (i === next) card.classList.add('is-next');
        });

        dots.forEach((dot, i) => {
            const active = i === index;
            dot.classList.toggle('is-active', active);
            if (active) dot.setAttribute('aria-current', 'true');
            else dot.removeAttribute('aria-current');
        });
    }

    function stopAuto() {
        clearInterval(autoTimer);
    }

    function restartAuto() {
        stopAuto();
        autoTimer = setInterval(() => goTo(index + 1), 5000);
    }

    prevBtn.addEventListener('click', () => {
        goTo(index - 1);
        restartAuto();
    });

    nextBtn.addEventListener('click', () => {
        goTo(index + 1);
        restartAuto();
    });

    cards.forEach((card) => {
        card.addEventListener('click', () => {
            if (card.classList.contains('is-prev')) goTo(index - 1);
            else if (card.classList.contains('is-next')) goTo(index + 1);
            restartAuto();
        });
    });

    let touchStartX = 0;
    root.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    root.addEventListener('touchend', (event) => {
        const deltaX = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(deltaX) < 40) return;
        goTo(index + (deltaX < 0 ? 1 : -1));
        restartAuto();
    }, { passive: true });

    root.addEventListener('mouseenter', stopAuto);
    root.addEventListener('mouseleave', restartAuto);

    goTo(0);
    restartAuto();
}

function initGridBackground() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const CELL = 48;
    const snakes = [];
    let paths = [];
    let width = 0;
    let height = 0;
    let last = performance.now();
    let frame = 0;

    const palette = [
        { head: [163, 62, 62], speed: 68, length: 110 },
        { head: [50, 79, 140], speed: 96, length: 160 },
        { head: [49, 130, 68], speed: 118, length: 210 }
    ];

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function mix(rgb, t) {
        const r = Math.round(lerp(255, rgb[0], 0.62));
        const g = Math.round(lerp(255, rgb[1], 0.62));
        const b = Math.round(lerp(255, rgb[2], 0.62));
        return [r, g, b];
    }

    function dist(a, b) {
        return Math.hypot(b[0] - a[0], b[1] - a[1]);
    }

    function pathLength(path) {
        if (path.type === "line") return dist(path.a, path.b);
        if (path.type === "arc") return Math.abs(path.end - path.start) * path.r;
        return path.parts.reduce((sum, part) => sum + pathLength(part), 0);
    }

    function pointOnLine(a, b, t) {
        return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
    }

    function pointOnArc(path, t) {
        const ang = lerp(path.start, path.end, t);
        return [path.c[0] + Math.cos(ang) * path.r, path.c[1] + Math.sin(ang) * path.r];
    }

    function pointAt(path, s) {
        if (path.type === "line") {
            const len = pathLength(path) || 1;
            const t = Math.max(0, Math.min(1, s / len));
            return pointOnLine(path.a, path.b, t);
        }
        if (path.type === "arc") {
            const len = pathLength(path) || 1;
            const t = Math.max(0, Math.min(1, s / len));
            return pointOnArc(path, t);
        }
        let remaining = s;
        for (const part of path.parts) {
            const len = pathLength(part);
            if (remaining <= len) return pointAt(part, remaining);
            remaining -= len;
        }
        const lastPart = path.parts[path.parts.length - 1];
        return pointAt(lastPart, pathLength(lastPart));
    }

    function buildPaths() {
        const snap = (n) => Math.round(n / CELL) * CELL;
        const cx = snap(width * 0.27);
        const cy = snap(height * 0.26);
        const ox = snap(width * 0.72);
        const oy = snap(height * 0.58);

        return [
            { type: "line", a: [-width, cy - CELL], b: [width * 2, cy + CELL * 9] },
            { type: "line", a: [-width, cy + CELL], b: [width * 2, cy + CELL * 11] },
            { type: "line", a: [cx - CELL * 22, height + CELL * 8], b: [cx + CELL * 28, -CELL * 10] },
            { type: "arc", c: [cx, cy], r: CELL * 4, start: 0, end: Math.PI * 2 },
            { type: "arc", c: [ox, oy], r: CELL, start: 0, end: Math.PI * 2 },
            {
                type: "chain",
                parts: [
                    { type: "line", a: [cx + CELL * 6, -height], b: [cx + CELL * 6, cy] },
                    { type: "arc", c: [cx, cy], r: CELL * 6, start: 0, end: Math.PI / 2 },
                    { type: "line", a: [cx, cy + CELL * 6], b: [-width, cy + CELL * 6] }
                ]
            }
        ];
    }

    function pickPath(exclude) {
        const options = paths.filter((_, i) => i !== exclude);
        return options[Math.floor(Math.random() * options.length)] || paths[0];
    }

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        paths = buildPaths();
        if (!snakes.length) {
            palette.forEach((spec, i) => {
                snakes.push({
                    ...spec,
                    tail: mix(spec.head),
                    pathIndex: i % paths.length,
                    s: pathLength(paths[i % paths.length]) * (0.18 + i * 0.12)
                });
            });
        }
        snakes.forEach((snake, i) => {
            if (!paths[snake.pathIndex]) snake.pathIndex = i % paths.length;
        });
    }

    function drawGrid() {
        ctx.lineWidth = 1;
        for (let x = 0; x <= width + CELL; x += CELL) {
            ctx.strokeStyle = (x / CELL) % 4 === 0 ? "rgba(48, 48, 49, 0.20)" : "rgba(48, 48, 49, 0.10)";
            ctx.beginPath();
            ctx.moveTo(x + 0.5, 0);
            ctx.lineTo(x + 0.5, height);
            ctx.stroke();
        }
        for (let y = 0; y <= height + CELL; y += CELL) {
            ctx.strokeStyle = (y / CELL) % 4 === 0 ? "rgba(48, 48, 49, 0.20)" : "rgba(48, 48, 49, 0.10)";
            ctx.beginPath();
            ctx.moveTo(0, y + 0.5);
            ctx.lineTo(width, y + 0.5);
            ctx.stroke();
        }
    }

    function drawConstruction() {
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = "rgba(48, 48, 49, 0.32)";
        ctx.lineWidth = 1.2;
        paths.forEach((path) => {
            ctx.beginPath();
            if (path.type === "line") {
                ctx.moveTo(path.a[0], path.a[1]);
                ctx.lineTo(path.b[0], path.b[1]);
            } else if (path.type === "arc") {
                ctx.arc(path.c[0], path.c[1], path.r, path.start, path.end);
            } else {
                path.parts.forEach((part, i) => {
                    if (part.type === "line") {
                        if (i === 0) ctx.moveTo(part.a[0], part.a[1]);
                        ctx.lineTo(part.b[0], part.b[1]);
                    } else {
                        ctx.arc(part.c[0], part.c[1], part.r, part.start, part.end);
                    }
                });
            }
            ctx.stroke();
        });
        ctx.setLineDash([]);

        const mark = paths[4];
        if (mark && mark.type === "arc") {
            ctx.strokeStyle = "rgba(48, 48, 49, 0.45)";
            ctx.beginPath();
            ctx.moveTo(mark.c[0] - 6, mark.c[1] - 6);
            ctx.lineTo(mark.c[0] + 6, mark.c[1] + 6);
            ctx.moveTo(mark.c[0] + 6, mark.c[1] - 6);
            ctx.lineTo(mark.c[0] - 6, mark.c[1] + 6);
            ctx.stroke();
        }
    }

    function drawSnake(snake) {
        const path = paths[snake.pathIndex];
        if (!path) return;
        const len = pathLength(path);
        const start = Math.max(0, snake.s - snake.length);
        const end = Math.min(len, snake.s);
        if (end <= start) return;

        const steps = 56;
        let prev = pointAt(path, start);
        for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const next = pointAt(path, lerp(start, end, t));
            const r = lerp(snake.tail[0], snake.head[0], t);
            const g = lerp(snake.tail[1], snake.head[1], t);
            const b = lerp(snake.tail[2], snake.head[2], t);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.55 + t * 0.45})`;
            ctx.lineWidth = 2.1;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(prev[0], prev[1]);
            ctx.lineTo(next[0], next[1]);
            ctx.stroke();
            prev = next;
        }

        const head = pointAt(path, end);
        ctx.save();
        ctx.shadowColor = `rgba(${snake.head[0]}, ${snake.head[1]}, ${snake.head[2]}, 0.9)`;
        ctx.shadowBlur = 10;
        ctx.fillStyle = `rgb(${snake.head[0]}, ${snake.head[1]}, ${snake.head[2]})`;
        ctx.beginPath();
        ctx.arc(head[0], head[1], 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function tick(now) {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        ctx.clearRect(0, 0, width, height);
        drawGrid();
        drawConstruction();

        if (!reduceMotion) {
            snakes.forEach((snake) => {
                const path = paths[snake.pathIndex];
                const len = pathLength(path);
                snake.s += snake.speed * dt;
                if (snake.s > len + snake.length) {
                    const next = pickPath(snake.pathIndex);
                    snake.pathIndex = paths.indexOf(next);
                    snake.s = 20;
                }
                drawSnake(snake);
            });
            frame = requestAnimationFrame(tick);
        } else {
            snakes.forEach(drawSnake);
        }
    }

    window.addEventListener("resize", () => {
        cancelAnimationFrame(frame);
        resize();
        last = performance.now();
        frame = requestAnimationFrame(tick);
    });

    resize();
    frame = requestAnimationFrame(tick);
} 