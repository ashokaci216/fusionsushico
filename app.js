// Fusion Sushi Co. - Layout v2 JavaScript

let cart = {};
let allProducts = [];

fetch('menu.json')
  .then(res => res.json())
  .then(data => {
    allProducts = data;
    displayGroupedProducts();
    setupButtons();
  });

function displayGroupedProducts() {
  const productList = document.getElementById('grouped-product-list');
  productList.innerHTML = '';

  const categories = [...new Set(allProducts.map(item => item.category))];

  categories.forEach(category => {
    const section = document.createElement('div');
    section.className = 'category-block';
    const heading = document.createElement('h2');
    heading.className = 'category-title';
    heading.textContent = category;

    const items = allProducts.filter(item => item.category === category);
    const grid = document.createElement('div');
    grid.className = 'grid gap-4 sm:grid-cols-2';

    items.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p><strong>₹${product.price}</strong> • 🔥 ${product.calories} kcal</p>
          <div class="flex items-center gap-2 mt-2">
            <button onclick="changeQty('${product.name}', -1)">➖</button>
            <span>${cart[product.name]?.qty || 0}</span>
            <button onclick="changeQty('${product.name}', 1)">➕</button>
          </div>
        </div>
        <div class="cursor-pointer" onclick="openPreview('${product.name}')">
          <img src="images/${product.image}" alt="${product.name}" />
        </div>
      `;
      grid.appendChild(card);
    });

    section.appendChild(heading);
    section.appendChild(grid);
    productList.appendChild(section);
  });
}

function changeQty(name, delta) {
  const item = allProducts.find(p => p.name === name);
  if (!item) return;

  if (!cart[name]) cart[name] = { ...item, qty: 0 };
  cart[name].qty += delta;

  if (cart[name].qty <= 0) delete cart[name];

  updateCart();
  displayGroupedProducts();
}

function updateCart() {
  const itemsDiv = document.getElementById('cart-items');
  const totalSpan = document.getElementById('cart-total');
  const cartBar = document.getElementById('view-cart-bar');
  const cartText = document.getElementById('cart-bar-text');
  const desktopCount = document.getElementById('cart-count-desktop');
  const itemCountText = document.getElementById('cart-count-text');
  const fab = document.getElementById('menu-fab');

  let total = 0;
  let count = 0;
  itemsDiv.innerHTML = '';

  for (let key in cart) {
    const item = cart[key];
    total += item.qty * item.price;
    count += item.qty;
    const div = document.createElement('div');
    div.className = 'border-b py-2 text-sm';
    div.innerHTML = `<strong>${item.name}</strong> x ${item.qty} = ₹${item.qty * item.price} <button onclick="changeQty('${item.name}', -1)">❌</button>`;
    itemsDiv.appendChild(div);
  }

  totalSpan.textContent = total;
  cartText.textContent = `${count} item${count !== 1 ? 's' : ''} added`;
  desktopCount.textContent = count;
  itemCountText.textContent = count;
  cartBar.classList.toggle('active', count > 0);
  fab.style.bottom = count > 0 ? '80px' : '20px';
}

function setupButtons() {
  document.getElementById('view-cart-btn').onclick = () => {
    document.getElementById('cart-panel').classList.add('active');
  };
  document.getElementById('desktop-cart-btn').onclick = () => {
    document.getElementById('cart-panel').classList.add('active');
  };
  document.getElementById('close-cart').onclick = () => {
    document.getElementById('cart-panel').classList.remove('active');
  };
  document.getElementById('clear-cart').onclick = () => {
    cart = {};
    updateCart();
    displayGroupedProducts();
  };
  document.getElementById('menu-fab').onclick = () => {
    document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' });
  };
  document.getElementById('orderNowBtn').onclick = () => {
    document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' });
  };
  document.getElementById('exploreMenuBtn').onclick = () => {
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

function openPreview(name) {
  const item = allProducts.find(p => p.name === name);
  if (!item) return;
  document.getElementById('modal-image').src = `images/${item.image}`;
  document.getElementById('modal-name').textContent = item.name;
  document.getElementById('modal-description').textContent = item.description;
  document.getElementById('modal-price').textContent = `₹${item.price}`;
  document.getElementById('modal-calories').textContent = `🔥 ${item.calories} kcal`;
  document.getElementById('preview-modal').classList.remove('hidden');
  document.getElementById('modal-add-to-cart').onclick = () => {
    changeQty(name, 1);
    document.getElementById('preview-modal').classList.add('hidden');
  };
  document.getElementById('close-modal').onclick = () => {
    document.getElementById('preview-modal').classList.add('hidden');
  };
}
