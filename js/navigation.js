/**
 * Navigation Module
 * 
 * Handles all navigation-related functionality including:
 * - Smooth scrolling between sections
 * - Mobile menu toggle
 * - Active link highlighting
 * - Navbar scroll effects
 */

/* ============================================
   NAVIGATION STATE MANAGEMENT
   ============================================ */

/**
 * Navigation state object to track current state
 */
const NavigationState = {
  currentSection: 'home',
  isMenuOpen: false,
  isScrolled: false,
  scrollThreshold: 50, // Pixels from top to consider "scrolled"
  sections: ['home', 'experience', 'skills', 'achievements', 'contact']
};

/* ============================================
   DOM ELEMENT REFERENCES
   ============================================ */

/**
 * Cache DOM elements for better performance
 * Elements are retrieved once and reused throughout the module
 */
let navElements = {};

/**
 * Initialize navigation DOM elements
 * Called once when the module loads
 */
function initializeNavElements() {
  navElements = {
    navbar: querySelector('.navbar'),
    navToggle: querySelector('.nav-toggle'),
    navMenu: querySelector('.nav-menu'),
    navLinks: querySelectorAll('.nav-link'),
    brandLink: querySelector('.brand-link'),
    sections: querySelectorAll('section[id]')
  };
  
  // Log missing elements for debugging
  Object.entries(navElements).forEach(([key, element]) => {
    if (!element && key !== 'sections') {
      console.warn(`Navigation element not found: ${key}`);
    }
  });
}

/* ============================================
   MOBILE MENU FUNCTIONALITY
   ============================================ */

/**
 * Toggle mobile navigation menu
 * Handles opening/closing of mobile menu with proper state management
 */
function toggleMobileMenu() {
  if (!navElements.navToggle || !navElements.navMenu) {
    console.error('Mobile menu elements not found');
    return;
  }
  
  try {
    // Toggle menu state
    NavigationState.isMenuOpen = !NavigationState.isMenuOpen;
    
    // Update DOM elements
    toggleClass(navElements.navToggle, 'active');
    toggleClass(navElements.navMenu, 'active');
    
    // Prevent body scroll when menu is open
    if (NavigationState.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Update ARIA attributes for accessibility
    const isExpanded = NavigationState.isMenuOpen ? 'true' : 'false';
    navElements.navToggle.setAttribute('aria-expanded', isExpanded);
    
    console.log(`Mobile menu ${NavigationState.isMenuOpen ? 'opened' : 'closed'}`);
    
  } catch (error) {
    console.error('Error toggling mobile menu:', error);
  }
}

/**
 * Close mobile menu
 * Utility function to explicitly close the mobile menu
 */
function closeMobileMenu() {
  if (NavigationState.isMenuOpen) {
    toggleMobileMenu();
  }
}

/**
 * Handle clicks outside mobile menu to close it
 * @param {Event} event - Click event
 */
function handleOutsideClick(event) {
  if (!NavigationState.isMenuOpen) return;
  
  const isClickInsideMenu = navElements.navMenu?.contains(event.target);
  const isClickOnToggle = navElements.navToggle?.contains(event.target);
  
  if (!isClickInsideMenu && !isClickOnToggle) {
    closeMobileMenu();
  }
}

/* ============================================
   SMOOTH SCROLLING FUNCTIONALITY
   ============================================ */

/**
 * Handle navigation link clicks for smooth scrolling
 * @param {Event} event - Click event from navigation link
 */
function handleNavLinkClick(event) {
  event.preventDefault();
  
  const link = event.currentTarget;
  const targetId = link.getAttribute('href');
  
  if (!targetId || !targetId.startsWith('#')) {
    console.warn('Invalid navigation link target:', targetId);
    return;
  }
  
  try {
    const targetSection = querySelector(targetId);
    
    if (!targetSection) {
      console.warn('Target section not found:', targetId);
      return;
    }
    
    // Close mobile menu if open
    closeMobileMenu();
    
    // Calculate scroll position accounting for fixed navbar
    const navHeight = navElements.navbar?.offsetHeight || 64;
    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
    const scrollToPosition = Math.max(0, targetPosition - navHeight - 20); // 20px extra padding
    
    // Smooth scroll to target
    window.scrollTo({
      top: scrollToPosition,
      behavior: 'smooth'
    });
    
    // Update active link immediately for better UX
    const sectionId = targetId.substring(1); // Remove # from id
    updateActiveNavLink(sectionId);
    
    console.log(`Navigated to section: ${sectionId}`);
    
  } catch (error) {
    console.error('Error handling navigation click:', error);
  }
}

/* ============================================
   ACTIVE LINK HIGHLIGHTING
   ============================================ */

/**
 * Update active navigation link based on current section
 * @param {string} activeSection - ID of the currently active section
 */
function updateActiveNavLink(activeSection) {
  if (!navElements.navLinks || navElements.navLinks.length === 0) {
    return;
  }
  
  try {
    // Remove active class from all links
    navElements.navLinks.forEach(link => {
      removeClass(link, 'active');
    });
    
    // Add active class to current section link
    const activeLink = querySelector(`.nav-link[href="#${activeSection}"]`);
    if (activeLink) {
      addClass(activeLink, 'active');
      NavigationState.currentSection = activeSection;
    }
    
  } catch (error) {
    console.error('Error updating active nav link:', error);
  }
}

/**
 * Determine which section is currently in view
 * Uses intersection logic to find the most visible section
 * @returns {string} - ID of the active section
 */
function getCurrentSection() {
  if (!navElements.sections || navElements.sections.length === 0) {
    return NavigationState.currentSection;
  }
  
  try {
    const scrollPosition = window.pageYOffset;
    const navHeight = navElements.navbar?.offsetHeight || 64;
    const viewportMiddle = scrollPosition + navHeight + (window.innerHeight / 3);
    
    let activeSection = NavigationState.currentSection;
    
    // Check each section to find which one is most visible
    navElements.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      // If viewport middle is within section bounds, make it active
      if (viewportMiddle >= sectionTop && viewportMiddle <= sectionBottom) {
        activeSection = section.id;
      }
    });
    
    return activeSection;
    
  } catch (error) {
    console.error('Error determining current section:', error);
    return NavigationState.currentSection;
  }
}

/* ============================================
   NAVBAR SCROLL EFFECTS
   ============================================ */

/**
 * Handle navbar appearance changes on scroll
 * Adds/removes classes based on scroll position
 */
function handleNavbarScroll() {
  if (!navElements.navbar) return;
  
  try {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const shouldBeScrolled = scrollTop > NavigationState.scrollThreshold;
    
    // Only update if state has changed to avoid unnecessary DOM manipulation
    if (shouldBeScrolled !== NavigationState.isScrolled) {
      NavigationState.isScrolled = shouldBeScrolled;
      
      if (shouldBeScrolled) {
        addClass(navElements.navbar, 'scrolled');
      } else {
        removeClass(navElements.navbar, 'scrolled');
      }
    }
    
  } catch (error) {
    console.error('Error handling navbar scroll:', error);
  }
}

/**
 * Handle scroll events for navigation updates
 * Combines navbar scroll effects and active link updates
 */
function handleScroll() {
  // Update navbar appearance
  handleNavbarScroll();
  
  // Update active navigation link
  const currentSection = getCurrentSection();
  if (currentSection !== NavigationState.currentSection) {
    updateActiveNavLink(currentSection);
  }
}

/* ============================================
   KEYBOARD NAVIGATION SUPPORT
   ============================================ */

/**
 * Handle keyboard navigation
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeyboardNavigation(event) {
  // Close mobile menu on Escape key
  if (event.key === 'Escape' && NavigationState.isMenuOpen) {
    closeMobileMenu();
    return;
  }
  
  // Handle Enter and Space on navigation toggle
  if (event.target === navElements.navToggle && 
      (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    toggleMobileMenu();
  }
}

/* ============================================
   EVENT LISTENERS SETUP
   ============================================ */

/**
 * Set up all navigation event listeners
 * Called once during initialization
 */
function setupNavigationEventListeners() {
  // Mobile menu toggle
  if (navElements.navToggle) {
    addEventListenerSafe(navElements.navToggle, 'click', toggleMobileMenu);
  }
  
  // Navigation link clicks
  if (navElements.navLinks) {
    navElements.navLinks.forEach(link => {
      addEventListenerSafe(link, 'click', handleNavLinkClick);
    });
  }
  
  // Brand link click (scroll to top)
  if (navElements.brandLink) {
    addEventListenerSafe(navElements.brandLink, 'click', (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      updateActiveNavLink('home');
      closeMobileMenu();
    });
  }
  
  // Scroll events (throttled for performance)
  const throttledScrollHandler = throttle(handleScroll, 16); // ~60fps
  addEventListenerSafe(window, 'scroll', throttledScrollHandler);
  
  // Resize events (debounced)
  const debouncedResizeHandler = debounce(() => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && NavigationState.isMenuOpen) {
      closeMobileMenu();
    }
  }, 250);
  addEventListenerSafe(window, 'resize', debouncedResizeHandler);
  
  // Outside click to close mobile menu
  addEventListenerSafe(document, 'click', handleOutsideClick);
  
  // Keyboard navigation
  addEventListenerSafe(document, 'keydown', handleKeyboardNavigation);
  
  console.log('Navigation event listeners initialized');
}

/* ============================================
   INITIALIZATION FUNCTIONS
   ============================================ */

/**
 * Initialize navigation module
 * Sets up DOM elements, event listeners, and initial state
 */
function initializeNavigation() {
  try {
    // Initialize DOM elements
    initializeNavElements();
    
    // Set up event listeners
    setupNavigationEventListeners();
    
    // Set initial active link
    const initialSection = getCurrentSection();
    updateActiveNavLink(initialSection);
    
    // Set initial navbar state
    handleNavbarScroll();
    
    console.log('Navigation module initialized successfully');
    
  } catch (error) {
    console.error('Error initializing navigation:', error);
  }
}

/* ============================================
   PUBLIC API
   ============================================ */

/**
 * Public navigation API for external use
 */
const Navigation = {
  init: initializeNavigation,
  goToSection: (sectionId) => {
    const targetSection = querySelector(`#${sectionId}`);
    if (targetSection) {
      const fakeEvent = {
        preventDefault: () => {},
        currentTarget: { getAttribute: () => `#${sectionId}` }
      };
      handleNavLinkClick(fakeEvent);
    }
  },
  closeMobileMenu: closeMobileMenu,
  getCurrentSection: () => NavigationState.currentSection,
  getState: () => ({ ...NavigationState }) // Return copy of state
};

/* ============================================
   AUTO-INITIALIZATION
   ============================================ */

// Initialize navigation when DOM is ready
domReady(() => {
  initializeNavigation();
});

// Export for use in other modules if needed
// Uncomment if using ES6 modules
/*
export default Navigation;
*/