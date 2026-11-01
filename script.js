/**
 * GOPI SETIAWAN SIHOMBING — PERSONAL BRANDING WEBSITE
 * Final Optimized Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. DOM Elements
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const backToTopBtn = document.getElementById('backToTop');
  const heroPhoto = document.getElementById('heroPhoto');
  const photoFrame = document.querySelector('.photo-card-frame');
  const copyrightYearEl = document.getElementById('copyrightYear');

  // Dynamic copyright year
  if (copyrightYearEl) {
    copyrightYearEl.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     3. STICKY HEADER & BACK TO TOP BUTTON
     -------------------------------------------------------------------------- */
  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;

    // Header styling on scroll
    if (scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top visibility
    if (scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. MOBILE NAVIGATION DRAWER
     -------------------------------------------------------------------------- */
  const toggleMobileMenu = (open) => {
    const shouldOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
    if (shouldOpen) {
      mobileDrawer.classList.add('open');
      mobileToggle.classList.add('active');
      mobileToggle.setAttribute('aria-expanded', 'true');
    } else {
      mobileDrawer.classList.remove('open');
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  // Close mobile drawer when clicking a mobile navigation link
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer-cta a');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(false);
    });
  });

  // Close mobile drawer when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileDrawer && mobileDrawer.classList.contains('open')) {
      if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
        toggleMobileMenu(false);
      }
    }
  });

  /* --------------------------------------------------------------------------
     5. ACTIVE SECTION HIGHLIGHT ON SCROLL
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  
  const updateActiveNav = () => {
    const scrollY = window.scrollY + 140; // Offset for header

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* --------------------------------------------------------------------------
     6. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is unsupported
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  /* --------------------------------------------------------------------------
     7. ANIMATED KPI COUNTER
     -------------------------------------------------------------------------- */
  const kpiFigures = document.querySelectorAll('.kpi-figure[data-target]');

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1500; // ms
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeProgress * target);

      el.textContent = `${prefix}${currentVal}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = `${prefix}${target}${suffix}`;
      }
    };

    requestAnimationFrame(updateCount);
  };

  if ('IntersectionObserver' in window && kpiFigures.length > 0) {
    let kpiAnimated = false;
    const kpiSection = document.getElementById('highlights');

    if (kpiSection) {
      const kpiObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !kpiAnimated) {
            kpiFigures.forEach(fig => animateCounter(fig));
            kpiAnimated = true;
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.25 });

      kpiObserver.observe(kpiSection);
    }
  }

  /* --------------------------------------------------------------------------
     8. PROFILE PHOTO VALIDATION & FALLBACK HANDLING
     -------------------------------------------------------------------------- */
  if (heroPhoto && photoFrame) {
    heroPhoto.addEventListener('error', () => {
      photoFrame.classList.add('photo-not-found');
    });

    heroPhoto.addEventListener('load', () => {
      if (heroPhoto.naturalWidth > 0) {
        photoFrame.classList.remove('photo-not-found');
      }
    });

    if (heroPhoto.complete) {
      if (heroPhoto.naturalWidth === 0) {
        photoFrame.classList.add('photo-not-found');
      } else {
        photoFrame.classList.remove('photo-not-found');
      }
    }
  }

  /* --------------------------------------------------------------------------
     9. ESCAPE KEY TO CLOSE MOBILE DRAWER
     -------------------------------------------------------------------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleMobileMenu(false);
    }
  });
});
