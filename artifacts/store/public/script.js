// ── Slider ──────────────────────────────────────
const slides    = document.querySelectorAll('.slide');
const dots      = document.querySelectorAll('.dot');
const prevBtn   = document.getElementById('prev');
const nextBtn   = document.getElementById('next');
const sliderEl  = document.querySelector('.slider');
let current     = 0;
let autoTimer;

function goTo(index) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (index + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

function startAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => goTo(current + 1), 4000);
}

prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });
dots.forEach(dot => dot.addEventListener('click', () => {
  goTo(parseInt(dot.dataset.index));
  startAuto();
}));

// ── Touch / swipe support ───────────────────────
let touchStartX = 0;
let touchStartY = 0;
let isDragging  = false;

sliderEl.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  isDragging  = true;
}, { passive: true });

sliderEl.addEventListener('touchend', (e) => {
  if (!isDragging) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  // Only swipe if horizontal movement is dominant and large enough
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
    dx < 0 ? goTo(current + 1) : goTo(current - 1);
    startAuto();
  }
  isDragging = false;
}, { passive: true });

// ── Mouse drag swipe (desktop) ──────────────────
let mouseStartX = 0;
let mouseDown   = false;

sliderEl.addEventListener('mousedown', (e) => {
  mouseStartX = e.clientX;
  mouseDown   = true;
});

sliderEl.addEventListener('mouseup', (e) => {
  if (!mouseDown) return;
  const dx = e.clientX - mouseStartX;
  if (Math.abs(dx) > 50) {
    dx < 0 ? goTo(current + 1) : goTo(current - 1);
    startAuto();
  }
  mouseDown = false;
});

sliderEl.addEventListener('mouseleave', () => { mouseDown = false; });

startAuto();

// ── Mobile menu toggle ──────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
if (hamburger) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// ── Search ──────────────────────────────────────
const searchInput  = document.querySelector('.nav-search input');
const searchButton = document.querySelector('.nav-search button');

searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) alert(`Searching for: "${query}"`);
});

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') searchButton.click();
});
