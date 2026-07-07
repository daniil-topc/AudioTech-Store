// Product detail page rendering
(function () {
  const container = document.getElementById("product-detail");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const product = window.getProductById(productId);

  if (!product) {
    container.innerHTML = `
      <div class="product-not-found">
        <h1 class="title">Product not found</h1>
        <p class="product-not-found-text">The product you are looking for does not exist or was removed.</p>
        <a href="index.html#products" class="hero-button">Back to Products</a>
      </div>
    `;
    return;
  }

  document.title = product.name + " — AudioTech";
  const breadcrumb = document.getElementById("breadcrumb-product");
  if (breadcrumb) breadcrumb.textContent = product.name;

  function starsMarkup(rating) {
    const full = Math.round(rating);
    let html = "";
    for (let i = 1; i <= 5; i++) {
      html += `<span class="star ${i <= full ? "star-filled" : ""}" aria-hidden="true">★</span>`;
    }
    return html;
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const specsRows = Object.entries(product.specs)
    .map(
      ([key, value]) => `
        <tr class="specs-row">
          <th class="specs-key" scope="row">${key}</th>
          <td class="specs-value">${value}</td>
        </tr>
      `
    )
    .join("");

  const featuresList = product.features
    .map((f) => `<li class="feature-item">${f}</li>`)
    .join("");

  const reviewsList = product.reviews
    .map(
      (review) => `
        <article class="review-card">
          <div class="review-header">
            <span class="review-author">${review.name}</span>
            <span class="review-date">${formatDate(review.date)}</span>
          </div>
          <div class="review-stars" role="img" aria-label="${review.rating} out of 5 stars">
            ${starsMarkup(review.rating)}
          </div>
          <p class="review-text">${review.text}</p>
        </article>
      `
    )
    .join("");

  container.innerHTML = `
    <section class="product-hero">
      <div class="product-hero-image-wrap">
        <img src="${product.image}" alt="${product.name}" class="product-hero-image" width="500" />
      </div>
      <div class="product-hero-info">
        <h1 class="product-detail-title title">${product.name}</h1>
        <div class="product-rating">
          <div class="review-stars" role="img" aria-label="Average rating ${product.rating} out of 5 stars">
            ${starsMarkup(product.rating)}
          </div>
          <span class="product-rating-value">${product.rating}</span>
          <span class="product-review-count">(${product.reviews.length} reviews)</span>
        </div>
        <p class="product-detail-price">${window.formatPrice(product.price)}</p>
        <p class="product-detail-description">${product.description}</p>
        <ul class="feature-list">${featuresList}</ul>
        <div class="product-actions">
          <div class="qty-selector">
            <button class="qty-button" type="button" id="qty-decrease" aria-label="Decrease quantity">&minus;</button>
            <span class="qty-value" id="qty-value" aria-live="polite">1</span>
            <button class="qty-button" type="button" id="qty-increase" aria-label="Increase quantity">+</button>
          </div>
          <button class="add-to-cart-button button" type="button" id="add-to-cart">Add to Cart</button>
        </div>
      </div>
    </section>
    <section class="product-specs">
      <h2 class="title specs-title">Specifications</h2>
      <table class="specs-table">
        <tbody>${specsRows}</tbody>
      </table>
    </section>
    <section class="product-reviews">
      <h2 class="title reviews-title">Customer Reviews</h2>
      <div class="reviews-grid">${reviewsList}</div>
    </section>
  `;

  // Quantity selector + add to cart
  let quantity = 1;
  const qtyValue = document.getElementById("qty-value");
  document.getElementById("qty-decrease").addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      qtyValue.textContent = quantity;
    }
  });
  document.getElementById("qty-increase").addEventListener("click", () => {
    quantity++;
    qtyValue.textContent = quantity;
  });
  document.getElementById("add-to-cart").addEventListener("click", () => {
    window.Cart.add(product.id, quantity);
    quantity = 1;
    qtyValue.textContent = "1";
  });
})();
