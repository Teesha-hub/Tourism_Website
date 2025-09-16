// Form handling and validation for TravelVista India
// All form validation and submission flows are localized for Indian users

document.addEventListener('DOMContentLoaded', function() {
    initBookingForm();
    initContactForm();
    initFormValidation();
});

// Booking Form
function initBookingForm() {
    const bookingForm = document.getElementById('booking-form');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateBookingForm()) {
                submitBookingForm(this);
            }
        });
        
        // Real-time validation
        const formInputs = bookingForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
        
        // Date validation
        const travelDate = document.getElementById('travel-date');
        if (travelDate) {
            const today = new Date().toISOString().split('T')[0];
            travelDate.min = today;
            
            travelDate.addEventListener('change', function() {
                const selectedDate = new Date(this.value);
                const today = new Date();
                
                if (selectedDate <= today) {
                    showFieldError(this, 'Travel date must be in the future');
                } else {
                    clearFieldError(this);
                }
            });
        }
    }
}

// Contact Form
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateContactForm()) {
                submitContactForm(this);
            }
        });
    }
}

// Form Validation
function initFormValidation() {
    // Email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateEmail(this);
        });
    });
    
    // Phone validation
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validatePhone(this);
        });
        
        input.addEventListener('input', function() {
            formatPhone(this);
        });
    });
    
    // Password validation
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validatePassword(this);
        });
    });
}

// Booking Form Validation
function validateBookingForm() {
    const form = document.getElementById('booking-form');
    let isValid = true;
    
    // Required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Email validation
    const email = document.getElementById('email');
    if (email && email.value && !validateEmail(email)) {
        isValid = false;
    }
    
    // Phone validation
    const phone = document.getElementById('phone');
    if (phone && phone.value && !validatePhone(phone)) {
        isValid = false;
    }
    
    // Date validation
    const travelDate = document.getElementById('travel-date');
    if (travelDate && travelDate.value) {
        const selectedDate = new Date(travelDate.value);
        const today = new Date();
        
        if (selectedDate <= today) {
            showFieldError(travelDate, 'Travel date must be in the future');
            isValid = false;
        }
    }
    
    return isValid;
}

// Contact Form Validation
function validateContactForm() {
    const form = document.querySelector('.contact-form');
    let isValid = true;
    
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    const email = form.querySelector('input[type="email"]');
    if (email && email.value && !validateEmail(email)) {
        isValid = false;
    }
    
    return isValid;
}

// Submit Booking Form
function submitBookingForm(form) {
    const submitButton = form.querySelector('.btn-submit');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Submitting...';
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    // Prepare form data
    const formData = new FormData(form);
    const bookingData = {
        full_name: formData.get('full_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        package: formData.get('package'),
        travelers: formData.get('travelers'),
        travel_date: formData.get('travel_date'),
        special_requests: formData.get('special_requests') || ''
    };
    
    // Simulate API call (replace with actual endpoint)
    setTimeout(() => {
        try {
            // In a real implementation, you would send this to your PHP backend
            console.log('Booking submitted:', bookingData);
            
            // Show success message
            window.TravelVista.showNotification('Booking request submitted successfully! We will contact you within 24 hours.', 'success');
            
            // Reset form
            form.reset();
            
            // Optional: Redirect to a thank you page
            // window.location.href = 'booking-confirmation.html';
            
        } catch (error) {
            console.error('Booking submission error:', error);
            window.TravelVista.showNotification('There was an error submitting your booking. Please try again.', 'error');
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    }, 1500);
}

// Submit Contact Form
function submitContactForm(form) {
    const submitButton = form.querySelector('.btn-submit');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Sending...';
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    const formData = new FormData(form);
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject') || 'General Inquiry',
        message: formData.get('message')
    };
    
    // Simulate API call
    setTimeout(() => {
        try {
            console.log('Contact form submitted:', contactData);
            
            window.TravelVista.showNotification('Message sent successfully! We will get back to you soon.', 'success');
            form.reset();
            
        } catch (error) {
            console.error('Contact form submission error:', error);
            window.TravelVista.showNotification('There was an error sending your message. Please try again.', 'error');
        } finally {
            submitButton.textContent = originalText;
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    }, 1000);
}

// Field Validation Functions
function validateField(field) {
    const value = field.value.trim();
    
    if (field.required && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value) {
        return validateEmail(field);
    }
    
    if (field.type === 'tel' && value) {
        return validatePhone(field);
    }
    
    if (field.type === 'password' && value) {
        return validatePassword(field);
    }
    
    clearFieldError(field);
    return true;
}

function validateEmail(emailField) {
    const email = emailField.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        showFieldError(emailField, 'Please enter a valid email address');
        return false;
    }
    
    clearFieldError(emailField);
    return true;
}

function validatePhone(phoneField) {
    const phone = phoneField.value.trim();
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    
    if (phone.length < 10) {
        showFieldError(phoneField, 'Phone number must be at least 10 digits');
        return false;
    }
    
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
        showFieldError(phoneField, 'Please enter a valid phone number');
        return false;
    }
    
    clearFieldError(phoneField);
    return true;
}

function validatePassword(passwordField) {
    const password = passwordField.value;
    const minLength = 8;
    
    if (password.length < minLength) {
        showFieldError(passwordField, `Password must be at least ${minLength} characters long`);
        return false;
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        showFieldError(passwordField, 'Password must contain at least one uppercase letter, one lowercase letter, and one number');
        return false;
    }
    
    clearFieldError(passwordField);
    return true;
}

// Format phone number
function formatPhone(phoneField) {
    let value = phoneField.value.replace(/\D/g, '');
    
    if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{3})(\d+)/, '($1) $2-$3');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{3})(\d+)/, '($1) $2');
    }
    
    phoneField.value = value;
}

// Error display functions
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    field.style.borderColor = '#EF4444';
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.cssText = `
        color: #EF4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        animation: fadeIn 0.3s ease;
    `;
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    field.style.borderColor = '#E2E8F0';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Password confirmation validation
function initPasswordConfirmation() {
    const password = document.getElementById('signup-password');
    const confirmPassword = document.getElementById('confirm-password');
    
    if (password && confirmPassword) {
        confirmPassword.addEventListener('blur', function() {
            if (this.value !== password.value) {
                showFieldError(this, 'Passwords do not match');
            } else {
                clearFieldError(this);
            }
        });
    }
}

// Initialize password confirmation on signup page
if (document.getElementById('signup-form')) {
    initPasswordConfirmation();
}