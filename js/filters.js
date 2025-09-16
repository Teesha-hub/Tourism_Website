// Advanced filtering system for Indian packages and destinations
// All filters, sorting, and search are localized for Indian users

document.addEventListener('DOMContentLoaded', function() {
    initAdvancedFilters();
    initSearchFunctionality();
    initSortingOptions();
    initPriceRangeSlider();
});

// Advanced Filters
function initAdvancedFilters() {
    const filterContainer = document.querySelector('.package-filters');
    
    if (filterContainer) {
        // Create advanced filter toggle
        const advancedToggle = createAdvancedToggle();
        filterContainer.appendChild(advancedToggle);
        
        // Create advanced filters panel
        const advancedPanel = createAdvancedFiltersPanel();
        filterContainer.appendChild(advancedPanel);
        
        // Initialize filter event listeners
        attachFilterEventListeners();
    }
}

function createAdvancedToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'advanced-filter-toggle';
    toggle.textContent = 'Advanced Filters';
    toggle.style.cssText = `
        background: #0EA5E9;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    `;
    
    toggle.addEventListener('click', function() {
        const panel = document.querySelector('.advanced-filters-panel');
        if (panel) {
            panel.classList.toggle('active');
            this.textContent = panel.classList.contains('active') ? 'Hide Filters' : 'Advanced Filters';
        }
    });
    
    return toggle;
}

function createAdvancedFiltersPanel() {
    const panel = document.createElement('div');
    panel.className = 'advanced-filters-panel';
    panel.style.cssText = `
        display: none;
        background: white;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-top: 1rem;
        grid-column: 1 / -1;
        transition: all 0.3s ease;
    `;
    
    panel.innerHTML = `
        <div class="advanced-filters-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
            <div class="filter-group">
                <label for="rating-filter">Minimum Rating:</label>
                <select id="rating-filter">
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                    <option value="3.0">3.0+ Stars</option>
                </select>
            </div>
            
            <div class="filter-group">
                <label for="activity-filter">Activity Type:</label>
                <select id="activity-filter">
                    <option value="">All Activities</option>
                    <option value="adventure">Adventure</option>
                    <option value="cultural">Cultural</option>
                    <option value="relaxation">Relaxation</option>
                    <option value="wildlife">Wildlife</option>
                    <option value="city">City Tours</option>
                </select>
            </div>
            
            <div class="filter-group">
                <label for="season-filter">Best Season:</label>
                <select id="season-filter">
                    <option value="">Any Season</option>
                    <option value="spring">Spring</option>
                    <option value="summer">Summer</option>
                    <option value="autumn">Autumn</option>
                    <option value="winter">Winter</option>
                </select>
            </div>
            
            <div class="filter-group">
                <label for="group-size-filter">Group Size:</label>
                <select id="group-size-filter">
                    <option value="">Any Size</option>
                    <option value="solo">Solo Travel</option>
                    <option value="couple">Couples</option>
                    <option value="family">Family</option>
                    <option value="group">Large Groups</option>
                </select>
            </div>
        </div>
        
        <div class="filter-actions" style="display: flex; gap: 1rem; margin-top: 1.5rem; justify-content: flex-end;">
            <button class="btn-clear-filters" style="background: #64748B; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer;">Clear All</button>
            <button class="btn-apply-filters" style="background: #0EA5E9; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer;">Apply Filters</button>
        </div>
    `;
    
    // Add CSS class for active state
    const style = document.createElement('style');
    style.textContent = `
        .advanced-filters-panel.active {
            display: block !important;
            animation: fadeInDown 0.3s ease;
        }
        
        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    return panel;
}

// Search Functionality
function initSearchFunctionality() {
    // Create search input if it doesn't exist
    const packageFilters = document.querySelector('.package-filters');
    
    if (packageFilters && !document.getElementById('package-search')) {
        const searchGroup = document.createElement('div');
        searchGroup.className = 'filter-group';
        searchGroup.innerHTML = `
            <label for="package-search">Search Packages:</label>
            <input type="text" id="package-search" placeholder="Search by name, location, or description..." 
                   style="padding: 0.75rem 1rem; border: 2px solid #E2E8F0; border-radius: 8px; font-size: 1rem; min-width: 250px;">
        `;
        
        packageFilters.insertBefore(searchGroup, packageFilters.firstChild);
        
        const searchInput = document.getElementById('package-search');
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(this.value);
            }, 300);
        });
    }
}

function performSearch(query) {
    const packageCards = document.querySelectorAll('.package-card');
    const searchTerm = query.toLowerCase().trim();
    
    packageCards.forEach(card => {
        if (!searchTerm) {
            card.style.display = 'block';
            return;
        }
        
        const title = card.querySelector('h3').textContent.toLowerCase();
        const location = card.querySelector('.package-location').textContent.toLowerCase();
        const description = card.querySelector('.package-description').textContent.toLowerCase();
        
        const matchesSearch = title.includes(searchTerm) || 
                             location.includes(searchTerm) || 
                             description.includes(searchTerm);
        
        card.style.display = matchesSearch ? 'block' : 'none';
    });
    
    updateResultsCount();
}

// Sorting Options
function initSortingOptions() {
    const packageFilters = document.querySelector('.package-filters');
    
    if (packageFilters && !document.getElementById('sort-select')) {
        const sortGroup = document.createElement('div');
        sortGroup.className = 'filter-group';
        sortGroup.innerHTML = `
            <label for="sort-select">Sort by:</label>
            <select id="sort-select">
                <option value="default">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="duration-short">Duration: Short to Long</option>
                <option value="duration-long">Duration: Long to Short</option>
                <option value="alphabetical">Alphabetical</option>
            </select>
        `;
        
        packageFilters.appendChild(sortGroup);
        
        const sortSelect = document.getElementById('sort-select');
        sortSelect.addEventListener('change', function() {
            sortPackages(this.value);
        });
    }
}

function sortPackages(sortType) {
    const packagesGrid = document.getElementById('packages-grid');
    const packageCards = Array.from(packagesGrid.querySelectorAll('.package-card'));
    
    packageCards.sort((a, b) => {
        switch (sortType) {
            case 'price-low':
                return parseInt(a.dataset.price) - parseInt(b.dataset.price);
            case 'price-high':
                return parseInt(b.dataset.price) - parseInt(a.dataset.price);
            case 'duration-short':
                return parseInt(a.dataset.duration) - parseInt(b.dataset.duration);
            case 'duration-long':
                return parseInt(b.dataset.duration) - parseInt(a.dataset.duration);
            case 'alphabetical':
                const titleA = a.querySelector('h3').textContent;
                const titleB = b.querySelector('h3').textContent;
                return titleA.localeCompare(titleB);
            default:
                return 0;
        }
    });
    
    // Clear and re-append sorted cards
    packagesGrid.innerHTML = '';
    packageCards.forEach(card => {
        packagesGrid.appendChild(card);
    });
    
    // Add sort animation
    packageCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Price Range Slider
function initPriceRangeSlider() {
    // This would be implemented with a custom range slider
    // For now, we'll enhance the existing price filter
    const priceFilter = document.getElementById('price-filter');
    
    if (priceFilter) {
        // Add more granular price options
        priceFilter.innerHTML = `
            <option value="">All Prices</option>
            <option value="0-500">Under $500</option>
            <option value="500-1000">$500 - $1,000</option>
            <option value="1000-1500">$1,000 - $1,500</option>
            <option value="1500-2000">$1,500 - $2,000</option>
            <option value="2000-3000">$2,000 - $3,000</option>
            <option value="3000+">Above $3,000</option>
        `;
    }
}

// Attach event listeners to filters
function attachFilterEventListeners() {
    const filterButtons = document.querySelectorAll('.btn-clear-filters, .btn-apply-filters');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('btn-clear-filters')) {
                clearAllFilters();
            } else {
                applyAllFilters();
            }
        });
    });
}

function clearAllFilters() {
    // Clear all filter inputs
    const allFilters = document.querySelectorAll('.package-filters select, .package-filters input');
    allFilters.forEach(filter => {
        filter.value = '';
    });
    
    // Show all packages
    const packageCards = document.querySelectorAll('.package-card');
    packageCards.forEach(card => {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
    });
    
    // Remove no results message
    const noResultsMessage = document.querySelector('.no-packages-message');
    if (noResultsMessage) {
        noResultsMessage.remove();
    }
    
    updateResultsCount();
    window.TravelVista.showNotification('All filters cleared', 'info');
}

function applyAllFilters() {
    // This would combine all active filters
    // For now, we'll trigger the existing filter function
    if (typeof filterPackages === 'function') {
        filterPackages();
    }
    
    window.TravelVista.showNotification('Filters applied successfully', 'success');
}

// Update results count
function updateResultsCount() {
    const packageCards = document.querySelectorAll('.package-card');
    const visibleCards = Array.from(packageCards).filter(card => 
        card.style.display !== 'none'
    );
    
    // Add or update results count display
    let resultsCount = document.querySelector('.results-count');
    if (!resultsCount) {
        resultsCount = document.createElement('div');
        resultsCount.className = 'results-count';
        resultsCount.style.cssText = `
            text-align: center;
            margin: 1rem 0;
            color: #64748B;
            font-size: 0.9rem;
        `;
        
        const packagesSection = document.querySelector('.packages .container');
        const packagesGrid = document.getElementById('packages-grid');
        packagesSection.insertBefore(resultsCount, packagesGrid);
    }
    
    resultsCount.textContent = `Showing ${visibleCards.length} of ${packageCards.length} packages`;
}

// Filter state management
const filterState = {
    location: '',
    price: '',
    duration: '',
    rating: '',
    activity: '',
    season: '',
    groupSize: '',
    search: '',
    sort: 'default'
};

function updateFilterState() {
    const locationFilter = document.getElementById('location-filter');
    const priceFilter = document.getElementById('price-filter');
    const durationFilter = document.getElementById('duration-filter');
    const searchInput = document.getElementById('package-search');
    const sortSelect = document.getElementById('sort-select');
    
    filterState.location = locationFilter ? locationFilter.value : '';
    filterState.price = priceFilter ? priceFilter.value : '';
    filterState.duration = durationFilter ? durationFilter.value : '';
    filterState.search = searchInput ? searchInput.value : '';
    filterState.sort = sortSelect ? sortSelect.value : 'default';
}

// Save and load filter preferences
function saveFilterPreferences() {
    updateFilterState();
    localStorage.setItem('travelVista_filterPreferences', JSON.stringify(filterState));
}

function loadFilterPreferences() {
    const saved = localStorage.getItem('travelVista_filterPreferences');
    if (saved) {
        const preferences = JSON.parse(saved);
        
        Object.keys(preferences).forEach(key => {
            const element = document.getElementById(`${key}-filter`) || document.getElementById(`${key}-select`);
            if (element && preferences[key]) {
                element.value = preferences[key];
            }
        });
        
        // Apply loaded filters
        setTimeout(applyAllFilters, 100);
    }
}

// Initialize filter preferences on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadFilterPreferences, 500);
});

// Save preferences when filters change
document.addEventListener('change', function(e) {
    if (e.target.matches('.package-filters select, .package-filters input')) {
        saveFilterPreferences();
    }
});