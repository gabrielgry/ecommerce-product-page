/*
 * Mobile Menu
 */
(function mobileMenu() {
  const menu = document.getElementById("menu");

  function handleCloseMenu() {
    menu.dataset.open = "false";
  }

  function handleOpenMenu() {
    menu.dataset.open = "true";
  }

  const openBtn = document.getElementById("menu-open-btn");
  openBtn.addEventListener("click", handleOpenMenu);

  const closeBtn = document.getElementById("menu-close-btn");
  closeBtn.addEventListener("click", handleCloseMenu);

  const backdrop = document.getElementById("menu-backdrop");
  backdrop.addEventListener("click", handleCloseMenu);
})();

/*
 * Carousel
 */
function Carousel(root, currentImageIndex) {
  this.root = root;

  this.currentImageIndex = currentImageIndex || 0;

  const imageList = this.root.querySelectorAll(".carousel__image");
  const previewList = this.root.querySelector(".carousel__preview-list");
  const previewItems = previewList.children;
  const previousBtn = this.root.querySelector(".carousel__previous-btn");
  const nextBtn = this.root.querySelector(".carousel__next-btn");

  this.changeImage = function (imageIndex) {
    if (imageIndex >= 0 && imageIndex < previewItems.length) {
      previousBtn.classList.remove("carousel__btn--hidden");
      nextBtn.classList.remove("carousel__btn--hidden");
      previewItems[this.currentImageIndex]
        .querySelector(".carousel__preview-overlay")
        .classList.remove("carousel__preview-overlay--active");

      imageList[this.currentImageIndex].classList.remove(
        "carousel__image--show"
      );
      imageList[imageIndex].classList.add("carousel__image--show");
      previewItems[imageIndex]
        .querySelector(".carousel__preview-overlay")
        .classList.add("carousel__preview-overlay--active");

      this.currentImageIndex = imageIndex;
    }

    if (imageIndex - 1 < 0) {
      previousBtn.classList.add("carousel__btn--hidden");
    }

    if (imageIndex + 1 >= previewItems.length) {
      nextBtn.classList.add("carousel__btn--hidden");
    }
  };

  this.handlePreviewSelect = function (e) {
    const selectedItem = e.target.parentElement;

    let selectedItemIndex;

    for (let index = 0; index < previewItems.length; index++) {
      if (selectedItem.isSameNode(previewItems[index])) {
        selectedItemIndex = index;
        break;
      }
    }

    this.changeImage(selectedItemIndex);
  };

  previousBtn.addEventListener("click", () => {
    this.changeImage(this.currentImageIndex - 1);
  });
  nextBtn.addEventListener("click", () =>
    this.changeImage(this.currentImageIndex + 1)
  );

  for (let item of previewItems) {
    item.addEventListener("click", (e) => this.handlePreviewSelect(e));
  }
}

(function pageCarouselInit() {
  const pageCarouselRoot = document.querySelector("#page-carousel");
  const pageCarousel = new Carousel(pageCarouselRoot);
})();

/*
 * Amount
 */
(function amount() {
  const valueDisplay = document.getElementById("amount__value");

  function handleAmount(operation) {
    let value = Number(valueDisplay.innerText);

    if (operation === "minus") {
      value--;
    }

    if (operation === "plus") {
      value++;
    }

    if (value < 1) {
      value = 1;
    }

    valueDisplay.innerText = value;
  }

  const minusBtn = document.getElementById("amount__minus-btn");
  minusBtn.addEventListener("click", () => handleAmount("minus"));

  const plusBtn = document.getElementById("amount__plus-btn");
  plusBtn.addEventListener("click", () => handleAmount("plus"));
})();

/*
 * Cart
 */
const Cart = (function () {
  const cartContainer = document.getElementsByClassName(
    "nav__cart-container"
  )[0];
  const cartPopup = document.getElementsByClassName("cart__popup")[0];
  const cart = document.getElementsByClassName("cart__card")[0];
  const list = document.getElementById("cart-list");
  const itemTemplate = document.getElementById("cart-item-template");

  let products = [];

  function addItemToDocument(product) {
    const itemNode = document.importNode(itemTemplate.content, true);

    itemNode.querySelector("img").src = product.thumb;
    itemNode.querySelector(".cart__item-name").innerText = product.name;
    itemNode.querySelector(
      ".cart__item-price"
    ).innerText = `${product.price} x ${product.quantity}`;

    const total = Number(product.price.slice(1)) * Number(product.quantity);

    itemNode.querySelector(".cart__item-total").innerText = `$${total}`;
    itemNode
      .querySelector(".cart__item-delete-btn")
      .addEventListener("click", (e) => removeItem(e));

    list.appendChild(itemNode);
  }

  function removeItem(e) {
    const parent = e.target.parentElement;
    const productNameToRemove =
      parent.querySelector(".cart__item-name").innerText;

    products = products.filter(function (product) {
      product.name !== productNameToRemove;
    });

    parent.remove();

    if (products.length <= 0) {
      cart.dataset.isEmpty = true;
    }
  }

  function handleCartVisibility(action) {
    if (action == "show") {
      cartPopup.classList.add("cart__popup--show");
    }

    if (action == "hide") {
      cartPopup.classList.remove("cart__popup--show");
    }
  }

  cartContainer.addEventListener("mouseover", () =>
    handleCartVisibility("show")
  );
  cartContainer.addEventListener("mouseout", () =>
    handleCartVisibility("hide")
  );

  return {
    add: function (product) {
      cart.dataset.isEmpty = false;

      const hasProductInCart = products.some(function (cartProduct) {
        return cartProduct.name === product.name;
      });

      if (hasProductInCart) {
        return;
      }

      products.push(product);
      addItemToDocument(product);
    },
  };
})();

(function addToCart() {
  const addToCartBtn = document.getElementById("add-to-cart");
  addToCartBtn.addEventListener("click", handleAddToCart);

  function handleAddToCart() {
    const product = {
      thumb: document.getElementsByClassName("carousel__preview-image")[0].src,
      name: document.getElementById("product-name").innerText,
      price: document.getElementById("product-price").innerText,
      quantity: document.getElementById("amount__value").innerText,
    };

    Cart.add(product);
  }
})();

/*
 * Lightbox
 */
(function openLightbox() {
  const lightbox = document.querySelector("#lightbox");
  const lightboxCarousel = new Carousel(lightbox);

  const pageCarousel = document.getElementById("page-carousel");
  const pageCarouselImages = pageCarousel.querySelectorAll(".carousel__image");

  const closeBtn = document.getElementsByClassName("lightbox__close-btn")[0];

  pageCarouselImages.forEach((image) => {
    image.addEventListener("click", function (e) {
      const selectedItem = e.target;

      let selectedItemIndex;

      for (let index = 0; index < pageCarouselImages.length; index++) {
        if (selectedItem.isSameNode(pageCarouselImages[index])) {
          selectedItemIndex = index;
          break;
        }
      }

      lightboxCarousel.changeImage(selectedItemIndex);
      lightbox.classList.add("lightbox--show");
    });
  });

  closeBtn.addEventListener("click", function () {
    lightbox.classList.remove("lightbox--show");
  });
})();
