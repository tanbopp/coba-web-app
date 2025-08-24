// Framework7 App with iOS Native Feel
console.log('🚀 Starting Framework7 iOS App...');

// Force iOS detection and classes
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
             (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

// Add iOS classes immediately
document.documentElement.classList.add('ios', 'framework7-root');
document.body.classList.add('framework7-root');

var app = new Framework7({
    // App root element
    root: '#app',
    
    // App Name
    name: 'Coba Web App',
    
    // App id
    id: 'com.example.cobawebapp',
    
    // Force iOS theme
    theme: 'ios',
    
    // iOS-specific settings
    ios: {
        // Enable iOS edge swipe back
        swipeBackPage: true,
        swipeBackPageThreshold: 0,
        swipeBackPageActiveArea: 30,
        swipeBackPageAnimateShadow: true,
        swipeBackPageAnimateOpacity: true,
        
        // Dynamic navbar
        dynamicNavbar: true,
        
        // Touch ripple
        touchRipple: true
    },
    
    // Dark mode detection
    darkMode: 'auto',
    
    // View settings
    view: {
        // iOS Dynamic Navbar
        iosDynamicNavbar: true,
        
        // Animate navbar back icon
        animateNavBackIcon: true,
        
        // Push state
        pushState: true,
        pushStateRoot: '',
        pushStateSeparator: '#!',
        pushStateAnimate: true,
        
        // Preload previous page
        preloadPreviousPage: false,
        
        // Reload pages
        reloadPages: true,
        
        // XHR cache
        xhrCache: false
    },
    
    // Touch settings
    touch: {
        fastClicks: true,
        fastClicksDistanceThreshold: 10,
        fastClicksDelayBetweenClicks: 50,
        activeState: true,
        activeStateElements: 'a, button, label, span, .activatable',
        tapHold: true,
        tapHoldDelay: 750,
        iosTouchRipple: true
    },
    
    // Clicks settings
    clicks: {
        externalLinks: '.external'
    }
});

console.log('✅ Framework7 app created successfully');

// Force add classes after app initialization
setTimeout(() => {
    document.documentElement.classList.add('ios', 'framework7-root');
    document.body.classList.add('framework7-root');
    
    // Add device classes
    if (isIOS) {
        document.documentElement.classList.add('device-ios');
    }
    
    console.log('📱 iOS classes applied');
}, 100);

// Main view
var mainView = app.views.create('.view-main');

// App variables
let deferredPrompt;
let isOnline = navigator.onLine;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Framework7 iOS App starting...');
    
    // Initialize app
    initializeApp();
    
    // Setup PWA
    setupPWA();
    
    // Setup Service Worker
    setupServiceWorker();
    
    // Initialize dark mode
    initializeDarkMode();
    
    // Setup event listeners
    setupEventListeners();
});

// Initialize App
function initializeApp() {
    console.log('📱 iOS-style app initialized');
    
    // Update online status
    updateOnlineStatus();
    
    // Show welcome toast after delay
    setTimeout(() => {
        app.toast.create({
            text: '🎉 Selamat datang di Coba Web App!',
            closeTimeout: 3000,
            position: 'center',
            cssClass: 'toast-welcome'
        }).open();
    }, 1500);
    
    // Initialize iOS-specific features
    initializeIOSFeatures();
}

// Initialize iOS-specific features
function initializeIOSFeatures() {
    // Detect iOS device
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
        // Add iOS-specific class
        document.documentElement.classList.add('device-ios');
        
        // Handle iOS status bar
        if (window.navigator.standalone) {
            document.documentElement.classList.add('device-fullscreen');
        }
        
        // Prevent zoom on input focus
        document.addEventListener('touchstart', function() {}, {passive: true});
        
        // Handle iOS bounce scroll
        document.addEventListener('touchmove', function(e) {
            if (e.target.closest('.page-content')) {
                // Allow normal scrolling in page content
                return;
            }
        }, {passive: false});
    }
    
    // Simulate iOS haptic feedback
    setupHapticFeedback();
}

// Setup haptic feedback simulation
function setupHapticFeedback() {
    // Light haptic feedback for buttons
    document.addEventListener('touchstart', function(e) {
        if (e.target.matches('.button, .item-link, .tab-link')) {
            // Vibrate for 10ms (light feedback)
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        }
    }, {passive: true});
}

// Initialize Dark Mode
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    if (darkModeToggle) {
        // Check saved preference
        const savedDarkMode = localStorage.getItem('darkMode');
        const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let isDarkMode = false;
        if (savedDarkMode !== null) {
            isDarkMode = savedDarkMode === 'true';
        } else {
            isDarkMode = systemDarkMode;
        }
        
        // Apply dark mode
        if (isDarkMode) {
            document.documentElement.classList.add('theme-dark');
            darkModeToggle.checked = true;
        }
        
        // Listen for toggle changes
        darkModeToggle.addEventListener('change', function() {
            toggleDarkMode(this.checked);
        });
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (localStorage.getItem('darkMode') === null) {
            toggleDarkMode(e.matches);
        }
    });
}

// Toggle Dark Mode
function toggleDarkMode(enabled) {
    if (enabled) {
        document.documentElement.classList.add('theme-dark');
        localStorage.setItem('darkMode', 'true');
        
        app.toast.create({
            text: '🌙 Mode gelap diaktifkan',
            closeTimeout: 2000,
            position: 'center'
        }).open();
    } else {
        document.documentElement.classList.remove('theme-dark');
        localStorage.setItem('darkMode', 'false');
        
        app.toast.create({
            text: '☀️ Mode terang diaktifkan',
            closeTimeout: 2000,
            position: 'center'
        }).open();
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Handle notification toggle
    const notificationToggle = document.querySelector('input[type="checkbox"]:not(#darkModeToggle)');
    if (notificationToggle) {
        notificationToggle.addEventListener('change', function() {
            app.toast.create({
                text: this.checked ? '🔔 Notifikasi diaktifkan' : '🔕 Notifikasi dinonaktifkan',
                closeTimeout: 2000,
                position: 'center'
            }).open();
        });
    }
    
    // Handle menu button
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            showActionSheet();
        });
    }
    
    // Handle "Pelajari Lebih" button
    const learnMoreBtn = document.querySelector('.button-outline');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function() {
            app.dialog.create({
                title: 'Framework7',
                text: 'Framework7 adalah framework HTML yang powerful untuk membangun aplikasi mobile hybrid dan web dengan tampilan dan nuansa native iOS dan Android.',
                buttons: [
                    {
                        text: 'Tutup',
                        close: true
                    },
                    {
                        text: 'Buka Dokumentasi',
                        onClick: function() {
                            window.open('https://framework7.io/', '_blank');
                        }
                    }
                ]
            }).open();
        });
    }
}

// Show Action Sheet
function showActionSheet() {
    app.actions.create({
        buttons: [
            {
                text: 'Refresh Halaman',
                icon: '<i class="f7-icons">arrow_clockwise</i>',
                onClick: function() {
                    window.location.reload();
                }
            },
            {
                text: 'Bagikan App',
                icon: '<i class="f7-icons">square_arrow_up</i>',
                onClick: function() {
                    if (navigator.share) {
                        navigator.share({
                            title: 'Coba Web App',
                            text: 'Lihat aplikasi web iOS yang keren ini!',
                            url: window.location.href
                        });
                    } else {
                        app.toast.create({
                            text: 'Sharing tidak didukung di browser ini',
                            closeTimeout: 2000
                        }).open();
                    }
                }
            },
            {
                text: 'Tentang App',
                icon: '<i class="f7-icons">info_circle</i>',
                onClick: function() {
                    app.dialog.create({
                        title: 'Tentang Coba Web App',
                        text: 'Versi 1.0.0<br>Dibuat dengan Framework7<br>© 2025',
                        buttons: ['Tutup']
                    }).open();
                }
            },
            {
                text: 'Batal',
                color: 'red',
                close: true
            }
        ]
    }).open();
}

// PWA Setup
function setupPWA() {
    // Handle install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        const installBtn = document.getElementById('installBtn');
        if (installBtn) {
            installBtn.style.display = 'block';
            installBtn.addEventListener('click', installApp);
        }
    });
    
    // Handle app installed
    window.addEventListener('appinstalled', () => {
        console.log('PWA installed successfully');
        
        app.toast.create({
            text: '✅ Aplikasi berhasil dipasang!',
            closeTimeout: 3000,
            position: 'center'
        }).open();
        
        const installBtn = document.getElementById('installBtn');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    });
}

// Install App
function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        
        deferredPrompt.userChoice.then((result) => {
            if (result.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    }
}

// Service Worker Setup
function setupServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered:', registration);
                
                // Handle updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    }
}

// Show Update Notification
function showUpdateNotification() {
    app.toast.create({
        text: '🔄 Update tersedia! Tap untuk refresh.',
        closeTimeout: 5000,
        position: 'top',
        onClick: function() {
            window.location.reload();
        }
    }).open();
}

// Online Status
function updateOnlineStatus() {
    isOnline = navigator.onLine;
    console.log('📶 Status:', isOnline ? 'Online' : 'Offline');
    
    if (!isOnline) {
        app.toast.create({
            text: '📴 Anda sedang offline',
            closeTimeout: 3000,
            position: 'center',
            cssClass: 'color-red'
        }).open();
    }
}

// Handle online/offline events
window.addEventListener('online', () => {
    isOnline = true;
    app.toast.create({
        text: '📶 Koneksi internet kembali',
        closeTimeout: 2000,
        position: 'center',
        cssClass: 'color-green'
    }).open();
});

window.addEventListener('offline', () => {
    isOnline = false;
    updateOnlineStatus();
});

// App lifecycle events
app.on('pageInit', function (page) {
    console.log('📄 Page initialized:', page.name);
});

app.on('pageBeforeIn', function (page) {
    console.log('📄 Page before in:', page.name);
});

app.on('pageAfterIn', function (page) {
    console.log('📄 Page after in:', page.name);
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('❌ App error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('❌ Unhandled promise rejection:', e.reason);
});

// Export app for debugging
window.app = app;
window.mainView = mainView;

console.log('✅ Framework7 iOS App fully loaded!');
