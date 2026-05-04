/* ============================================================
   PAGE LOADING ANIMATION
   ============================================================ */
(function initLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (!overlay) return;

  function dismissLoader() {
    overlay.classList.add('fade-out');
    document.body.classList.add('page-loaded');

    // Using setTimeout instead of transitionend because multiple transitions 
    // run on children and can trigger it prematurely.
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 2600);
  }

  // Hide loading overlay after page loads (with minimum display time)
  window.addEventListener('load', () => {
    setTimeout(dismissLoader, 1800);
  });

  // Fallback: hide after 4 seconds if load event doesn't fire
  setTimeout(() => {
    if (!overlay.classList.contains('fade-out')) {
      dismissLoader();
    }
  }, 4000);
})();

/* ============================================================
   CUSTOMISE: Formspree endpoint for the contact form
   1. Create a free account at https://formspree.io
   2. Replace the URL below with your form's action URL
   ============================================================ */
const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

/* ============================================================
   CUSTOMISE: Roles that cycle in the "I'm a ___" typing animation
   ============================================================ */
const ROLES = [
  'BCA Student',
  'STEM Enthusiast',
  'AI Aspirint',
  'Backend Game Developer',
];

/* ============================================================
   TYPING ANIMATION — ENHANCED VERSION
   ============================================================ */
(function initTyping() {
  const el = document.getElementById('typedText');
  const cursor = document.querySelector('.cursor-blink');
  if (!el || !cursor) return;

  let roleIdx = 0, charIdx = 0, deleting = false;
  let typingSpeed = 90, deletingSpeed = 60, pauseTime = 2000;

  function getRandomTypingSpeed() {
    return Math.random() * 50 + 70; // Random speed between 70-120ms
  }

  function typeWriter() {
    const current = ROLES[roleIdx];

    if (deleting) {
      el.textContent = current.slice(0, --charIdx);
      typingSpeed = deletingSpeed;

      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % ROLES.length;
        typingSpeed = 500; // Pause before starting new word
      }
    } else {
      el.textContent = current.slice(0, ++charIdx);
      typingSpeed = getRandomTypingSpeed(); // Variable typing speed

      if (charIdx === current.length) {
        deleting = true;
        typingSpeed = pauseTime; // Pause at end of word
      }
    }

    // Reset cursor blink during active typing (cross-browser safe)
    if (!deleting && charIdx > 0) {
      cursor.style.webkitAnimation = 'none';
      cursor.style.animation = 'none';
      // Force reflow to restart animation (works in all browsers)
      void cursor.offsetHeight;
      cursor.style.webkitAnimation = '';
      cursor.style.animation = '';
    }

    setTimeout(typeWriter, typingSpeed);
  }

  // Start typing after initial delay
  setTimeout(typeWriter, 1000);
})();

/* ============================================================
   FLOATING PARTICLES IN HERO — ENHANCED VERSION
   ============================================================ */
(function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  // Light grey colors for the mix-blend-mode: difference "x-ray" effect
  // On a white background, these invert to visible Dark Grey stars.
  // Over black text, they invert back to Light Grey glowing stars.
  const COLORS = ['#dddddd', '#cccccc', '#bbbbbb', '#d5d5d5', '#c5c5c5'];
  const PARTICLE_COUNT = 25;

  // Create particles with enhanced properties
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 30 + 15; // bigger sparkle: 15–45px
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const delay = Math.random() * -20;
    const duration = Math.random() * 12 + 10;
    const randomX = (Math.random() - 0.5) * 200;
    const scaleFactor = Math.random() * 0.5 + 0.5;

    Object.assign(p.style, {
      width: size + 'px',
      height: size + 'px',
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      background: color,
      animationDuration: duration + 's',
      animationDelay: delay + 's',
    });

    // Store particle-specific data as data attributes for animation
    p.dataset.randomX = randomX;
    p.dataset.scaleFactor = scaleFactor;

    container.appendChild(p);
  }

  // Mouse parallax for particles — uses margin offset instead of
  // CSS custom properties inside transforms (Safari-incompatible)
  const particleElements = Array.from(container.querySelectorAll('.particle'));
  let mouseX = 0.5, mouseY = 0.5;
  let currentMX = 0.5, currentMY = 0.5;
  let ticking = false;

  function lerpParticles() {
    // Smooth interpolation for all browsers
    currentMX += (mouseX - currentMX) * 0.08;
    currentMY += (mouseY - currentMY) * 0.08;

    particleElements.forEach((p, i) => {
      const speed = 0.02 + (i % 3) * 0.01;
      const x = (currentMX - 0.5) * speed * 100;
      const y = (currentMY - 0.5) * speed * 100;
      p.style.marginLeft = x + 'px';
      p.style.marginTop = y + 'px';
    });

    // Keep animating if mouse is moving
    if (Math.abs(mouseX - currentMX) > 0.001 || Math.abs(mouseY - currentMY) > 0.001) {
      requestAnimationFrame(lerpParticles);
    } else {
      ticking = false;
    }
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;

    if (!ticking) {
      ticking = true;
      requestAnimationFrame(lerpParticles);
    }
  });
})();

/* ============================================================
   CURSOR GLOW — Cross-browser (Safari + Chrome + Firefox)
   Uses left/top with requestAnimationFrame lerp instead of
   transform, which Safari throttles on mousemove.
   ============================================================ */
(function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.matchMedia('(pointer: coarse)').matches) {
    if (glow) glow.style.display = 'none';
    return;
  }

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let animating = false;

  document.addEventListener('mousemove', e => {
    targetX = e.clientX - 200;
    targetY = e.clientY - 200;

    if (!animating) {
      animating = true;
      requestAnimationFrame(updateGlow);
    }
  });

  function updateGlow() {
    // Smooth lerp for buttery animation on all browsers
    currentX += (targetX - currentX) * 0.15;
    currentY += (targetY - currentY) * 0.15;

    glow.style.left = currentX + 'px';
    glow.style.top = currentY + 'px';

    // Keep looping until settled
    if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
      requestAnimationFrame(updateGlow);
    } else {
      // Snap to final position
      glow.style.left = targetX + 'px';
      glow.style.top = targetY + 'px';
      animating = false;
    }
  }
})();

/* ============================================================
   NAVBAR: shrink on scroll + active link highlight
   ============================================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Shrink and deepen background on scroll
    navbar.classList.toggle('scrolled', window.scrollY > 30);

    // Active link highlighting
    let current = 'hero'; // default to hero
    sections.forEach(s => {
      const sectionTop = s.offsetTop;
      const sectionHeight = s.offsetHeight;
      if (window.scrollY >= sectionTop - 200) {
        current = s.getAttribute('id');
      }
    });

    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }, { passive: true });
})();

/* ============================================================
   HAMBURGER MENU (mobile)
   ============================================================ */
(function initHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    links.classList.toggle('mobile-open');
  });

  // Close on nav link click
  links.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      btn.classList.remove('open');
      links.classList.remove('mobile-open');
    });
  });
})();

/* ============================================================
   SCROLL REVEAL — ENHANCED VERSION
   ============================================================ */
(function initScrollReveal() {
  // --- General reveal targets (non-project-card) ---
  const generalTargets = document.querySelectorAll(
    '.about-grid, .skill-category, .contact-grid, .section-header'
  );

  generalTargets.forEach(el => {
    el.classList.add('reveal');

    if (el.classList.contains('about-grid')) {
      el.classList.add('reveal-left');
    } else if (el.classList.contains('skill-category')) {
      el.classList.add('reveal-up');
    } else if (el.classList.contains('section-header')) {
      el.classList.add('reveal-down');
    } else {
      el.classList.add('reveal-right');
    }
  });

  const generalObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          generalObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  generalTargets.forEach(el => generalObserver.observe(el));

  // --- Skill cards: stagger by grid position ---
  document.querySelectorAll('.skills-grid').forEach(grid => {
    [...grid.children].forEach((child, i) => {
      child.style.transitionDelay = (i * 0.1) + 's';
    });
  });

  // --- Project cards: dedicated reveal with per-card stagger ---
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach((card, i) => {
    card.classList.add('reveal-card');
    // Each card gets a stagger delay based on its position in the grid
    card.style.transitionDelay = (i * 0.12) + 's';
  });

  // Track which cards have already been revealed
  const revealedCards = new Set();

  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !revealedCards.has(entry.target)) {
          revealedCards.add(entry.target);
          entry.target.classList.add('visible');
          cardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );

  projectCards.forEach(card => cardObserver.observe(card));
})();

/* ============================================================
   PROJECT FILTER
   ============================================================ */
(function initProjectFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden-card', !match);
      });
    });
  });
})();

/* ============================================================
   CONTACT FORM
   ============================================================ */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const btn = document.getElementById('submitBtn');
  if (!form || !btn) return;

  const btnText = btn.querySelector('.btn-text');
  const btnLoader = btn.querySelector('.btn-loader');

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Basic validation
    const inputs = form.querySelectorAll('[required]');
    let valid = true;
    inputs.forEach(inp => {
      inp.style.borderColor = '';
      if (!inp.value.trim()) { inp.style.borderColor = 'var(--clr-pink)'; valid = false; }
    });
    if (!valid) return;

    // Loading state
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    btn.disabled = true;

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });

      if (res.ok) {
        form.innerHTML = `
          <div style="text-align:center;padding:2rem 0">
            <div style="font-size:3rem;margin-bottom:1rem">🎉</div>
            <h3 style="margin-bottom:0.5rem">Message sent!</h3>
            <p style="color:var(--clr-muted)">Thanks for reaching out — I'll get back to you soon.</p>
          </div>`;
      } else {
        throw new Error('Form submission failed');
      }
    } catch {
      btnText.classList.remove('hidden');
      btnLoader.classList.add('hidden');
      btn.disabled = false;
      alert('Oops! Something went wrong. Please email me directly.');
    }
  });
})();

/* ============================================================
   PARALLAX SCROLL EFFECT
   ============================================================ */
(function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  const heroParticles = document.querySelector('.hero-particles');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        const scrolled = window.pageYOffset || document.documentElement.scrollTop;
        const rate = scrolled * -0.5;

        if (heroBg) {
          heroBg.style.transform = 'translateY(' + rate + 'px)';
          heroBg.style.webkitTransform = 'translateY(' + rate + 'px)';
        }

        if (heroParticles) {
          heroParticles.style.transform = 'translateY(' + (rate * 0.3) + 'px)';
          heroParticles.style.webkitTransform = 'translateY(' + (rate * 0.3) + 'px)';
        }

        ticking = false;
      });
    }
  }, { passive: true });
})();

/* ============================================================
   THEME TOGGLE
   ============================================================ */
(function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const icon = btn.querySelector('i');
  
  function updateIcon(theme) {
    if (theme === 'dark') {
      icon.classList.replace('fa-moon', 'fa-sun');
    } else {
      icon.classList.replace('fa-sun', 'fa-moon');
    }
  }

  // Initial icon state
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  updateIcon(currentTheme);

  btn.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateIcon(theme);
  });
})();
