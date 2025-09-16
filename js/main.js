// Main JavaScript functionality for TravelVista India Tourism Management System
// All navigation, packages, and destinations are localized for Indian users

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation
    initMobileNavigation();
    
    // Smooth scrolling
    initSmoothScrolling();
    
    // Header scroll effect
    initHeaderScrollEffect();
    
    // Testimonials slider
    initTestimonialsSlider();
    
    // Package filter functionality
    initPackageFilters();
    
    // Package booking buttons
    initPackageBooking();
    
    // Intersection observer for animations
    initScrollAnimations();
    
    // Initialize lazy loading
    initLazyLoading();
});

// Mobile Navigation
function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Header Scroll Effect
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(30, 41, 59, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(30, 41, 59, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
}

// Testimonials Slider
function initTestimonialsSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    const navDots = document.querySelectorAll('.nav-dot');
    let currentSlide = 0;
    
    if (testimonials.length > 0 && navDots.length > 0) {
        // Auto slide functionality
        function showSlide(index) {
            testimonials.forEach(testimonial => testimonial.classList.remove('active'));
            navDots.forEach(dot => dot.classList.remove('active'));
            
            testimonials[index].classList.add('active');
            navDots[index].classList.add('active');
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % testimonials.length;
            showSlide(currentSlide);
        }
        
        // Set up navigation dots
        navDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });
        
        // Auto-advance slides every 5 seconds
        setInterval(nextSlide, 5000);
    }
}

// Package Filters
function initPackageFilters() {
    const locationFilter = document.getElementById('location-filter');
    const priceFilter = document.getElementById('price-filter');
    const durationFilter = document.getElementById('duration-filter');
    const packageCards = document.querySelectorAll('.package-card');
    
    if (locationFilter && priceFilter && durationFilter) {
        [locationFilter, priceFilter, durationFilter].forEach(filter => {
            filter.addEventListener('change', filterPackages);
        });
    }
    
    function filterPackages() {
        const locationValue = locationFilter.value;
        const priceValue = priceFilter.value;
        const durationValue = durationFilter.value;
        
        packageCards.forEach(card => {
            const cardLocation = card.dataset.location;
            const cardPrice = parseInt(card.dataset.price);
            const cardDuration = parseInt(card.dataset.duration);
            
            let showCard = true;
            
            // Filter by location
            if (locationValue && cardLocation !== locationValue) {
                showCard = false;
            }
            
            // Filter by price
            if (priceValue && showCard) {
                const [minPrice, maxPrice] = priceValue.split('-').map(p => parseInt(p));
                if (maxPrice) {
                    if (cardPrice < minPrice || cardPrice > maxPrice) {
                        showCard = false;
                    }
                } else if (priceValue.includes('+')) {
                    if (cardPrice < minPrice) {
                        showCard = false;
                    }
                }
            }
            
            // Filter by duration
            if (durationValue && showCard) {
                const [minDuration, maxDuration] = durationValue.split('-').map(d => parseInt(d));
                if (maxDuration) {
                    if (cardDuration < minDuration || cardDuration > maxDuration) {
                        showCard = false;
                    }
                } else if (durationValue.includes('+')) {
                    if (cardDuration < minDuration) {
                        showCard = false;
                    }
                }
            }
            
            // Show/hide card with animation
            if (showCard) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // Show "No packages found" message if no packages are visible
        const visiblePackages = Array.from(packageCards).filter(card => 
            card.style.display !== 'none'
        );
        
        const existingMessage = document.querySelector('.no-packages-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        if (visiblePackages.length === 0) {
            const packagesGrid = document.getElementById('packages-grid');
            const message = document.createElement('div');
            message.className = 'no-packages-message';
            message.style.cssText = `
                grid-column: 1 / -1;
                text-align: center;
                padding: 3rem;
                color: #64748B;
                font-size: 1.1rem;
            `;
            message.innerHTML = `
                <h3>No packages found</h3>
                <p>Try adjusting your filters to see more results.</p>
            `;
            packagesGrid.appendChild(message);
        }
    }
}

// Package Booking
function initPackageBooking() {
    const bookingButtons = document.querySelectorAll('.btn-book-package');
    const packageSelect = document.getElementById('package-select');
    
    bookingButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const packageName = this.dataset.package;
            
            if (packageSelect && packageName) {
                packageSelect.value = packageName;
            }
            
            // Scroll to booking form
            const bookingSection = document.getElementById('booking');
            if (bookingSection) {
                const offsetTop = bookingSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Add highlight effect to the form
                const bookingForm = document.getElementById('booking-form');
                if (bookingForm) {
                    bookingForm.style.transform = 'scale(1.02)';
                    bookingForm.style.boxShadow = '0 8px 30px rgba(14, 165, 233, 0.3)';
                    
                    setTimeout(() => {
                        bookingForm.style.transform = 'scale(1)';
                        bookingForm.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    }, 1000);
                }
            }
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.destination-card, .package-card, .feature, .testimonial');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });
}

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#0EA5E9'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Export functions for use in other modules
window.TravelVista = {
    showNotification,
    initMobileNavigation,
    initSmoothScrolling,
    initHeaderScrollEffect,
    initTestimonialsSlider,
    initPackageFilters,
    initPackageBooking,
    initScrollAnimations,
    initLazyLoading
};