import productsJson from "../data/products.json";
import image from "../assets/image-product-1-thumbnail.jpg";
import icons from "../assets/icon-addcart.svg";
import plus from "../assets/icon-plus.svg";
import minus from "../assets/icon-minus.svg";
import deleteCart from "../assets/icon-delete.svg";

let listProductHTML = document.querySelector(".div-16");
let listCartHTML = document.querySelector(".listCart");
let iconCart = document.querySelector(".icon-cart");
let openCart = document.getElementById("cartTab");
let iconCartSpan = document.querySelector(".icon-cart span");
let products = [];
let cart = [];

export function showCart() {
  function handleClickOnPage(event) {
    // Check if the click was on the iconCart or a child of iconCart
    if (iconCart.contains(event.target)) {
      // Toggle the 'hidden' class of openCart when iconCart is clicked
      openCart.classList.toggle("hidden");
      openCart.classList.toggle("cartAnim");
    } else if (
      !openCart.contains(event.target) &&
      listCartHTML.contains(event.target) && // Add this condition to check for clicks inside the listCart
      !openCart.classList.contains("hidden")
    ) {
      // Hide openCart by adding the 'hidden' class only if the click was outside openCart and it is not already hidden
      openCart.classList.add("hidden");
    }
  }

  // Attach the event listener to the window object
  window.addEventListener("click", handleClickOnPage);

  const addDataToHTML = (products) => {

    // Clears existing products if necessary
    listProductHTML.innerHTML = "";
    products.quantity = 0;

    if (products.length >= 0) {
      products.forEach((product) => {
        let newProduct = document.createElement("div");
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
                     <li class="div-22">${product.discout_50}%</li>
                    </ul>
                   <div class="div-23">$250.00</div>
                </div>
                <div class="div-24">
                  <div class="div-25">
                    <img
                      loading="lazy"
                      src="${minus}"
                      class="minus"
                    />
                    <span>0</span>
                    <img
                      loading="lazy"
                      src="${plus}"
                      class="plus"
                    />
                  </div>
                  <button class="addtoCart">
                    <img
                      loading="lazy"
                      src="${icons}"
                      class="img-11"
                    />
                    <h1>Add to cart</h1>
                  </button>
                  </di>`;

        // Append the new product after setting innerHTML
        listProductHTML.appendChild(newProduct);
      });
    }
  };

  const findProductById = (id) =>
    products.find((product) => product.id.toString() === id.toString());

  // Handle quantity change in product list
  listProductHTML.addEventListener("click", (event) => {
    let targetElement = event.target;
    if (
      targetElement.classList.contains("plus") ||
      targetElement.classList.contains("minus")
    ) {
      // Get the closest .item parent which contains the data-id attribute
      let productElement = targetElement.closest(".item");

      let productId = productElement.dataset.id;
      let product = findProductById(productId);

      let quantityElement = productElement.querySelector(".div-25 span");
      let currentQuantity = parseInt(quantityElement.textContent, 0);

      if (targetElement.classList.contains("plus")) {
        currentQuantity += 1;
      } else if (
        currentQuantity > 1 &&
        targetElement.classList.contains("minus")
      ) {
        // Prevent decreasing below 1
        currentQuantity -= 1;
      }

      // Update the quantity in the DOM
      quantityElement.textContent = currentQuantity.toString();

      // Update the quantity in the products array
      product.quantity = currentQuantity;
    }
  });

  // Function to add an item to the cart
  const addToCart = (productId) => {
    let product = findProductById(productId);

    // Check if the quantity is sufficient
    if (product.quantity < 1) {
      console.error("Cannot add to cart: Product quantity is less than 1");
      return;
    }

    let cartItemIndex = cart.findIndex((item) => item.product_id === productId);

    if (cartItemIndex > -1) {
      // If the product already exists in the cart, just update the quantity
      cart[cartItemIndex].quantity += product.quantity;
    } else {
      // Else, add a new product to the cart with its quantity
      cart.push({
        product_id: productId,
        quantity: product.quantity,
      });
    }

    // Reset the product quantity to 1 for future additions
    product.quantity = 1;

    // Update the cart UI
    addCartToHTML();
    // Update the local storage
    addCartToMemory();

    // Update the product list quantity display
    let productElement = listProductHTML.querySelector(
      `.item[data-id="${productId}"]`
    );
    if (productElement) {
      let quantityElement = productElement.querySelector(".div-25 span");
      quantityElement.textContent = "1";
    }
  };

  // Add event listener for the 'Add to Cart' button in the product list
  listProductHTML.addEventListener("click", (event) => {
    let positionClick = event.target;

    // Ensure we get the .addtoCart button even if the image or <h1> inside it is clicked
    let addToCartButton = positionClick.closest(".addtoCart");

    if (addToCartButton) {
      // Traverse up to the parent '.item' to get the dataset id
      let productElement = addToCartButton.closest(".item");
      let productId = productElement.dataset.id;
      addToCart(productId);
    }
  });

  const addCartToMemory = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const addCartToHTML = () => {
    listCartHTML.innerHTML = "";

    let totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

    if (cart.length > 0) {
      cart.forEach((item) => {
        let product = products.find((p) => p.id == item.product_id);

        // Safeguard against undefined products
        if (!product) {
          console.error(`Product with ID ${item.product_id} not found.`);
          return; // Continue to the next iteration
        }

        let newItemHTML = `
                <div class="item" data-id="${item.product_id}">
                    <div class="image">
                        <img src="${
                          image ?? "default-placeholder.png"
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
                          deleteCart ?? "default-placeholder.png"
                        }"></span>
            
                </div>`;
        listCartHTML.insertAdjacentHTML("beforeend", newItemHTML);
        console.log(products);
      });
    } else {
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
    let product_id = event.target.closest(".item")?.dataset.id;
    if (!product_id) return;

    let type = event.target.classList.contains("plus") ? "plus" : "minus";
    changeQuantityCart(product_id, type);
  });

  listCartHTML.addEventListener("click", (event) => {
    let positionClick = event.target;
    if (
      positionClick.classList.contains("minus") ||
      positionClick.classList.contains("plus")
    ) {
      let product_id = positionClick.parentElement.parentElement.dataset.id;
      let type = "minus";
      if (positionClick.classList.contains("plus")) {
        type = "plus";
      }
      changeQuantityCart(product_id, type);
    }
  });

  const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex(
      (value) => value.product_id == product_id
    );
    if (positionItemInCart >= 0) {
      let info = cart[positionItemInCart];
      switch (type) {
        case "plus":
          cart[positionItemInCart].quantity =
            cart[positionItemInCart].quantity + 1;
          break;

        default:
          let changeQuantity = cart[positionItemInCart].quantity - 1;
          if (changeQuantity > 0) {
            cart[positionItemInCart].quantity = changeQuantity;
          } else {
            cart.splice(positionItemInCart, 1);
          }
          break;
      }
    }
    addCartToHTML();
    addCartToMemory();
  };

  const initApp = async () => {

    let cart;

    fetch(productsJson)
      .then((response) => response.json())
      .then((data) => {
        products = data;
        addDataToHTML(products);

        if (localStorage.getItem("cart")) {
          cart = JSON.parse(localStorage.getItem("cart"));
          addCartToHTML(cart);
        }
      })
      .catch((error) => console.error("Failed to load products:", error));
  };

  initApp();
}
 


//-----------------------------------------------------------------------------

// // Simplified and optimized code structure

// let listProductHTML = document.querySelector(".div-16");
// let listCartHTML = document.querySelector(".listCart");
// // let iconCart = document.querySelector(".icon-cart");
// let openCart = document.getElementById("cartTab");
// let iconCartSpan = document.querySelector(".icon-cart span");
// let products = [];
// let cart = [];

// export function showCart() {
//     document.addEventListener("click", toggleCartVisibility);

//     async function initApp() {
//         try {
//             const response = await fetch("../../../data/products.json");
//             const data = await response.json();
//             products = data;
//             renderProducts(products);
            
//             // Load cart from local storage if it exists
//             const storedCart = localStorage.getItem("cart");
//             if (storedCart) {
//               cart = JSON.parse(storedCart);
//               updateCartUI(cart);
//             }
//         } catch (error) {
//             console.error("Failed to load products:", error);
//         }
//     }

//     initApp();
// }

// function toggleCartVisibility(event) {
//     if (event.target.closest(".icon-cart")) {
//         openCart.classList.toggle("hidden");
//         openCart.classList.toggle("cartAnim");
//     } else if (!openCart.contains(event.target) && !openCart.classList.contains("hidden") && listCartHTML.contains(event.target)) {
//         openCart.classList.add("hidden");
//     }
// }

// function renderProducts(products, icons) {
//     listProductHTML.innerHTML = ""; // Clear the product listing
//     products.quantity = 0;
    
//     products.forEach((product) => {
//         listProductHTML.insertAdjacentHTML("beforeend", generateProductHTML(product, icons));
        
//         // Add event listeners for each item's plus, minus, and add-to-cart actions
//         let newProductDiv = listProductHTML.lastElementChild;
//         newProductDiv.querySelector(".plus").addEventListener("click", () => adjustQuantity(product.id, 'increase'));
//         newProductDiv.querySelector(".minus").addEventListener("click", () => adjustQuantity(product.id, 'decrease'));
//         newProductDiv.querySelector(".addtoCart").addEventListener("click", () => addToCart(product.id));
//     });
// }

// function generateProductHTML(product) {
//     return `
//     <div class="div-17">${product.title}</div>

//     <div class="div-18">${product.name}</div>
//     <div class="div-19">
//       ${product.description}
//     </div>
//     <div class="discount">
//         <ul class="div-20">
//          <li class="div-21">$${product.price}</li>  
//          <li class="div-22">${product.discout_50}%</li>
//         </ul>
//        <div class="div-23">$250.00</div>
//     </div>
//     <div class="div-24">
//       <div class="div-25">
//         <img
//           loading="lazy"
//           src="${product.minus}"
//           class="minus"
//         />
//         <span>0</span>
//         <img
//           loading="lazy"
//           src="${product.plus}"
//           class="plus"
//         />
//       </div>
//       <button class="addtoCart">
//         <img
//           loading="lazy"
//           src="${product.cart}"
//           class="img-11"
//         />
//         <h1>Add to cart</h1>
//       </button>
//       </di>`;
// }

// function addToCart(productId) {
//     const productInCartIndex = cart.findIndex(item => item.product_id === productId);
//     const productToAdd = products.find(p => p.id === productId);
    
//     if (typeof productToAdd.quantity === 'undefined') {
//         console.error("Product is missing quantity field");
//         return;
//     }

//     if (productInCartIndex > -1) {
//         cart[productInCartIndex].quantity += productToAdd.quantity;
//     } else {
//         cart.push({ product_id: productId, quantity: productToAdd.quantity });
//     }

//     productToAdd.quantity = 1; // Reset to default
//     updateCartUI();
//     storeCart();
// }

// function updateCartUI() {
//     listCartHTML.innerHTML = "";
//     let totalQuantity = 0;

//     cart.forEach(item => {
//         const product = products.find(p => p.id === item.product_id);
//         listCartHTML.insertAdjacentHTML("beforeend", generateCartItemHTML(product, item));
//         totalQuantity += item.quantity;
//     });

//     iconCartSpan.textContent = totalQuantity.toString();
//     iconCartSpan.classList.toggle("hidden", totalQuantity === 0);
// }

// function generateCartItemHTML(product, item) {
//     return `
//     <div class="item" data-id="${item.product_id}">
//     <div class="image">
//         <img src="${product.image}">
//     </div>
//     <div class="name">${product.name}</div>
//     <div class="price">$${product.price}</div>
//     <div class="quantity">
//     <span>x${item.quantity}</span>
// </div>
//     <div class="totalPrice"><p>$${(
//       product.price * item.quantity
//     ).toFixed(2)}</p></div>
 
//         <span class="minus"><img src="${
//           product.delete ?? "default-placeholder.png"
//         }"></span>

// </div>`;
// }

// function storeCart() {
//     localStorage.setItem("cart", JSON.stringify(cart));
// }

// function adjustQuantity(productId, type) {
//     const productIndex = products.findIndex(p => p.id === productId);
//     if (productIndex === -1) return;

//     let product = products[productIndex];
//     if (type === 'increase') {
//         product.quantity++;
//     } else if (type === 'decrease' && product.quantity > 1) {
//         product.quantity--;
//     }

//     let productElement = listProductHTML.querySelector(`.item[data-id="${productId}"]`);
//     if (productElement) {
//         let quantityElement = productElement.querySelector(".div-25 span");
//         quantityElement.textContent = product.quantity.toString();
//     }
// }
