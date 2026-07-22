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

// ── Product Catalog ─────────────────────────────
const PRODUCTS = [
  { id: 'sneakers',  name: 'Classic Sneakers',   price: 89.99,  img: 'https://placehold.co/100x100/ede9fe/4f46e5?text=👟',  tags: ['shoe','sneaker','footwear','classic'] },
  { id: 'tote',      name: 'Leather Tote Bag',   price: 129.00, img: 'https://placehold.co/100x100/fef3c7/d97706?text=👜',  tags: ['bag','tote','leather','handbag'] },
  { id: 'glasses',   name: 'UV Sunglasses',      price: 45.00,  img: 'https://placehold.co/100x100/d1fae5/065f46?text=🕶️', tags: ['glasses','sunglasses','uv','shades'] },
  { id: 'watch',     name: 'Smart Watch',        price: 199.99, img: 'https://placehold.co/100x100/e0e7ff/3730a3?text=⌚',  tags: ['watch','smart','smartwatch','wrist'] },
  { id: 'runners',   name: 'Running Shoes',      price: 74.99,  img: 'https://placehold.co/100x100/fce7f3/db2777?text=👟',  tags: ['shoe','running','runners','sport'] },
  { id: 'backpack',  name: 'Canvas Backpack',    price: 59.99,  img: 'https://placehold.co/100x100/e0f2fe/0284c7?text=🎒',  tags: ['bag','backpack','canvas','travel'] },
  { id: 'headphones',name: 'Wireless Headphones', price: 149.99, img: 'https://placehold.co/100x100/f3e8ff/9333ea?text=🎧',  tags: ['headphones','audio','wireless','music'] },
  { id: 'wallet',    name: 'Slim Leather Wallet',price: 34.99,  img: 'https://placehold.co/100x100/ffedd5/c2410c?text=👛',  tags: ['wallet','leather','accessory'] },
  { id: 'cap',       name: 'Baseball Cap',        price: 24.99,  img: 'https://placehold.co/100x100/dcfce7/166534?text=🧢',  tags: ['cap','hat','baseball','headwear'] },
  { id: 'jeans',     name: 'Denim Jeans',         price: 69.99,  img: 'https://placehold.co/100x100/dbeafe/1d4ed8?text=👖',  tags: ['jeans','denim','pants','clothing'] },
  { id: 'tshirt',    name: 'Cotton T-Shirt',      price: 19.99,  img: 'https://placehold.co/100x100/fef3c7/d97706?text=👕',  tags: ['shirt','tshirt','cotton','clothing'] },
  { id: 'scarf',     name: 'Wool Scarf',          price: 39.99,  img: 'https://placehold.co/100x100/fce7f3/db2777?text=🧣',  tags: ['scarf','wool','winter','accessory'] },
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

function formatPrice(n) {
  return '$' + parseFloat(n).toFixed(2);
}

// ── Item rotation (every 5 minutes) ──────────────
const FIVE_MINUTES = 5 * 60 * 1000;
let currentListItems = [];

function getRotationIndex() {
  return Math.floor(Date.now() / FIVE_MINUTES);
}

function pickItems(start, count) {
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push(PRODUCTS[(start + i) % PRODUCTS.length]);
  }
  return items;
}

function cardImageUrl(name) {
  return `https://placehold.co/200x180/f3f4f6/374151?text=${encodeURIComponent(name.replace(/ /g, '+'))}`;
}

function attachCardListeners(card) {
  const plusBtn  = card.querySelector('.qty-btn.plus');
  const minusBtn = card.querySelector('.qty-btn.minus');
  const display  = card.querySelector('.qty-display');
  const saveBtn  = card.querySelector('.save-btn');
  const id       = card.dataset.id;
  const name     = card.dataset.name;
  const price    = card.dataset.price;
  const img      = card.dataset.img;
  let saved = false;

  function updateCardQty() {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    display.textContent = item ? item.qty : 0;
  }
  updateCardQty();

  plusBtn.addEventListener('click', () => {
    addToCart(id, name, price, img);
    updateCardQty();
  });

  minusBtn.addEventListener('click', () => {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
      item.qty--;
      if (item.qty <= 0) {
        cart.splice(cart.indexOf(item), 1);
      }
      saveCart(cart);
      updateCardQty();
    }
  });

  saveBtn.addEventListener('click', () => {
    saved = !saved;
    saveBtn.textContent = saved ? 'Saved ♥' : 'Save';
    saveBtn.style.color = saved ? '#ef4444' : '';
  });
}

function renderFeaturedCards() {
  const idx = getRotationIndex();
  const featured = pickItems(idx, 2);
  const container = document.getElementById('productCards');
  container.innerHTML = '';

  featured.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = p.id;
    card.dataset.name = p.name;
    card.dataset.price = p.price;
    card.dataset.img = p.img;
    card.innerHTML = `
      <div class="card-image">
        <img src="${cardImageUrl(p.name)}" alt="${p.name}" />
      </div>
      <div class="card-info">
        <span class="card-name">${p.name}</span>
        <span class="card-price">${formatPrice(p.price)}</span>
      </div>
      <div class="card-controls">
        <button class="qty-btn plus">+</button>
        <span class="qty-display">0</span>
        <button class="qty-btn minus">−</button>
        <button class="save-btn">Save</button>
      </div>
    `;
    attachCardListeners(card);
    container.appendChild(card);
  });
}

function renderShoppingList() {
  const idx = getRotationIndex();
  const items = pickItems(idx + 2, 4);
  currentListItems = items;
  const container = document.getElementById('shoppingList');
  container.innerHTML = '';

  items.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${p.img}" alt="${p.name}" />
      <div class="list-item-info">
        <span class="item-name">${p.name}</span>
        <span class="item-price">${formatPrice(p.price)}</span>
      </div>
      <button class="add-to-cart-btn" data-id="${p.id}"><i class="fas fa-plus"></i></button>
    `;
    const btn = li.querySelector('.add-to-cart-btn');
    btn.addEventListener('click', () => {
      addToCart(p.id, p.name, p.price.toString(), p.img);
      btn.innerHTML = '<i class="fas fa-check"></i>';
      btn.style.background = '#16a34a';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-plus"></i>';
        btn.style.background = '';
        btn.style.color = '';
      }, 1200);
    });
    container.appendChild(li);
  });
}

function rotateItems() {
  renderFeaturedCards();
  renderShoppingList();
}

rotateItems();
setInterval(rotateItems, FIVE_MINUTES);

// ── Buy All ──────────────────────────────────────
const buyAllBtn = document.getElementById('buyAllBtn');
if (buyAllBtn) {
  buyAllBtn.addEventListener('click', () => {
    currentListItems.forEach(item => addToCart(item.id, item.name, item.price.toString(), item.img));
    window.location.href = '/cart.html';
  });
}
