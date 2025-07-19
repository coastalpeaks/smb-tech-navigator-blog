/**
 * Main Application Entry Point
 * 
 * Coordinates all modules and handles global application functionality.
 * This is the main orchestrator that initializes all other modules and
 * handles cross-module communication and global state management.
 */

/* ============================================
   APPLICATION STATE
   ============================================ */

/**
 * Global application state and configuration
 */
const AppState = {
  isInitialized: false,
  isLoading: true,
  currentTheme: 'light',
  modules: {
    navigation: false,
    animations: false,
    utils: false
  },
  performance: {
    startTime: performance.now(),
    loadTime: null,
    domReadyTime: null
  },
  debug: false // Set to true for development debugging
};

/**
 * Application configuration
 */
const AppConfig = {
  // Loading states
  minLoadingTime: 500, // Minimum loading screen duration
  
  // Performance monitoring
  performanceMetrics: true,
  
  // Error tracking
  errorTracking: true,
  
  // Feature flags
  features: {
    animations: true,
    smoothScrolling: true,
    progressIndicator: true,
    analytics: false
  },
  
  // Contact information (from resume)
  contact: {
    email: 'jmssrfs@gmail.com',
    phone: '413-478-1672',
    linkedin: 'https://www.linkedin.com/in/jamesaws',
    location: 'Kirkland, WA'
  }
};

/* ============================================
   ERROR HANDLING
   ============================================ */

/**
 * Global error handler for unhandled errors
 * @param {ErrorEvent} event - Error event
 */
function handleGlobalError(event) {
  console.error('Global error caught:', {
    message: event.message,
    filename: event.filename,
    line: event.lineno,
    column: event.colno,
    error: event.error
  });
  
  // Track error if analytics is enabled
  if (AppConfig.features.analytics) {
    trackError('javascript_error', {
      message: event.message,
      source: event.filename,
      line: event.lineno
    });
  }
  
  // Show user-friendly error message in development
  if (AppState.debug) {
    showErrorMessage('An unexpected error occurred. Please refresh the page.');
  }
}

/**
 * Handle unhandled promise rejections
 * @param {PromiseRejectionEvent} event - Promise rejection event
 */
function handleUnhandledRejection(event) {
  console.error('Unhandled promise rejection:', event.reason);
  
  // Track error if analytics is enabled
  if (AppConfig.features.analytics) {
    trackError('promise_rejection', {
      reason: event.reason?.message || 'Unknown promise rejection'
    });
  }
  
  // Prevent the default behavior (showing error in console)
  event.preventDefault();
}

/**
 * Show error message to user
 * @param {string} message - Error message to display
 */
function showErrorMessage(message) {
  try {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ef4444;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10000;
      font-family: var(--font-primary);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 5000);
    
  } catch (error) {
    console.error('Error showing error message:', error);
  }
}

/* ============================================
   PERFORMANCE MONITORING
   ============================================ */

/**
 * Track performance metrics
 * @param {string} metric - Metric name
 * @param {number} value - Metric value
 */
function trackPerformance(metric, value) {
  if (!AppConfig.performanceMetrics) return;
  
  try {
    AppState.performance[metric] = value;
    
    if (AppState.debug) {
      console.log(`Performance: ${metric} = ${value}ms`);
    }
    
    // Send to analytics if enabled
    if (AppConfig.features.analytics) {
      // Analytics tracking would go here
      console.log(`Analytics: ${metric}`, value);
    }
    
  } catch (error) {
    console.error('Error tracking performance:', error);
  }
}

/**
 * Measure and track page load performance
 */
function measurePagePerformance() {
  try {
    // Track DOM ready time
    const domReadyTime = performance.now() - AppState.performance.startTime;
    trackPerformance('domReadyTime', Math.round(domReadyTime));
    
    // Track full load time when window loads
    windowReady(() => {
      const loadTime = performance.now() - AppState.performance.startTime;
      trackPerformance('loadTime', Math.round(loadTime));
      
      // Track Web Vitals if available
      if ('web-vitals' in window) {
        // This would integrate with web-vitals library if included
        console.log('Web Vitals tracking available');
      }
    });
    
  } catch (error) {
    console.error('Error measuring page performance:', error);
  }
}

/* ============================================
   LOADING MANAGEMENT
   ============================================ */

/**
 * Show loading indicator
 */
function showLoading() {
  try {
    const loader = querySelector('.page-loader') || createLoader();
    fadeIn(loader, 200);
  } catch (error) {
    console.error('Error showing loading indicator:', error);
  }
}

/**
 * Hide loading indicator
 */
function hideLoading() {
  try {
    const loader = querySelector('.page-loader');
    if (loader) {
      fadeOut(loader, 300);
      setTimeout(() => {
        if (loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, 300);
    }
    AppState.isLoading = false;
  } catch (error) {
    console.error('Error hiding loading indicator:', error);
  }
}

/**
 * Create loading indicator element
 * @returns {Element} - Loading element
 */
function createLoader() {
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = `
    <div class="loader-content">
      <div class="loader-spinner"></div>
      <div class="loader-text">Loading...</div>
    </div>
  `;
  
  loader.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    font-family: var(--font-primary);
  `;
  
  document.body.appendChild(loader);
  return loader;
}

/* ============================================
   MODULE INITIALIZATION
   ============================================ */

/**
 * Initialize all application modules
 */
function initializeModules() {
  try {
    console.log('Initializing application modules...');
    
    // Modules initialize themselves, we just track their status
    // Navigation module
    if (typeof Navigation !== 'undefined') {
      AppState.modules.navigation = true;
      console.log('✓ Navigation module available');
    }
    
    // Animations module
    if (typeof Animations !== 'undefined') {
      AppState.modules.animations = true;
      console.log('✓ Animations module available');
    }
    
    // Utils are always available since they're in the same file context
    AppState.modules.utils = true;
    console.log('✓ Utils module available');
    
    console.log('All modules initialized successfully');
    
  } catch (error) {
    console.error('Error initializing modules:', error);
  }
}

/* ============================================
   SCROLL PROGRESS INDICATOR
   ============================================ */

/**
 * Setup scroll progress indicator
 */
function setupScrollProgress() {
  if (!AppConfig.features.progressIndicator) return;
  
  try {
    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
      z-index: 9999;
      transition: width 0.3s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    const updateProgress = throttle(() => {
      const scrollPercent = getScrollPercentage();
      progressBar.style.width = `${scrollPercent}%`;
    }, 16);
    
    addEventListenerSafe(window, 'scroll', updateProgress);
    
    console.log('Scroll progress indicator initialized');
    
  } catch (error) {
    console.error('Error setting up scroll progress:', error);
  }
}

/* ============================================
   CONTACT FORM HANDLERS (if needed)
   ============================================ */

/**
 * Handle contact actions (email, phone, etc.)
 */
function setupContactHandlers() {
  try {
    // Email links
    const emailLinks = querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
      addEventListenerSafe(link, 'click', (event) => {
        trackEvent('contact_email_clicked');
      });
    });
    
    // Phone links
    const phoneLinks = querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
      addEventListenerSafe(link, 'click', (event) => {
        trackEvent('contact_phone_clicked');
      });
    });
    
    // LinkedIn links
    const linkedinLinks = querySelectorAll('a[href*="linkedin.com"]');
    linkedinLinks.forEach(link => {
      addEventListenerSafe(link, 'click', (event) => {
        trackEvent('linkedin_profile_clicked');
      });
    });
    
    console.log('Contact handlers initialized');
    
  } catch (error) {
    console.error('Error setting up contact handlers:', error);
  }
}

/* ============================================
   ANALYTICS & TRACKING
   ============================================ */

/**
 * Track custom events
 * @param {string} eventName - Event name
 * @param {Object} eventData - Event data
 */
function trackEvent(eventName, eventData = {}) {
  if (!AppConfig.features.analytics) return;
  
  try {
    // This would integrate with your analytics service (GA, Mixpanel, etc.)
    console.log('Event tracked:', eventName, eventData);
    
    // Example for Google Analytics 4
    // if (typeof gtag !== 'undefined') {
    //   gtag('event', eventName, eventData);
    // }
    
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

/**
 * Track errors for analytics
 * @param {string} errorType - Type of error
 * @param {Object} errorData - Error data
 */
function trackError(errorType, errorData = {}) {
  if (!AppConfig.features.analytics) return;
  
  try {
    trackEvent('error_occurred', {
      error_type: errorType,
      ...errorData
    });
  } catch (error) {
    console.error('Error tracking error:', error);
  }
}

/* ============================================
   ACCESSIBILITY ENHANCEMENTS
   ============================================ */

/**
 * Setup accessibility enhancements
 */
function setupAccessibility() {
  try {
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--color-primary);
      color: white;
      padding: 8px;
      z-index: 10000;
      text-decoration: none;
      border-radius: 4px;
    `;
    
    // Show on focus
    addEventListenerSafe(skipLink, 'focus', () => {
      skipLink.style.top = '6px';
    });
    
    addEventListenerSafe(skipLink, 'blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID if not present
    const main = querySelector('main');
    if (main && !main.id) {
      main.id = 'main-content';
    }
    
    console.log('Accessibility enhancements initialized');
    
  } catch (error) {
    console.error('Error setting up accessibility:', error);
  }
}

/* ============================================
   APPLICATION INITIALIZATION
   ============================================ */

/**
 * Initialize the entire application
 */
function initializeApp() {
  if (AppState.isInitialized) {
    console.warn('Application already initialized');
    return;
  }
  
  try {
    console.log('🚀 Initializing James Liu Portfolio Website...');
    
    // Setup error handling
    addEventListenerSafe(window, 'error', handleGlobalError);
    addEventListenerSafe(window, 'unhandledrejection', handleUnhandledRejection);
    
    // Initialize performance monitoring
    measurePagePerformance();
    
    // Initialize modules
    initializeModules();
    
    // Setup features
    setupScrollProgress();
    setupContactHandlers();
    setupAccessibility();
    
    // Initialize email protection
    initEmailProtection();
    
    // Mark as initialized
    AppState.isInitialized = true;
    
    console.log('✅ Application initialized successfully');
    console.log('📊 Application state:', AppState);
    
    // Track initialization
    trackEvent('app_initialized', {
      modules: AppState.modules,
      features: AppConfig.features
    });
    
  } catch (error) {
    console.error('❌ Error initializing application:', error);
    showErrorMessage('Failed to initialize application. Please refresh the page.');
  }
}

/**
 * Finalize application loading
 */
function finalizeLoading() {
  try {
    const loadingTime = performance.now() - AppState.performance.startTime;
    const minLoadingMet = loadingTime >= AppConfig.minLoadingTime;
    
    const finalize = () => {
      hideLoading();
      trackPerformance('totalInitTime', Math.round(loadingTime));
      
      // Trigger any post-load events
      document.dispatchEvent(new CustomEvent('appReady', {
        detail: { appState: AppState }
      }));
      
      console.log('🎉 Application fully loaded and ready!');
    };
    
    if (minLoadingMet) {
      finalize();
    } else {
      // Wait for minimum loading time
      setTimeout(finalize, AppConfig.minLoadingTime - loadingTime);
    }
    
  } catch (error) {
    console.error('Error finalizing loading:', error);
    hideLoading(); // Fallback
  }
}

/* ============================================
   PUBLIC API
   ============================================ */

/**
 * Public application API
 */
window.App = {
  state: AppState,
  config: AppConfig,
  trackEvent: trackEvent,
  trackError: trackError,
  showError: showErrorMessage,
  getPerformance: () => AppState.performance
};

/* ============================================
   APPLICATION STARTUP
   ============================================ */

// Initialize when DOM is ready
domReady(() => {
  console.log('DOM ready, initializing application...');
  initializeApp();
});

// Finalize when everything is loaded
windowReady(() => {
  console.log('Window loaded, finalizing application...');
  finalizeLoading();
});

// Handle page visibility changes
addEventListenerSafe(document, 'visibilitychange', () => {
  if (document.hidden) {
    trackEvent('page_hidden');
  } else {
    trackEvent('page_visible');
  }
});

// Handle before unload for cleanup
addEventListenerSafe(window, 'beforeunload', () => {
  trackEvent('page_unload');
});

console.log('📝 Main application script loaded');

/**
 * Development helpers (only available in debug mode)
 */
if (AppState.debug) {
  window.AppDebug = {
    resetAnimations: () => typeof Animations !== 'undefined' && Animations.reset(),
    goToSection: (section) => typeof Navigation !== 'undefined' && Navigation.goToSection(section),
    showError: showErrorMessage,
    state: AppState,
    config: AppConfig
  };
  
  console.log('🔧 Debug mode enabled. Use window.AppDebug for development helpers.');
}