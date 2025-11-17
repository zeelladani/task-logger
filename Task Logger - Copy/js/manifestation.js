// manifestation.js - PWA Installation and Service Worker Management
class Manifestation {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }

    init() {
        this.registerServiceWorker();
        this.addInstallPromptListener();
        this.detectStandaloneMode();
    }

    // Register Service Worker for PWA functionality
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // Make sure the path is correct for your project structure
                navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                        console.log('✅ SW registered: ', registration);
                    })
                    .catch((registrationError) => {
                        console.log('❌ SW registration failed: ', registrationError);
                    });
            });
        } else {
            console.log('❌ Service Worker not supported');
        }
    }

    // Handle install prompt
    addInstallPromptListener() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            console.log('📱 PWA install prompt available');
            this.showInstallPromotion();
        });

        window.addEventListener('appinstalled', () => {
            this.deferredPrompt = null;
            console.log('✅ PWA was installed');
            this.hideInstallPromotion();
        });
    }

    // Show install promotion
    showInstallPromotion() {
        // Create install button if it doesn't exist
        if (!document.getElementById('install-button')) {
            const installBtn = document.createElement('button');
            installBtn.id = 'install-button';
            installBtn.className = 'btn btn-primary install-btn';
            installBtn.innerHTML = '📱 Install App';
            installBtn.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                animation: pulse 2s infinite;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                border: none;
                border-radius: 12px;
                padding: 12px 20px;
                font-weight: 600;
                cursor: pointer;
                background: linear-gradient(135deg, #4361ee, #3f37c9);
                color: white;
            `;
            
            installBtn.addEventListener('click', () => this.installApp());
            document.body.appendChild(installBtn);
        }
    }

    hideInstallPromotion() {
        const installBtn = document.getElementById('install-button');
        if (installBtn) {
            installBtn.remove();
        }
    }

    // Trigger app installation
    async installApp() {
        if (this.deferredPrompt) {
            console.log('🚀 Triggering installation...');
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('✅ User accepted the install prompt');
            } else {
                console.log('❌ User dismissed the install prompt');
            }
            
            this.deferredPrompt = null;
            this.hideInstallPromotion();
        } else {
            console.log('❌ No install prompt available');
        }
    }

    // Detect if app is running in standalone mode
    detectStandaloneMode() {
        if (window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone === true) {
            console.log('📱 App is running in standalone mode');
            document.body.classList.add('standalone-mode');
        }
    }

    // Check if app can be installed
    canInstall() {
        return this.deferredPrompt !== null;
    }

    // Manual trigger for install promotion (for testing)
    showInstallButton() {
        this.showInstallPromotion();
    }
}

// Initialize PWA functionality
const manifestation = new Manifestation();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Manifestation;
}