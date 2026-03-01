/**
 * The Stationery Hub – script.js
 * Handles: mobile menu, sticky nav shadow, scroll reveal animations
 */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------
     1. MOBILE MENU TOGGLE
  ----------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Create overlay element dynamically
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  /** Opens the mobile navigation drawer */
  function openMenu() {
    hamburger.classList.add('open');
    navLinks.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // prevent background scroll
    hamburger.setAttribute('aria-expanded', 'true');
  }

  /** Closes the mobile navigation drawer */
  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  // Toggle on hamburger click
  hamburger.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close on overlay click
  overlay.addEventListener('click', closeMenu);

  // Close when any nav link is clicked (smooth-scroll to section)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key press
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) closeMenu();
  });


  /* -----------------------------------------------
     2. STICKY HEADER SHADOW ON SCROLL
  ----------------------------------------------- */
  const siteHeader = document.querySelector('.site-header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }, { passive: true });


  /* -----------------------------------------------
     3. SCROLL REVEAL ANIMATION
     Elements with class "reveal" animate in when
     they enter the viewport.
  ----------------------------------------------- */

  // Add "reveal" class to target elements
  const revealTargets = [
    '.product-card',
    '.why-card',
    '.contact-card',
    '.about-stats .stat',
    '.hero-card',
    '.section-header',
    '.about-text',
    '.about-visual',
    '.contact-map',
  ];

  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      // Stagger siblings within the same parent grid/list
      el.style.transitionDelay = `${i * 80}ms`;
    });
  });

  // IntersectionObserver to trigger animation
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once visible, stop observing to save resources
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,       // trigger when 12% of element is visible
      rootMargin: '0px 0px -40px 0px'
    }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  /* -----------------------------------------------
     4. SMOOTH SCROLL FOR ANCHOR LINKS
     (CSS scroll-behavior handles this natively, but
      this provides a JS fallback & offset correction
      to account for the fixed navbar height.)
  ----------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navbarHeight = siteHeader.offsetHeight;
        const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });


  /* -----------------------------------------------
     5. ACTIVE NAV LINK HIGHLIGHTING
     Highlight the nav link corresponding to the
     section currently in view.
  ----------------------------------------------- */
  const sections = document.querySelectorAll('main > section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchors.forEach(a => {
            a.style.color = '';
            if (a.getAttribute('href') === `#${id}`) {
              if (!a.classList.contains('nav-cta')) {
                a.style.color = 'var(--clr-primary)';
              }
            }
          });
        }
      });
    },
    {
      threshold: 0.4
    }
  );

  sections.forEach(section => sectionObserver.observe(section));

}); // end DOMContentLoaded
