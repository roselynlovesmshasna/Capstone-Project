// ── Cart utilities shared with index.js ───────────
function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function formatMoney(n) {
  return '$' + n.toFixed(2);
}

function renderCart() {
  const cart = getCart();
  const cartItemsEl = document.querySelector('.cart-items');
  const itemCountEl = document.getElementById('summaryItemCount');
  const itemTotalEl = document.getElementById('summaryItemTotal');
  const discountEl  = document.getElementById('summaryDiscount');
  const totalEl     = document.getElementById('summaryTotal');

  cartItemsEl.innerHTML = '';

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p class="cart-empty">Your cart is empty. <a href="/">Continue shopping</a></p>`;
    itemCountEl.textContent = 'Items (0)';
    itemTotalEl.textContent = formatMoney(0);
    discountEl.textContent = '− ' + formatMoney(0);
    totalEl.textContent = formatMoney(0);
    return;
  }

  let subtotal = 0;
  let totalQty = 0;

  cart.forEach(item => {
    const itemSubtotal = item.price * item.qty;
    subtotal += itemSubtotal;
    totalQty += item.qty;

    const row = document.createElement('div');
    row.className = 'cart-item';
    row.dataset.id = item.id;
    row.innerHTML = `
      <img class="cart-item-img" src="${item.img}" alt="${item.name}" />
      <div class="cart-item-details">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">${formatMoney(item.price)}</span>
      </div>
      <div class="cart-item-qty">
        <button class="qty-ctrl minus">−</button>
        <span class="qty-value">${item.qty}</span>
        <button class="qty-ctrl plus">+</button>
      </div>
      <span class="cart-item-subtotal">${formatMoney(itemSubtotal)}</span>
      <button class="cart-item-remove"><i class="fas fa-trash"></i></button>
    `;

    row.querySelector('.plus').addEventListener('click', () => {
      item.qty++;
      saveCart(cart);
      renderCart();
    });

    row.querySelector('.minus').addEventListener('click', () => {
      item.qty--;
      if (item.qty <= 0) {
        const idx = cart.findIndex(i => i.id === item.id);
        cart.splice(idx, 1);
      }
      saveCart(cart);
      renderCart();
    });

    row.querySelector('.cart-item-remove').addEventListener('click', () => {
      const idx = cart.findIndex(i => i.id === item.id);
      cart.splice(idx, 1);
      saveCart(cart);
      renderCart();
    });

    cartItemsEl.appendChild(row);
  });

  const discount = 0; // placeholder for future points integration
  const total = Math.max(0, subtotal - discount);

  itemCountEl.textContent = `Items (${totalQty})`;
  itemTotalEl.textContent = formatMoney(subtotal);
  discountEl.textContent = '− ' + formatMoney(discount);
  totalEl.textContent = formatMoney(total);
}

// ── Checkout ─────────────────────────────────────
const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    const cart = getCart();
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    alert('Checkout complete! Thank you for your order.');
    localStorage.removeItem('cart');
    renderCart();
  });
}

// ── Initial render ───────────────────────────────
renderCart();
