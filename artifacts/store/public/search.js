// ── Shared search functionality for all pages ───
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

const searchInput    = document.getElementById('searchInput');
const searchBtn      = document.getElementById('searchBtn');
const searchDropdown = document.getElementById('searchDropdown');

if (searchInput && searchBtn && searchDropdown) {
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

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-search')) {
      searchDropdown.classList.remove('open');
    }
  });
}
