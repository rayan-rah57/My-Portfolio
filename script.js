/**
 * MD. RAYAN RAHMAN - CREATIVE PORTFOLIO INTERACTIVITY
 * Phase 1: Core Scaffolding, Initialization & Theme Management
 */

// Establish global namespace
const PortfolioApp = {
  // Application Constants & Configuration
  config: {
    typingSpeed: 100,
    typingDelay: 2000,
    particleCount: 60
  },

  // Initialize all modular elements
  init() {
    console.log("🚀 Portfolio design system and core JavaScript scaffold initialized.");
    
    // Core foundational features
    this.theme.init();
    this.mobileMenu.init();
    this.scrollEffects.init();
  },

  // ==========================================================================
  // 1. Theme Management (Dark/Light Mode)
  // ==========================================================================
  theme: {
    init() {
      const savedTheme = localStorage.getItem('portfolio-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Determine initial theme
      let initialTheme = 'dark';
      if (savedTheme) {
        initialTheme = savedTheme;
      } else if (!prefersDark) {
        initialTheme = 'light';
      }
      
      // Apply theme
      this.applyTheme(initialTheme);
      
      // Wire up toggle buttons if they exist in later phases
      document.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('#theme-toggle');
        if (toggleBtn) {
          this.toggle();
        }
      });
    },

    applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('portfolio-theme', theme);
      
      // Emit a custom event for other modules (like canvas background) to respond to
      const event = new CustomEvent('themechanged', { detail: { theme } });
      window.dispatchEvent(event);
      
      // Update theme toggle icon status
      this.updateIcon(theme);
    },

    toggle() {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      this.applyTheme(newTheme);
    },

    updateIcon(theme) {
      const icon = document.querySelector('#theme-toggle i');
      if (!icon) return;
      
      if (theme === 'light') {
        icon.className = 'fas fa-moon';
      } else {
        icon.className = 'fas fa-sun';
      }
    }
  },

  // ==========================================================================
  // 2. Navigation & Mobile Menu Stubs
  // ==========================================================================
  mobileMenu: {
    init() {
      // Stub for hamburger toggle interaction
      document.addEventListener('click', (e) => {
        const menuBtn = e.target.closest('#menu-toggle');
        if (menuBtn) {
          document.body.classList.toggle('nav-open');
          const isExpanded = document.body.classList.contains('nav-open');
          menuBtn.setAttribute('aria-expanded', isExpanded);
        }
        
        // Close menu when clicking a nav link
        const navLink = e.target.closest('.nav-link');
        if (navLink && document.body.classList.contains('nav-open')) {
          document.body.classList.remove('nav-open');
          const menuBtn = document.querySelector('#menu-toggle');
          if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }
  },

  // ==========================================================================
  // 3. Scroll Interactions Stubs
  // ==========================================================================
  scrollEffects: {
    init() {
      // Throttle/Debounce utility for performance
      let scrollTimeout;
      window.addEventListener('scroll', () => {
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(() => {
          this.handleScroll();
          scrollTimeout = null;
        }, 10);
      }, { passive: true });
    },

    handleScroll() {
      const navbar = document.querySelector('#navbar');
      const scrollTopBtn = document.querySelector('#scroll-top-btn');
      const scrollPosition = window.scrollY;

      // Sticky Navbar background add/remove
      if (navbar) {
        if (scrollPosition > 80) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }

      // Back to top button visibility
      if (scrollTopBtn) {
        if (scrollPosition > 400) {
          scrollTopBtn.classList.add('visible');
        } else {
          scrollTopBtn.classList.remove('visible');
        }
      }
    }
  }
};

// Start application when DOM is fully prepared
document.addEventListener('DOMContentLoaded', () => {
  PortfolioApp.init();
});
