/**
 * MD. RAYAN RAHMAN - CREATIVE PORTFOLIO INTERACTIVITY ENGINE
 * Phase 4: Complete Javascript Core & Visual Animations
 */

const PortfolioApp = {
  // Global Interactivity Settings
  config: {
    typingSpeed: 80,
    typingDelay: 2500,
    particleCount: 65
  },

  // Central Entry Initialization
  init() {
    console.log("🚀 Custom Interactivity Engine fully loaded for Md. Rayan Rahman.");
    
    this.theme.init();
    this.particles.init();
    this.typingText.init();
    this.mobileMenu.init();
    this.scrollSpy.init();
    this.skills.init();
    this.projectFilter.init();
    this.scrollTop.init();
  },

  // ==========================================================================
  // 1. DYNAMIC COLOR THEME CONTROLLER
  // ==========================================================================
  theme: {
    init() {
      const savedTheme = localStorage.getItem('portfolio-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Select appropriate theme
      let initialTheme = 'dark';
      if (savedTheme) {
        initialTheme = savedTheme;
      } else if (!prefersDark) {
        initialTheme = 'light';
      }
      
      this.applyTheme(initialTheme);

      // Bind theme toggler clicks
      const toggleBtn = document.getElementById('theme-toggle');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => this.toggle());
      }
    },

    applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('portfolio-theme', theme);
      
      // Emit color update event for custom canvas particles to shift colors
      const themeEvent = new CustomEvent('themechanged', { detail: { theme } });
      window.dispatchEvent(themeEvent);
      
      this.updateIcon(theme);
    },

    toggle() {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
      this.applyTheme(targetTheme);
    },

    updateIcon(theme) {
      const icon = document.querySelector('#theme-toggle i');
      if (!icon) return;
      
      // Update toggle visual iconography
      if (theme === 'light') {
        icon.className = 'fas fa-moon';
      } else {
        icon.className = 'fas fa-sun';
      }
    }
  },

  // ==========================================================================
  // 2. MATHEMATICAL CANVAS PARTICLES BACKDROP
  // ==========================================================================
  particles: {
    canvas: null,
    ctx: null,
    list: [],
    mouse: { x: null, y: null, targetX: null, targetY: null },
    // Palette configurations linked directly to design system themes
    themeColors: {
      dark: {
        dot: 'rgba(124, 109, 250, 0.35)', 
        line: 'rgba(124, 109, 250, 0.07)'
      },
      light: {
        dot: 'rgba(90, 79, 207, 0.25)', 
        line: 'rgba(90, 79, 207, 0.05)'
      }
    },
    currentColor: null,
    animationId: null,

    init() {
      this.canvas = document.getElementById('particle-canvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');

      // Check user system motion constraints (Respect Accessibility)
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        this.canvas.style.display = 'none';
        return;
      }

      this.resize();
      
      // Establish default colors matching current body attribute
      const initialTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      this.currentColor = this.themeColors[initialTheme];

      // Dynamic color updating on theme shifts
      window.addEventListener('themechanged', (e) => {
        this.currentColor = this.themeColors[e.detail.theme];
      });

      // Window resize and mouse parallax triggers
      window.addEventListener('resize', () => this.resize());
      
      const heroSec = document.getElementById('hero');
      if (heroSec) {
        heroSec.addEventListener('mousemove', (e) => {
          const rect = this.canvas.getBoundingClientRect();
          this.mouse.targetX = e.clientX - rect.left;
          this.mouse.targetY = e.clientY - rect.top;
        });

        heroSec.addEventListener('mouseleave', () => {
          this.mouse.targetX = null;
          this.mouse.targetY = null;
        });
      }

      this.setupParticles();
      this.animate();
    },

    resize() {
      if (!this.canvas) return;
      this.canvas.width = this.canvas.parentElement.offsetWidth;
      this.canvas.height = this.canvas.parentElement.offsetHeight;
      this.setupParticles();
    },

    setupParticles() {
      this.list = [];
      const count = PortfolioApp.config.particleCount;
      for (let i = 0; i < count; i++) {
        this.list.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 2 + 1
        });
      }
    },

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Interpolate mouse parallax coordinates smoothly
      if (this.mouse.targetX !== null) {
        if (this.mouse.x === null) {
          this.mouse.x = this.mouse.targetX;
          this.mouse.y = this.mouse.targetY;
        } else {
          this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
          this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;
        }
      } else {
        this.mouse.x = null;
        this.mouse.y = null;
      }

      const connectionDistance = 115;
      
      // Cycle and update dots
      for (let i = 0; i < this.list.length; i++) {
        const p = this.list[i];
        
        let dispX = p.x;
        let dispY = p.y;

        // Apply mouse gravitation forces
        if (this.mouse.x !== null) {
          const dx = this.mouse.x - p.x;
          const dy = this.mouse.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 200) {
            const pullForce = (200 - distance) / 200;
            dispX -= (dx / distance) * pullForce * 12;
            dispY -= (dy / distance) * pullForce * 12;
          }
        }

        // Draw dot
        this.ctx.fillStyle = this.currentColor.dot;
        this.ctx.beginPath();
        this.ctx.arc(dispX, dispY, p.size, 0, Math.PI * 2);
        this.ctx.fill();

        // Increment trajectories
        p.x += p.vx;
        p.y += p.vy;

        // Handle canvas edges collision bounce
        if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

        // Draw connection lines to neighboring dots
        for (let j = i + 1; j < this.list.length; j++) {
          const p2 = this.list[j];
          
          let p2DispX = p2.x;
          let p2DispY = p2.y;

          if (this.mouse.x !== null) {
            const dx = this.mouse.x - p2.x;
            const dy = this.mouse.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 200) {
              const pullForce = (200 - distance) / 200;
              p2DispX -= (dx / distance) * pullForce * 12;
              p2DispY -= (dy / distance) * pullForce * 12;
            }
          }

          const dx = dispX - p2DispX;
          const dy = dispY - p2DispY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const strength = (connectionDistance - dist) / connectionDistance;
            this.ctx.strokeStyle = this.currentColor.line;
            this.ctx.lineWidth = strength * 0.75;
            this.ctx.beginPath();
            this.ctx.moveTo(dispX, dispY);
            this.ctx.lineTo(p2DispX, p2DispY);
            this.ctx.stroke();
          }
        }
      }
      
      this.animationId = requestAnimationFrame(() => this.animate());
    }
  },

  // ==========================================================================
  // 3. TAGLINE TYPEWRITER EFFECT
  // ==========================================================================
  typingText: {
    words: ["Creative Developer", "UI Designer", "Problem Solver"],
    wordIndex: 0,
    charIndex: 0,
    isDeleting: false,
    timer: null,

    init() {
      const element = document.getElementById('typing-text');
      if (!element) return;
      this.type(element);
    },

    type(target) {
      const fullWord = this.words[this.wordIndex];
      
      if (this.isDeleting) {
        target.textContent = fullWord.substring(0, this.charIndex - 1);
        this.charIndex--;
      } else {
        target.textContent = fullWord.substring(0, this.charIndex + 1);
        this.charIndex++;
      }

      let speed = PortfolioApp.config.typingSpeed;
      if (this.isDeleting) speed /= 2;

      // Handle pause states at string endpoints
      if (!this.isDeleting && this.charIndex === fullWord.length) {
        speed = PortfolioApp.config.typingDelay;
        this.isDeleting = true;
      } else if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.wordIndex = (this.wordIndex + 1) % this.words.length;
        speed = 450;
      }

      this.timer = setTimeout(() => this.type(target), speed);
    }
  },

  // ==========================================================================
  // 4. MOBILE DRAWER INTERACTIVITY
  // ==========================================================================
  mobileMenu: {
    init() {
      const menuBtn = document.getElementById('menu-toggle');
      const drawer = document.getElementById('mobile-drawer');
      if (!menuBtn || !drawer) return;

      // Toggle drawer on button press
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.body.classList.toggle('nav-open');
        const isOpen = document.body.classList.contains('nav-open');
        menuBtn.setAttribute('aria-expanded', isOpen);
      });

      // Close menu on navigation link clicks
      const navLinks = document.querySelectorAll('.drawer-link');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          document.body.classList.remove('nav-open');
          menuBtn.setAttribute('aria-expanded', 'false');
        });
      });

      // Close drawer when clicking outside the panel
      document.addEventListener('click', (e) => {
        if (document.body.classList.contains('nav-open') && 
            !e.target.closest('#mobile-drawer') && 
            !e.target.closest('#menu-toggle')) {
          document.body.classList.remove('nav-open');
          menuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }
  },

  // ==========================================================================
  // 5. THROTTLED STICKY HEADER & SCROLL SPY
  // ==========================================================================
  scrollSpy: {
    init() {
      const navbar = document.getElementById('navbar');
      const scrollTopBtn = document.getElementById('scroll-top-btn');
      
      // Throttling scroll hooks for optimal frame rates
      let scrollTimer = null;
      window.addEventListener('scroll', () => {
        if (scrollTimer !== null) return;
        
        scrollTimer = setTimeout(() => {
          const scrollPos = window.scrollY;

          // Toggle navbar scrolled visual states
          if (navbar) {
            if (scrollPos > 70) {
              navbar.classList.add('scrolled');
            } else {
              navbar.classList.remove('scrolled');
            }
          }

          // Toggle Floating scroll-top button visibility
          if (scrollTopBtn) {
            if (scrollPos > 400) {
              scrollTopBtn.classList.add('visible');
            } else {
              scrollTopBtn.classList.remove('visible');
            }
          }

          scrollTimer = null;
        }, 15);
      }, { passive: true });

      // IntersectionObserver for active section highlights in navbar
      const sections = document.querySelectorAll('section[id]');
      const navLinks = document.querySelectorAll('.nav-link');
      
      const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');
            
            navLinks.forEach(link => {
              const href = link.getAttribute('href');
              if (href === `#${sectionId}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      }, {
        root: null,
        rootMargin: '-30% 0px -50% 0px', // Target active reading viewport coordinates
        threshold: 0.1
      });

      sections.forEach(section => spyObserver.observe(section));
    }
  },

  // ==========================================================================
  // 6. SCROLL TRIGGERED PROGRESS BARS
  // ==========================================================================
  skills: {
    init() {
      const fills = document.querySelectorAll('.progress-bar-fill');
      if (!fills.length) return;

      const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const fill = entry.target;
            const targetWidth = fill.getAttribute('data-width');
            
            // Set element width triggering the CSS transition
            fill.style.width = targetWidth;
            
            // Unobserve to run animation only once on scroll entry
            skillObserver.unobserve(fill);
          }
        });
      }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });

      fills.forEach(fill => skillObserver.observe(fill));
    }
  },

  // ==========================================================================
  // 7. RESPONSIVE PROJECT CLASSIFIER (FILTER ENGINE)
  // ==========================================================================
  projectFilter: {
    init() {
      const buttons = document.querySelectorAll('.filter-btn');
      const cards = document.querySelectorAll('.project-card');
      if (!buttons.length || !cards.length) return;

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          // Toggle active visual states
          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const categoryFilter = btn.getAttribute('data-filter');

          cards.forEach(card => {
            const categories = card.getAttribute('data-category').split(' ');

            // Apply quick fade-out scale transition
            card.style.opacity = '0';
            card.style.transform = 'scale(0.94)';

            setTimeout(() => {
              if (categoryFilter === 'all' || categories.includes(categoryFilter)) {
                card.style.display = 'flex';
                // Trigger reflow to guarantee entry animation plays
                card.offsetHeight;
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
              } else {
                card.style.display = 'none';
              }
            }, 250); // Matches stylesheet transition timing
          });
        });
      });
    }
  },

  // ==========================================================================
  // 8. SCROLL BACK TO TOP CONTROL
  // ==========================================================================
  scrollTop: {
    init() {
      const btn = document.getElementById('scroll-top-btn');
      if (!btn) return;

      btn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }
};

// Start Interactive Core when HTML is fully parsed
document.addEventListener('DOMContentLoaded', () => {
  PortfolioApp.init();
});
