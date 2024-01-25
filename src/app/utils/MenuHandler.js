import { Utils } from "./Utils";
import "../../main.scss";

export class MenuHandler {
  constructor(querySelectorNavItems, querySelectorHamburger, breakpoint) {
    this.navbar = document.querySelectorAll(querySelectorNavItems);
    this.hamburgers = document.querySelectorAll(querySelectorHamburger);
    this.navItem = document.querySelectorAll(".navitems");
    this.isToggleActive = false;
    this.breakpoint = breakpoint;
    this.overlay = null;

    // Add event listeners
    window.addEventListener("resize", this.handleResize.bind(this));
    window.dispatchEvent(new Event("resize"));

    Utils.forEach(this.hamburgers, (hamburger) => {
      hamburger.addEventListener("click", (event) => {
        this.toggleMenu(event);
        this.navbar.forEach((navItem) => {
          navItem.classList.toggle("navbar-slide-out"); // Toggle the 'navbar-slide-out' class
        });
      }); // Handle the menu toggle
    });

    this.createOverlay();
  }

  createOverlay() {
    // Create an overlay element
    this.overlay = document.createElement("div");
    this.overlay.classList.add("overlay");
    // Append overlay to the body
    document.body.appendChild(this.overlay);
  }

  toggleOverlay(visible) {
    if (visible) {
      this.overlay.classList.add("overlay-visible");
    } else {
      this.overlay.classList.remove("overlay-visible");
    }
  }

  toggleVisible(elementsToToggle, toggleHide) {
    Utils.forEach(elementsToToggle, (element) => {
      if (toggleHide) {
        element.classList.add("hidden");
      } else {
        element.classList.remove("hidden");
      }
    });
  }

  toggleMenu(event) {
    let isActive = this.isToggleActive;

    // Changed the way `isToggleActive` is set
    // When there's no event, we assume this function is called to deactivate the menu.
    this.isToggleActive = event
      ? event.currentTarget.classList.toggle("is-active")
      : false;

    // Only hide nav items if we're going from active to inactive
    if (isActive && !this.isToggleActive) {
      const isDesktop = window.innerWidth > this.breakpoint;
      this.toggleVisible(this.navbar, !isDesktop);
      this.toggleOverlay(false);
    } else if (!isActive && this.isToggleActive) {
      // We only want to do the following if activating the menu
      this.toggleVisible(this.navbar, false);
      this.toggleOverlay(true);
    }

    if (event) event.preventDefault(); // Prevent default only if there's an event.
  }

  handleResize() {
    const isDesktop = window.innerWidth > this.breakpoint;

    this.toggleVisible(this.hamburgers, isDesktop);

    if (!this.isToggleActive) {
      this.toggleVisible(this.navbar, !isDesktop);
    }
  }
}
