// Admin dashboard functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check admin authentication
    if (!checkAdminAuth()) {
        return;
    }
    
    initAdminDashboard();
    initTabNavigation();
    initDataTables();
    initModals();
    initCharts();
    initRealTimeUpdates();
});

function checkAdminAuth() {
    const session = sessionStorage.getItem('travelVista_admin_session');
    if (!session) {
        window.location.href = 'admin-login.html';
        return false;
    }
    
    try {
        const data = JSON.parse(session);
        const maxAge = 30 * 60 * 1000; // 30 minutes
        const isExpired = Date.now() - data.timestamp > maxAge;
        
        if (isExpired) {
            sessionStorage.removeItem('travelVista_admin_session');
            window.location.href = 'admin-login.html';
            return false;
        }
        
        return true;
    } catch (error) {
        window.location.href = 'admin-login.html';
        return false;
    }
}

function initAdminDashboard() {
    // Load initial data
    loadDashboardData();
    
    // Set up auto-refresh
    setInterval(() => {
        updateDashboardStats();
    }, 30000); // Update every 30 seconds
    
    // Initialize responsive sidebar
    initResponsiveSidebar();
}

function initTabNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    const adminTabs = document.querySelectorAll('.admin-tab');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetTab = this.dataset.tab;
            
            // Update active menu item
            menuItems.forEach(mi => mi.classList.remove('active'));
            this.classList.add('active');
            
            // Update active tab
            adminTabs.forEach(tab => tab.classList.remove('active'));
            const targetTabElement = document.getElementById(targetTab);
            if (targetTabElement) {
                targetTabElement.classList.add('active');
                
                // Load tab-specific data
                loadTabData(targetTab);
            }
        });
    });
}

function loadTabData(tabName) {
    switch (tabName) {
        case 'packages':
            loadPackagesData();
            break;
        case 'bookings':
            loadBookingsData();
            break;
        case 'users':
            loadUsersData();
            break;
        case 'destinations':
            loadDestinationsData();
            break;
        case 'reports':
            loadReportsData();
            break;
    }
}

function loadDashboardData() {
    // Load dashboard statistics (INR, Indian context)
    // All stats and bookings below are localized for Indian users
    const stats = getDashboardStats();
    updateStatsDisplay(stats);
    // Load recent bookings (Indian names/packages)
    loadRecentBookings();
    // Load destination stats (Indian destinations)
    loadDestinationStats();
}

function getDashboardStats() {
    // Simulate fetching data from API
    return {
        totalUsers: 1234,
        activeBookings: 567,
        totalPackages: 24,
        monthlyRevenue: 89450
    };
}

function updateStatsDisplay(stats) {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach((card, index) => {
        const statValue = card.querySelector('h3');
        if (statValue) {
            switch (index) {
                case 0:
                    statValue.textContent = stats.totalUsers.toLocaleString();
                    break;
                case 1:
                    statValue.textContent = stats.activeBookings.toLocaleString();
                    break;
                case 2:
                    statValue.textContent = stats.totalPackages;
                    break;
                case 3:
                    statValue.textContent = `$${stats.monthlyRevenue.toLocaleString()}`;
                    break;
            }
        }
    });
}

function loadRecentBookings() {
    const bookings = [
        {
            id: '#BK001',
            customer: 'Sarah Johnson',
            email: 'sarah@email.com',
            package: 'Tropical Paradise Adventure',
            status: 'pending',
            amount: 1798
        },
        {
            id: '#BK002',
            customer: 'Michael Chen',
            email: 'michael@email.com',
            package: 'Japan Discovery Tour',
            status: 'confirmed',
            amount: 1899
        },
        {
            id: '#BK003',
            customer: 'Emma Wilson',
            email: 'emma@email.com',
            package: 'African Safari Experience',
            status: 'confirmed',
            amount: 2299
        }
    ];
    
    const recentBookingsContainer = document.querySelector('.recent-bookings');
    if (recentBookingsContainer) {
        recentBookingsContainer.innerHTML = '';
        
        bookings.forEach(booking => {
            const bookingElement = createBookingElement(booking);
            recentBookingsContainer.appendChild(bookingElement);
        });
    }
}

function createBookingElement(booking) {
    const element = document.createElement('div');
    element.className = 'booking-item';
    
    element.innerHTML = `
        <div class="booking-info">
            <strong>${booking.customer}</strong>
            <p>${booking.package} - $${booking.amount.toLocaleString()}</p>
        </div>
        <div class="booking-status ${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</div>
    `;
    
    return element;
}

// Package Management
function loadPackagesData() {
    const packages = getPackagesFromStorage();
    displayPackagesTable(packages);
}

function getPackagesFromStorage() {
    const stored = localStorage.getItem('travelVista_packages');
    return stored ? JSON.parse(stored) : getDefaultPackages();
}

function getDefaultPackages() {
    return [
        {
            id: 1,
            name: 'Tropical Paradise Adventure',
            destination: 'Bali, Indonesia',
            duration: '7 Days',
            price: 899,
            status: 'active',
            image_url: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg'
        },
        {
            id: 2,
            name: 'Romantic European Getaway',
            destination: 'Paris, France',
            duration: '5 Days',
            price: 1299,
            status: 'active',
            image_url: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg'
        },
        {
            id: 3,
            name: 'Greek Islands Explorer',
            destination: 'Santorini, Greece',
            duration: '6 Days',
            price: 1099,
            status: 'active',
            image_url: 'https://images.pexels.com/photos/161901/santorini-travel-holiday-vacation-161901.jpeg'
        }
    ];
}

function displayPackagesTable(packages) {
    const tableBody = document.querySelector('.packages-table tbody');
    if (tableBody) {
        tableBody.innerHTML = '';
        
        packages.forEach(package => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${package.name}</td>
                <td>${package.destination}</td>
                <td>${package.duration}</td>
                <td>$${package.price}</td>
                <td><span class="status-badge ${package.status}">${package.status.charAt(0).toUpperCase() + package.status.slice(1)}</span></td>
                <td class="table-actions">
                    <button class="btn-edit" onclick="editPackage(${package.id})">Edit</button>
                    <button class="btn-delete" onclick="deletePackage(${package.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Booking Management
function loadBookingsData() {
    const bookings = getBookingsFromStorage();
    displayBookingsTable(bookings);
}

function getBookingsFromStorage() {
    const stored = localStorage.getItem('travelVista_bookings');
    return stored ? JSON.parse(stored) : getDefaultBookings();
}

function getDefaultBookings() {
    return [
        {
            id: 'BK001',
            customer: 'Sarah Johnson',
            email: 'sarah@email.com',
            package: 'Tropical Paradise Adventure',
            travel_date: '2024-06-15',
            travelers: 2,
            total: 1798,
            status: 'pending'
        },
        {
            id: 'BK002',
            customer: 'Michael Chen',
            email: 'michael@email.com',
            package: 'Japan Discovery Tour',
            travel_date: '2024-07-20',
            travelers: 1,
            total: 1899,
            status: 'confirmed'
        }
    ];
}

function displayBookingsTable(bookings) {
    const tableBody = document.querySelector('.bookings-table tbody');
    if (tableBody) {
        tableBody.innerHTML = '';
        
        bookings.forEach(booking => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${booking.id}</td>
                <td>${booking.customer}<br><small>${booking.email}</small></td>
                <td>${booking.package}</td>
                <td>${booking.travel_date}</td>
                <td>${booking.travelers}</td>
                <td>$${booking.total.toLocaleString()}</td>
                <td><span class="status-badge ${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span></td>
                <td class="table-actions">
                    <button class="btn-confirm" onclick="confirmBooking('${booking.id}')">Confirm</button>
                    <button class="btn-cancel" onclick="cancelBooking('${booking.id}')">Cancel</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// User Management
function loadUsersData() {
    const users = getUsersFromStorage();
    displayUsersTable(users);
}

function getUsersFromStorage() {
    const stored = localStorage.getItem('travelVista_users');
    return stored ? JSON.parse(stored) : [];
}

function displayUsersTable(users) {
    const tableBody = document.querySelector('.users-table tbody');
    if (tableBody) {
        tableBody.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.first_name} ${user.last_name}</td>
                <td>${user.email}</td>
                <td>${user.phone || 'N/A'}</td>
                <td>${new Date(user.created_at).toLocaleDateString()}</td>
                <td>0</td>
                <td><span class="status-badge active">Active</span></td>
                <td class="table-actions">
                    <button class="btn-edit" onclick="editUser('${user.id}')">Edit</button>
                    <button class="btn-delete" onclick="deleteUser('${user.id}')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Modal Management
function initModals() {
    const packageModal = document.getElementById('package-modal');
    const addPackageBtn = document.getElementById('add-package-btn');
    const closeBtn = document.querySelector('.close');
    
    if (addPackageBtn) {
        addPackageBtn.addEventListener('click', function() {
            packageModal.classList.add('active');
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            packageModal.classList.remove('active');
        });
    }
    
    // Close modal when clicking outside
    packageModal.addEventListener('click', function(e) {
        if (e.target === packageModal) {
            packageModal.classList.remove('active');
        }
    });
    
    // Handle form submission
    const packageForm = document.querySelector('.package-form');
    if (packageForm) {
        packageForm.addEventListener('submit', handleAddPackage);
    }
}

function handleAddPackage(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const packageData = {
        id: Date.now(),
        name: formData.get('package_name'),
        destination: formData.get('destination'),
        duration: formData.get('duration'),
        price: parseFloat(formData.get('price')),
        description: formData.get('description'),
        image_url: formData.get('image_url') || 'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg',
        status: 'active'
    };
    
    // Save to storage
    const packages = getPackagesFromStorage();
    packages.push(packageData);
    localStorage.setItem('travelVista_packages', JSON.stringify(packages));
    
    // Refresh table
    displayPackagesTable(packages);
    
    // Close modal
    document.getElementById('package-modal').classList.remove('active');
    
    // Reset form
    e.target.reset();
    
    showAdminNotification('Package added successfully!', 'success');
}

// CRUD Operations
function editPackage(id) {
    const packages = getPackagesFromStorage();
    const package = packages.find(p => p.id === id);
    
    if (package) {
        // Populate modal with package data
        const modal = document.getElementById('package-modal');
        const form = modal.querySelector('.package-form');
        
        form.package_name.value = package.name;
        form.destination.value = package.destination;
        form.duration.value = package.duration;
        form.price.value = package.price;
        form.description.value = package.description || '';
        form.image_url.value = package.image_url || '';
        
        modal.classList.add('active');
        
        // Change form handler for editing
        form.setAttribute('data-editing-id', id);
        form.querySelector('.btn-primary').textContent = 'Update Package';
    }
}

function deletePackage(id) {
    if (confirm('Are you sure you want to delete this package?')) {
        let packages = getPackagesFromStorage();
        packages = packages.filter(p => p.id !== id);
        localStorage.setItem('travelVista_packages', JSON.stringify(packages));
        
        displayPackagesTable(packages);
        showAdminNotification('Package deleted successfully!', 'success');
    }
}

function confirmBooking(id) {
    const bookings = getBookingsFromStorage();
    const booking = bookings.find(b => b.id === id);
    
    if (booking) {
        booking.status = 'confirmed';
        localStorage.setItem('travelVista_bookings', JSON.stringify(bookings));
        displayBookingsTable(bookings);
        showAdminNotification('Booking confirmed!', 'success');
    }
}

function cancelBooking(id) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        const bookings = getBookingsFromStorage();
        const booking = bookings.find(b => b.id === id);
        
        if (booking) {
            booking.status = 'cancelled';
            localStorage.setItem('travelVista_bookings', JSON.stringify(bookings));
            displayBookingsTable(bookings);
            showAdminNotification('Booking cancelled!', 'info');
        }
    }
}

// Charts and Analytics
function initCharts() {
    // Since we can't use external charting libraries, we'll create simple visual representations
    createDestinationStatsChart();
}

function createDestinationStatsChart() {
    // This creates the animated bars for destination popularity
    const destinationStats = document.querySelectorAll('.destination-stat');
    
    destinationStats.forEach(stat => {
        const bar = stat.querySelector('.stat-fill');
        const percentage = bar.style.width;
        
        // Animate bar on load
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = percentage;
        }, 500);
    });
}

// Real-time Updates
function initRealTimeUpdates() {
    // Simulate real-time updates
    setInterval(() => {
        updateDashboardStats();
    }, 30000);
}

function updateDashboardStats() {
    // Simulate slight changes in stats
    const currentStats = getDashboardStats();
    
    // Add some random variation
    currentStats.totalUsers += Math.floor(Math.random() * 5);
    currentStats.activeBookings += Math.floor(Math.random() * 3) - 1;
    currentStats.monthlyRevenue += Math.floor(Math.random() * 1000) - 500;
    
    updateStatsDisplay(currentStats);
}

// Responsive Sidebar
function initResponsiveSidebar() {
    if (window.innerWidth <= 768) {
        const sidebar = document.querySelector('.admin-sidebar');
        const hamburger = document.createElement('button');
        hamburger.className = 'mobile-menu-toggle';
        hamburger.innerHTML = '☰';
        hamburger.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1001;
            background: #0EA5E9;
            color: white;
            border: none;
            padding: 0.75rem;
            border-radius: 6px;
            font-size: 1.2rem;
            cursor: pointer;
        `;
        
        document.body.appendChild(hamburger);
        
        hamburger.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
        
        // Close sidebar when clicking on main content
        document.querySelector('.admin-main').addEventListener('click', function() {
            sidebar.classList.remove('open');
        });
    }
}

// Utility Functions
function showAdminNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `admin-notification ${type}`;
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

// Export functions for global access
window.editPackage = editPackage;
window.deletePackage = deletePackage;
window.confirmBooking = confirmBooking;
window.cancelBooking = cancelBooking;
window.editUser = function(id) { console.log('Edit user:', id); };
window.deleteUser = function(id) { console.log('Delete user:', id); };
window.extendAdminSession = function() {
    const sessionData = JSON.parse(sessionStorage.getItem('travelVista_admin_session'));
    if (sessionData) {
        sessionData.timestamp = Date.now();
        sessionStorage.setItem('travelVista_admin_session', JSON.stringify(sessionData));
        showAdminNotification('Session extended!', 'success');
    }
};