// Admin authentication system for TravelVista India
// All admin authentication flows and security features are localized for Indian users

document.addEventListener('DOMContentLoaded', function() {
    initAdminAuth();
    initSecurityFeatures();
});

function initAdminAuth() {
    const adminLoginForm = document.getElementById('admin-login-form');
    
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
    
    // Check if already authenticated
    checkAdminAuthState();
}

function handleAdminLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const securityCode = form.security_code.value;
    
    if (!validateAdminCredentials(email, password, securityCode)) {
        return;
    }
    
    const submitButton = form.querySelector('.btn-auth');
    showAdminButtonLoading(submitButton, 'Authenticating...');
    
    setTimeout(() => {
        authenticateAdmin(email, password, securityCode)
            .then(response => {
                if (response.success) {
                    handleAdminAuthSuccess(response.admin);
                } else {
                    handleAdminAuthError(response.message);
                }
            })
            .catch(error => {
                handleAdminAuthError('Authentication failed. Please try again.');
            })
            .finally(() => {
                hideAdminButtonLoading(submitButton, 'Access Dashboard');
            });
    }, 1000);
}

function validateAdminCredentials(email, password, securityCode) {
    let isValid = true;
    
    if (!email || !password || !securityCode) {
        showAdminAuthError('All fields are required for admin access');
        isValid = false;
    }
    
    if (email && !isValidEmail(email)) {
        showAdminAuthError('Please enter a valid email address');
        isValid = false;
    }
    
    if (securityCode && securityCode.length !== 6) {
        showAdminAuthError('Security code must be 6 digits');
        isValid = false;
    }
    
    return isValid;
}

function authenticateAdmin(email, password, securityCode) {
    return new Promise((resolve) => {
        // Demo admin credentials
        const adminCredentials = {
            email: 'admin@travelvista.com',
            password: 'admin123',
            securityCode: '123456'
        };
        
        if (email === adminCredentials.email && 
            password === adminCredentials.password && 
            securityCode === adminCredentials.securityCode) {
            
            resolve({
                success: true,
                admin: {
                    id: 'admin_1',
                    email: email,
                    name: 'Administrator',
                    role: 'admin',
                    permissions: ['all']
                }
            });
        } else {
            resolve({
                success: false,
                message: 'Invalid credentials or security code'
            });
        }
    });
}

function handleAdminAuthSuccess(admin) {
    // Store admin session with enhanced security
    const sessionData = {
        admin: admin,
        timestamp: Date.now(),
        sessionId: generateSessionId(),
        ip: getClientIP() // In production, get from server
    };
    
    // Store in sessionStorage only (no persistent login for admin)
    sessionStorage.setItem('travelVista_admin_session', JSON.stringify(sessionData));
    
    showAdminAuthSuccess(`Welcome, ${admin.name}!`);
    
    setTimeout(() => {
        window.location.href = 'admin-dashboard.html';
    }, 1500);
}

function handleAdminAuthError(message) {
    showAdminAuthError(message);
    
    // Log failed attempt
    logSecurityEvent('admin_login_failed', { message });
}

function checkAdminAuthState() {
    const sessionData = getAdminSessionData();
    
    if (sessionData && sessionData.admin) {
        // Check if on login page, redirect to dashboard
        if (window.location.pathname.includes('admin-login.html')) {
            window.location.href = 'admin-dashboard.html';
        }
    } else {
        // Check if on admin dashboard, redirect to login
        if (window.location.pathname.includes('admin-dashboard.html')) {
            window.location.href = 'admin-login.html';
        }
    }
}

function getAdminSessionData() {
    const session = sessionStorage.getItem('travelVista_admin_session');
    
    if (session) {
        try {
            const data = JSON.parse(session);
            
            // Check if session is expired (30 minutes for admin)
            const maxAge = 30 * 60 * 1000; // 30 minutes
            const isExpired = Date.now() - data.timestamp > maxAge;
            
            if (isExpired) {
                adminLogout();
                return null;
            }
            
            return data;
        } catch (error) {
            console.error('Error parsing admin session data:', error);
            return null;
        }
    }
    
    return null;
}

function adminLogout() {
    sessionStorage.removeItem('travelVista_admin_session');
    
    if (window.location.pathname.includes('admin-dashboard.html')) {
        window.location.href = 'admin-login.html';
    }
}

// Security features
function initSecurityFeatures() {
    // Auto-logout on tab close/refresh warning
    window.addEventListener('beforeunload', function(e) {
        const adminSession = getAdminSessionData();
        if (adminSession) {
            e.preventDefault();
            e.returnValue = 'You will be logged out. Are you sure you want to leave?';
        }
    });
    
    // Session timeout warning
    setAdminSessionTimeout();
    
    // Prevent multiple tabs
    preventMultipleAdminTabs();
    
    // Monitor for suspicious activity
    monitorAdminActivity();
}

function setAdminSessionTimeout() {
    const sessionData = getAdminSessionData();
    
    if (sessionData) {
        const timeRemaining = 30 * 60 * 1000 - (Date.now() - sessionData.timestamp);
        
        if (timeRemaining > 0) {
            // Show warning 5 minutes before expiration
            setTimeout(() => {
                showSessionTimeoutWarning();
            }, timeRemaining - 5 * 60 * 1000);
            
            // Auto logout at expiration
            setTimeout(() => {
                adminLogout();
            }, timeRemaining);
        }
    }
}

function showSessionTimeoutWarning() {
    const warning = document.createElement('div');
    warning.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #FEF3C7;
        color: #92400E;
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid #FDE68A;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 300px;
    `;
    warning.innerHTML = `
        <strong>Session Timeout Warning</strong>
        <p>Your admin session will expire in 5 minutes.</p>
        <button onclick="extendAdminSession()" style="background: #D97706; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; margin-top: 0.5rem;">
            Extend Session
        </button>
    `;
    
    document.body.appendChild(warning);
    
    setTimeout(() => {
        if (warning.parentNode) {
            warning.remove();
        }
    }, 10000);
}

function extendAdminSession() {
    const sessionData = getAdminSessionData();
    if (sessionData) {
        sessionData.timestamp = Date.now();
        sessionStorage.setItem('travelVista_admin_session', JSON.stringify(sessionData));
        
        // Remove warning
        const warning = document.querySelector('[style*="position: fixed"][style*="top: 20px"]');
        if (warning) {
            warning.remove();
        }
        
        // Reset timeout
        setAdminSessionTimeout();
        
        showAdminNotification('Session extended successfully', 'success');
    }
}

function preventMultipleAdminTabs() {
    const sessionData = getAdminSessionData();
    if (sessionData) {
        // Use localStorage to communicate between tabs
        localStorage.setItem('admin_tab_active', sessionData.sessionId);
        
        window.addEventListener('storage', function(e) {
            if (e.key === 'admin_tab_active' && e.newValue !== sessionData.sessionId) {
                alert('Admin panel is already open in another tab. This session will be closed.');
                adminLogout();
            }
        });
    }
}

function monitorAdminActivity() {
    let activityTimeout;
    
    function resetActivityTimeout() {
        clearTimeout(activityTimeout);
        activityTimeout = setTimeout(() => {
            if (getAdminSessionData()) {
                alert('Session terminated due to inactivity.');
                adminLogout();
            }
        }, 15 * 60 * 1000); // 15 minutes of inactivity
    }
    
    // Monitor various user activities
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetActivityTimeout, true);
    });
    
    resetActivityTimeout();
}

// UI helper functions for admin auth
function showAdminButtonLoading(button, text) {
    button.innerHTML = `
        <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
            <div style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            ${text}
        </span>
    `;
    button.disabled = true;
}

function hideAdminButtonLoading(button, originalText) {
    button.innerHTML = originalText;
    button.disabled = false;
}

function showAdminAuthError(message) {
    const existingAlert = document.querySelector('.admin-auth-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = 'admin-auth-alert';
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

function showAdminAuthSuccess(message) {
    const alert = document.createElement('div');
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

function showAdminNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#F59E0B'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Utility functions
function generateSessionId() {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function getClientIP() {
    // In production, this would come from server
    return 'xxx.xxx.xxx.xxx';
}

function logSecurityEvent(event, data) {
    const logEntry = {
        event: event,
        data: data,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
    };
    
    console.log('Security Event:', logEntry);
    
    // In production, send to server for logging
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add CSS animations
const adminAuthStyles = document.createElement('style');
adminAuthStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(adminAuthStyles);