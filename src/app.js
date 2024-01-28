
import { MenuHandler } from "./app/MenuHandler";
import { Gallery } from "./app/Gallery";
import { showCart } from "./app/showCart";
import "./main.scss";

// Initialize the MenuHandler with appropriate selectors and breakpoint
new MenuHandler('.navitems', '.hamburger', 991);

new Gallery();
new showCart();



