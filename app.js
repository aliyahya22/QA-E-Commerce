// ---- UTILS ----
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};

// ---- DATA MODELS ----
const mockProducts = [
  {
    id: 1,
    name: 'Aura Premium Over-Ear Headphones',
    price: 2999000,
    category: 'Electronics',
    stock: 15,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
    description: 'Industry-leading active noise cancellation.',
  },
  {
    id: 2,
    name: 'Aura Minimal Series Smartwatch',
    price: 1999000,
    category: 'Electronics',
    stock: 0,
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
    description:
      'Track your health metrics seamlessly. Currently Out of Stock.',
  },
  {
    id: 3,
    name: 'ErgoPro Mechanical Keyboard',
    price: 1499000,
    category: 'Accessories',
    stock: 24,
    image:
      'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600&auto=format&fit=crop',
    description: 'Boost your productivity with custom tactile switches.',
  },
  {
    id: 4,
    name: 'Aura Ultra-Light Laptop Stand',
    price: 499000,
    category: 'Accessories',
    stock: 50,
    image:
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=600&auto=format&fit=crop',
    description: 'Improve your posture instantly with this lightweight stand.',
  },
  {
    id: 5,
    name: 'Luxury Leather Briefcase',
    price: 3990000,
    category: 'Fashion',
    stock: 5,
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop',
    description:
      'Premium handcrafted leather briefcase for the modern executive.',
  },
  {
    id: 6,
    name: 'Studio Microphone Pro',
    price: 1200000,
    category: 'Electronics',
    stock: 12,
    image:
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=600&auto=format&fit=crop',
    description: 'Crystal clear audio recording for podcasts and gaming.',
  },
  {
    id: 7,
    name: 'Wireless Charging Pad',
    price: 350000,
    category: 'Electronics',
    stock: 120,
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop',
    description:
      'Fast 15W wireless charging compatible with all Qi-certified devices.',
  },
  {
    id: 8,
    name: 'Polarized Aviator Sunglasses',
    price: 850000,
    category: 'Fashion',
    stock: 35,
    image:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop',
    description: 'Classic aviator sunglasses with UV400 protection.',
  },
  {
    id: 9,
    name: 'Stainless Steel Water Bottle',
    price: 299000,
    category: 'Accessories',
    stock: 80,
    image:
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop',
    description:
      'Insulated water bottle keeping drinks cold for 24h or hot for 12h.',
  },
  {
    id: 10,
    name: 'Noise Cancelling Earbuds',
    price: 1599000,
    category: 'Electronics',
    stock: 40,
    image:
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop',
    description: 'Compact true wireless earbuds with immersive sound.',
  },
  {
    id: 11,
    name: 'Designer Leather Wallet',
    price: 750000,
    category: 'Fashion',
    stock: 18,
    image:
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=600&auto=format&fit=crop',
    description: 'Slim bifold wallet crafted from genuine full-grain leather.',
  },
  {
    id: 12,
    name: 'Ergonomic Office Chair',
    price: 2490000,
    category: 'Furniture',
    stock: 8,
    image:
      'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=600&auto=format&fit=crop',
    description:
      'Premium mesh chair with lumbar support for long working hours.',
  },
];

// ---- STATE MANAGEMENT ----
let cart = JSON.parse(localStorage.getItem('sqa_cart')) || [];
let users = JSON.parse(localStorage.getItem('sqa_users')) || [];
let currentUser = JSON.parse(localStorage.getItem('sqa_session')) || null;
let orders = JSON.parse(localStorage.getItem('sqa_orders')) || [];
let currentFilters = {
  category: 'All',
  search: '',
  sort: 'default',
  priceLimit: 5000000,
};
let savedPromos = JSON.parse(localStorage.getItem('sqa_promos'));
let appliedPromos = Array.isArray(savedPromos) ? savedPromos : [];
if (users.length === 0) {
  users.push({
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  });
  localStorage.setItem('sqa_users', JSON.stringify(users));
}

// DOM Elements
const appContainer = document.getElementById('app-container');
const cartCount = document.getElementById('cart-count');
const authLinks = document.getElementById('auth-links');
const globalSearch = document.getElementById('global-search');
const searchBtn = document.getElementById('search-btn');
const searchSuggestions = document.getElementById('search-suggestions');

// ---- GLOBAL EVENT LISTENERS ----
searchBtn.addEventListener('click', () => handleGlobalSearch());
globalSearch.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleGlobalSearch();
});
globalSearch.addEventListener('input', handleSearchSuggest);
globalSearch.addEventListener('focus', handleSearchSuggest);
document.addEventListener('click', (e) => {
  if (!e.target.closest('#search-wrapper')) {
    searchSuggestions.classList.remove('active');
  }
});

function handleSearchSuggest(e) {
  const query = e.target.value.trim().toLowerCase();
  if (!query) {
    searchSuggestions.classList.remove('active');
    return;
  }

  let matches = mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query),
  );
  matches = matches.slice(0, 5);

  if (matches.length > 0) {
    searchSuggestions.innerHTML = matches
      .map(
        (m) => `
            <li onclick="window.location.hash='#/product/${m.id}'; document.getElementById('search-suggestions').classList.remove('active'); document.getElementById('global-search').value='${m.name.replace(/'/g, "\\'")}';" data-testid="suggest-item-${m.id}">
                <img src="${m.image}">
                <span>${m.name}</span>
            </li>
        `,
      )
      .join('');
  } else {
    searchSuggestions.innerHTML = `<li style="pointer-events:none; color:var(--text-muted);" data-testid="suggest-empty">No products found</li>`;
  }
  searchSuggestions.classList.add('active');
}

function handleGlobalSearch() {
  searchSuggestions.classList.remove('active');
  currentFilters.search = globalSearch.value.trim().toLowerCase();
  if (window.location.hash !== '#/') window.location.hash = '#/';
  else renderProducts();
}

function saveState() {
  localStorage.setItem('sqa_cart', JSON.stringify(cart));
  localStorage.setItem('sqa_users', JSON.stringify(users));
  localStorage.setItem('sqa_promos', JSON.stringify(appliedPromos));
  localStorage.setItem('sqa_orders', JSON.stringify(orders));
  if (currentUser)
    localStorage.setItem('sqa_session', JSON.stringify(currentUser));
  else localStorage.removeItem('sqa_session');
  updateNav();
}

function simulateNetworkDelay(ms, callback) {
  document.getElementById('global-spinner').style.display = 'flex';
  setTimeout(() => {
    document.getElementById('global-spinner').style.display = 'none';
    callback();
  }, ms);
}

// Modal State Hook
let targetDropId = null;
const modalContainer = document.getElementById('modal-container');
document.getElementById('modal-cancel-btn').addEventListener('click', () => {
  modalContainer.style.display = 'none';
  targetDropId = null;
});
document.getElementById('modal-confirm-btn').addEventListener('click', () => {
  if (targetDropId !== null) {
    cart = cart.filter((i) => i.id !== targetDropId);
    saveState();
    renderCart();
    targetDropId = null;
  }
  modalContainer.style.display = 'none';
});

// MODIFIKASI: Menambahkan logika sembunyikan Search Bar & Cart
function updateNav() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  const searchWrapper = document.getElementById('search-wrapper');
  const navCart = document.querySelector('.nav-cart');
  const currentHash = window.location.hash;

  // Sembunyikan elemen jika berada di halaman login atau register
  if (currentHash === '#login' || currentHash === '#register') {
    if (searchWrapper) searchWrapper.style.display = 'none';
    if (navCart) navCart.style.display = 'none';
  } else {
    // Tampilkan kembali di halaman lain
    if (searchWrapper) searchWrapper.style.display = 'flex';
    if (navCart) navCart.style.display = 'flex';
  }

  if (currentUser) {
    authLinks.innerHTML = `
            <span data-testid="greeting">Hi, ${currentUser.name.split(' ')[0]}</span>
            <a href="#profile" data-testid="nav-profile">Profile</a>
            <a href="#" onclick="handleLogout()" data-testid="nav-logout">Logout</a>
        `;
  } else {
    authLinks.innerHTML = `
            <a href="#login" data-testid="nav-login">Login</a>
            <a href="#register" data-testid="nav-register">Register</a>
        `;
  }
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toast.setAttribute('data-testid', `toast-${type}`);
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ---- ROUTER ----
function router() {
  const hash = window.location.hash;
  appContainer.classList.remove('fade-in');
  void appContainer.offsetWidth; // Reflow
  appContainer.classList.add('fade-in');

  updateNav();

  if (hash === '#login')
    currentUser ? (window.location.hash = '#/') : renderLogin();
  else if (hash === '#register')
    currentUser ? (window.location.hash = '#/') : renderRegister();
  else if (hash === '' || hash === '#/') requireAuth(renderProducts);
  else if (hash.startsWith('#/product/'))
    requireAuth(() => renderProductDetail(parseInt(hash.split('/')[2])));
  else if (hash === '#cart') requireAuth(renderCart);
  else if (hash === '#checkout') requireAuth(renderCheckout);
  else if (hash === '#profile') requireAuth(renderProfile);
  else if (hash.startsWith('#confirmation/'))
    requireAuth(() => renderConfirmation(hash.split('/')[1]));
  else requireAuth(renderProducts);
}
window.addEventListener('hashchange', router);

function requireAuth(renderFunc) {
  if (!currentUser) {
    showToast('You must be logged in to access this page.', 'error');
    window.location.hash = '#login';
  } else {
    renderFunc();
  }
}

// ---- AUTH VIEWS & LOGIC ----
function renderLogin() {
  appContainer.innerHTML = `
        <div class="auth-container" data-testid="login-page">
            <h2>Log In</h2>
            <div style="background: rgba(46, 204, 113, 0.1); border-left: 4px solid var(--success-color); padding: 10px; margin-bottom: 20px; font-size: 0.9rem;" data-testid="login-hint">
                <strong>Demo Account:</strong><br>
                Email: <code>test@example.com</code><br>
                Password: <code>password123</code>
            </div>
            <form id="login-form" data-testid="login-form" onsubmit="handleLogin(event)">
                <span id="login-error" class="error-msg" data-testid="login-error"></span>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="login-email" required data-testid="login-email">
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="login-password" required data-testid="login-password">
                </div>
                <button type="submit" class="btn-primary" data-testid="login-submit-btn">Login</button>
                <div style="margin-top:20px; text-align:center;">
                    <a href="#register" data-testid="link-to-register">Don't have an account? Register</a>
                </div>
            </form>
        </div>
    `;
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const pass = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');

  const user = users.find((u) => u.email === email && u.password === pass);
  if (user) {
    currentUser = user;
    saveState();
    showToast('Login successful!');
    window.location.hash = '#/';
  } else {
    errorEl.textContent = 'Invalid email or password';
  }
}

function renderRegister() {
  appContainer.innerHTML = `
        <div class="auth-container" data-testid="register-page">
            <h2>Create Account</h2>
            <form id="register-form" data-testid="register-form" onsubmit="handleRegister(event)">
                <span id="register-error" class="error-msg" data-testid="register-error"></span>
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" id="reg-name" required data-testid="reg-name">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="reg-email" required data-testid="reg-email">
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="reg-password" minlength="6" required data-testid="reg-password">
                </div>
                <button type="submit" class="btn-primary" data-testid="register-submit-btn">Register</button>
            </form>
        </div>
    `;
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const pass = document.getElementById('reg-password').value;
  const errorEl = document.getElementById('register-error');

  if (users.find((u) => u.email === email)) {
    errorEl.textContent = 'Email is already registered';
    return;
  }

  const newUser = { id: Date.now(), name, email, password: pass };
  users.push(newUser);
  currentUser = newUser;
  saveState();
  showToast('Registration successful!');
  window.location.hash = '#/';
}

function handleLogout() {
  currentUser = null;
  saveState();
  showToast('Logged out effectively');
  if (
    window.location.hash === '#checkout' ||
    window.location.hash === '#profile'
  ) {
    window.location.hash = '#login';
  } else {
    router();
  }
}

window.markOrderAction = (id) => {
  let order = orders.find((o) => o.orderId === id);
  if (order && order.status === 'Processing') {
    order.status = 'Completed';
  } else if (order && order.status === 'Completed') {
    orders = orders.filter((o) => o.orderId !== id);
  }
  saveState();
  renderProfile();
};

function renderProfile() {
  appContainer.innerHTML = `
        <div class="auth-container" data-testid="profile-page" style="max-width: 800px;">
            <h2>My Profile</h2>
            <p><strong>Name:</strong> <span data-testid="profile-name">${currentUser.name}</span></p>
            <p><strong>Email:</strong> <span data-testid="profile-email">${currentUser.email}</span></p>
            
            <h3 style="margin-top: 30px; margin-bottom: 15px;">Order History</h3>
            ${
              orders.length > 0
                ? `
            <div class="orders-grid" data-testid="orders-container">
                ${orders
                  .map(
                    (o) => `
                    <div class="order-card" data-testid="order-card-${o.orderId}">
                        <div class="order-card-header">
                            <span class="order-id" data-testid="order-row-id-${o.orderId}">${o.orderId}</span>
                            <span class="status-badge" style="${o.status === 'Completed' ? 'background:rgba(0,0,0,0.05); color:var(--text-muted);' : ''}" data-testid="order-row-status-${o.orderId}">${o.status}</span>
                        </div>
                        <div class="order-card-body">
                            <p><strong>Date:</strong> ${o.date}</p>
                            <p><strong>Quantities:</strong> ${o.items} ${o.items > 1 ? 'items' : 'item'}</p>
                        </div>
                        <div class="order-card-footer">
                            <button class="btn-secondary" style="width:100%; border-radius:8px;" onclick="markOrderAction('${o.orderId}')" data-testid="order-action-btn-${o.orderId}">
                                ${o.status === 'Completed' ? '✖ Clear Record' : '✔ Mark as Complete'}
                            </button>
                        </div>
                    </div>
                `,
                  )
                  .join('')}
            </div>
            `
                : `<p data-testid="empty-orders-msg">You have no previous orders.</p>`
            }

            <button class="btn-secondary" onclick="handleLogout()" style="width:100%; margin-top:30px;" data-testid="profile-logout-btn">Logout</button>
        </div>
    `;
}

// ---- PRODUCT & PLP LOGIC ----
window.updateCategory = (cat) => {
  currentFilters.category = cat;
  renderProducts();
};
window.updateSort = (val) => {
  currentFilters.sort = val;
  renderProducts();
};
window.updatePriceLimit = (val) => {
  currentFilters.priceLimit = parseInt(val);
  document.getElementById('price-limit-display').textContent = formatRupiah(
    currentFilters.priceLimit,
  );
};
window.applyPriceFilter = () => {
  renderProducts();
};

function renderProducts() {
  const maxPrice = 5000000;
  const currentPriceLimit = currentFilters.priceLimit || maxPrice;

  let filtered = mockProducts.filter((p) => {
    const matchCat =
      currentFilters.category === 'All' ||
      p.category === currentFilters.category;
    const matchSearch =
      p.name.toLowerCase().includes(currentFilters.search) ||
      p.description.toLowerCase().includes(currentFilters.search);
    const matchPrice = p.price <= currentPriceLimit;
    return matchCat && matchSearch && matchPrice;
  });

  if (currentFilters.sort === 'price-low')
    filtered.sort((a, b) => a.price - b.price);
  else if (currentFilters.sort === 'price-high')
    filtered.sort((a, b) => b.price - a.price);
  else if (currentFilters.sort === 'name-a')
    filtered.sort((a, b) => a.name.localeCompare(b.name));

  const categories = ['All', ...new Set(mockProducts.map((p) => p.category))];

  let html = `
        <div class="plp-layout" data-testid="plp-page">
            <aside class="sidebar-filters" data-testid="sidebar-filters">
                <div class="filter-group">
                    <h4>Categories</h4>
                    ${categories
                      .map(
                        (c) => `
                        <label>
                            <input type="radio" name="category" value="${c}" 
                                   ${currentFilters.category === c ? 'checked' : ''}
                                   onchange="updateCategory('${c}')" data-testid="filter-cat-${c}">
                            ${c}
                        </label>
                    `,
                      )
                      .join('')}
                </div>
                <div class="filter-group price-slider-container">
                    <h4>Max Price: <span id="price-limit-display" data-testid="price-limit-display">${formatRupiah(currentPriceLimit)}</span></h4>
                    <input type="range" id="price-slider" min="0" max="${maxPrice}" step="100000" value="${currentPriceLimit}" 
                           data-testid="price-slider" 
                           oninput="updatePriceLimit(this.value)" 
                           onchange="applyPriceFilter()">
                </div>
            </aside>
            <div class="main-content">
                <div class="plp-header">
                    <h2>Products ${currentFilters.search ? `(Search: "${currentFilters.search}")` : ''}</h2>
                    <select class="plp-sort-select" onchange="updateSort(this.value)" data-testid="sort-select">
                        <option value="default" ${currentFilters.sort === 'default' ? 'selected' : ''}>Featured</option>
                        <option value="price-low" ${currentFilters.sort === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
                        <option value="price-high" ${currentFilters.sort === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
                        <option value="name-a" ${currentFilters.sort === 'name-a' ? 'selected' : ''}>Name: A to Z</option>
                    </select>
                </div>
                <div class="product-grid" data-testid="product-grid">
    `;

  if (filtered.length === 0) {
    html += `<div style="grid-column: 1/-1; text-align:center; padding: 3rem;">No products found.</div>`;
  } else {
    filtered.forEach((p) => {
      const isOOS = p.stock === 0;
      html += `
                <div class="product-card" data-testid="product-card-${p.id}">
                    ${isOOS ? `<span class="out-of-stock-badge" data-testid="oos-badge-${p.id}">Out of Stock</span>` : ''}
                    <div class="product-image-container">
                        <img src="${p.image}" class="product-image">
                    </div>
                    <p class="product-category">${p.category}</p>
                    <h3 class="product-title" data-testid="name-${p.id}">${p.name}</h3>
                    <p class="product-price" data-testid="price-${p.id}">${formatRupiah(p.price)}</p>
                    <a href="#/product/${p.id}" class="btn-primary" data-testid="view-details-btn-${p.id}">View Details</a>
                </div>
            `;
    });
  }

  html += `</div></div></div>`;
  appContainer.innerHTML = html;
}

function renderProductDetail(id) {
  const product = mockProducts.find((p) => p.id === id);
  if (!product) return (appContainer.innerHTML = `<h2>Product not found</h2>`);

  const isOOS = product.stock === 0;

  appContainer.innerHTML = `
        <div class="product-detail" data-testid="pdp-page">
            <div class="detail-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="detail-info">
                ${isOOS ? `<span style="color:var(--error-color); font-weight:bold" data-testid="pdp-oos-msg">Currently Out of Stock</span>` : ''}
                <h1 data-testid="pdp-name">${product.name}</h1>
                <p class="product-category">${product.category}</p>
                <p class="product-price" style="font-size:2rem;" data-testid="pdp-price">${formatRupiah(product.price)}</p>
                <p class="detail-description" style="line-height:1.6; margin-bottom:2rem;">${product.description}</p>
                
                <div style="display:flex; gap:15px; margin-bottom: 2rem; align-items:center;">
                    <div class="quantity-controls" style="margin: 0;">
                        <button onclick="document.getElementById('pdp-qty').value = Math.max(1, parseInt(document.getElementById('pdp-qty').value) - 1)" 
                            data-testid="pdp-decrease-qty" ${isOOS ? 'disabled' : ''}>-</button>
                        <input type="number" id="pdp-qty" value="1" min="1" max="${product.stock}" 
                            style="width: 50px; text-align: center; border: 1px solid rgba(0,0,0,0.1); border-radius: 5px; font-family:inherit; font-weight:600;" 
                            data-testid="pdp-qty-input" ${isOOS ? 'disabled' : ''} readonly>
                        <button onclick="document.getElementById('pdp-qty').value = Math.min(${product.stock}, parseInt(document.getElementById('pdp-qty').value) + 1)" 
                            data-testid="pdp-increase-qty" ${isOOS ? 'disabled' : ''}>+</button>
                    </div>

                    <button class="btn-primary" style="flex: 1;" onclick="addToCart(${product.id}, parseInt(document.getElementById('pdp-qty').value) || 1)" 
                        ${isOOS ? 'disabled' : ''} data-testid="add-to-cart-btn">
                        ${isOOS ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ---- CART & CHECKOUT LOGIC ----
window.addToCart = (id, qty = 1) => {
  const product = mockProducts.find((p) => p.id === id);
  if (product.stock <= 0) return;

  const existing = cart.find((i) => i.id === id);
  if (existing) {
    if (existing.quantity + qty > product.stock) {
      showToast(`Only ${product.stock} items available in stock!`, 'error');
      return;
    }
    existing.quantity += qty;
  } else {
    if (qty > product.stock) {
      showToast(`Only ${product.stock} items available in stock!`, 'error');
      return;
    }
    cart.push({ ...product, quantity: qty });
  }

  saveState();
  showToast('Added to cart!');
};

window.updateQuantity = (id, newQty) => {
  if (newQty < 1) {
    removeFromCart(id);
    return;
  }
  const product = mockProducts.find((p) => p.id === id);
  const existing = cart.find((i) => i.id === id);
  if (existing && product) {
    if (newQty > product.stock) {
      showToast(`Only ${product.stock} items available in stock!`, 'error');
      return;
    }
    existing.quantity = newQty;
    saveState();
    renderCart();
  }
};

window.removeFromCart = (id) => {
  targetDropId = id;
  const product = cart.find((i) => i.id === id);
  if (product) {
    document.getElementById('modal-body').textContent =
      `Are you sure you want to remove ${product.name} from your cart?`;
    modalContainer.style.display = 'flex';
  }
};

window.applyPromoCode = () => {
  const input = document
    .getElementById('promo-input')
    .value.trim()
    .toUpperCase();
  const errorEl = document.getElementById('promo-error');

  errorEl.textContent = '';

  if (appliedPromos.find((p) => p.code === input)) {
    errorEl.textContent = 'Promo tersebut sudah aktif!';
    return;
  }

  let newPromo = null;
  if (input === 'EXPIRED20') {
    errorEl.textContent = 'Voucher EXPIRED20 sudah kadaluarsa.';
    return;
  }

  if (input === 'SQA100K') {
    newPromo = { code: 'SQA100K', amount: 100000, type: 'flat' };
  } else if (input === 'FREESHIP') {
    newPromo = { code: 'FREESHIP', amount: 25000, type: 'shipping' };
  } else if (input === 'DISC10') {
    newPromo = { code: 'DISC10', amount: 0.1, type: 'percent' };
  }

  if (newPromo) {
    const isBelanja = newPromo.type === 'flat' || newPromo.type === 'percent';
    const hasBelanja = appliedPromos.some(
      (p) => p.type === 'flat' || p.type === 'percent',
    );
    const hasLogistik = appliedPromos.some((p) => p.type === 'shipping');

    if (isBelanja && hasBelanja) {
      errorEl.textContent =
        'S&K Berlaku: Anda tidak bisa menumpuk tipe voucher sama. Hanya 1 Voucher Belanja yang diizinkan.';
      return;
    }
    if (!isBelanja && hasLogistik) {
      errorEl.textContent =
        'S&K Berlaku: Paling banyak hanya 1 Voucher Logistik yang diizinkan dalam 1 transaksi.';
      return;
    }

    appliedPromos.push(newPromo);
    saveState();
    showToast('Promo applied successfully!');
    renderCart();
  } else {
    errorEl.textContent = 'Invalid promo code';
  }
};

window.removePromo = (code) => {
  appliedPromos = appliedPromos.filter((p) => p.code !== code);
  saveState();
  showToast('Promo removed');
  renderCart();
};

function renderCart() {
  let rawSubtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  let rawShipping = cart.length > 0 ? 25000 : 0;

  let flatDiscount = 0;
  let percentDiscount = 0;
  let shippingDiscount = 0;

  appliedPromos.forEach((p) => {
    if (p.type === 'flat') flatDiscount += p.amount;
  });
  flatDiscount = Math.min(flatDiscount, rawSubtotal);

  let subtotalAfterFlat = rawSubtotal - flatDiscount;

  appliedPromos.forEach((p) => {
    if (p.type === 'percent') percentDiscount += subtotalAfterFlat * p.amount;
  });
  percentDiscount = Math.min(percentDiscount, subtotalAfterFlat);

  let totalSubtotalDiscount = flatDiscount + percentDiscount;

  appliedPromos.forEach((p) => {
    if (p.type === 'shipping') shippingDiscount += p.amount;
  });
  shippingDiscount = Math.min(shippingDiscount, rawShipping);

  let finalShipping = rawShipping - shippingDiscount;
  let total = Math.max(0, rawSubtotal - totalSubtotalDiscount) + finalShipping;

  let hasStockIssue = false;
  cart.forEach((cItem) => {
    const p = mockProducts.find((p) => p.id === cItem.id);
    if (p && cItem.quantity > p.stock) hasStockIssue = true;
  });

  let html = `
        <div class="cart-wrapper" data-testid="cart-page">
            <div class="cart-items">
                <h2>Your Cart</h2>
    `;

  if (cart.length === 0) {
    html += `<p data-testid="empty-cart-message">Cart is empty.</p></div>`;
  } else {
    cart.forEach((item) => {
      html += `
                <div class="cart-item" data-testid="cart-item-${item.id}">
                    <div class="cart-item-info">
                        <img src="${item.image}">
                        <div>
                            <h4>${item.name}</h4>
                            <p style="margin-bottom: 8px;">${formatRupiah(item.price)}</p>
                            <div class="quantity-controls">
                                <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" data-testid="cart-decrease-qty-${item.id}">-</button>
                                <span data-testid="cart-item-qty-${item.id}" style="font-weight: 600; min-width: 20px; text-align: center;">${item.quantity}</span>
                                <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" data-testid="cart-increase-qty-${item.id}">+</button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <span style="font-weight:bold; margin-right: 15px;">${formatRupiah(item.price * item.quantity)}</span>
                        <button class="btn-secondary" style="padding: 5px 10px;" onclick="removeFromCart(${item.id})" data-testid="remove-btn-${item.id}">Drop</button>
                    </div>
                </div>
            `;
    });
    html += `</div>`;
  }

  html += `
            <div class="cart-summary">
                <h3>Summary</h3>
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span>Subtotal</span>
                    <span data-testid="cart-subtotal">${formatRupiah(rawSubtotal)}</span>
                </div>

                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span>Shipping Fee</span>
                    <span data-testid="cart-shipping">${formatRupiah(rawShipping)}</span>
                </div>
                
                <div class="promo-box">
                    <input type="text" id="promo-input" placeholder="Promo / Voucher" data-testid="promo-input" onkeypress="if(event.key === 'Enter') applyPromoCode()">
                    <button onclick="applyPromoCode()" data-testid="apply-promo-btn">Apply</button>
                </div>
                <div style="margin-top: 5px; margin-bottom: 15px; font-size: 0.85rem; color: var(--text-muted);">
                    <span data-testid="promo-info">Masukkan kode voucher untuk melihat diskon yang tersedia atau peringatan jika voucher telah kedaluwarsa.</span>
                </div>
                <div style="background: rgba(46, 204, 113, 0.05); padding: 10px; border-radius: 8px; font-size: 0.85rem; margin-top: -5px; margin-bottom: 15px; border: 1px solid var(--success-color);" data-testid="promo-hints">
                    <strong>Voucher Tersedia:</strong>
                    <ul style="margin: 5px 0 10px 15px; padding: 0; color:var(--text-muted);">
                        <li><code>DISC10</code> : Diskon 10% (Subtotal)</li>
                        <li><code>SQA100K</code> : Potongan Rp 100.000 (Subtotal)</li>
                        <li><code>FREESHIP</code> : Gratis Ongkos Kirim</li>
                        <li><code>EXPIRED20</code> : Voucher kadaluarsa, hanya untuk testing.</li>
                    </ul>
                    <div style="color: var(--text-muted); font-size: 0.8rem; font-style: italic; border-top: 1px dashed rgba(0,0,0,0.1); padding-top: 5px;" data-testid="promo-tnc">
                        *Syarat & Ketentuan: Anda diperbolehkan menggabungkan maksimal 1 Voucher Belanja dengan 1 Voucher Logistik.
                    </div>
                </div>
                <span id="promo-error" style="color:var(--error-color); font-size: 0.85rem;" data-testid="promo-error"></span>

                ${appliedPromos
                  .map((promo) => {
                    let discountAmount = 0;
                    if (promo.type === 'flat')
                      discountAmount = Math.min(promo.amount, rawSubtotal);
                    else if (promo.type === 'percent')
                      discountAmount = subtotalAfterFlat * promo.amount;
                    else if (promo.type === 'shipping')
                      discountAmount = Math.min(promo.amount, rawShipping);

                    return `
                    <div style="display:flex; justify-content:space-between; color:var(--success-color); margin-bottom:10px; font-size: 0.95rem;">
                        <span>
                            Diskon (${promo.code})
                            <span style="color:var(--error-color); cursor:pointer; margin-left: 5px; font-weight:bold;" onclick="removePromo('${promo.code}')" data-testid="remove-promo-${promo.code}">&#10006;</span>
                        </span>
                        <span data-testid="cart-discount-${promo.code}">- ${formatRupiah(discountAmount)}</span>
                    </div>
                    `;
                  })
                  .join('')}
                
                <hr style="border:0; border-top:1px solid #ccc; margin: 15px 0;">
                <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:1.2rem; margin-bottom:20px;">
                    <span>Total</span>
                    <span data-testid="cart-total">${formatRupiah(total)}</span>
                </div>

                <a href="#checkout" class="btn-primary" ${cart.length === 0 || hasStockIssue ? 'disabled style="pointer-events:none; background:#ccc"' : ''} data-testid="checkout-btn">${hasStockIssue ? 'Fix Stock to Checkout' : 'Proceed to Checkout'}</a>
            </div>
        </div>
    `;
  appContainer.innerHTML = html;
}

function renderCheckout() {
  if (cart.length === 0) return (window.location.hash = '#cart');

  appContainer.innerHTML = `
        <div class="auth-container" style="max-width:600px;" data-testid="checkout-page">
            <h2>Secure Checkout</h2>
            <form id="chk-form" data-testid="checkout-form">
                <span id="chk-error" class="error-msg" data-testid="chk-error"></span>
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" id="chk-name" required data-testid="chk-name" value="${currentUser ? currentUser.name : ''}">
                </div>
                <div class="form-group">
                    <label>Postal Code</label>
                    <input type="text" id="chk-postal" required data-testid="chk-postal" placeholder="e.g. 12345">
                    <small style="color:var(--text-muted); font-size:0.8rem;">Must be exactly 5 numerical digits.</small>
                </div>
                <div class="form-group">
                    <label>Mock Credit Card</label>
                    <input type="text" id="chk-card" required placeholder="0000 0000 0000 0000" data-testid="chk-card" maxlength="19">
                </div>
                <button type="button" class="btn-primary" onclick="handleCheckoutSubmit()" data-testid="submit-order-btn">Pay Now (Simulate Delay)</button>
            </form>
        </div>
    `;

  const cb = document.getElementById('chk-card');
  if (cb) {
    cb.addEventListener('input', function (e) {
      let target = e.target,
        position = target.selectionEnd,
        length = target.value.length;
      target.value = target.value
        .replace(/[^0-9]/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim();
      target.selectionEnd =
        position +
        (target.value.charAt(position - 1) === ' ' &&
        target.value.charAt(length - 1) === ' '
          ? 1
          : 0);
    });
  }
}

window.handleCheckoutSubmit = () => {
  const errorEl = document.getElementById('chk-error');
  errorEl.textContent = '';

  let stockError = null;
  cart.forEach((cItem) => {
    const prod = mockProducts.find((p) => p.id === cItem.id);
    if (prod && cItem.quantity > prod.stock) {
      stockError = `Sorry, product "${prod.name}" only has ${prod.stock} items left. Please adjust your Cart.`;
    }
  });

  if (stockError) {
    errorEl.textContent = stockError;
    return;
  }

  const name = document.getElementById('chk-name').value;
  const postal = document.getElementById('chk-postal').value;
  const card = document.getElementById('chk-card').value.replace(/\s/g, '');

  if (!name || !postal || !card) {
    errorEl.textContent = 'All fields are required.';
    return;
  }
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    errorEl.textContent = 'Name must contain only letters and spaces.';
    return;
  }
  if (!/^\d{5}$/.test(postal)) {
    errorEl.textContent = 'Postal code must be exactly 5 digits.';
    return;
  }
  if (!/^\d{16}$/.test(card)) {
    errorEl.textContent = 'Credit card must be 16 digits format.';
    return;
  }

  simulateNetworkDelay(1500, executeOrder);
};

function executeOrder() {
  const newOrder = {
    orderId: 'SQA-' + Math.floor(Math.random() * 900000 + 100000),
    date: new Date().toLocaleDateString(),
    items: cart.reduce((s, i) => s + i.quantity, 0),
    status: 'Processing',
  };
  orders.unshift(newOrder);

  cart.forEach((cItem) => {
    const prod = mockProducts.find((p) => p.id === cItem.id);
    if (prod) prod.stock -= cItem.quantity;
  });

  cart = [];
  appliedPromos = [];
  saveState();
  window.location.hash = '#confirmation/' + newOrder.orderId;
}

function renderConfirmation(orderId) {
  if (!orderId) orderId = 'SQA-000000';
  appContainer.innerHTML = `
        <div class="success-view" data-testid="order-confirmation-page">
            <h2 data-testid="success-header">Payment Successful!</h2>
            <p>Thank you for shopping, ${currentUser ? currentUser.name : 'Guest'}.</p>
            <p style="font-size:1.2rem; margin:20px 0;">Your Order ID is <strong data-testid="order-id">${orderId}</strong></p>
            <a href="#/" class="btn-primary" style="display:inline-block; max-width:200px;" data-testid="back-to-home-btn">Continue Shopping</a>
            <a href="#profile" class="btn-secondary" style="display:inline-block; max-width:200px; margin-top:10px;" data-testid="view-orders-btn">View My Orders</a>
        </div>
    `;
}

// Boot
updateNav();
router();
