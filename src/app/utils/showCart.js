// import productsJson from "../../../data/products.json";

let listProductHTML = document.querySelector(".div-16");
let listCartHTML = document.querySelector(".listCart");
let iconCart = document.querySelector(".icon-cart");
let openCart = document.getElementById("cartTab");
let iconCartSpan = document.querySelector(".icon-cart span");
let products = [];
let cart = [];

export async function showCart() {
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

  const addDataToHTML = () => {
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
                      src="../../src/assets/icon-minus.svg"
                      class="minus"
                    />
                    <span>0</span>
                    <img
                      loading="lazy"
                      src="../../src/assets/icon-plus.svg"
                      class="plus"
                    />
                  </div>
                  <button class="addtoCart">
                    <img
                      loading="lazy"
                      src="../../src/assets/icon-addcart.svg"
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
                          product.image ?? "default-placeholder.png"
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
                          product.delete ?? "default-placeholder.png"
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

  const initApp = () => {

    fetch('../../../data/products.json')
      .then((response) => response.json())
      .then((data) => {
        products = data;
        addDataToHTML();

        if (localStorage.getItem("cart")) {
          cart = JSON.parse(localStorage.getItem("cart"));
          addCartToHTML();
        }
      })
      .catch((error) => console.error("Failed to load products:", error));
  };
  console.log(products);
  initApp();

//   async function initApp() {
//   const response = await fetch(productsJson);
//   if (!response.ok) throw new Error("Network response was not ok.");

//   products = await response.json();
//   addDataToHTML();

//   const storedCart = localStorage.getItem("cart");
//   if (storedCart) {
//     cart = JSON.parse(storedCart);
//     addCartToHTML();
//   }
//  }
//  initApp();
}



// import productsJson from "../../../data/products.json";

// // Cache selectors for better performance
// const listProductHTML = document.querySelector(".div-16");
// const listCartHTML = document.querySelector(".listCart");
// const iconCart = document.querySelector(".icon-cart");
// const openCart = document.getElementById("cartTab");
// const iconCartSpan = document.querySelector(".icon-cart span");
// let products = productsJson.products;
// let cart = [];

// function handleClickOnPage(event) {
//   if (iconCart.contains(event.target)) {
//     openCart.classList.toggle("hidden");
//     openCart.classList.toggle("cartAnim");
//   } else if (
//     !openCart.contains(event.target) &&
//     !openCart.classList.contains("hidden") &&
//     event.target.closest(".listCart") !== null
//   ) {
//     openCart.classList.add("hidden");
//   }
// }

// function findProductById(id) {
//   return products.find((product) => product.id.toString() === id.toString());
// }

// // Function to add an item to the cart
// function addToCart(productId) {
//   let product = findProductById(productId);
//   if (product.quantity < 1) {
//     console.error("Cannot add to cart: Product quantity is less than 1");
//     return;
//   }

//   let cartItemIndex = cart.findIndex((item) => item.product_id === productId);
//   if (cartItemIndex > -1) {
//     cart[cartItemIndex].quantity += product.quantity;
//   } else {
//     cart.push({ product_id: productId, quantity: product.quantity });
//   }

//   product.quantity = 1; // Reset for future additions

//   updateQuantityDisplay(productId, 1);
//   updateCart();
// }

// function addDataToHTML() {
//   listProductHTML.innerHTML = "";
//   for (const product of products) {
//     const newProduct = document.createElement("div");
//     newProduct.dataset.id = product.id;
//     newProduct.classList.add("item");
//     newProduct.innerHTML = `
//       <div class="div-17">${product.title}</div>
//       <div class="div-18">${product.name}</div>
//       <div class="div-19">${product.description}</div>
//       <div class="discount">
//         <ul class="div-20">
//           <li class="div-21">$${product.price}</li>  
//           <li class="div-22">${product.discount_50}%</li>
//         </ul>
//         <div class="div-23">$250.00</div>
//       </div>
//       <div class="div-24">
//         <div class="div-25">
//           <img loading="lazy" src="../../src/assets/icon-minus.svg" class="minus" />
//           <span>0</span>
//           <img loading="lazy" src="../../src/assets/icon-plus.svg" class="plus" />
//         </div>
//         <button class="addtoCart">
//           <img loading="lazy" src="../../src/assets/icon-addcart.svg" class="img-11" />
//           <h1>Add to cart</h1>
//         </button>
//       </div>`;
//     listProductHTML.appendChild(newProduct);
//   }
// }

// function changeQuantity(productId, isIncrement) {
//   const product = findProductById(productId);
//   if (!product) return;

//   product.quantity += isIncrement ? 1 : -1;
//   if (product.quantity < 0) product.quantity = 0;

//   updateQuantityDisplay(productId, product.quantity);
// }

// function updateQuantityDisplay(productId, quantity) {
//   const productElement = listProductHTML.querySelector(`.item[data-id="${productId}"]`);
//   const quantityElement = productElement.querySelector(".div-25 span");
//   quantityElement.textContent = quantity;
// }

// function updateCart() {
//   // Save to local storage and Update the UI
//   localStorage.setItem("cart", JSON.stringify(cart));
//   addCartToHTML();
// }

// function addCartToHTML() {
//   listCartHTML.innerHTML = "";
//   let totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

//   cart.forEach((item) => {
//     const product = products.find((p) => p.id == item.product_id);
//     if (!product) {
//       console.error(`Product with ID ${item.product_id} not found.`);
//       return;
//     }
    
//     listCartHTML.insertAdjacentHTML("beforeend", `
//       <div class="item" data-id="${item.product_id}">
//         <div class="image"><img src="${product.image ?? "default-placeholder.png"}"></div>
//         <div class="name">${product.name}</div>
//         <div class="price">$${product.price}</div>
//         <div class="quantity">x${item.quantity}</div>
//         <div class="totalPrice">$${(product.price * item.quantity).toFixed(2)}</div>
//         <span class="minus"><img src="${product.delete ?? "default-placeholder.png"}"></span>
//       </div>`);
//   });

//   listCartHTML.innerHTML = cart.length > 0 ? listCartHTML.innerHTML : "<p>Your cart is empty.</p>";
//   iconCartSpan.className = totalQuantity === 0 ? "hidden" : "";
//   iconCartSpan.textContent = totalQuantity.toString();
// }

// async function initApp() {
//   const response = await fetch("../../../data/products.json");
//   if (!response.ok) throw new Error("Network response was not ok.");

//   products = await response.json();
//   addDataToHTML();

//   const storedCart = localStorage.getItem("cart");
//   if (storedCart) {
//     cart = JSON.parse(storedCart);
//     addCartToHTML();
//   }
// }

// // Event listeners
// window.addEventListener("click", handleClickOnPage);

// listProductHTML.addEventListener("click", (event) => {
//   const targetElement = event.target;
//   if (targetElement.classList.contains("addtoCart")) {
//     addToCart(targetElement.closest(".item").dataset.id);
//   } else if (targetElement.classList.contains("plus") || targetElement.classList.contains("minus")) {
//     const productId = targetElement.closest(".item").dataset.id;
//     changeQuantity(productId, targetElement.classList.contains("plus"));
//   }
// });

// export async function showCart() {
//   // Calls to initialize the application
//   initApp();
// }
