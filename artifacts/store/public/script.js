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
  autoTimer = setInterval(() => goTo(current + 1), 10000);
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

// ── Search ──────────────────────────────────────
const PRODUCTS = [
  { id: 'sneakers', name: 'Classic Sneakers',  price: 89.99,  img: 'https://placehold.co/100x100/ede9fe/4f46e5?text=👟',  tags: ['shoe','sneaker','footwear','classic'] },
  { id: 'tote',     name: 'Leather Tote Bag',  price: 129.00, img: 'https://placehold.co/100x100/fef3c7/d97706?text=👜',  tags: ['bag','tote','leather','handbag'] },
  { id: 'glasses',  name: 'UV Sunglasses',     price: 45.00,  img: 'https://placehold.co/100x100/d1fae5/065f46?text=🕶️', tags: ['glasses','sunglasses','uv','shades'] },
  { id: 'watch',    name: 'Smart Watch',        price: 199.99, img: 'https://placehold.co/100x100/e0e7ff/3730a3?text=⌚',  tags: ['watch','smart','smartwatch','wrist'] },
];

const searchInput    = document.getElementById('searchInput');
const searchBtn      = document.getElementById('searchBtn');
const searchDropdown = document.getElementById('searchDropdown');

function runSearch() {
  const query = searchInput.value.trim().toLowerCase();
  searchDropdown.innerHTML = '';

  if (!query) { searchDropdown.classList.remove('open'); return; }

  const results = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.tags.some(t => t.includes(query))
  );

  if (results.length === 0) {
    searchDropdown.innerHTML = `<p class="search-no-results">No products found for "<strong>${searchInput.value.trim()}</strong>"</p>`;
  } else {
    results.forEach(p => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.innerHTML = `
        <img src="${p.img}" alt="${p.name}" />
        <div class="search-result-info">
          <span class="search-result-name">${p.name}</span>
          <span class="search-result-price">${p.price.toFixed(2)}</span>
        </div>
        <button class="search-result-add" data-id="${p.id}">Add to Cart</button>
      `;
      item.querySelector('.search-result-add').addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(p.id, p.name, p.price.toString(), p.img);
        const btn = e.currentTarget;
        btn.textContent = 'Added ✓';
        btn.style.background = '#16a34a';
        setTimeout(() => { btn.textContent = 'Add to Cart'; btn.style.background = ''; }, 1500);
      });
      searchDropdown.appendChild(item);
    });
  }

  searchDropdown.classList.add('open');
}

searchBtn.addEventListener('click', runSearch);
searchInput.addEventListener('input', runSearch);
searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') runSearch(); });

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-search')) {
    searchDropdown.classList.remove('open');
  }
});

// ── Cart helpers ─────────────────────────────────
function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}
function addToCart(id, name, price, img) {
  const cart = getCart();
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price: parseFloat(price), img, qty: 1 });
  }
  saveCart(cart);
}

// ── Product card +/− qty and Save ───────────────
document.querySelectorAll('.product-card').forEach(card => {
  const plusBtn  = card.querySelector('.qty-btn.plus');
  const minusBtn = card.querySelector('.qty-btn.minus');
  const display  = card.querySelector('.qty-display');
  const saveBtn  = card.querySelector('.save-btn');
  const id       = card.dataset.id;
  const name     = card.dataset.name;
  const price    = card.dataset.price;
  const img      = card.dataset.img;
  let saved = false;

  function updateCardQtyFromCart() {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    display.textContent = item ? item.qty : 0;
  }
  updateCardQtyFromCart();

  plusBtn.addEventListener('click', () => {
    addToCart(id, name, price, img);
    updateCardQtyFromCart();
    plusBtn.classList.add('clicked');
    setTimeout(() => plusBtn.classList.remove('clicked'), 200);
  });

  minusBtn.addEventListener('click', () => {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
      item.qty--;
      if (item.qty <= 0) {
        const idx = cart.indexOf(item);
        cart.splice(idx, 1);
      }
      saveCart(cart);
      updateCardQtyFromCart();
    }
  });

  saveBtn.addEventListener('click', () => {
    saved = !saved;
    saveBtn.textContent   = saved ? 'Saved ♥' : 'Save';
    saveBtn.style.color   = saved ? '#ef4444' : '';
  });
});

// ── Shopping list + buttons ──────────────────────
const listItems = [
  { id: 'sneakers', name: 'Classic Sneakers', price: '89.99', img: 'https://placehold.co/100x100/ede9fe/4f46e5?text=👟' },
  { id: 'tote',     name: 'Leather Tote Bag', price: '129.00', img: 'https://placehold.co/100x100/fef3c7/d97706?text=👜' },
  { id: 'glasses',  name: 'UV Sunglasses',    price: '45.00',  img: 'https://placehold.co/100x100/d1fae5/065f46?text=🕶️' },
  { id: 'watch',    name: 'Smart Watch',      price: '199.99', img: 'https://placehold.co/100x100/e0e7ff/3730a3?text=⌚' },
];

document.querySelectorAll('.add-to-cart-btn').forEach((btn, i) => {
  btn.addEventListener('click', () => {
    const item = listItems[i];
    addToCart(item.id, item.name, item.price, item.img);
    btn.innerHTML = '<i class="fas fa-check"></i>';
    btn.style.background = '#16a34a';
    btn.style.color = '#fff';
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-plus"></i>';
      btn.style.background = '';
      btn.style.color = '';
    }, 1200);
  });
});

// ── Buy All ──────────────────────────────────────
document.querySelector('.buy-all-btn').addEventListener('click', () => {
  listItems.forEach(item => addToCart(item.id, item.name, item.price, item.img));
  window.location.href = '/cart.html';
});
