// ── Mobile menu toggle ──────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// ── Search ──────────────────────────────────────
const searchInput  = document.querySelector('.nav-search input');
const searchButton = document.querySelector('.nav-search button');

searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    alert(`Searching for: "${query}"`);
  }
});

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') searchButton.click();
});

// ── Cart ────────────────────────────────────────
const cartBtn   = document.querySelector('.cart-btn');
const cartCount = document.querySelector('.cart-count');
let count = parseInt(cartCount.textContent, 10);

cartBtn.addEventListener('click', () => {
  count++;
  cartCount.textContent = count;
  cartBtn.style.transform = 'scale(1.2)';
  setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);
});
