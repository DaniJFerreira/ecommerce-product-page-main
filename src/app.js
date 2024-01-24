
import { MenuHandler } from "./app/utils/MenuHandler";
import { Gallery } from "../src/app/utils/Gallery";
import { showCart } from "../src/app/utils/showCart";
import "./main.scss";


// Initialize the MenuHandler with appropriate selectors and breakpoint
new MenuHandler('.navitems', '.hamburger', 991);

// let iconCart = document.querySelector('.img2');
// let showCart = document.createElement('.div');

// iconCart.addEventListener('click', () => {
//     showCart.classList.add('.showCart')
// })
new Gallery();
new showCart();



