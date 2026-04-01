const products = [
  {
    id: "key-lime-cupcake",
    name: "Key Lime Cupcake",
    category: "Cupcake",
    price: 6,
    image: "images/products/cupcakes-lime.jpg",
    description:
      "A bright citrus cupcake finished with a smooth swirl of frosting and styled lime garnish for a clean bakery look."
  },
  {
    id: "chocolate-dream-cupcake",
    name: "Chocolate Dream Cupcake",
    category: "Cupcake",
    price: 6,
    image: "images/products/cupcakes-chocolate.jpg",
    description:
      "Rich chocolate cake topped with creamy frosting and chocolate sprinkles for a classic dessert-shop finish."
  },
  {
    id: "cherry-blossom-cupcake",
    name: "Cherry Blossom Cupcake",
    category: "Cupcake",
    price: 7,
    image: "images/products/cupcakes-cherry.jpg",
    description:
      "A signature Tiny Cakes centerpiece with a soft pink swirl, elegant plating, and a bold cherry topper."
  },
  {
    id: "chocolate-chip-cookie",
    name: "Chocolate Chip Cookie",
    category: "Cookie",
    price: 4,
    image: "images/products/cookie-chip.jpg",
    description:
      "A classic bakery cookie with golden edges, soft texture, and generous chocolate chips."
  },
  {
    id: "double-chocolate-cookie",
    name: "Double Chocolate Cookie",
    category: "Cookie",
    price: 5,
    image: "images/products/cookie-chocolate.jpg",
    description:
      "A rich chocolate cookie finished with a dusting of sugar for a more indulgent café-style dessert."
  },
  {
    id: "berry-muffin",
    name: "Berry Muffin",
    category: "Muffin",
    price: 5,
    image: "images/products/muffin-berries.jpg",
    description:
      "A soft bakery muffin baked with berries and styled as a fresh display item for the Tiny Cakes menu."
  },
  {
    id: "cranberry-muffin",
    name: "Cranberry Muffin",
    category: "Muffin",
    price: 5,
    image: "images/products/muffin-dots.jpg",
    description:
      "A tall paper-wrapped muffin with berry detail and a bold bakery display feel."
  },
  {
    id: "signature-latte",
    name: "Signature Latte",
    category: "Drink",
    price: 5,
    image: "images/products/coffee-latte.jpg",
    description:
      "A warm latte pairing that expands Tiny Cakes from dessert brand to complete café experience."
  },
  {
    id: "herbal-tea",
    name: "Herbal Tea",
    category: "Drink",
    price: 4,
    image: "images/products/tea-herbal.jpg",
    description:
      "A light herbal tea option styled to complement the soft botanical Tiny Cakes aesthetic."
  }
];

const STORAGE_KEY = "tiny-cakes-cart";

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");
const quickViewButtons = document.querySelectorAll(".quick-view-trigger");
const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

const cartButton = document.getElementById("cartButton");
const cartDrawer = document.getElementById("cartDrawer");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const cartSummary = document.getElementById("cartSummary");
const clearCartBtn = document.getElementById("clearCartBtn");

const overlay = document.getElementById("overlay");

const productModal = document.getElementById("productModal");
const modalClose = document.getElementById("modalClose");
const modalImage = document.getElementById("modalImage");
const modalCategory = document.getElementById("modalCategory");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalAddToCart = document.getElementById("modalAddToCart");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxTriggers = document.querySelectorAll(".lightbox-trigger");

const testimonialQuote = document.getElementById("testimonialQuote");
const testimonialName = document.getElementById("testimonialName");
const revealElements = document.querySelectorAll(".reveal");

const testimonials = [
  {
    quote:
      "“Tiny Cakes feels polished, charming, and ready for a boutique brand launch.”",
    name: "— Portfolio Review"
  },
  {
    quote:
      "“The visual direction is memorable and the interactive browsing makes the project stand out.”",
    name: "— Front-End Showcase"
  },
  {
    quote:
      "“A strong example of how thoughtful HTML, CSS, and JavaScript can elevate a static site.”",
    name: "— Design Feedback"
  }
];

let testimonialIndex = 0;
let activeProductId = null;
let cart = loadCart();

function loadCart() {
  try {
    const savedCart = localStorage.getItem(STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function findProduct(productId) {
  return products.find((product) => product.id === productId);
}

function formatPrice(value) {
  return `$${value}`;
}

function addToCart(productId) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const product = findProduct(productId);
    if (!product) return;

    cart.push({
      id: product.id,
      quantity: 1
    });
  }

  saveCart();
  renderCart();

  const product = findProduct(productId);
  if (product) {
    showToast(`${product.name} added to cart`);
  }
}

function removeFromCart(productId) {
  cart = cart
    .map((item) =>
      item.id === productId
        ? { ...item, quantity: item.quantity - 1 }
        : item
    )
    .filter((item) => item.quantity > 0);

  saveCart();
  renderCart();
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

function renderCart() {
  if (!cart.length) {
    cartItems.innerHTML = `<p class="cart-empty">Your cart is empty.</p>`;
    cartCount.textContent = "0";
    cartTotal.textContent = "$0";
    cartSummary.textContent = "Subtotal (0 items)";
    return;
  }

  let totalItems = 0;
  let totalPrice = 0;

  cartItems.innerHTML = cart
    .map((item) => {
      const product = findProduct(item.id);
      if (!product) return "";

      totalItems += item.quantity;
      totalPrice += product.price * item.quantity;

      return `
        <div class="cart-item">
          <img src="${product.image}" alt="${product.name}">
          <div>
            <h3>${product.name}</h3>
            <p>${product.category} • ${formatPrice(product.price)} • Qty ${item.quantity}</p>
            <button class="remove-item-btn" data-id="${product.id}">Remove one</button>
          </div>
          <strong>${formatPrice(product.price * item.quantity)}</strong>
        </div>
      `;
    })
    .join("");

  cartCount.textContent = String(totalItems);
  cartTotal.textContent = formatPrice(totalPrice);
  cartSummary.textContent = `Subtotal (${totalItems} item${totalItems === 1 ? "" : "s"})`;

  document.querySelectorAll(".remove-item-btn").forEach((button) => {
    button.addEventListener("click", () => {
      removeFromCart(button.dataset.id);
    });
  });
}

function openCart() {
  cartDrawer.classList.add("active");
  cartDrawer.setAttribute("aria-hidden", "false");
  overlay.classList.add("active");
}

function closeCart() {
  cartDrawer.classList.remove("active");
  cartDrawer.setAttribute("aria-hidden", "true");

  if (!productModal.classList.contains("active") && !lightbox.classList.contains("active")) {
    overlay.classList.remove("active");
  }
}

function openModal(productId) {
  const product = findProduct(productId);
  if (!product) return;

  activeProductId = product.id;
  modalImage.src = product.image;
  modalImage.alt = product.name;
  modalCategory.textContent = product.category;
  modalTitle.textContent = product.name;
  modalDescription.textContent = product.description;
  modalPrice.textContent = formatPrice(product.price);

  productModal.classList.add("active");
  productModal.setAttribute("aria-hidden", "false");
  overlay.classList.add("active");
}

function closeModal() {
  productModal.classList.remove("active");
  productModal.setAttribute("aria-hidden", "true");
  activeProductId = null;

  if (!cartDrawer.classList.contains("active") && !lightbox.classList.contains("active")) {
    overlay.classList.remove("active");
  }
}

function openLightbox(imageSrc, imageAlt) {
  lightboxImage.src = imageSrc;
  lightboxImage.alt = imageAlt;
  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");
  overlay.classList.add("active");
}

function closeLightbox() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");

  if (!cartDrawer.classList.contains("active") && !productModal.classList.contains("active")) {
    overlay.classList.remove("active");
  }
}

function filterProducts(category) {
  productCards.forEach((card) => {
    const matches = category === "all" || card.dataset.category === category;
    card.classList.toggle("hidden-by-filter", !matches);
  });
}

function rotateTestimonials() {
  testimonialIndex = (testimonialIndex + 1) % testimonials.length;
  testimonialQuote.textContent = testimonials[testimonialIndex].quote;
  testimonialName.textContent = testimonials[testimonialIndex].name;
}

function setupRevealAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function showToast(message) {
  const existingToast = document.querySelector(".toast");
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

navToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    filterProducts(button.dataset.filter);
  });
});

quickViewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openModal(button.dataset.id);
  });
});

addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    addToCart(button.dataset.id);
    openCart();
  });
});

modalAddToCart.addEventListener("click", () => {
  if (!activeProductId) return;
  addToCart(activeProductId);
  closeModal();
  openCart();
});

cartButton.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
clearCartBtn.addEventListener("click", clearCart);

modalClose.addEventListener("click", closeModal);

lightboxTriggers.forEach((button) => {
  button.addEventListener("click", () => {
    openLightbox(button.dataset.image, button.dataset.alt);
  });
});

lightboxClose.addEventListener("click", closeLightbox);

overlay.addEventListener("click", () => {
  closeCart();
  closeModal();
  closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    closeModal();
    closeLightbox();
  }
});

setInterval(rotateTestimonials, 4000);

renderCart();
setupRevealAnimations();