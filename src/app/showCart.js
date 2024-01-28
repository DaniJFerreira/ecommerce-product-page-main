import productsJson from "../data/products.json";
import image from "../assets/image-product-1-thumbnail.jpg";
import icons from "../assets/icon-addcart.svg";
import plus from "../assets/icon-plus.svg";
import minus from "../assets/icon-minus.svg";
import deleteCart from "../assets/icon-delete.svg";

// Bundle the asset imports to reduce clutter and improve maintainability

const assets = {
  image: require('../assets/image-product-1-thumbnail.jpg'),
  icons: require('../assets/icon-addcart.svg'),
  plus: require('../assets/icon-plus.svg'),
  minus: require('../assets/icon-minus.svg'),
  deleteCart: require('../assets/icon-delete.svg')
};

// Simplify selector retrieval using a helper function
const select = (selector) => document.querySelector(selector);

// Select DOM elements once and reuse them
const listProductHTML = select(".div-16");
const listCartHTML = select(".listCart");
const iconCart = select(".icon-cart");
const openCart = select("#cartTab");
const iconCartSpan = select(".icon-cart span");

let products = [];
let cart = [];

export function showCart() {
// Debounce function to prevent excessive calls for simultaneous clicks
const debounce = (func, delay) => {
  let inDebounce;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
};

const handleClickOnPage = debounce((event) => {
  if (iconCart.contains(event.target)) {
    openCart.classList.toggle("hidden");
    openCart.classList.toggle("cartAnim");
  } else if (
    !openCart.contains(event.target) &&
    listCartHTML.contains(event.target) && 
    !openCart.classList.contains("hidden")
  ) {
    openCart.classList.add("hidden");
  }
}, 250); // Wait for 250ms before processing the click

window.addEventListener("click", handleClickOnPage);

// Added functions to better organize code
const findProductById = (id) =>
  products.find((product) => product.id.toString() === id.toString());

const updateQuantityDisplay = (quantityElement, quantity) => {
  quantityElement.textContent = quantity.toString();
};

const addItemToDom = (product) => {
  const newProduct = document.createElement("div");
  newProduct.dataset.id = product.id;
  newProduct.classList.add("item");
  newProduct.innerHTML = `
          <div class="div-17">${product.title}</div>
          <div class="div-18">${product.name}</div>
          <div class="div-19">
            ${product.description}
          </div>
          <div class="discount">
              <ul class="div-20">
               <li class="div-21">$${product.price}</li>  
               <li class="div-22">${product.discount_50}%</li>
              </ul>
             <div class="div-23">$250.00</div>
          </div>
          <div class="div-24">
            <div class="div-25">
              <img src="${assets.minus}" loading="lazy" class="minus" />
              <span>0</span>
              <img src="${assets.plus}" loading="lazy" class="plus" />
            </div>
            <button class="addtoCart">
              <img src="${assets.icons}" loading="lazy" class="img-11" />
              <h1>Add to cart</h1>
            </button>
            </di>`;
  listProductHTML.appendChild(newProduct);
};

const addToCart = (productId) => {
  const product = findProductById(productId);
  if (!product || product.quantity < 1) {
    console.error("Cannot add to cart: Product is undefined or quantity is less than 1");
    return;
  }

  let cartItem = cart.find((item) => item.product_id === productId);
  if (cartItem) {
    cartItem.quantity += product.quantity;
  } else {
    cart.push({ product_id: productId, quantity: product.quantity });
  }

  product.quantity = 1;
  updateCartUI();
  updateLocalStorage();
};

listProductHTML.addEventListener("click", (event) => {
  const targetElement = event.target;
  if (targetElement.classList.contains("plus") || targetElement.classList.contains("minus")) {
    const productElement = targetElement.closest(".item");
    const productId = productElement.dataset.id;
    const product = findProductById(productId);
    const quantityElement = productElement.querySelector(".div-25 span");
    let currentQuantity = parseInt(quantityElement.textContent, 10);

    if (targetElement.classList.contains("plus")) {
      currentQuantity++;
    } else if (currentQuantity > 1) { 
      currentQuantity--;
    }

    updateQuantityDisplay(quantityElement, currentQuantity);
    product.quantity = currentQuantity;
  }
});

listProductHTML.addEventListener("click", (event) => {
  const addToCartButton = event.target.closest(".addtoCart");
  if (addToCartButton) {
    const productElement = addToCartButton.closest(".item");
    addToCart(productElement.dataset.id);
  }
});

const updateLocalStorage = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const updateCartUI = () => {
  listCartHTML.innerHTML = "";

  let totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  if (cart.length > 0) {
  cart.forEach((item) => {
    const product = findProductById(item.product_id);
    if (!product) {
      console.error(`Product with ID ${item.product_id} not found.`);
      return;
    }
    
    const newItemHTML = `
        <div class="item" data-id="${item.product_id}">
         <div class="image">
            <img src="${
              assets.image ?? "default-placeholder.png"
              }">
             </div>
             <div class="name">${product.name}</div>
                <div class="price">$${product.price}</div>
                <div class="quantity">
                  <span>x${item.quantity}</span>
                </div>
                  <div class="totalPrice"><p>$${(
                    product.price * item.quantity
                  ).toFixed(2)}</p></div>
          
                 <span class="minus"><img src="${
                   assets.deleteCart ?? "default-placeholder.png"
                 }"></span>
            </div>`;
    listCartHTML.insertAdjacentHTML("beforeend", newItemHTML);
  });

}else{
  listCartHTML.innerHTML = "<p>Your cart is empty.</p>"; // Show a message when cart is empty 
}

  if (totalQuantity === 0) {
    iconCartSpan.classList.add("hidden");
  } else {
    iconCartSpan.classList.remove("hidden");
    iconCartSpan.textContent = totalQuantity.toString();
  }
};

listCartHTML.addEventListener("click", (event) => {
  const type = event.target.classList.contains("plus") ? "plus" : "minus";
  changeQuantityCart(event.target.closest(".item")?.dataset.id, type);
});

const changeQuantityCart = (product_id, type) => {
  const itemIndex = cart.findIndex((value) => value.product_id == product_id);
  if (itemIndex >= 0) {
    const item = cart[itemIndex];
    if (type === "plus") {
      cart[itemIndex].quantity++;
    } else if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity--;
    } else {
      cart.splice(itemIndex, 1);
    }

    updateCartUI();
    updateLocalStorage();
  }
};

const fetchProducts = async () => {
  try {
    const response = await fetch(productsJson);
    products = await response.json();
    products.forEach(addItemToDom);
  } catch (error) {
    console.error("Failed to load products:", error);
  }

  if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
    updateCartUI();
  }
};

fetchProducts();
}