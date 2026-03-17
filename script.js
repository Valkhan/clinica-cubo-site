/* ============================================================
   CUBO TERAPIAS COMPLETIVAS – script.js
   ============================================================ */

(function () {
  'use strict';

  /* ── Header scroll shadow ── */
  const header = document.getElementById('top')?.closest('.site-header') || document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ── Mobile menu toggle ── */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav    = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close nav on link click
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
        mainNav.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Scroll-reveal animations ── */
  const animatedEls = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window && animatedEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el    = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);

        setTimeout(() => {
          el.classList.add('is-visible');
        }, delay);

        observer.unobserve(el);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show everything immediately
    animatedEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ── Smooth scroll for anchor links (polyfill for Safari) ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = header ? header.offsetHeight : 0;
      const top     = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── FAQ: close others when one opens ── */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('toggle', function () {
      if (this.open) {
        document.querySelectorAll('.faq-item[open]').forEach(other => {
          if (other !== this) other.open = false;
        });
      }
    });
  });

  /* ── Hero cards: staggered entrance on load ── */
  const heroCards = document.querySelectorAll('.hero-card');
  heroCards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transition = 'opacity .5s ease, transform .5s ease';
    setTimeout(() => {
      card.style.opacity = '1';
    }, 600 + i * 120);
  });

  /* ── Center badge entrance ── */
  const badge = document.querySelector('.hero-center-badge');
  if (badge) {
    badge.style.opacity = '0';
    badge.style.transform = 'translate(-50%,-50%) scale(.5)';
    badge.style.transition = 'opacity .6s ease, transform .6s cubic-bezier(.34,1.56,.64,1)';
    setTimeout(() => {
      badge.style.opacity = '1';
      badge.style.transform = 'translate(-50%,-50%) scale(1)';
    }, 400);
  }

  /* ── Active nav link highlight on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

  if (sections.length && navLinks.length) {
    const setActive = () => {
      const scrollY = window.scrollY + (header ? header.offsetHeight + 50 : 100);
      let current = '';
      sections.forEach(section => {
        if (section.offsetTop <= scrollY) {
          current = section.id;
        }
      });
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    };

    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
  }

})();
