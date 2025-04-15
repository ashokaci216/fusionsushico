// Fusion Sushi Co. - app.js (with Shivneri Slide Cart v1 logic)

let cart = {};
let allProducts = [];

// Load the menu
fetch('menu.json')
  .then(res => res.json())
  .then(data => {
    allProducts = data;
    displayProducts('Sushi');
    setupButtons();
  });

// Display products by category (Sushi or Ramen)
function displayProducts(filterCategory) {
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';

  const filtered = allProducts.filter(item =>
    filterCategory === 'Sushi' ? item.category !== 'Ramen Bowls' : item.category === 'Ramen Bowls'
  );

  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card flex';
    card.innerHTML = `
      <div class="flex-1 p-2">
        <h3 class="font-bold text-base">${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>₹${product.price}</strong> • 🔥 ${product.calories} kcal</p>
        <div class="flex items-center gap-2 mt-2">
          <button onclick="changeQty('${product.name}', -1)">➖</button>
          <span>${cart[product.name]?.qty || 0}</span>
          <button onclick="changeQty('${product.name}', 1)">➕</button>
        </div>
      </div>
      <div class="w-32 relative">
        <img src="images/${product.image}" alt="${product.name}" onclick="openPreview('${product.name}')" />
      </div>
    `;
    productList.appendChild(card);
  });
}

function changeQty(name, delta) {
  const item = allProducts.find(p => p.name === name);
  if (!item) return;

  if (!cart[name]) cart[name] = { ...item, qty: 0 };
  cart[name].qty += delta;

  if (cart[name].qty <= 0) delete cart[name];

  updateCart();
  displayProducts(document.getElementById('showSushi').classList.contains('active') ? 'Sushi' : 'Ramen');
}

function updateCart() {
  const itemsDiv = document.getElementById('cart-items');
  const totalSpan = document.getElementById('cart-total');
  const cartBar = document.getElementById('view-cart-bar');
  const cartText = document.getElementById('cart-bar-text');
  const desktopCount = document.getElementById('cart-count-desktop');
  const itemCountText = document.getElementById('cart-count-text');

  let total = 0;
  let count = 0;

  itemsDiv.innerHTML = '';
  for (let key in cart) {
    const item = cart[key];
    total += item.qty * item.price;
    count += item.qty;
    const div = document.createElement('div');
    div.className = 'flex justify-between items-center border-b py-1';
    div.innerHTML = `
      <div>
        <strong>${item.name}</strong> x ${item.qty} = ₹${item.qty * item.price}
      </div>
      <button onclick="changeQty('${item.name}', -1)">❌</button>
    `;
    itemsDiv.appendChild(div);
  }

  totalSpan.textContent = total;
  cartText.textContent = `${count} item${count !== 1 ? 's' : ''} added`;
  desktopCount.textContent = count;
  itemCountText.textContent = count;
  cartBar.classList.toggle('active', count > 0);
}

function setupButtons() {
  document.getElementById('showSushi').onclick = () => {
    displayProducts('Sushi');
    setActiveTab('showSushi');
  };
  document.getElementById('showRamen').onclick = () => {
    displayProducts('Ramen');
    setActiveTab('showRamen');
  };

  // Slide-in open triggers
  document.getElementById('desktop-cart-btn').onclick = () => {
    document.getElementById('cart-panel').classList.remove('translate-x-full');
  };
  document.getElementById('view-cart-btn').onclick = () => {
    document.getElementById('cart-panel').classList.remove('translate-x-full');
  };

  // Slide-in close button
  document.getElementById('close-cart').onclick = () => {
    document.getElementById('cart-panel').classList.add('translate-x-full');
  };

  document.getElementById('clear-cart').onclick = () => {
    cart = {};
    updateCart();
    displayProducts('Sushi');
  };

  document.getElementById('orderNowBtn').onclick = () => {
    document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' });
  };
  document.getElementById('exploreMenuBtn').onclick = () => {
    document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' });
  };
  document.getElementById('menu-fab').onclick = () => {
    document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' });
  };

  document.getElementById('whatsapp-order').onclick = () => {
    const name = document.getElementById('customer-name').value;
    const address = document.getElementById('customer-address').value;
    let message = 'Order from Fusion Sushi Co.\n';
    let total = 0;
    for (let key in cart) {
      const item = cart[key];
      message += `\n${item.qty}x ${item.name} – ₹${item.qty * item.price}`;
      total += item.qty * item.price;
    }
    message += `\n\nTotal: ₹${total}`;
    message += `\n\nName: ${name || '______'}\nAddress: ${address || '______'}`;
    const encoded = encodeURIComponent(message);
    document.getElementById('whatsapp-order').href = `https://wa.me/919867378209?text=${encoded}`;
  };
}

function setActiveTab(id) {
  document.getElementById('showSushi').classList.remove('active');
  document.getElementById('showRamen').classList.remove('active');
  document.getElementById(id).classList.add('active');
}

function openPreview(name) {
  const item = allProducts.find(p => p.name === name);
  if (!item) return;

  document.getElementById('modal-image').src = `images/${item.image}`;
  document.getElementById('modal-name').textContent = item.name;
  document.getElementById('modal-description').textContent = item.description;
  document.getElementById('modal-price').textContent = `₹${item.price}`;
  document.getElementById('modal-calories').textContent = `🔥 ${item.calories} kcal`;

  const modal = document.getElementById('preview-modal');
  modal.classList.remove('hidden');

  document.getElementById('modal-add-to-cart').onclick = () => {
    changeQty(name, 1);
    modal.classList.add('hidden');
  };
  document.getElementById('close-modal').onclick = () => modal.classList.add('hidden');
}
