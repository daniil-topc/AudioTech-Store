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
