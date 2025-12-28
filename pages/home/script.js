const products = [
    { id: 1, name: "Essential Cotton Tee", category: "Apparel", price: 34.00, img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800", badge: "Best Seller" },
    { id: 2, name: "Nylon Bomber Jacket", category: "Outerwear", price: 129.00, img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800", badge: "New" },
    { id: 3, name: "Classic Leather Sneakers", category: "Footwear", price: 155.00, img: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=800", badge: null },
    { id: 4, name: "Wool Blend Overcoat", category: "Outerwear", price: 299.00, img: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&q=80&w=800", badge: "Premium" },
    { id: 5, name: "Modern Cargo Pants", category: "Apparel", price: 89.00, img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800", badge: null },
    { id: 6, name: "Suede Tote Bag", category: "Accessories", price: 110.00, img: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800", badge: "Limited" },
    { id: 7, name: "Minimalist Watch", category: "Accessories", price: 195.00, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800", badge: null },
    { id: 8, name: "Linen Shirt", category: "Apparel", price: 65.00, img: "https://images.unsplash.com/photo-1596755094514-f87034a2612d?auto=format&fit=crop&q=80&w=800", badge: "Restock" }
];

// State management
let cartItems = JSON.parse(localStorage.getItem('luxe_cart')) || [];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartCount = document.querySelector('.cart-count');
const mainContent = document.getElementById('main-content');
const cartPage = document.getElementById('cart-page');
const cartItemsList = document.getElementById('cart-items-list');
const emptyCartMsg = document.getElementById('empty-cart-msg');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotal = document.getElementById('cart-total');
const cartTrigger = document.getElementById('cart-trigger');
const backToShop = document.getElementById('back-to-shop');
const homeTrigger = document.getElementById('home-trigger');
const navHome = document.getElementById('nav-home');

// Sidebar Elements
const menuTrigger = document.getElementById('menu-trigger');
const sideMenu = document.getElementById('side-menu');
const closeMenu = document.getElementById('close-menu');
const sideOverlay = document.getElementById('sidebar-overlay');

// Search Elements
const searchTrigger = document.getElementById('search-trigger');
const searchModal = document.getElementById('search-modal');
const closeSearch = document.getElementById('close-search');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

/**
 * UI - Sidebar Control
 */
function toggleMenu(show) {
    sideMenu.classList.toggle('open', show);
    sideOverlay.classList.toggle('visible', show);
    document.body.style.overflow = show ? 'hidden' : '';
}

/**
 * UI - Search Control
 */
function toggleSearch(show) {
    searchModal.classList.toggle('visible', show);
    document.body.style.overflow = show ? 'hidden' : '';
    if (show) {
        setTimeout(() => searchInput.focus(), 300);
    }
}

function handleSearch(e) {
    const term = e.target.value.toLowerCase();
    if (!term) {
        searchResults.innerHTML = '';
        return;
    }

    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.category.toLowerCase().includes(term)
    );

    searchResults.innerHTML = filtered.length > 0 
        ? filtered.map(p => `
            <div class="search-result-item" onclick="navigateToProduct(${p.id})">
                <img src="${p.img}" class="search-result-img">
                <div>
                    <div style="font-weight:600">${p.name}</div>
                    <div style="font-size:0.8rem; color:var(--secondary)">${p.category}</div>
                </div>
                <div style="margin-left:auto; font-weight:600">$${p.price.toFixed(2)}</div>
            </div>
        `).join('')
        : '<p style="padding:1rem; color:var(--secondary)">No products found matching your search.</p>';
}

window.navigateToProduct = (id) => {
    toggleSearch(false);
    // In a real app, this would route to a product page
    console.log("Navigate to product:", id);
};

/**
 * Catalog Rendering
 */
function renderProducts() {
    if (!productGrid) return;
    productGrid.innerHTML = products.map((product, index) => `
        <div class="product-card" data-product-id="${product.id}" style="animation: fadeIn 0.8s ease forwards ${index * 0.1}s; opacity: 0;">
            <div class="product-img-wrapper">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <img src="${product.img}" alt="${product.name}" loading="lazy">
                <div class="product-actions">
                    <button class="action-btn btn-add" data-id="${product.id}" aria-label="Add to Cart">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="action-btn" aria-label="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <a href="#" class="product-name">${product.name}</a>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart-button" data-id="${product.id}">
                    <i class="fas fa-shopping-bag"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');

    // Attach event listeners to all add-to-cart buttons
    document.querySelectorAll('.btn-add, .add-to-cart-button').forEach(btn => {
        btn.addEventListener('click', handleAddToCart);
    });
}

/**
 * Cart Management
 */
function handleAddToCart(e) {
    e.preventDefault();
    const btn = e.currentTarget;
    const productId = parseInt(btn.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);

    if (product) {
        console.log(`Product added to cart: ${product.name} (ID: ${product.id})`);
        
        const existingItem = cartItems.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({ ...product, quantity: 1 });
        }

        saveCart();
        updateUI();

        // Visual Feedback
        const isMainBtn = btn.classList.contains('add-to-cart-button');
        const originalHTML = btn.innerHTML;
        
        if (isMainBtn) {
            btn.innerHTML = '<i class="fas fa-check"></i> Added';
            btn.style.backgroundColor = 'var(--success)';
            btn.style.borderColor = 'var(--success)';
        } else {
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.style.background = 'var(--success)';
            btn.style.color = 'white';
        }

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            if (isMainBtn) {
                btn.style.backgroundColor = '';
                btn.style.borderColor = '';
            } else {
                btn.style.background = '';
                btn.style.color = '';
            }
        }, 1500);
    }
}

function saveCart() {
    localStorage.setItem('luxe_cart', JSON.stringify(cartItems));
}

function renderCart() {
    if (cartItems.length === 0) {
        cartItemsList.innerHTML = '';
        emptyCartMsg.classList.remove('hidden');
        updatePrices(0);
        return;
    }

    emptyCartMsg.classList.add('hidden');
    cartItemsList.innerHTML = cartItems.map(item => `
        <li class="cart-item">
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 style="margin-bottom:0.25rem">${item.name}</h4>
                <p style="font-size:0.8rem; color:var(--secondary)">${item.category}</p>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="changeQty(${item.id}, -1)"><i class="fas fa-minus"></i></button>
                    <span class="qty-val">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQty(${item.id}, 1)"><i class="fas fa-plus"></i></button>
                </div>
            </div>
            <div class="cart-item-price-actions" style="text-align:right">
                <div style="font-weight:600">$${(item.price * item.quantity).toFixed(2)}</div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})" style="background:none; border:none; color:var(--secondary); font-size:0.75rem; cursor:pointer; margin-top:1rem; text-decoration:underline">Remove</button>
            </div>
        </li>
    `).join('');

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    updatePrices(total);
}

window.changeQty = function(id, delta) {
    const item = cartItems.find(i => i.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) removeFromCart(id);
        else { saveCart(); updateUI(); }
    }
};

window.removeFromCart = function(id) {
    cartItems = cartItems.filter(i => i.id !== id);
    saveCart();
    updateUI();
};

function updatePrices(total) {
    const formatted = `$${total.toFixed(2)}`;
    if (cartSubtotal) cartSubtotal.textContent = formatted;
    if (cartTotal) cartTotal.textContent = formatted;
}

function updateUI() {
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
    if (cartPage && !cartPage.classList.contains('hidden')) renderCart();
}

/**
 * Navigation
 */
function showCartPage() {
    mainContent.classList.add('hidden');
    cartPage.classList.remove('hidden');
    if (navHome) navHome.classList.remove('active');
    renderCart();
    window.scrollTo(0, 0);
}

function hideCartPage() {
    cartPage.classList.add('hidden');
    mainContent.classList.remove('hidden');
    if (navHome) navHome.classList.add('active');
    window.scrollTo(0, 0);
}

// Event Listeners
if (menuTrigger) menuTrigger.addEventListener('click', () => toggleMenu(true));
if (closeMenu) closeMenu.addEventListener('click', () => toggleMenu(false));
if (sideOverlay) sideOverlay.addEventListener('click', () => toggleMenu(false));

if (searchTrigger) searchTrigger.addEventListener('click', () => toggleSearch(true));
if (closeSearch) closeSearch.addEventListener('click', () => toggleSearch(false));
if (searchInput) searchInput.addEventListener('input', handleSearch);

if (cartTrigger) cartTrigger.addEventListener('click', showCartPage);
if (backToShop) backToShop.addEventListener('click', hideCartPage);
if (homeTrigger) homeTrigger.addEventListener('click', hideCartPage);
if (navHome) navHome.addEventListener('click', (e) => {
    e.preventDefault();
    hideCartPage();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateUI();
    
    // Global styles for animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
    `;
    document.head.appendChild(style);
});