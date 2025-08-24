// App State
let deferredPrompt;
let isOnline = navigator.onLine;

// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const installBtn = document.getElementById('installBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const loading = document.getElementById('loading');
const toast = document.getElementById('toast');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    setupPWA();
    setupServiceWorker();
    checkDarkMode();
});

// Initialize Application
function initializeApp() {
    console.log('🚀 Mobile App initialized');
    
    // Check online status
    updateOnlineStatus();
    
    // Set initial page
    showPage('home');
    
    // Show welcome toast
    setTimeout(() => {
        showToast('Selamat datang di Coba Web App!');
    }, 1000);
}

// Setup Event Listeners
function setupEventListeners() {
    // Bottom navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const page = e.currentTarget.getAttribute('data-page');
            navigateToPage(page);
        });
    });
    
    // Dark mode toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', toggleDarkMode);
    }
    
    // Install button
    if (installBtn) {
        installBtn.addEventListener('click', installApp);
    }
    
    // Menu button
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            showToast('Menu diklik!');
        });
    }
    
    // Online/Offline status
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Prevent zoom on double tap (iOS)
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

// Navigation
function navigateToPage(pageId) {
    // Show loading
    showLoading();
    
    // Simulate navigation delay
    setTimeout(() => {
        showPage(pageId);
        updateNavigation(pageId);
        hideLoading();
        
        // Analytics (if needed)
        console.log(`📱 Navigated to: ${pageId}`);
    }, 200);
}

function showPage(pageId) {
    // Hide all pages
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

function updateNavigation(activePageId) {
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === activePageId) {
            item.classList.add('active');
        }
    });
}

// Dark Mode
function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark);
    
    showToast(isDark ? 'Mode gelap diaktifkan' : 'Mode terang diaktifkan');
}

function checkDarkMode() {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedMode === 'true' || (savedMode === null && prefersDark)) {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.checked = true;
        }
    }
}

// PWA Setup
function setupPWA() {
    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('💾 Install prompt available');
        e.preventDefault();
        deferredPrompt = e;
        
        if (installBtn) {
            installBtn.style.display = 'block';
        }
    });
    
    // Listen for app install
    window.addEventListener('appinstalled', () => {
        console.log('✅ App installed successfully');
        showToast('Aplikasi berhasil dipasang!');
        
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    });
}

async function installApp() {
    if (!deferredPrompt) {
        showToast('Aplikasi sudah terpasang atau tidak bisa dipasang');
        return;
    }
    
    try {
        showLoading();
        
        // Show install prompt
        deferredPrompt.prompt();
        
        // Wait for user response
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('✅ User accepted install');
            showToast('Menginstal aplikasi...');
        } else {
            console.log('❌ User dismissed install');
            showToast('Instalasi dibatalkan');
        }
        
        deferredPrompt = null;
        hideLoading();
        
    } catch (error) {
        console.error('❌ Install failed:', error);
        showToast('Gagal menginstal aplikasi');
        hideLoading();
    }
}

// Service Worker
async function setupServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('./service-worker.js');
            console.log('✅ Service Worker registered:', registration);
            
            // Listen for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showToast('Update tersedia! Refresh untuk memperbarui.');
                    }
                });
            });
            
        } catch (error) {
            console.error('❌ Service Worker registration failed:', error);
        }
    }
}

// Online/Offline Status
function updateOnlineStatus() {
    isOnline = navigator.onLine;
    
    if (isOnline) {
        console.log('🌐 App is online');
        document.body.classList.remove('offline');
    } else {
        console.log('📵 App is offline');
        document.body.classList.add('offline');
        showToast('Aplikasi sedang offline');
    }
}

// UI Utilities
function showLoading() {
    if (loading) {
        loading.style.display = 'flex';
    }
}

function hideLoading() {
    if (loading) {
        loading.style.display = 'none';
    }
}

function showToast(message, duration = 3000) {
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
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
    }
}

// Handle back button for PWA
window.addEventListener('popstate', function(event) {
    // Handle browser back button
    console.log('🔙 Back button pressed');
    
    // You can implement custom back navigation here
    // For now, just go to home
    navigateToPage('home');
});

// Handle visibility change
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('📱 App hidden');
    } else {
        console.log('📱 App visible');
        updateOnlineStatus();
    }
});

// Handle orientation change
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        console.log('🔄 Orientation changed');
        // Handle orientation specific adjustments if needed
    }, 100);
});

// Keyboard handling for accessibility
document.addEventListener('keydown', function(e) {
    // Handle keyboard navigation
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`⚡ Page load time: ${loadTime}ms`);
        }, 0);
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('❌ Global error:', e.error);
    showToast('Terjadi kesalahan. Silakan refresh halaman.');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('❌ Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        navigateToPage,
        showToast,
        toggleDarkMode
    };
}
