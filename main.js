// Render product catalog on the home page (before animations are set up)
const productGrid = document.getElementById("product-grid");
if (productGrid && window.PRODUCTS) {
  productGrid.innerHTML = window.PRODUCTS.map(
    (product) => `
      <div class="product-item">
        <a href="product.html?id=${product.id}" class="product-link">
          <img
            src="${product.image}"
            alt="${product.name}"
            class="product-image"
            width="375"
          />
        </a>
        <div class="product-desc">
          <h3 class="product-name">
            <a href="product.html?id=${product.id}" class="product-name-link">${product.name}</a>
          </h3>
          <span class="product-price">${window.formatPrice(product.price)}</span>
          <div class="product-card-actions">
            <a href="product.html?id=${product.id}" class="product-button">View</a>
            <button class="product-button product-add-button" type="button" data-id="${product.id}">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `
  ).join("");

  productGrid.querySelectorAll(".product-add-button").forEach((button) => {
    button.addEventListener("click", () => {
      window.Cart.add(Number(button.dataset.id), 1);
    });
  });
}

const burgerButton = document.querySelector(".burger-button");
const body = document.body;
const navLinks = document.querySelectorAll(".navbar .nav-link");
const animatedElements = document.querySelectorAll(
  ".hero, .brands, .product-item, .about-text, .about-card, .footer-left, .footer-center, .footer-right"
);

if (burgerButton) {
  const closeMenu = () => {
    body.classList.remove("menu-open");
    burgerButton.setAttribute("aria-expanded", "false");
    burgerButton.setAttribute("aria-label", "Open navigation menu");
  };

  const openMenu = () => {
    body.classList.add("menu-open");
    burgerButton.setAttribute("aria-expanded", "true");
    burgerButton.setAttribute("aria-label", "Close navigation menu");
  };

  burgerButton.addEventListener("click", () => {
    if (body.classList.contains("menu-open")) {
      closeMenu();
      return;
    }

    openMenu();
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

if (animatedElements.length > 0) {
  animatedElements.forEach((element, index) => {
    element.classList.add("fade-in");
    element.style.transitionDelay = `${Math.min(index * 70, 420)}ms`;
  });

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  animatedElements.forEach((element) => {
    observer.observe(element);
  });
}
