/**
 * Animations Module
 * 
 * Handles all website animations including:
 * - Scroll-triggered animations (fade in, slide up, etc.)
 * - Intersection Observer for performance
 * - Loading animations
 * - Interactive hover effects
 * - Reduced motion support for accessibility
 */

/* ============================================
   ANIMATION STATE MANAGEMENT
   ============================================ */

/**
 * Animation configuration and state
 */
const AnimationConfig = {
  // Performance settings
  intersectionThreshold: 0.1, // Trigger when 10% of element is visible
  rootMargin: '0px 0px -50px 0px', // Trigger 50px before element enters viewport
  
  // Animation delays and durations
  baseDelay: 100, // Base delay between elements in milliseconds
  staggerDelay: 150, // Additional delay for staggered animations
  
  // CSS classes for animations
  classes: {
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    slideLeft: 'animate-slide-left',
    slideRight: 'animate-slide-right',
    scaleIn: 'animate-scale-in',
    rotateIn: 'animate-rotate-in',
    visible: 'is-visible',
    animated: 'is-animated'
  },
  
  // Reduced motion support
  prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

/**
 * State tracking for animated elements
 */
const AnimationState = {
  observer: null,
  animatedElements: new Set(),
  isInitialized: false
};

/* ============================================
   INTERSECTION OBSERVER SETUP
   ============================================ */

/**
 * Create and configure Intersection Observer
 * @returns {IntersectionObserver} - Configured observer instance
 */
function createIntersectionObserver() {
  const observerOptions = {
    root: null, // Use viewport as root
    rootMargin: AnimationConfig.rootMargin,
    threshold: AnimationConfig.intersectionThreshold
  };
  
  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateElement(entry.target);
        AnimationState.observer.unobserve(entry.target);
      }
    });
  };
  
  try {
    return new IntersectionObserver(observerCallback, observerOptions);
  } catch (error) {
    console.error('Failed to create Intersection Observer:', error);
    return null;
  }
}

/* ============================================
   ANIMATION FUNCTIONS
   ============================================ */

/**
 * Animate a single element
 * @param {Element} element - Element to animate
 */
function animateElement(element) {
  if (!element || AnimationState.animatedElements.has(element)) {
    return;
  }
  
  try {
    // Mark element as animated
    AnimationState.animatedElements.add(element);
    
    // Get animation type from data attribute or default to fade-in
    const animationType = element.dataset.animation || 'fade-in';
    const delay = parseInt(element.dataset.delay || '0', 10);
    
    // Apply animation with delay
    setTimeout(() => {
      if (AnimationConfig.prefersReducedMotion) {
        // Skip animations for users who prefer reduced motion
        addClass(element, AnimationConfig.classes.visible);
      } else {
        // Apply animation class
        const animationClass = AnimationConfig.classes[animationType.replace('-', '')] || AnimationConfig.classes.fadeIn;
        addClass(element, animationClass);
        addClass(element, AnimationConfig.classes.visible);
      }
      
      // Mark as fully animated
      addClass(element, AnimationConfig.classes.animated);
      
    }, delay);
    
  } catch (error) {
    console.error('Error animating element:', error);
  }
}

/**
 * Animate a group of elements with stagger effect
 * @param {NodeList|Array} elements - Elements to animate
 * @param {number} baseDelay - Base delay before first animation
 */
function animateElementsStaggered(elements, baseDelay = 0) {
  if (!elements || elements.length === 0) {
    return;
  }
  
  try {
    elements.forEach((element, index) => {
      const staggeredDelay = baseDelay + (index * AnimationConfig.staggerDelay);
      element.dataset.delay = staggeredDelay.toString();
      
      if (isInViewport(element, 0.1)) {
        // Element is already in viewport, animate immediately
        animateElement(element);
      } else if (AnimationState.observer) {
        // Element not in viewport, observe for intersection
        AnimationState.observer.observe(element);
      }
    });
  } catch (error) {
    console.error('Error animating staggered elements:', error);
  }
}

/* ============================================
   LOADING ANIMATIONS
   ============================================ */

/**
 * Handle page load animations
 * Animates elements that should appear immediately on page load
 */
function handlePageLoadAnimations() {
  try {
    // Hero section animations
    const heroElements = querySelectorAll('.hero-section [data-animation]');
    if (heroElements.length > 0) {
      animateElementsStaggered(heroElements, 300);
    }
    
    // Navigation animation
    const navbar = querySelector('.navbar');
    if (navbar) {
      addClass(navbar, 'is-loaded');
    }
    
    console.log('Page load animations initialized');
    
  } catch (error) {
    console.error('Error handling page load animations:', error);
  }
}

/* ============================================
   SCROLL-TRIGGERED ANIMATIONS
   ============================================ */

/**
 * Setup scroll-triggered animations for all sections
 */
function setupScrollAnimations() {
  if (!AnimationState.observer) {
    console.warn('Intersection Observer not available, skipping scroll animations');
    return;
  }
  
  try {
    // Experience timeline items
    const timelineItems = querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
      item.dataset.animation = 'slide-up';
      item.dataset.delay = (index * 200).toString();
      AnimationState.observer.observe(item);
    });
    
    // Skills categories
    const skillCategories = querySelectorAll('.skill-category');
    animateElementsStaggered(skillCategories, 0);
    
    // Achievement cards
    const achievementCards = querySelectorAll('.achievement-card');
    animateElementsStaggered(achievementCards, 100);
    
    // Contact methods
    const contactMethods = querySelectorAll('.contact-method');
    animateElementsStaggered(contactMethods, 0);
    
    // Section headers
    const sectionHeaders = querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
      header.dataset.animation = 'fade-in';
      AnimationState.observer.observe(header);
    });
    
    console.log('Scroll animations setup complete');
    
  } catch (error) {
    console.error('Error setting up scroll animations:', error);
  }
}

/* ============================================
   INTERACTIVE ANIMATIONS
   ============================================ */

/**
 * Setup hover and interaction animations
 */
function setupInteractiveAnimations() {
  try {
    // Tech tag hover animations
    const techTags = querySelectorAll('.tech-tag, .skill-tag');
    techTags.forEach(tag => {
      addEventListenerSafe(tag, 'mouseenter', function() {
        if (!AnimationConfig.prefersReducedMotion) {
          this.style.transform = 'translateY(-2px) scale(1.05)';
        }
      });
      
      addEventListenerSafe(tag, 'mouseleave', function() {
        this.style.transform = '';
      });
    });
    
    // Button animations
    const buttons = querySelectorAll('.btn');
    buttons.forEach(button => {
      addEventListenerSafe(button, 'mouseenter', function() {
        if (!AnimationConfig.prefersReducedMotion) {
          addClass(this, 'btn-hover');
        }
      });
      
      addEventListenerSafe(button, 'mouseleave', function() {
        removeClass(this, 'btn-hover');
      });
      
      // Click animation
      addEventListenerSafe(button, 'mousedown', function() {
        if (!AnimationConfig.prefersReducedMotion) {
          addClass(this, 'btn-active');
        }
      });
      
      addEventListenerSafe(button, 'mouseup', function() {
        removeClass(this, 'btn-active');
      });
    });
    
    // Card hover animations are handled via CSS for better performance
    
    console.log('Interactive animations setup complete');
    
  } catch (error) {
    console.error('Error setting up interactive animations:', error);
  }
}

/* ============================================
   TYPING ANIMATION
   ============================================ */

/**
 * Create typing animation effect for text
 * @param {Element} element - Element containing text to animate
 * @param {string} text - Text to type out
 * @param {number} speed - Typing speed in milliseconds per character
 */
function createTypingAnimation(element, text, speed = 100) {
  if (!element || AnimationConfig.prefersReducedMotion) {
    // Skip animation if reduced motion is preferred
    if (element) element.textContent = text;
    return;
  }
  
  try {
    let index = 0;
    element.textContent = '';
    
    const typeWriter = () => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(typeWriter, speed);
      }
    };
    
    typeWriter();
    
  } catch (error) {
    console.error('Error in typing animation:', error);
    if (element) element.textContent = text;
  }
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */

/**
 * Animate number counting up
 * @param {Element} element - Element containing the number
 * @param {number} target - Target number to count to
 * @param {number} duration - Animation duration in milliseconds
 */
function animateCounter(element, target, duration = 2000) {
  if (!element || AnimationConfig.prefersReducedMotion) {
    if (element) element.textContent = target;
    return;
  }
  
  try {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      
      // Format number based on original content
      const formattedNumber = formatCounterNumber(current, element.dataset.format);
      element.textContent = formattedNumber;
      
    }, 16);
    
  } catch (error) {
    console.error('Error in counter animation:', error);
    if (element) element.textContent = target;
  }
}

/**
 * Format counter number based on specified format
 * @param {number} number - Number to format
 * @param {string} format - Format type (percentage, currency, etc.)
 * @returns {string} - Formatted number string
 */
function formatCounterNumber(number, format = 'default') {
  try {
    const roundedNumber = Math.floor(number);
    
    switch (format) {
      case 'percentage':
        return `${roundedNumber}%`;
      case 'currency':
        return `$${roundedNumber.toLocaleString()}`;
      case 'thousands':
        return `${(roundedNumber / 1000).toFixed(0)}K+`;
      default:
        return roundedNumber.toLocaleString();
    }
  } catch (error) {
    console.error('Error formatting counter number:', error);
    return number.toString();
  }
}

/* ============================================
   ANIMATION UTILITIES
   ============================================ */

/**
 * Reset all animations (useful for testing or state changes)
 */
function resetAnimations() {
  try {
    AnimationState.animatedElements.clear();
    
    const animatedElements = querySelectorAll('.is-animated, .is-visible');
    animatedElements.forEach(element => {
      removeClass(element, AnimationConfig.classes.animated);
      removeClass(element, AnimationConfig.classes.visible);
      
      // Remove animation classes
      Object.values(AnimationConfig.classes).forEach(className => {
        removeClass(element, className);
      });
    });
    
    console.log('Animations reset');
    
  } catch (error) {
    console.error('Error resetting animations:', error);
  }
}

/**
 * Pause all animations
 */
function pauseAnimations() {
  try {
    document.body.style.animationPlayState = 'paused';
    document.body.style.transitionDuration = '0s';
    
    console.log('Animations paused');
    
  } catch (error) {
    console.error('Error pausing animations:', error);
  }
}

/**
 * Resume all animations
 */
function resumeAnimations() {
  try {
    document.body.style.animationPlayState = '';
    document.body.style.transitionDuration = '';
    
    console.log('Animations resumed');
    
  } catch (error) {
    console.error('Error resuming animations:', error);
  }
}

/* ============================================
   REDUCED MOTION SUPPORT
   ============================================ */

/**
 * Handle reduced motion preference changes
 */
function setupReducedMotionSupport() {
  try {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleReducedMotionChange = (e) => {
      AnimationConfig.prefersReducedMotion = e.matches;
      
      if (e.matches) {
        console.log('Reduced motion enabled');
        pauseAnimations();
      } else {
        console.log('Reduced motion disabled');
        resumeAnimations();
      }
    };
    
    // Listen for changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleReducedMotionChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleReducedMotionChange);
    }
    
  } catch (error) {
    console.error('Error setting up reduced motion support:', error);
  }
}

/* ============================================
   INITIALIZATION
   ============================================ */

/**
 * Initialize animations module
 */
function initializeAnimations() {
  if (AnimationState.isInitialized) {
    console.warn('Animations already initialized');
    return;
  }
  
  try {
    // Create Intersection Observer
    AnimationState.observer = createIntersectionObserver();
    
    // Setup reduced motion support
    setupReducedMotionSupport();
    
    // Setup different types of animations
    setupScrollAnimations();
    setupInteractiveAnimations();
    
    // Handle page load animations
    handlePageLoadAnimations();
    
    // Mark as initialized
    AnimationState.isInitialized = true;
    
    console.log('Animations module initialized successfully');
    
  } catch (error) {
    console.error('Error initializing animations:', error);
  }
}

/* ============================================
   PUBLIC API
   ============================================ */

/**
 * Public animations API
 */
const Animations = {
  init: initializeAnimations,
  animateElement: animateElement,
  animateStaggered: animateElementsStaggered,
  createTyping: createTypingAnimation,
  animateCounter: animateCounter,
  reset: resetAnimations,
  pause: pauseAnimations,
  resume: resumeAnimations,
  config: AnimationConfig
};

/* ============================================
   AUTO-INITIALIZATION
   ============================================ */

// Initialize animations when DOM is ready
domReady(() => {
  // Wait a bit for other modules to initialize first
  setTimeout(initializeAnimations, 100);
});

// Initialize counter animations when elements become visible
windowReady(() => {
  const counterElements = querySelectorAll('[data-counter]');
  counterElements.forEach(element => {
    const target = parseInt(element.dataset.counter, 10);
    const format = element.dataset.format || 'default';
    
    if (AnimationState.observer) {
      // Observe for intersection
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target, target);
            observer.unobserve(entry.target);
          }
        });
      });
      
      observer.observe(element);
    } else {
      // Fallback without intersection observer
      animateCounter(element, target);
    }
  });
});

// Export for use in other modules if needed
// Uncomment if using ES6 modules
/*
export default Animations;
*/