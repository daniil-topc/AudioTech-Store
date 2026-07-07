// AudioTech shopping cart (localStorage-based)
(function () {
  const STORAGE_KEY = "audiotech-cart";

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    updateBadge();
  }

  function addToCart(productId, quantity = 1) {
    const cart = getCart();
    const existing = cart.find((item) => item.id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ id: productId, quantity });
    }
    saveCart(cart);
    renderCartDrawer();
    openCartDrawer();
  }

  function removeFromCart(productId) {
    saveCart(getCart().filter((item) => item.id !== productId));
    renderCartDrawer();
  }

  function updateQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find((i) => i.id === productId);
    if (!item) return;
    item.quantity = quantity;
    if (item.quantity <= 0) {
      saveCart(cart.filter((i) => i.id !== productId));
    } else {
      saveCart(cart);
    }
    renderCartDrawer();
  }

  function cartCount() {
    return getCart().reduce((sum, item) => sum + item.quantity, 0);
  }

  function cartTotal() {
    return getCart().reduce((sum, item) => {
      const product = window.getProductById(item.id);
      return product ? sum + product.price * item.quantity : sum;
    }, 0);
  }

  function updateBadge() {
    const badge = document.querySelector(".cart-badge");
    if (!badge) return;
    const count = cartCount();
    badge.textContent = count;
    badge.classList.toggle("cart-badge-visible", count > 0);
  }

  // ---- Drawer markup ----
  function injectDrawer() {
    const drawer = document.createElement("div");
    drawer.className = "cart-drawer-wrapper";
    drawer.innerHTML = `
      <div class="cart-overlay" aria-hidden="true"></div>
      <aside class="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping cart">
        <div class="cart-drawer-header">
          <h2 class="cart-drawer-title">Your Cart</h2>
          <button class="cart-close-button" type="button" aria-label="Close cart">&times;</button>
        </div>
        <div class="cart-items"></div>
        <div class="cart-drawer-footer">
          <div class="cart-total-row">
            <span class="cart-total-label">Total</span>
            <span class="cart-total-value">$0.00</span>
          </div>
          <button class="cart-checkout-button button" type="button">Checkout</button>
        </div>
      </aside>
    `;
    document.body.appendChild(drawer);

    drawer.querySelector(".cart-overlay").addEventListener("click", closeCartDrawer);
    drawer.querySelector(".cart-close-button").addEventListener("click", closeCartDrawer);
    drawer.querySelector(".cart-checkout-button").addEventListener("click", checkout);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeCartDrawer();
    });
  }

  function openCartDrawer() {
    document.body.classList.add("cart-open");
  }

  function closeCartDrawer() {
    document.body.classList.remove("cart-open");
  }

  function checkout() {
    const cart = getCart();
    if (cart.length === 0) return;
    saveCart([]);
    renderCartDrawer();
    const itemsEl = document.querySelector(".cart-items");
    if (itemsEl) {
      itemsEl.innerHTML =
        '<p class="cart-empty cart-success">Thank you for your order! We will contact you soon.</p>';
    }
  }

  function renderCartDrawer() {
    const itemsEl = document.querySelector(".cart-items");
    const totalEl = document.querySelector(".cart-total-value");
    const checkoutBtn = document.querySelector(".cart-checkout-button");
    if (!itemsEl) return;

    const cart = getCart();

    if (cart.length === 0) {
      itemsEl.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
      if (totalEl) totalEl.textContent = "$0.00";
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    itemsEl.innerHTML = cart
      .map((item) => {
        const product = window.getProductById(item.id);
        if (!product) return "";
        return `
          <div class="cart-item" data-id="${product.id}">
            <a href="product.html?id=${product.id}" class="cart-item-image-link">
              <img src="${product.image}" alt="${product.name}" class="cart-item-image" width="72" height="72" />
            </a>
            <div class="cart-item-info">
              <a href="product.html?id=${product.id}" class="cart-item-name">${product.name}</a>
              <span class="cart-item-price">${window.formatPrice(product.price)}</span>
              <div class="cart-item-controls">
                <button class="cart-qty-button" type="button" data-action="decrease" aria-label="Decrease quantity">&minus;</button>
                <span class="cart-item-qty">${item.quantity}</span>
                <button class="cart-qty-button" type="button" data-action="increase" aria-label="Increase quantity">+</button>
                <button class="cart-remove-button" type="button" data-action="remove" aria-label="Remove item">Remove</button>
              </div>
            </div>
            <span class="cart-item-subtotal">${window.formatPrice(product.price * item.quantity)}</span>
          </div>
        `;
      })
      .join("");

    if (totalEl) totalEl.textContent = window.formatPrice(cartTotal());

    itemsEl.querySelectorAll(".cart-item").forEach((row) => {
      const id = Number(row.dataset.id);
      row.querySelectorAll("[data-action]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const action = btn.dataset.action;
          const item = getCart().find((i) => i.id === id);
          if (!item) return;
          if (action === "increase") updateQuantity(id, item.quantity + 1);
          if (action === "decrease") updateQuantity(id, item.quantity - 1);
          if (action === "remove") removeFromCart(id);
        });
      });
    });
  }

  function initCartButton() {
    const cartButton = document.querySelector(".cart-button");
    if (cartButton) {
      cartButton.addEventListener("click", () => {
        renderCartDrawer();
        openCartDrawer();
      });
    }
  }

  function init() {
    injectDrawer();
    initCartButton();
    renderCartDrawer();
    updateBadge();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Public API
  window.Cart = {
    add: addToCart,
    remove: removeFromCart,
    updateQuantity,
    getCart,
    open: openCartDrawer,
    close: closeCartDrawer,
  };
})();
