// ============================================================
// script.js — KR Portfolio
// Handles: nav, mobile menu, sliders with dots, scroll reveal
// ✏️ No content changes needed here.
// ============================================================

// --- Nav scroll shadow ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
});

// --- Mobile menu ---
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ============================================================
// SLIDER ENGINE
// ============================================================
function initSlider(trackId, dotsContainerId) {
  const track = document.getElementById(trackId);
  if (!track) return;

  const dotsContainer = document.getElementById(dotsContainerId);
  const slides = Array.from(track.children);
  let current = 0;

  // How many slides are visible at once (based on flex sizing)?
  function visibleCount() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, slides.length - visibleCount());
  }

  // Build dots
  function buildDots() {
    dotsContainer.innerHTML = '';
    const pages = maxIndex() + 1;
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function getSlideWidth() {
    if (!slides[0]) return 0;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.gap) || 20;
    return slides[0].offsetWidth + gap;
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, maxIndex()));
    track.style.transform = `translateX(-${current * getSlideWidth()}px)`;
    updateDots();
  }

  function prev() { goTo(current - 1); }
  function next() { goTo(current + 1); }

  // Wire buttons (prev/next are siblings of the viewport, inside slider-wrap)
  const wrap = track.closest('.slider-wrap');
  if (wrap) {
    wrap.querySelector('.slider-prev').addEventListener('click', prev);
    wrap.querySelector('.slider-next').addEventListener('click', next);
  }

  // Touch swipe
  let startX = null;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = startX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) { dx > 0 ? next() : prev(); }
    startX = null;
  });

  // Keyboard (when focused)
  wrap && wrap.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // Init
  buildDots();
  goTo(0);

  // Recalculate on resize
  window.addEventListener('resize', () => {
    buildDots();
    goTo(Math.min(current, maxIndex()));
  });
}

// Boot sliders
initSlider('skillsTrack',   'skillsDots');
initSlider('projectsTrack', 'projectsDots');

// ============================================================
// SCROLL REVEAL
// ============================================================
const sections = document.querySelectorAll('.section');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.07 });

sections.forEach(s => {
  if (!s.classList.contains('hero')) revealObserver.observe(s);
});
