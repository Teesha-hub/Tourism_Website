// Authentication system for TravelVista India
// All authentication flows and messages are localized for Indian users

document.addEventListener('DOMContentLoaded', function() {
    initAuthForms();
    initPasswordToggle();
    initSocialAuth();
    checkAuthState();
});

// Initialize authentication forms
function initAuthForms() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const remember = form.remember ? form.remember.checked : false;
    
    if (!validateLoginForm(email, password)) {
        return;
    }
    
    const submitButton = form.querySelector('.btn-auth');
    showButtonLoading(submitButton, 'Signing in...');
    
    // Simulate API call
    setTimeout(() => {
        authenticateUser(email, password, remember)
            .then(response => {
                if (response.success) {
                    handleAuthSuccess(response.user, remember);
                } else {
                    handleAuthError(response.message);
                }
            })
            .catch(error => {
                handleAuthError('Login failed. Please try again.');
            })
            .finally(() => {
                hideButtonLoading(submitButton, 'Sign In');
            });
    }, 1000);
}

// Handle signup form submission
function handleSignup(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const userData = {
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        password: formData.get('password'),
        confirm_password: formData.get('confirm_password')
    };
    
    if (!validateSignupForm(userData)) {
        return;
    }
    
    const submitButton = form.querySelector('.btn-auth');
    showButtonLoading(submitButton, 'Creating account...');
    
    setTimeout(() => {
        createUserAccount(userData)
            .then(response => {
                if (response.success) {
                    handleSignupSuccess(response.user);
                } else {
                    handleAuthError(response.message);
                }
            })
            .catch(error => {
                handleAuthError('Account creation failed. Please try again.');
            })
            .finally(() => {
                hideButtonLoading(submitButton, 'Create Account');
            });
    }, 1500);
}

// Form validation functions
function validateLoginForm(email, password) {
    let isValid = true;
    
    if (!email) {
        showAuthError('Please enter your email address');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showAuthError('Please enter a valid email address');
        isValid = false;
    }
    
    if (!password) {
        showAuthError('Please enter your password');
        isValid = false;
    } else if (password.length < 6) {
        showAuthError('Password must be at least 6 characters long');
        isValid = false;
    }
    
    return isValid;
}

function validateSignupForm(userData) {
    let isValid = true;
    
    // Name validation
    if (!userData.first_name || !userData.last_name) {
        showAuthError('Please enter your full name');
        isValid = false;
    }
    
    // Email validation
    if (!userData.email) {
        showAuthError('Please enter your email address');
        isValid = false;
    } else if (!isValidEmail(userData.email)) {
        showAuthError('Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation
    if (!userData.phone) {
        showAuthError('Please enter your phone number');
        isValid = false;
    } else if (!isValidPhone(userData.phone)) {
        showAuthError('Please enter a valid phone number');
        isValid = false;
    }
    
    // Password validation
    if (!userData.password) {
        showAuthError('Please enter a password');
        isValid = false;
    } else if (!isStrongPassword(userData.password)) {
        showAuthError('Password must be at least 8 characters and contain uppercase, lowercase, and numbers');
        isValid = false;
    }
    
    // Confirm password
    if (userData.password !== userData.confirm_password) {
        showAuthError('Passwords do not match');
        isValid = false;
    }
    
    return isValid;
}

// Authentication API simulation
function authenticateUser(email, password, remember) {
    return new Promise((resolve) => {
        // Simulate API delay
        const users = getStoredUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            resolve({
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    name: `${user.first_name} ${user.last_name}`,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    phone: user.phone
                }
            });
        } else {
            resolve({
                success: false,
                message: 'Invalid email or password'
            });
        }
    });
}

function createUserAccount(userData) {
    return new Promise((resolve) => {
        const users = getStoredUsers();
        
        // Check if user already exists
        if (users.find(u => u.email === userData.email)) {
            resolve({
                success: false,
                message: 'An account with this email already exists'
            });
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            created_at: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('travelVista_users', JSON.stringify(users));
        
        resolve({
            success: true,
            user: {
                id: newUser.id,
                email: newUser.email,
                name: `${newUser.first_name} ${newUser.last_name}`,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                phone: newUser.phone
            }
        });
    });
}

// Success handlers
function handleAuthSuccess(user, remember = false) {
    // Store user session
    const sessionData = {
        user: user,
        timestamp: Date.now(),
        remember: remember
    };
    
    if (remember) {
        localStorage.setItem('travelVista_session', JSON.stringify(sessionData));
    } else {
        sessionStorage.setItem('travelVista_session', JSON.stringify(sessionData));
    }
    
    showAuthSuccess(`Welcome back, ${user.name}!`);
    
    // Redirect after success
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

function handleSignupSuccess(user) {
    showAuthSuccess('Account created successfully! You can now sign in.');
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// Error handler
function handleAuthError(message) {
    showAuthError(message);
}

// UI helper functions
function showButtonLoading(button, text) {
    button.innerHTML = `
        <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
            <div style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            ${text}
        </span>
    `;
    button.disabled = true;
}

function hideButtonLoading(button, originalText) {
    button.innerHTML = originalText;
    button.disabled = false;
}

function showAuthError(message) {
    const existingAlert = document.querySelector('.auth-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = 'auth-alert alert-error';
    alert.style.cssText = `
        background: #FEF2F2;
        color: #991B1B;
        border: 1px solid #FECACA;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        animation: fadeIn 0.3s ease;
    `;
    alert.textContent = message;
    
    const authForm = document.querySelector('.auth-form');
    authForm.insertBefore(alert, authForm.firstChild);
    
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

function showAuthSuccess(message) {
    const existingAlert = document.querySelector('.auth-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = 'auth-alert alert-success';
    alert.style.cssText = `
        background: #ECFDF5;
        color: #065F46;
        border: 1px solid #A7F3D0;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        animation: fadeIn 0.3s ease;
    `;
    alert.textContent = message;
    
    const authForm = document.querySelector('.auth-form');
    authForm.insertBefore(alert, authForm.firstChild);
}

// Password toggle functionality
function initPasswordToggle() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    passwordInputs.forEach(input => {
        const toggleButton = document.createElement('button');
        toggleButton.type = 'button';
        toggleButton.style.cssText = `
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #64748B;
            cursor: pointer;
            padding: 0;
            font-size: 0.9rem;
        `;
        toggleButton.textContent = '👁️';
        
        const inputContainer = input.parentNode;
        inputContainer.style.position = 'relative';
        inputContainer.appendChild(toggleButton);
        
        toggleButton.addEventListener('click', function() {
            if (input.type === 'password') {
                input.type = 'text';
                this.textContent = '🙈';
            } else {
                input.type = 'password';
                this.textContent = '👁️';
            }
        });
    });
}

// Social authentication (placeholder)
function initSocialAuth() {
    // This would integrate with social login providers
    // For now, we'll just add placeholder buttons if needed
}

// Check authentication state
function checkAuthState() {
    const sessionData = getSessionData();
    
    if (sessionData && sessionData.user) {
        // User is logged in
        updateUIForLoggedInUser(sessionData.user);
    }
}

function getSessionData() {
    const localStorage_session = localStorage.getItem('travelVista_session');
    const sessionStorage_session = sessionStorage.getItem('travelVista_session');
    
    const session = localStorage_session || sessionStorage_session;
    
    if (session) {
        try {
            const data = JSON.parse(session);
            
            // Check if session is expired (24 hours for remember me, 2 hours otherwise)
            const maxAge = data.remember ? 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000;
            const isExpired = Date.now() - data.timestamp > maxAge;
            
            if (isExpired) {
                logout();
                return null;
            }
            
            return data;
        } catch (error) {
            console.error('Error parsing session data:', error);
            return null;
        }
    }
    
    return null;
}

function updateUIForLoggedInUser(user) {
    // Update navigation if on main site
    const loginLink = document.querySelector('a[href="login.html"]');
    if (loginLink) {
        loginLink.textContent = `Welcome, ${user.first_name}`;
        loginLink.href = '#';
        
        // Add logout functionality
        const logoutLink = document.createElement('a');
        logoutLink.textContent = 'Logout';
        logoutLink.href = '#';
        logoutLink.className = 'nav-link';
        logoutLink.addEventListener('click', logout);
        
        loginLink.parentNode.insertBefore(logoutLink, loginLink.nextSibling);
    }
}

function logout() {
    localStorage.removeItem('travelVista_session');
    sessionStorage.removeItem('travelVista_session');
    window.location.reload();
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function isStrongPassword(password) {
    return password.length >= 8 && 
           /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
}

function getStoredUsers() {
    const users = localStorage.getItem('travelVista_users');
    return users ? JSON.parse(users) : [];
}

// Initialize with some demo users for testing
function initDemoUsers() {
    const users = getStoredUsers();
    
    if (users.length === 0) {
        const demoUsers = [
            {
                id: '1',
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com',
                password: 'password123',
                phone: '1234567890',
                created_at: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('travelVista_users', JSON.stringify(demoUsers));
    }
}

// Initialize demo users on first load
initDemoUsers();