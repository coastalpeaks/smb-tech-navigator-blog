/**
 * Personal Brand Interactive Features
 * 
 * Enhanced JavaScript for James Liu's personal brand website
 * Focus: Authentic engagement, student-friendly interactions, search functionality
 */

(function() {
    'use strict';

    // ============================================
    // ANALYTICS AND TRACKING (Student-Focused)
    // ============================================

    const PersonalAnalytics = {
        // Track organic engagement patterns
        trackEngagement: function(action, content = '', isStudent = false) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'engagement', {
                    event_category: 'personal_brand',
                    event_label: action,
                    custom_content: content,
                    custom_user_type: isStudent ? 'student' : 'visitor'
                });
            }
        },

        // Track content interest
        trackContentInterest: function(contentType, contentTitle) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'content_interest', {
                    event_category: 'content',
                    event_label: contentType,
                    custom_title: contentTitle
                });
            }
        },

        // Track mentorship inquiries
        trackMentorshipInterest: function(inquiryType, isStudent = false) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'mentorship_interest', {
                    event_category: 'mentorship',
                    event_label: inquiryType,
                    custom_user_type: isStudent ? 'student' : 'professional'
                });
            }
        },

        // Track search behavior
        trackSearch: function(query, results = 0) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'search', {
                    event_category: 'content_discovery',
                    event_label: query,
                    custom_results: results
                });
            }
        }
    };

    // ============================================
    // STUDENT EMAIL DETECTION (Enhanced)
    // ============================================

    function isEducationalEmail(email) {
        const eduDomains = [
            '.edu', '.edu.au', '.edu.sg', '.edu.my', '.ac.uk', '.ac.nz', '.ac.za',
            '.university', '.college', '.school'
        ];
        
        const universityDomains = [
            'student.', 'students.', 'alumni.', 'uw.edu', 'washington.edu', 
            'u.washington.edu', 'mit.edu', 'stanford.edu', 'harvard.edu',
            'berkeley.edu', 'columbia.edu', 'cornell.edu', 'princeton.edu',
            'yale.edu', 'bu.edu', 'northeastern.edu', 'seattle.edu',
            'seattleu.edu', 'spu.edu', 'uwb.edu', 'uw.edu'
        ];

        const emailLower = email.toLowerCase();
        
        const hasEduDomain = eduDomains.some(domain => emailLower.includes(domain));
        const hasUniversityDomain = universityDomains.some(domain => emailLower.includes(domain));
        
        return hasEduDomain || hasUniversityDomain;
    }

    function showStudentWelcome(email) {
        // Remove existing welcome if present
        const existingWelcome = document.querySelector('.student-welcome');
        if (existingWelcome) {
            existingWelcome.remove();
        }

        const welcome = document.createElement('div');
        welcome.className = 'student-welcome';
        welcome.innerHTML = `
            <div class="welcome-content">
                <div class="welcome-icon">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <div class="welcome-text">
                    <h4>🎓 Hey there, student!</h4>
                    <p>Great to meet you! I love connecting with students who are passionate about AI and product development. 
                    <strong>Your consultation is always free</strong> - let's chat about your journey and goals!</p>
                </div>
                <button class="welcome-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add welcome styles
        const style = document.createElement('style');
        style.textContent = `
            .student-welcome {
                position: fixed;
                top: 80px;
                right: 20px;
                background: linear-gradient(135deg, var(--color-student), var(--color-accent));
                color: white;
                padding: var(--space-4);
                border-radius: var(--radius-xl);
                box-shadow: var(--shadow-2xl);
                z-index: var(--z-index-toast);
                max-width: 380px;
                animation: slideInRight 0.6s ease-out;
            }
            
            .welcome-content {
                display: flex;
                align-items: flex-start;
                gap: var(--space-3);
            }
            
            .welcome-icon {
                font-size: var(--font-size-2xl);
                margin-top: var(--space-1);
                color: #fbbf24;
            }
            
            .welcome-text h4 {
                margin: 0 0 var(--space-2) 0;
                font-size: var(--font-size-lg);
                font-weight: var(--font-weight-semibold);
            }
            
            .welcome-text p {
                margin: 0;
                font-size: var(--font-size-sm);
                line-height: var(--line-height-relaxed);
            }
            
            .welcome-close {
                background: none;
                border: none;
                color: white;
                font-size: var(--font-size-lg);
                cursor: pointer;
                padding: var(--space-1);
                margin-left: auto;
                margin-top: -var(--space-1);
                border-radius: var(--radius-base);
                transition: background var(--duration-base);
            }
            
            .welcome-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(welcome);

        // Track student detection
        PersonalAnalytics.trackMentorshipInterest('student_welcome_shown', true);

        // Auto-remove after 15 seconds
        setTimeout(() => {
            if (welcome.parentElement) {
                welcome.style.animation = 'slideInRight 0.4s ease-in reverse';
                setTimeout(() => welcome.remove(), 400);
            }
        }, 15000);
    }

    // ============================================
    // SEARCH FUNCTIONALITY
    // ============================================

    function initializeSearch() {
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');
        
        if (!searchInput || !searchBtn) return;

        // Search data (in a real implementation, this would come from a CMS or search API)
        const searchData = [
            {
                title: 'The AI Reality Gap: Why Most AI Projects Fail',
                type: 'insight',
                category: 'ai-strategy',
                excerpt: 'After implementing AI systems at scale, I\'ve seen the same patterns emerge...',
                url: 'blog/ai-reality-gap.html',
                keywords: ['ai', 'implementation', 'product', 'strategy', 'failure', 'reality']
            },
            {
                title: 'Mentoring the AI Generation',
                type: 'insight',
                category: 'mentorship',
                excerpt: 'Students often ask me: How do I break into AI?',
                url: 'blog/mentoring-ai-generation.html',
                keywords: ['mentorship', 'students', 'career', 'ai', 'advice']
            },
            {
                title: 'Product Management in the AI Era',
                type: 'insight',
                category: 'product',
                excerpt: 'AI isn\'t just another feature to ship...',
                url: 'blog/product-ai-integration.html',
                keywords: ['product management', 'ai', 'features', 'strategy']
            },
            {
                title: 'My Story - AI Innovation Meets Business Reality',
                type: 'page',
                category: 'about',
                excerpt: 'Understanding both the technical complexities and business realities of AI implementation',
                url: '#story',
                keywords: ['story', 'background', 'experience', 'ai', 'business']
            },
            {
                title: 'Student Mentorship Program',
                type: 'page',
                category: 'mentorship',
                excerpt: 'Free consultations and career guidance for university students',
                url: '#mentorship',
                keywords: ['students', 'mentorship', 'free', 'consultation', 'career']
            }
        ];

        let searchTimeout;

        function performSearch(query) {
            if (!query || query.length < 2) {
                hideSearchResults();
                return;
            }

            const queryLower = query.toLowerCase();
            const results = searchData.filter(item => {
                return item.title.toLowerCase().includes(queryLower) ||
                       item.excerpt.toLowerCase().includes(queryLower) ||
                       item.keywords.some(keyword => keyword.toLowerCase().includes(queryLower));
            });

            showSearchResults(results, query);
            PersonalAnalytics.trackSearch(query, results.length);
        }

        function showSearchResults(results, query) {
            // Remove existing results
            const existingResults = document.querySelector('.search-results');
            if (existingResults) {
                existingResults.remove();
            }

            if (results.length === 0) {
                showNoResults(query);
                return;
            }

            const resultsContainer = document.createElement('div');
            resultsContainer.className = 'search-results';
            resultsContainer.innerHTML = `
                <div class="search-results-header">
                    <h4>Search Results for "${query}"</h4>
                    <button class="close-search">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="search-results-list">
                    ${results.map(result => `
                        <a href="${result.url}" class="search-result-item" data-type="${result.type}">
                            <div class="result-content">
                                <h5>${highlightQuery(result.title, query)}</h5>
                                <p>${highlightQuery(result.excerpt, query)}</p>
                                <span class="result-category">${result.category}</span>
                            </div>
                        </a>
                    `).join('')}
                </div>
            `;

            // Position results below search
            const navSearch = document.querySelector('.nav-search');
            navSearch.appendChild(resultsContainer);

            // Add close functionality
            resultsContainer.querySelector('.close-search').addEventListener('click', hideSearchResults);
            
            // Track result clicks
            resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    PersonalAnalytics.trackContentInterest('search_result', item.querySelector('h5').textContent);
                    hideSearchResults();
                });
            });

            // Add search results styles
            addSearchStyles();
        }

        function showNoResults(query) {
            const resultsContainer = document.createElement('div');
            resultsContainer.className = 'search-results';
            resultsContainer.innerHTML = `
                <div class="search-results-header">
                    <h4>No results for "${query}"</h4>
                    <button class="close-search">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="no-results">
                    <p>Try searching for:</p>
                    <div class="search-suggestions">
                        <button class="suggestion-btn" data-query="AI strategy">AI strategy</button>
                        <button class="suggestion-btn" data-query="mentorship">mentorship</button>
                        <button class="suggestion-btn" data-query="students">students</button>
                        <button class="suggestion-btn" data-query="product management">product management</button>
                    </div>
                </div>
            `;

            const navSearch = document.querySelector('.nav-search');
            navSearch.appendChild(resultsContainer);

            resultsContainer.querySelector('.close-search').addEventListener('click', hideSearchResults);
            resultsContainer.querySelectorAll('.suggestion-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const newQuery = btn.dataset.query;
                    searchInput.value = newQuery;
                    performSearch(newQuery);
                });
            });

            addSearchStyles();
        }

        function highlightQuery(text, query) {
            const regex = new RegExp(`(${query})`, 'gi');
            return text.replace(regex, '<mark>$1</mark>');
        }

        function hideSearchResults() {
            const results = document.querySelector('.search-results');
            if (results) {
                results.remove();
            }
        }

        function addSearchStyles() {
            if (document.querySelector('#search-styles')) return;

            const style = document.createElement('style');
            style.id = 'search-styles';
            style.textContent = `
                .search-results {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: var(--color-white);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-xl);
                    border: 1px solid var(--border-light);
                    max-height: 400px;
                    overflow-y: auto;
                    z-index: var(--z-index-dropdown);
                    margin-top: var(--space-2);
                }
                
                .search-results-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-3) var(--space-4);
                    border-bottom: 1px solid var(--border-light);
                    background: var(--color-gray-50);
                }
                
                .search-results-header h4 {
                    margin: 0;
                    font-size: var(--font-size-base);
                    color: var(--text-primary);
                }
                
                .close-search {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: var(--space-1);
                    border-radius: var(--radius-base);
                    transition: var(--transition-colors);
                }
                
                .close-search:hover {
                    background: var(--color-gray-200);
                    color: var(--text-primary);
                }
                
                .search-result-item {
                    display: block;
                    padding: var(--space-3) var(--space-4);
                    text-decoration: none;
                    border-bottom: 1px solid var(--border-light);
                    transition: var(--transition-colors);
                }
                
                .search-result-item:hover {
                    background: var(--color-gray-50);
                }
                
                .search-result-item:last-child {
                    border-bottom: none;
                }
                
                .result-content h5 {
                    margin: 0 0 var(--space-1) 0;
                    font-size: var(--font-size-base);
                    color: var(--text-primary);
                    font-weight: var(--font-weight-medium);
                }
                
                .result-content p {
                    margin: 0 0 var(--space-2) 0;
                    font-size: var(--font-size-sm);
                    color: var(--text-secondary);
                    line-height: var(--line-height-relaxed);
                }
                
                .result-category {
                    background: var(--color-primary);
                    color: var(--color-white);
                    padding: var(--space-1) var(--space-2);
                    border-radius: var(--radius-base);
                    font-size: var(--font-size-xs);
                    font-weight: var(--font-weight-medium);
                    text-transform: capitalize;
                }
                
                .no-results {
                    padding: var(--space-4);
                    text-align: center;
                }
                
                .search-suggestions {
                    display: flex;
                    gap: var(--space-2);
                    justify-content: center;
                    flex-wrap: wrap;
                    margin-top: var(--space-3);
                }
                
                .suggestion-btn {
                    background: var(--color-gray-100);
                    border: none;
                    padding: var(--space-1) var(--space-3);
                    border-radius: var(--radius-full);
                    font-size: var(--font-size-sm);
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: var(--transition-colors);
                }
                
                .suggestion-btn:hover {
                    background: var(--color-primary);
                    color: var(--color-white);
                }
                
                mark {
                    background: var(--color-secondary-light);
                    color: var(--color-secondary-dark);
                    padding: 0 2px;
                    border-radius: 2px;
                }
            `;

            document.head.appendChild(style);
        }

        // Event listeners
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(this.value.trim());
            }, 300);
        });

        searchBtn.addEventListener('click', function() {
            performSearch(searchInput.value.trim());
        });

        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value.trim());
            }
            if (e.key === 'Escape') {
                hideSearchResults();
            }
        });

        // Close search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-search')) {
                hideSearchResults();
            }
        });
    }

    // ============================================
    // CONTENT FILTERING
    // ============================================

    function initializeContentFilter() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const insightCards = document.querySelectorAll('.insight-card');
        
        if (filterBtns.length === 0) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;
                
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter content
                insightCards.forEach(card => {
                    const category = card.dataset.category;
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeInUp 0.4s ease-out';
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                // Track filter usage
                PersonalAnalytics.trackEngagement('content_filter', filter);
            });
        });
    }

    // ============================================
    // FORM ENHANCEMENTS
    // ============================================

    function initializeForms() {
        // Newsletter form
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = this.querySelector('input[type="email"]').value;
                const isStudent = isEducationalEmail(email);
                
                PersonalAnalytics.trackEngagement('newsletter_signup', email, isStudent);
                
                showFormSuccess('Thanks for subscribing! You\'ll receive weekly insights on AI, product strategy, and career growth.');
                this.reset();
            });
        }

        // Connect form with enhanced student detection
        const connectForm = document.getElementById('connect-form');
        if (connectForm) {
            const emailInput = connectForm.querySelector('input[type="email"]');
            
            emailInput?.addEventListener('input', function() {
                const email = this.value.trim();
                
                if (email && isEducationalEmail(email)) {
                    showStudentWelcome(email);
                }
            });

            connectForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                const email = formData.get('email') || emailInput?.value;
                const isStudent = isEducationalEmail(email);
                
                PersonalAnalytics.trackMentorshipInterest('contact_form', isStudent);
                
                const message = isStudent 
                    ? "Thanks for reaching out! I prioritize student inquiries - expect to hear back within 24 hours. Can't wait to chat about your AI journey!"
                    : "Thanks for reaching out! I'll get back to you within 48 hours. Looking forward to our conversation!";
                
                showFormSuccess(message);
                this.reset();
            });
        }
    }

    function showFormSuccess(message) {
        const successElement = document.createElement('div');
        successElement.className = 'form-success-modal';
        successElement.innerHTML = `
            <div class="success-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h4>Message Sent!</h4>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="this.closest('.form-success-modal').remove()">
                    Got it!
                </button>
            </div>
        `;

        // Add success modal styles
        const style = document.createElement('style');
        style.textContent = `
            .form-success-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: var(--z-index-modal);
                animation: fadeIn 0.3s ease-out;
            }
            
            .success-content {
                background: white;
                padding: var(--space-8);
                border-radius: var(--radius-2xl);
                box-shadow: var(--shadow-2xl);
                text-align: center;
                max-width: 400px;
                margin: var(--space-4);
                animation: slideInUp 0.3s ease-out;
            }
            
            .success-icon {
                font-size: var(--font-size-4xl);
                color: var(--color-accent);
                margin-bottom: var(--space-4);
            }
            
            .success-content h4 {
                color: var(--text-primary);
                margin-bottom: var(--space-4);
            }
            
            .success-content p {
                color: var(--text-secondary);
                line-height: var(--line-height-relaxed);
                margin-bottom: var(--space-6);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(successElement);

        // Remove modal after 5 seconds
        setTimeout(() => {
            if (successElement.parentElement) {
                successElement.style.animation = 'fadeIn 0.3s ease-in reverse';
                setTimeout(() => successElement.remove(), 300);
            }
        }, 5000);
    }

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================

    function initializeScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Track section views for engagement
                    const sectionId = entry.target.closest('section')?.id;
                    if (sectionId) {
                        PersonalAnalytics.trackEngagement('section_view', sectionId);
                    }
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll(`
            .expertise-item, .value-item, .opportunity-card, 
            .story-card, .insight-card, .timeline-item
        `).forEach(el => {
            el.classList.add('scroll-reveal');
            observer.observe(el);
        });
    }

    // ============================================
    // ENGAGEMENT TRACKING
    // ============================================

    function initializeEngagementTracking() {
        // Track time spent on page sections
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    if (sectionId) {
                        PersonalAnalytics.trackEngagement('section_enter', sectionId);
                    }
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('section[id]').forEach(section => {
            sectionObserver.observe(section);
        });

        // Track insight clicks
        document.querySelectorAll('.insight-card a').forEach(link => {
            link.addEventListener('click', function() {
                const title = this.textContent.trim();
                PersonalAnalytics.trackContentInterest('insight_click', title);
            });
        });

        // Track opportunity card interactions
        document.querySelectorAll('.opportunity-card').forEach(card => {
            card.addEventListener('click', function() {
                const title = this.querySelector('h4')?.textContent || 'unknown';
                PersonalAnalytics.trackMentorshipInterest('opportunity_click');
            });
        });

        // Track calendly clicks
        document.querySelectorAll('a[href*="calendly"]').forEach(link => {
            link.addEventListener('click', function() {
                PersonalAnalytics.trackMentorshipInterest('calendly_click');
            });
        });
    }

    // ============================================
    // EMAIL CONTACT HANDLING
    // ============================================

    function initializeEmailContacts() {
        document.querySelectorAll('.email-contact').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const user = this.dataset.user;
                const domain = this.dataset.domain;
                const email = `${user}@${domain}`;
                
                window.location.href = `mailto:${email}?subject=Hello from your website!`;
                PersonalAnalytics.trackEngagement('email_contact');
            });
        });
    }

    // ============================================
    // SMOOTH SCROLLING
    // ============================================

    function initializeSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.navbar')?.offsetHeight || 80;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    PersonalAnalytics.trackEngagement('navigation', targetId);
                }
            });
        });
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    function initialize() {
        // Track initial page view
        PersonalAnalytics.trackEngagement('page_load', window.location.pathname);
        
        // Initialize all features
        initializeSearch();
        initializeContentFilter();
        initializeForms();
        initializeScrollAnimations();
        initializeEngagementTracking();
        initializeEmailContacts();
        initializeSmoothScrolling();
        
        // Update current year
        document.querySelectorAll('.current-year').forEach(el => {
            el.textContent = new Date().getFullYear();
        });
        
        console.log('🎯 Personal brand website initialized successfully!');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Expose analytics for external use
    window.PersonalAnalytics = PersonalAnalytics;

})();