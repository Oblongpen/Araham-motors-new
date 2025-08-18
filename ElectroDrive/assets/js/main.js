/**
 * Araham Motors - Main JavaScript File
 * Mobile-First Creative Electric Vehicle Website
 * Author: Rio Development Team
 * Version: 1.0.0
 */

// Global app state and configuration
const App = {
    // Configuration
    config: {
        breakpoints: {
            mobile: 480,
            tablet: 768,
            desktop: 1024
        },
        carousel: {
            autoplayInterval: 5000,
            transitionDuration: 500
        },
        animations: {
            scrollOffset: 100,
            animationDelay: 100
        }
    },
    
    // State management
    state: {
        currentSlide: 0,
        isMenuOpen: false,
        selectedModels: [],
        activeFilters: {
            bodyType: 'all',
            range: 'all',
            price: 'all'
        },
        isLoading: false
    },
    
    // Initialize the application
    init() {
        this.bindEvents();
        this.initializeComponents();
        this.setupIntersectionObserver();
        this.loadModelsData();
        console.log('VoltEdge Motors app initialized');
    },
    
    // Bind all event listeners
    bindEvents() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    },
    
    // Setup all event listeners
    setupEventListeners() {
        // Header scroll behavior
        window.addEventListener('scroll', throttle(this.handleScroll.bind(this), 16));
        
        // Mobile menu
        const hamburger = document.getElementById('hamburger');
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        
        if (hamburger) {
            hamburger.addEventListener('click', this.toggleMobileMenu.bind(this));
        }
        
        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', (e) => {
                if (e.target === mobileMenuOverlay) {
                    this.closeMobileMenu();
                }
            });
        }
        
        // Smooth scrolling for anchor links
        document.addEventListener('click', this.handleSmoothScroll.bind(this));
        
        // Scroll to top button
        const scrollTopBtn = document.getElementById('scroll-top');
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', this.scrollToTop.bind(this));
        }
        
        // Newsletter form
        const newsletterForms = document.querySelectorAll('#newsletter-form');
        newsletterForms.forEach(form => {
            form.addEventListener('submit', this.handleNewsletterSubmit.bind(this));
        });
        
        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactSubmit.bind(this));
        }
        
        // Models page specific
        this.setupModelsPageEvents();
        
        // Technology page specific
        this.setupTechnologyPageEvents();
        
        // Contact page specific
        this.setupContactPageEvents();
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
        
        // Touch gestures for mobile
        this.setupTouchGestures();
    },
    
    // Initialize components
    initializeComponents() {
        this.initializeCarousel();
        this.initializeModals();
        this.initializeTechnologyAnimations();
    },
    
    // Handle scroll events
    handleScroll() {
        const header = document.getElementById('header');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Header scroll behavior
        if (header) {
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // Scroll to top button
        const scrollTopBtn = document.getElementById('scroll-top');
        if (scrollTopBtn) {
            if (scrollTop > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
    },
    
    // Mobile menu functionality
    toggleMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const overlay = document.getElementById('mobile-menu-overlay');
        
        if (this.state.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    },
    
    openMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const overlay = document.getElementById('mobile-menu-overlay');
        
        this.state.isMenuOpen = true;
        
        if (hamburger) {
            hamburger.classList.add('active');
            hamburger.setAttribute('aria-expanded', 'true');
        }
        
        if (overlay) {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus trap
            const focusableElements = overlay.querySelectorAll('a, button');
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }
    },
    
    closeMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const overlay = document.getElementById('mobile-menu-overlay');
        
        this.state.isMenuOpen = false;
        
        if (hamburger) {
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
        
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    },
    
    // Smooth scrolling
    handleSmoothScroll(e) {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        
        const href = link.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        
        const target = document.querySelector(href);
        if (target) {
            const headerHeight = 80;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (this.state.isMenuOpen) {
                this.closeMobileMenu();
            }
        }
    },
    
    // Scroll to top
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },
    
    // Intersection Observer for animations
    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        // Observe all elements with data-animate attribute
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach(el => observer.observe(el));
    }
};

// Carousel functionality
App.initializeCarousel = function() {
    const carousel = document.getElementById('models-carousel');
    if (!carousel) return;
    
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const indicators = carousel.querySelectorAll('.carousel-indicator');
    
    if (!track || slides.length === 0) return;
    
    let autoplayTimer;
    
    // Update carousel position
    const updateCarousel = () => {
        const translateX = -this.state.currentSlide * 100;
        track.style.transform = `translateX(${translateX}%)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.state.currentSlide);
        });
        
        // Update slide active states
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.state.currentSlide);
        });
    };
    
    // Navigate to specific slide
    const goToSlide = (index) => {
        this.state.currentSlide = Math.max(0, Math.min(index, slides.length - 1));
        updateCarousel();
    };
    
    // Next slide
    const nextSlide = () => {
        const nextIndex = this.state.currentSlide + 1;
        goToSlide(nextIndex >= slides.length ? 0 : nextIndex);
    };
    
    // Previous slide
    const prevSlide = () => {
        const prevIndex = this.state.currentSlide - 1;
        goToSlide(prevIndex < 0 ? slides.length - 1 : prevIndex);
    };
    
    // Start autoplay
    const startAutoplay = () => {
        autoplayTimer = setInterval(nextSlide, this.config.carousel.autoplayInterval);
    };
    
    // Stop autoplay
    const stopAutoplay = () => {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    };
    
    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoplay();
            setTimeout(startAutoplay, 3000); // Resume after 3 seconds
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoplay();
            setTimeout(startAutoplay, 3000);
        });
    }
    
    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            stopAutoplay();
            setTimeout(startAutoplay, 3000);
        });
    });
    
    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    
    // Touch gestures
    let startX = 0;
    let isDragging = false;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        stopAutoplay();
    });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });
    
    carousel.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        isDragging = false;
        setTimeout(startAutoplay, 3000);
    });
    
    // Initialize
    updateCarousel();
    startAutoplay();
};

// Models data
const MODELS = [
    {
        id: 'apex',
        name: 'VoltEdge Apex',
        bodyType: 'sedan',
        price: 45990,
        rangeKm: 650,
        topSpeed: 250,
        zeroToHundred: 3.2,
        batteryKWh: 100,
        fastCharge: 18,
        drivetrain: 'AWD',
        image: 'https://bmrev.in/cdn/shop/files/sonic-LunarGrey.jpg?v=1746269528&width=500',
        specs: {
            performance: {
                'Top Speed': '250 km/h',
                '0-100 km/h': '3.2 seconds',
                'Power': '450 kW',
                'Torque': '850 Nm'
            },
            range: {
                'Range (WLTP)': '650 km',
                'Battery Capacity': '100 kWh',
                'Energy Consumption': '15.4 kWh/100km',
                'Fast Charging': '18 minutes (10-80%)'
            },
            dimensions: {
                'Length': '4,970 mm',
                'Width': '1,964 mm',
                'Height': '1,445 mm',
                'Weight': '2,108 kg'
            },
            features: {
                'Drivetrain': 'All-Wheel Drive',
                'Seats': '5',
                'Cargo Space': '425 L',
                'Warranty': '8 years / 160,000 km'
            }
        }
    },
    {
        id: 'pulse',
        name: 'VoltEdge Pulse',
        bodyType: 'sedan',
        price: 38990,
        rangeKm: 520,
        topSpeed: 210,
        zeroToHundred: 4.8,
        batteryKWh: 80,
        fastCharge: 22,
        drivetrain: 'RWD',
        image: 'https://bmrev.in/cdn/shop/files/Bliss-LunarGrey.jpg?v=1746265410&width=500',
        specs: {
            performance: {
                'Top Speed': '210 km/h',
                '0-100 km/h': '4.8 seconds',
                'Power': '320 kW',
                'Torque': '640 Nm'
            },
            range: {
                'Range (WLTP)': '520 km',
                'Battery Capacity': '80 kWh',
                'Energy Consumption': '15.8 kWh/100km',
                'Fast Charging': '22 minutes (10-80%)'
            },
            dimensions: {
                'Length': '4,870 mm',
                'Width': '1,850 mm',
                'Height': '1,440 mm',
                'Weight': '1,890 kg'
            },
            features: {
                'Drivetrain': 'Rear-Wheel Drive',
                'Seats': '5',
                'Cargo Space': '405 L',
                'Warranty': '8 years / 160,000 km'
            }
        }
    },
    {
        id: 'prime-suv',
        name: 'VoltEdge Prime SUV',
        bodyType: 'suv',
        price: 52990,
        rangeKm: 580,
        topSpeed: 200,
        zeroToHundred: 4.2,
        batteryKWh: 95,
        fastCharge: 20,
        drivetrain: 'AWD',
        image: 'https://bmrev.in/cdn/shop/files/signatue_pastel_blue.jpg?v=1746709845&width=500',
        specs: {
            performance: {
                'Top Speed': '200 km/h',
                '0-100 km/h': '4.2 seconds',
                'Power': '400 kW',
                'Torque': '750 Nm'
            },
            range: {
                'Range (WLTP)': '580 km',
                'Battery Capacity': '95 kWh',
                'Energy Consumption': '16.4 kWh/100km',
                'Fast Charging': '20 minutes (10-80%)'
            },
            dimensions: {
                'Length': '4,950 mm',
                'Width': '1,970 mm',
                'Height': '1,680 mm',
                'Weight': '2,350 kg'
            },
            features: {
                'Drivetrain': 'All-Wheel Drive',
                'Seats': '7',
                'Cargo Space': '645 L',
                'Warranty': '8 years / 160,000 km'
            }
        }
    },
    {
        id: 'city',
        name: 'VoltEdge City',
        bodyType: 'hatchback',
        price: 29990,
        rangeKm: 420,
        topSpeed: 180,
        zeroToHundred: 6.8,
        batteryKWh: 60,
        fastCharge: 25,
        drivetrain: 'FWD',
        image: 'https://bmrev.in/cdn/shop/files/raptor-EmberRed_313c057f-edd6-4455-a911-1b147fb0f4f0.jpg?v=1746863088&width=500',
        specs: {
            performance: {
                'Top Speed': '180 km/h',
                '0-100 km/h': '6.8 seconds',
                'Power': '200 kW',
                'Torque': '400 Nm'
            },
            range: {
                'Range (WLTP)': '420 km',
                'Battery Capacity': '60 kWh',
                'Energy Consumption': '14.3 kWh/100km',
                'Fast Charging': '25 minutes (10-80%)'
            },
            dimensions: {
                'Length': '4,285 mm',
                'Width': '1,810 mm',
                'Height': '1,550 mm',
                'Weight': '1,680 kg'
            },
            features: {
                'Drivetrain': 'Front-Wheel Drive',
                'Seats': '5',
                'Cargo Space': '385 L',
                'Warranty': '8 years / 160,000 km'
            }
        }
    }
];

// Load models data
App.loadModelsData = function() {
    window.MODELS_DATA = MODELS;
    this.renderModelsGrid();
};

// Models page functionality
App.setupModelsPageEvents = function() {
    if (!window.location.pathname.includes('models.html')) return;
    
    // Mobile filters toggle
    const mobileFiltersToggle = document.getElementById('mobile-filters-toggle');
    const filters = document.getElementById('filters');
    
    if (mobileFiltersToggle && filters) {
        mobileFiltersToggle.addEventListener('click', () => {
            filters.classList.toggle('active');
        });
    }
    
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.target.dataset.category;
            const filter = e.target.dataset.filter;
            
            if (category && filter) {
                this.handleFilterChange(category, filter, e.target);
            }
        });
    });
    
    // Comparison functionality
    const comparisonClear = document.getElementById('comparison-clear');
    if (comparisonClear) {
        comparisonClear.addEventListener('click', this.clearComparison.bind(this));
    }
    
    const compareBtn = document.getElementById('compare-btn');
    if (compareBtn) {
        compareBtn.addEventListener('click', this.showComparison.bind(this));
    }
};

// Render models grid
App.renderModelsGrid = function() {
    const modelsGrid = document.getElementById('models-grid');
    if (!modelsGrid || !window.MODELS_DATA) return;
    
    modelsGrid.innerHTML = window.MODELS_DATA.map(model => `
        <div class="model-grid-card" data-body-type="${model.bodyType}" data-range="${model.rangeKm}" data-price="${model.price}">
            <div class="model-grid-image">
                <img src="${model.image}" alt="${model.name}" loading="lazy">
                <input type="checkbox" id="compare-${model.id}" class="compare-checkbox" data-model-id="${model.id}">
                <label for="compare-${model.id}" class="compare-label">
                    <i class="fas fa-check"></i>
                </label>
            </div>
            <div class="model-grid-info">
                <h3 class="model-grid-name">${model.name}</h3>
                <p class="model-grid-price">From $${model.price.toLocaleString()}</p>
                <div class="model-grid-specs">
                    <span class="spec-chip">${model.rangeKm}km Range</span>
                    <span class="spec-chip">${model.drivetrain}</span>
                    <span class="spec-chip">${model.fastCharge}min Charge</span>
                </div>
                <div class="model-actions">
                    <button class="btn btn-specs" data-model-id="${model.id}">View Specs</button>
                    <a href="contact.html" class="btn btn-primary">Test Drive</a>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners for new elements
    this.setupModelCardEvents();
};

// Setup model card events
App.setupModelCardEvents = function() {
    // Specs buttons
    const specsButtons = document.querySelectorAll('.btn-specs');
    specsButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modelId = e.target.dataset.modelId;
            this.showModelSpecs(modelId);
        });
    });
    
    // Comparison checkboxes
    const compareCheckboxes = document.querySelectorAll('.compare-checkbox');
    compareCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const modelId = e.target.dataset.modelId;
            this.handleComparisonToggle(modelId, e.target.checked);
        });
    });
};

// Handle filter changes
App.handleFilterChange = function(category, filter, button) {
    // Update active filter
    this.state.activeFilters[category] = filter;
    
    // Update button states
    const categoryButtons = button.parentElement.querySelectorAll('.filter-btn');
    categoryButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Apply filters
    this.applyFilters();
    
    // Save filters to localStorage
    localStorage.setItem('voltedge_filters', JSON.stringify(this.state.activeFilters));
};

// Apply filters to models
App.applyFilters = function() {
    const modelCards = document.querySelectorAll('.model-grid-card');
    
    modelCards.forEach(card => {
        const bodyType = card.dataset.bodyType;
        const range = parseInt(card.dataset.range);
        const price = parseInt(card.dataset.price);
        
        let visible = true;
        
        // Body type filter
        if (this.state.activeFilters.bodyType !== 'all' && bodyType !== this.state.activeFilters.bodyType) {
            visible = false;
        }
        
        // Range filter
        if (this.state.activeFilters.range !== 'all') {
            const rangeFilter = this.state.activeFilters.range;
            if (rangeFilter === '300-450' && (range < 300 || range > 450)) visible = false;
            if (rangeFilter === '450-550' && (range < 450 || range > 550)) visible = false;
            if (rangeFilter === '550+' && range < 550) visible = false;
        }
        
        // Price filter
        if (this.state.activeFilters.price !== 'all') {
            const priceFilter = this.state.activeFilters.price;
            if (priceFilter === 'under-35k' && price >= 35000) visible = false;
            if (priceFilter === '35k-45k' && (price < 35000 || price > 45000)) visible = false;
            if (priceFilter === '45k+' && price < 45000) visible = false;
        }
        
        // Apply visibility
        if (visible) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
};

// Handle comparison toggle
App.handleComparisonToggle = function(modelId, isChecked) {
    if (isChecked && this.state.selectedModels.length < 3) {
        this.state.selectedModels.push(modelId);
    } else if (!isChecked) {
        this.state.selectedModels = this.state.selectedModels.filter(id => id !== modelId);
    } else if (this.state.selectedModels.length >= 3) {
        // Uncheck the checkbox if limit reached
        const checkbox = document.querySelector(`[data-model-id="${modelId}"]`);
        if (checkbox) checkbox.checked = false;
        this.showToast('Maximum 3 models can be compared', 'warning');
        return;
    }
    
    this.updateComparisonBar();
};

// Update comparison bar
App.updateComparisonBar = function() {
    const comparisonBar = document.getElementById('comparison-bar');
    const comparisonCount = document.querySelector('.comparison-count');
    const compareBtn = document.getElementById('compare-btn');
    
    if (!comparisonBar) return;
    
    const count = this.state.selectedModels.length;
    
    if (count > 0) {
        comparisonBar.classList.add('visible');
        if (comparisonCount) {
            comparisonCount.textContent = `${count} selected`;
        }
        if (compareBtn) {
            compareBtn.disabled = count < 2;
        }
    } else {
        comparisonBar.classList.remove('visible');
    }
};

// Clear comparison
App.clearComparison = function() {
    this.state.selectedModels = [];
    const checkboxes = document.querySelectorAll('.compare-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    this.updateComparisonBar();
};

// Show model specs modal
App.showModelSpecs = function(modelId) {
    const model = window.MODELS_DATA.find(m => m.id === modelId);
    if (!model) return;
    
    const modal = document.getElementById('specs-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalTitle || !modalBody) return;
    
    modalTitle.textContent = `${model.name} Specifications`;
    
    modalBody.innerHTML = `
        <div class="specs-grid">
            ${Object.entries(model.specs).map(([category, specs]) => `
                <div class="spec-group">
                    <h4 class="spec-group-title">
                        <i class="spec-group-icon ${this.getSpecIcon(category)}"></i>
                        ${this.capitalizeFirst(category)}
                    </h4>
                    ${Object.entries(specs).map(([name, value]) => `
                        <div class="spec-item">
                            <span class="spec-name">${name}</span>
                            <span class="spec-value">${value}</span>
                        </div>
                    `).join('')}
                </div>
            `).join('')}
        </div>
    `;
    
    this.showModal('specs-modal');
};

// Show comparison modal
App.showComparison = function() {
    if (this.state.selectedModels.length < 2) return;
    
    const models = this.state.selectedModels.map(id => 
        window.MODELS_DATA.find(m => m.id === id)
    ).filter(Boolean);
    
    const modal = document.getElementById('comparison-modal');
    const modalBody = modal.querySelector('.modal-body');
    
    if (!modal || !modalBody) return;
    
    // Create comparison table
    const tableHTML = this.createComparisonTable(models);
    modalBody.innerHTML = tableHTML;
    
    this.showModal('comparison-modal');
};

// Create comparison table
App.createComparisonTable = function(models) {
    const allSpecs = new Set();
    models.forEach(model => {
        Object.values(model.specs).forEach(category => {
            Object.keys(category).forEach(spec => allSpecs.add(spec));
        });
    });
    
    return `
        <div class="comparison-table">
            <table>
                <thead>
                    <tr>
                        <th>Specification</th>
                        ${models.map(model => `
                            <th class="comparison-model-header">${model.name}</th>
                        `).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${Array.from(allSpecs).map(spec => `
                        <tr>
                            <td><strong>${spec}</strong></td>
                            ${models.map(model => {
                                const value = this.findSpecValue(model, spec);
                                return `<td>${value || '-'}</td>`;
                            }).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
};

// Find spec value in model
App.findSpecValue = function(model, specName) {
    for (const category of Object.values(model.specs)) {
        if (category[specName]) {
            return category[specName];
        }
    }
    return null;
};

// Get spec icon
App.getSpecIcon = function(category) {
    const icons = {
        performance: 'fas fa-tachometer-alt',
        range: 'fas fa-battery-full',
        dimensions: 'fas fa-ruler-combined',
        features: 'fas fa-cog'
    };
    return icons[category] || 'fas fa-info-circle';
};

// Modal functionality
App.initializeModals = function() {
    // Modal close buttons
    const modalCloses = document.querySelectorAll('.modal-close');
    modalCloses.forEach(btn => {
        btn.addEventListener('click', () => {
            this.closeModal(btn.closest('.modal').id);
        });
    });
    
    // Modal overlays
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            this.closeModal(overlay.closest('.modal').id);
        });
    });
};

// Show modal
App.showModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus management
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
};

// Close modal
App.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
};

// Technology page animations
App.setupTechnologyPageEvents = function() {
    if (!window.location.pathname.includes('technology.html')) return;
    
    // Safety indicators
    const safetyIndicators = document.querySelectorAll('.safety-indicator');
    safetyIndicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
            safetyIndicators.forEach(i => i.classList.remove('active'));
            indicator.classList.add('active');
        });
    });
    
    // Connectivity nodes
    const connectivityNodes = document.querySelectorAll('.node');
    connectivityNodes.forEach(node => {
        node.addEventListener('click', () => {
            node.style.transform += ' scale(1.2)';
            setTimeout(() => {
                node.style.transform = node.style.transform.replace(' scale(1.2)', '');
            }, 200);
        });
    });
};

// Technology animations
App.initializeTechnologyAnimations = function() {
    // Battery charging animation
    const batteryLevel = document.getElementById('battery-level');
    if (batteryLevel) {
        setInterval(() => {
            const percentage = document.querySelector('.battery-percentage');
            if (percentage) {
                const current = parseInt(percentage.textContent);
                const next = current >= 100 ? 20 : current + 1;
                percentage.textContent = `${next}%`;
            }
        }, 50);
    }
    
    // Charging progress animation
    const chargingProgress = document.getElementById('charging-progress');
    if (chargingProgress) {
        setInterval(() => {
            const currentWidth = parseFloat(chargingProgress.style.width) || 0;
            const nextWidth = currentWidth >= 80 ? 0 : currentWidth + 1;
            chargingProgress.style.width = `${nextWidth}%`;
        }, 100);
    }
    
    // Charging indicator pulse
    const chargingIndicator = document.getElementById('charging-indicator');
    if (chargingIndicator) {
        setInterval(() => {
            chargingIndicator.style.opacity = chargingIndicator.style.opacity === '0.3' ? '1' : '0.3';
        }, 750);
    }
};

// Contact page functionality
App.setupContactPageEvents = function() {
    if (!window.location.pathname.includes('contact.html')) return;
    
    // Dealer locator
    const findDealersBtn = document.getElementById('find-dealers');
    const citySelect = document.getElementById('citySelect');
    
    if (findDealersBtn && citySelect) {
        findDealersBtn.addEventListener('click', () => {
            const city = citySelect.value;
            if (city) {
                this.showDealers(city);
            } else {
                this.showToast('Please select a city', 'warning');
            }
        });
    }
    
    // FAQ accordions
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isOpen = question.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQs
            faqQuestions.forEach(q => {
                if (q !== question) {
                    q.setAttribute('aria-expanded', 'false');
                    q.nextElementSibling.classList.remove('active');
                }
            });
            
            // Toggle current FAQ
            question.setAttribute('aria-expanded', !isOpen);
            answer.classList.toggle('active');
        });
    });
};

// Dealer data
const DEALERS = {
    toronto: [
        {
            name: 'VoltEdge Toronto Downtown',
            address: '123 Bay Street, Toronto, ON M5H 2Y2',
            phone: '(416) 555-0123',
            email: 'toronto.downtown@voltedgemotors.com',
            hours: 'Mon-Fri 9AM-8PM, Sat-Sun 10AM-6PM'
        },
        {
            name: 'VoltEdge Toronto North',
            address: '456 Yonge Street, North York, ON M2N 5S8',
            phone: '(416) 555-0124',
            email: 'toronto.north@voltedgemotors.com',
            hours: 'Mon-Fri 9AM-8PM, Sat-Sun 10AM-6PM'
        }
    ],
    vancouver: [
        {
            name: 'VoltEdge Vancouver',
            address: '789 Robson Street, Vancouver, BC V6Z 1A1',
            phone: '(604) 555-0125',
            email: 'vancouver@voltedgemotors.com',
            hours: 'Mon-Fri 9AM-8PM, Sat-Sun 10AM-6PM'
        }
    ],
    montreal: [
        {
            name: 'VoltEdge Montreal',
            address: '321 Rue Sainte-Catherine, Montreal, QC H3B 1A6',
            phone: '(514) 555-0126',
            email: 'montreal@voltedgemotors.com',
            hours: 'Mon-Fri 9AM-8PM, Sat-Sun 10AM-6PM'
        }
    ],
    calgary: [
        {
            name: 'VoltEdge Calgary',
            address: '654 8th Avenue SW, Calgary, AB T2P 1H4',
            phone: '(403) 555-0127',
            email: 'calgary@voltedgemotors.com',
            hours: 'Mon-Fri 9AM-8PM, Sat-Sun 10AM-6PM'
        }
    ],
    ottawa: [
        {
            name: 'VoltEdge Ottawa',
            address: '987 Sparks Street, Ottawa, ON K1A 0A6',
            phone: '(613) 555-0128',
            email: 'ottawa@voltedgemotors.com',
            hours: 'Mon-Fri 9AM-8PM, Sat-Sun 10AM-6PM'
        }
    ],
    winnipeg: [
        {
            name: 'VoltEdge Winnipeg',
            address: '147 Portage Avenue, Winnipeg, MB R3B 2E1',
            phone: '(204) 555-0129',
            email: 'winnipeg@voltedgemotors.com',
            hours: 'Mon-Fri 9AM-8PM, Sat-Sun 10AM-6PM'
        }
    ]
};

// Show dealers
App.showDealers = function(city) {
    const dealersGrid = document.getElementById('dealers-grid');
    if (!dealersGrid) return;
    
    const dealers = DEALERS[city] || [];
    
    dealersGrid.innerHTML = dealers.map(dealer => `
        <div class="dealer-card">
            <h3 class="dealer-name">${dealer.name}</h3>
            <p class="dealer-address">${dealer.address}</p>
            <div class="dealer-contact">
                <div class="dealer-contact-item">
                    <i class="fas fa-phone"></i>
                    <span>${dealer.phone}</span>
                </div>
                <div class="dealer-contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>${dealer.email}</span>
                </div>
                <div class="dealer-contact-item">
                    <i class="fas fa-clock"></i>
                    <span>${dealer.hours}</span>
                </div>
            </div>
            <div class="dealer-map">
                <i class="fas fa-map-marker-alt"></i>
                Map Placeholder
            </div>
            <div class="dealer-actions">
                <button class="btn btn-primary btn-small">Get Directions</button>
                <button class="btn btn-outline btn-small">Call Now</button>
            </div>
        </div>
    `).join('');
    
    dealersGrid.classList.add('visible');
    
    if (dealers.length === 0) {
        dealersGrid.innerHTML = '<p style="text-align: center; color: var(--gray-600);">No dealers found in this city. Please try another location.</p>';
    }
};

// Form handling
App.handleContactSubmit = function(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Validate form
    if (!this.validateContactForm(data)) {
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    }
    
    // Simulate form submission
    setTimeout(() => {
        // Create mailto link as fallback
        const subject = encodeURIComponent(`VoltEdge Inquiry: ${data.inquiryType}`);
        const body = encodeURIComponent(`
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
City: ${data.city || 'Not provided'}
Model Interest: ${data.modelInterest || 'General inquiry'}
Inquiry Type: ${data.inquiryType}

Message:
${data.message}
        `);
        
        const mailtoLink = `mailto:info@voltedgemotors.com?subject=${subject}&body=${body}`;
        
        // Show success message
        this.showToast('Thank you for your inquiry! We\'ll get back to you within 24 hours.', 'success');
        
        // Open mailto link
        window.location.href = mailtoLink;
        
        // Reset form
        form.reset();
        
        // Reset button state
        if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }, 1500);
};

// Validate contact form
App.validateContactForm = function(data) {
    const errors = {};
    
    // Required fields
    if (!data.firstName.trim()) errors.firstName = 'First name is required';
    if (!data.lastName.trim()) errors.lastName = 'Last name is required';
    if (!data.email.trim()) errors.email = 'Email is required';
    if (!data.inquiryType) errors.inquiryType = 'Please select an inquiry type';
    if (!data.message.trim()) errors.message = 'Message is required';
    
    // Email validation
    if (data.email && !this.isValidEmail(data.email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (if provided)
    if (data.phone && !this.isValidPhone(data.phone)) {
        errors.phone = 'Please enter a valid phone number';
    }
    
    // Display errors
    Object.keys(errors).forEach(field => {
        this.showFieldError(field, errors[field]);
    });
    
    // Clear previous errors for valid fields
    const allFields = ['firstName', 'lastName', 'email', 'phone', 'city', 'inquiryType', 'message'];
    allFields.forEach(field => {
        if (!errors[field]) {
            this.clearFieldError(field);
        }
    });
    
    return Object.keys(errors).length === 0;
};

// Show field error
App.showFieldError = function(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    const field = document.getElementById(fieldName) || document.querySelector(`[name="${fieldName}"]`);
    if (field) {
        field.style.borderColor = 'var(--error)';
    }
};

// Clear field error
App.clearFieldError = function(fieldName) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
    
    const field = document.getElementById(fieldName) || document.querySelector(`[name="${fieldName}"]`);
    if (field) {
        field.style.borderColor = '';
    }
};

// Newsletter form handling
App.handleNewsletterSubmit = function(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
    
    if (!this.isValidEmail(email)) {
        this.showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
    }
    
    // Simulate subscription
    setTimeout(() => {
        this.showToast('Successfully subscribed to our newsletter!', 'success');
        form.reset();
        
        // Reset button state
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-arrow-right"></i>';
            submitBtn.disabled = false;
        }
    }, 1000);
};

// Touch gestures
App.setupTouchGestures = function() {
    let startX = 0;
    let startY = 0;
    let isTouch = false;
    
    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isTouch = true;
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isTouch) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = startX - currentX;
        const diffY = startY - currentY;
        
        // Prevent default for horizontal swipes (carousel navigation)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            e.preventDefault();
        }
    });
    
    document.addEventListener('touchend', (e) => {
        if (!isTouch) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Handle swipe gestures
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 100) {
            if (diffX > 0) {
                // Swipe left - next slide
                this.triggerCarouselNext();
            } else {
                // Swipe right - previous slide
                this.triggerCarouselPrev();
            }
        }
        
        isTouch = false;
    });
};

// Trigger carousel navigation
App.triggerCarouselNext = function() {
    const nextBtn = document.getElementById('carousel-next');
    if (nextBtn) nextBtn.click();
};

App.triggerCarouselPrev = function() {
    const prevBtn = document.getElementById('carousel-prev');
    if (prevBtn) prevBtn.click();
};

// Keyboard navigation
App.handleKeyboard = function(e) {
    // ESC key closes modals and mobile menu
    if (e.key === 'Escape') {
        if (this.state.isMenuOpen) {
            this.closeMobileMenu();
        }
        
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            this.closeModal(activeModal.id);
        }
    }
    
    // Arrow keys for carousel navigation
    if (e.key === 'ArrowLeft') {
        this.triggerCarouselPrev();
    } else if (e.key === 'ArrowRight') {
        this.triggerCarouselNext();
    }
};

// Toast notifications
App.showToast = function(message, type = 'info', duration = 5000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    const titles = {
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Information'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="${icons[type]}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${titles[type]}</div>
            <p class="toast-message">${message}</p>
        </div>
        <button class="toast-close" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add close functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        this.removeToast(toast);
    });
    
    // Add to container
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto remove
    setTimeout(() => {
        this.removeToast(toast);
    }, duration);
};

// Remove toast
App.removeToast = function(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
};

// Utility functions
App.isValidEmail = function(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

App.isValidPhone = function(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

App.capitalizeFirst = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// Utility function: Throttle
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

// Utility function: Debounce
function debounce(func, delay) {
    let timeoutId;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(context, args), delay);
    };
}

// Performance monitoring
App.performance = {
    start: performance.now(),
    
    mark(name) {
        console.log(`Performance mark: ${name} - ${performance.now() - this.start}ms`);
    },
    
    measure(name, startMark) {
        const duration = performance.now() - startMark;
        console.log(`Performance measure: ${name} - ${duration}ms`);
        return duration;
    }
};

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    App.showToast('An unexpected error occurred. Please refresh the page.', 'error');
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    App.showToast('An unexpected error occurred. Please try again.', 'error');
});

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// Export for global access
window.VoltEdgeApp = App;
