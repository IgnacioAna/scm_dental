/* ==========================================================================
   SCM DENTAL — Premium interactions
   Reveal · Cursor · Magnetic · Tilt · Parallax · Scroll progress · Nav state
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches || window.innerWidth < 920;

  /* ---------- SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* Stagger inside grid-3 */
  document.querySelectorAll('.grid-3').forEach(grid => {
    grid.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${i * 80}ms`;
    });
  });

  /* ---------- SCROLL PROGRESS BAR ---------- */
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);
  const updateProgress = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    progress.style.width = `${Math.min(scrolled * 100, 100)}%`;
  };
  updateProgress();

  /* ---------- NAV SCROLL STATE ---------- */
  const nav = document.querySelector('.sticky-header');
  const onScroll = () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 24);
    updateProgress();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- AURORA BLOBS (decorative) ---------- */
  if (!reduceMotion) {
    ['b1', 'b2', 'b3'].forEach(c => {
      const blob = document.createElement('div');
      blob.className = `aurora-blob ${c}`;
      document.body.appendChild(blob);
    });
    const noise = document.createElement('div');
    noise.className = 'noise-overlay';
    document.body.appendChild(noise);
  }

  /* ---------- CUSTOM CURSOR (desktop) ---------- */
  if (!isTouch && !reduceMotion) {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    document.body.appendChild(cursor);

    let cx = 0, cy = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });

    const tick = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    tick();

    const hoverables = document.querySelectorAll('a, button, .glass-card, summary, .stat-chip, .social-link');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
  }

  /* ---------- MAGNETIC BUTTONS ---------- */
  if (!isTouch && !reduceMotion) {
    const magnetics = document.querySelectorAll('.btn-primary, .social-link');
    magnetics.forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const mx = e.clientX - r.left - r.width / 2;
        const my = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${mx * 0.18}px, ${my * 0.25}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ---------- 3D TILT ON CARDS ---------- */
  if (!isTouch && !reduceMotion) {
    const tiltCards = document.querySelectorAll('.glass-card.number-card, .glass-card.proceso-phase, .glass-card.bonus-main-card, .glass-card.cost-panel, .glass-card.bio-detail, .glass-card.agendar-info-card');
    tiltCards.forEach(card => {
      card.classList.add('tilt-card');
      let raf = null;
      const onMove = e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const ry = (px - 0.5) * 8;
        const rx = (0.5 - py) * 8;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.setProperty('--rx', `${rx}deg`);
          card.style.setProperty('--ry', `${ry}deg`);
        });
      };
      const onLeave = () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });
  }

  /* ---------- HERO PARALLAX (subtle) ---------- */
  if (!reduceMotion) {
    const heroSidebar = document.querySelector('.hero-sidebar');
    const heroText = document.querySelector('.hero-text');
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (heroSidebar) heroSidebar.style.transform = `translateY(${y * 0.08}px)`;
        if (heroText)    heroText.style.transform    = `translateY(${y * -0.04}px)`;
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- SMOOTH ANCHOR SCROLL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- POPUP ---------- */
  const salesPopup = document.getElementById('salesPopup');
  const salesPopupClose = document.getElementById('salesPopupClose');
  if (salesPopup && salesPopupClose) {
    const closed = localStorage.getItem('salesPopupClosed') === '1';
    if (!closed) {
      setTimeout(() => salesPopup.classList.add('show'), 6500);
    }
    salesPopupClose.addEventListener('click', () => {
      salesPopup.classList.remove('show');
      localStorage.setItem('salesPopupClosed', '1');
    });
  }

  /* ---------- CALENDAR LAZY REVEAL ---------- */
  const revealBtn = document.getElementById('revealCalendar');
  const calendarContainer = document.getElementById('calendarContainer');
  if (revealBtn && calendarContainer) {
    revealBtn.addEventListener('click', () => {
      const iframe = calendarContainer.querySelector('iframe');
      if (iframe && iframe.dataset.src) {
        iframe.src = iframe.dataset.src;
        delete iframe.dataset.src;
      }
      calendarContainer.style.display = 'block';
      revealBtn.style.display = 'none';
      calendarContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ---------- ANIMATED COUNTERS ---------- */
  const fmtThousands = n => n.toLocaleString('es-AR').replace(/,/g, '.');
  const counters = document.querySelectorAll('.counter[data-target]');
  if (counters.length) {
    const counterObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.target;
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const useThousands = el.dataset.format === 'thousands';
        const dur = 2000;
        const start = performance.now();
        const step = now => {
          const t = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          const val = Math.round(target * eased);
          el.textContent = prefix + (useThousands ? fmtThousands(val) : val) + suffix;
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(c => counterObs.observe(c));
  }

});
