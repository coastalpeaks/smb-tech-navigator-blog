/**
 * Utility Functions
 * 
 * Common helper functions used throughout the application.
 * Provides reusable utilities for DOM manipulation, animations, and data processing.
 */

/* ============================================
   DOM UTILITIES
   ============================================ */

/**
 * Safely query a single element from the DOM
 * @param {string} selector - CSS selector string
 * @param {Element} context - Context element to search within (default: document)
 * @returns {Element|null} - Found element or null
 */
function querySelector(selector, context = document) {
  try {
    return context.querySelector(selector);
  } catch (error) {
    console.error(`Error selecting element with selector "${selector}":`, error);
    return null;
  }
}

/**
 * Safely query multiple elements from the DOM
 * @param {string} selector - CSS selector string
 * @param {Element} context - Context element to search within (default: document)
 * @returns {NodeList} - NodeList of found elements (empty if none found)
 */
function querySelectorAll(selector, context = document) {
  try {
    return context.querySelectorAll(selector);
  } catch (error) {
    console.error(`Error selecting elements with selector "${selector}":`, error);
    return document.createDocumentFragment().childNodes; // Return empty NodeList
  }
}

/**
 * Add event listener with error handling
 * @param {Element} element - Target element
 * @param {string} event - Event type
 * @param {Function} handler - Event handler function
 * @param {Object|boolean} options - Event listener options
 */
function addEventListenerSafe(element, event, handler, options = false) {
  if (!element || typeof handler !== 'function') {
    console.error('Invalid element or handler provided to addEventListenerSafe');
    return;
  }
  
  try {
    element.addEventListener(event, handler, options);
  } catch (error) {
    console.error(`Error adding event listener for "${event}":`, error);
  }
}

/**
 * Remove event listener with error handling
 * @param {Element} element - Target element
 * @param {string} event - Event type
 * @param {Function} handler - Event handler function
 * @param {Object|boolean} options - Event listener options
 */
function removeEventListenerSafe(element, event, handler, options = false) {
  if (!element || typeof handler !== 'function') {
    console.error('Invalid element or handler provided to removeEventListenerSafe');
    return;
  }
  
  try {
    element.removeEventListener(event, handler, options);
  } catch (error) {
    console.error(`Error removing event listener for "${event}":`, error);
  }
}

/* ============================================
   CLASS MANIPULATION UTILITIES
   ============================================ */

/**
 * Toggle class on element with error handling
 * @param {Element} element - Target element
 * @param {string} className - Class name to toggle
 * @returns {boolean} - True if class was added, false if removed
 */
function toggleClass(element, className) {
  if (!element || !className) {
    console.error('Invalid element or className provided to toggleClass');
    return false;
  }
  
  try {
    return element.classList.toggle(className);
  } catch (error) {
    console.error(`Error toggling class "${className}":`, error);
    return false;
  }
}

/**
 * Add class to element with error handling
 * @param {Element} element - Target element
 * @param {string} className - Class name to add
 */
function addClass(element, className) {
  if (!element || !className) {
    console.error('Invalid element or className provided to addClass');
    return;
  }
  
  try {
    element.classList.add(className);
  } catch (error) {
    console.error(`Error adding class "${className}":`, error);
  }
}

/**
 * Remove class from element with error handling
 * @param {Element} element - Target element
 * @param {string} className - Class name to remove
 */
function removeClass(element, className) {
  if (!element || !className) {
    console.error('Invalid element or className provided to removeClass');
    return;
  }
  
  try {
    element.classList.remove(className);
  } catch (error) {
    console.error(`Error removing class "${className}":`, error);
  }
}

/**
 * Check if element has specific class
 * @param {Element} element - Target element
 * @param {string} className - Class name to check
 * @returns {boolean} - True if element has the class
 */
function hasClass(element, className) {
  if (!element || !className) {
    console.error('Invalid element or className provided to hasClass');
    return false;
  }
  
  try {
    return element.classList.contains(className);
  } catch (error) {
    console.error(`Error checking class "${className}":`, error);
    return false;
  }
}

/* ============================================
   ANIMATION UTILITIES
   ============================================ */

/**
 * Smooth scroll to element
 * @param {Element|string} target - Target element or selector
 * @param {Object} options - Scroll options
 */
function scrollToElement(target, options = {}) {
  const defaultOptions = {
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
    offset: 0 // Additional offset from top
  };
  
  const scrollOptions = { ...defaultOptions, ...options };
  
  try {
    let targetElement;
    
    if (typeof target === 'string') {
      targetElement = querySelector(target);
    } else if (target instanceof Element) {
      targetElement = target;
    }
    
    if (!targetElement) {
      console.error('Target element not found for scrolling');
      return;
    }
    
    // Calculate position with offset
    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - scrollOptions.offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: scrollOptions.behavior
    });
    
  } catch (error) {
    console.error('Error scrolling to element:', error);
  }
}

/**
 * Fade in element
 * @param {Element} element - Element to fade in
 * @param {number} duration - Animation duration in milliseconds
 */
function fadeIn(element, duration = 300) {
  if (!element) {
    console.error('Invalid element provided to fadeIn');
    return;
  }
  
  try {
    element.style.opacity = '0';
    element.style.display = 'block';
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    
    // Force reflow to ensure transition works
    element.offsetHeight;
    
    element.style.opacity = '1';
  } catch (error) {
    console.error('Error in fadeIn animation:', error);
  }
}

/**
 * Fade out element
 * @param {Element} element - Element to fade out
 * @param {number} duration - Animation duration in milliseconds
 */
function fadeOut(element, duration = 300) {
  if (!element) {
    console.error('Invalid element provided to fadeOut');
    return;
  }
  
  try {
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    element.style.opacity = '0';
    
    setTimeout(() => {
      element.style.display = 'none';
    }, duration);
  } catch (error) {
    console.error('Error in fadeOut animation:', error);
  }
}

/* ============================================
   THROTTLE AND DEBOUNCE UTILITIES
   ============================================ */

/**
 * Throttle function execution
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
function throttle(func, limit) {
  if (typeof func !== 'function') {
    console.error('Invalid function provided to throttle');
    return () => {};
  }
  
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      try {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      } catch (error) {
        console.error('Error in throttled function execution:', error);
      }
    }
  };
}

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, delay) {
  if (typeof func !== 'function') {
    console.error('Invalid function provided to debounce');
    return () => {};
  }
  
  let timeoutId;
  
  return function executedFunction(...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      try {
        func.apply(this, args);
      } catch (error) {
        console.error('Error in debounced function execution:', error);
      }
    }, delay);
  };
}

/* ============================================
   VIEWPORT AND INTERSECTION UTILITIES
   ============================================ */

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @param {number} threshold - Threshold percentage (0-1)
 * @returns {boolean} - True if element is in viewport
 */
function isInViewport(element, threshold = 0) {
  if (!element) {
    console.error('Invalid element provided to isInViewport');
    return false;
  }
  
  try {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    const verticalVisible = (rect.top + (rect.height * threshold)) < windowHeight && 
                           (rect.bottom - (rect.height * threshold)) > 0;
    
    const horizontalVisible = (rect.left + (rect.width * threshold)) < windowWidth && 
                             (rect.right - (rect.width * threshold)) > 0;
    
    return verticalVisible && horizontalVisible;
  } catch (error) {
    console.error('Error checking viewport intersection:', error);
    return false;
  }
}

/**
 * Get scroll percentage of page
 * @returns {number} - Scroll percentage (0-100)
 */
function getScrollPercentage() {
  try {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (scrollHeight <= 0) return 0;
    
    return Math.round((scrollTop / scrollHeight) * 100);
  } catch (error) {
    console.error('Error calculating scroll percentage:', error);
    return 0;
  }
}

/* ============================================
   DATA VALIDATION UTILITIES
   ============================================ */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
function isValidEmail(email) {
  if (typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.toLowerCase());
}

/**
 * Validate phone number format (US format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone format
 */
function isValidPhone(phone) {
  if (typeof phone !== 'string') {
    return false;
  }
  
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if it's 10 digits (US format)
  return cleanPhone.length === 10 || cleanPhone.length === 11;
}

/* ============================================
   LOCAL STORAGE UTILITIES
   ============================================ */

/**
 * Safely set item in localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} - True if successful
 */
function setLocalStorage(key, value) {
  if (!key || typeof key !== 'string') {
    console.error('Invalid key provided to setLocalStorage');
    return false;
  }
  
  try {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error('Error setting localStorage:', error);
    return false;
  }
}

/**
 * Safely get item from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key not found
 * @returns {*} - Retrieved value or default
 */
function getLocalStorage(key, defaultValue = null) {
  if (!key || typeof key !== 'string') {
    console.error('Invalid key provided to getLocalStorage');
    return defaultValue;
  }
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error getting localStorage:', error);
    return defaultValue;
  }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} - True if successful
 */
function removeLocalStorage(key) {
  if (!key || typeof key !== 'string') {
    console.error('Invalid key provided to removeLocalStorage');
    return false;
  }
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing localStorage:', error);
    return false;
  }
}

/* ============================================
   PERFORMANCE UTILITIES
   ============================================ */

/**
 * Wait for DOM to be ready
 * @param {Function} callback - Function to execute when DOM is ready
 */
function domReady(callback) {
  if (typeof callback !== 'function') {
    console.error('Invalid callback provided to domReady');
    return;
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    // DOM is already ready
    callback();
  }
}

/**
 * Wait for window to load completely
 * @param {Function} callback - Function to execute when window loads
 */
function windowReady(callback) {
  if (typeof callback !== 'function') {
    console.error('Invalid callback provided to windowReady');
    return;
  }
  
  if (document.readyState === 'complete') {
    callback();
  } else {
    window.addEventListener('load', callback);
  }
}

/* ============================================
   EXPORT UTILITIES (if using modules)
   ============================================ */

// Export utilities for use in other modules
// Uncomment if using ES6 modules
/*
export {
  querySelector,
  querySelectorAll,
  addEventListenerSafe,
  removeEventListenerSafe,
  toggleClass,
  addClass,
  removeClass,
  hasClass,
  scrollToElement,
  fadeIn,
  fadeOut,
  throttle,
  debounce,
  isInViewport,
  getScrollPercentage,
  isValidEmail,
  isValidPhone,
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  domReady,
  windowReady,
  setupEmailContact,
  initEmailProtection
};
*/

/**
 * Email protection and anti-bot utilities
 */

/**
 * Setup email contact functionality (opens mail app without revealing email)
 * @param {Element} element - Element containing email data
 */
function setupEmailContact(element) {
  if (!element) {
    console.error('Element not provided to setupEmailContact');
    return;
  }

  try {
    const user = element.dataset.user;
    const domain = element.dataset.domain;
    
    if (!user || !domain) {
      console.error('Email data attributes missing');
      return;
    }

    const email = `${user}@${domain}`;
    
    // Set up the mailto link without displaying the email
    if (element.tagName.toLowerCase() === 'a') {
      element.href = `mailto:${email}`;
      element.title = 'Send email';
    }
    
    // Track email contact attempts for analytics (if available)
    addEventListenerSafe(element, 'click', () => {
      if (typeof trackEvent === 'function') {
        trackEvent('email_contact_clicked', { location: element.className || 'unknown' });
      }
    });
    
  } catch (error) {
    console.error('Error setting up email contact:', error);
  }
}

/**
 * Initialize email protection for all protected email elements
 */
function initEmailProtection() {
  try {
    // Find all email contact elements
    const emailElements = document.querySelectorAll('.email-contact[data-user][data-domain]');
    
    emailElements.forEach(element => {
      setupEmailContact(element);
    });
    
    console.log('Email protection initialized for', emailElements.length, 'elements');
    
  } catch (error) {
    console.error('Error initializing email protection:', error);
  }
}