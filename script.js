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
        <button class="close-rating" onclick="closeSkillRatingFromButton(this)">
            <i class="fas fa-times"></i>
        </button>
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

function closeSkillRatingFromButton(button) {
    const skillCard = button.closest('.skill-card');
    closeSkillRating(skillCard);
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
        navbar.style.background = 'rgba(10, 22, 40, 0.95)';
    } else {
        navbar.style.background = 'rgba(10, 22, 40, 0.9)';
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
        color: #00ffff !important;
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
                    submitBtn.style.background = 'linear-gradient(45deg, #00ffff, #0066ff)';
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
                submitBtn.style.background = 'linear-gradient(45deg, #00ffff, #0066ff)';
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
    if (slides.length > 0) {
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
    createModernBackgroundEffects();
    addScrollParallax();
    addColorCycling();
    
    // Add enhanced floating animation to some orbs
    const orbs = document.querySelectorAll('.diamond');
    orbs.forEach((orb, index) => {
        if (index % 2 === 0) {
            orb.style.animation = orb.style.animation.replace('floatOrb', 'floatOrbEnhanced');
        }
    });
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

// Scroll Progress Bar Functionality
function initScrollProgress() {
    const progressBar = document.querySelector('.progress-bar');
    
    if (!progressBar) return;
    
    function updateScrollProgress() {
        // Calculate scroll progress
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollProgress = (scrollTop / scrollHeight) * 100;
        
        // Update progress bar width
        progressBar.style.width = `${Math.min(scrollProgress, 100)}%`;
        
        // Add glow effect when scrolling
        if (scrollProgress > 0) {
            progressBar.style.boxShadow = `
                0 0 10px rgba(0, 255, 255, 0.5),
                0 0 20px rgba(0, 255, 255, 0.3),
                0 0 30px rgba(0, 255, 255, 0.1)
            `;
        } else {
            progressBar.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.5)';
        }
    }
    
    // Update progress on scroll
    window.addEventListener('scroll', updateScrollProgress);
    
    // Initial update
    updateScrollProgress();
}

// Initialize back to top button
document.addEventListener('DOMContentLoaded', function() {
    initScrollProgress();
    initBackToTopButton();
    
    // ... existing code ...
    animateSkillCards();
    addSkillCardInteractions();
    createModernBackgroundEffects();
    addScrollParallax();
    addColorCycling();
    
    // Add enhanced floating animation to some orbs
    const orbs = document.querySelectorAll('.diamond');
    orbs.forEach((orb, index) => {
        if (index % 2 === 0) {
            orb.style.animation = orb.style.animation.replace('floatOrb', 'floatOrbEnhanced');
        }
    });
}); 