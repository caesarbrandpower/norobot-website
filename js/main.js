/* ============================================================
   NoRobot.ai — main.js
   ============================================================ */

// === Nav: scrolled klasse ===
const nav = document.getElementById('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 20);
  lastScroll = y;
}, { passive: true });

// === Mobile nav toggle ===
const navToggle = document.querySelector('.nav__toggle');
const navLinks  = document.querySelector('.nav__links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Sluit menu bij klik op link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Sluit menu bij klik buiten menu
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && navLinks.classList.contains('is-open')) {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

// === Intersection Observer: fade-up en stagger ===
const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (motionOk) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.fade-up, .stagger').forEach(el => observer.observe(el));
} else {
  // Reduced motion: direct zichtbaar
  document.querySelectorAll('.fade-up, .stagger').forEach(el => el.classList.add('visible'));
}

// === Stats: teller-animatie ===
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateStat(el, to, decimals, prefix, suffix, duration) {
  const start = performance.now();

  function tick(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value    = easeOutCubic(progress) * to;

    const formatted = decimals > 0
      ? value.toFixed(decimals).replace('.', ',')
      : Math.round(value).toString();

    el.textContent = prefix + formatted + suffix;

    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      animateStat(
        el,
        parseFloat(el.dataset.to),
        parseInt(el.dataset.dec  || '0', 10),
        el.dataset.pre  || '',
        el.dataset.suf  || '',
        1400
      );
      statsObserver.unobserve(el);
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll('.stat__number[data-to]').forEach(el => {
  statsObserver.observe(el);
});

// === Smooth scroll voor anchors ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 66 + 24; // nav hoogte + extra ruimte
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
