import imagesJson from "../data/gallery.json";
import mainImage from "../assets/image-product-1.jpg";
import imageOne from "../assets/image-product-1.jpg";
import imageTwo from "../assets/image-product-2.jpg";
import imageThree from "../assets/image-product-3.jpg";
import imageFour from "../assets/image-product-4.jpg";
const imageAnimation = "imgAnim 0.5s ease 0s 1 normal forwards";

export function Gallery() {

  let currentIndex = null;
  let currentImageElement = null;
  let images = [];

  const galleryElement = document.getElementById("gallery");
  const modal = document.getElementById("modal");
  const featuredImage = document.querySelector(".featured-image");

  function createGalleryItems(images) {

    images.forEach((image, index) => {
      let imgElem = document.createElement("img");
      imgElem.src = image.src;
      imgElem.id = image.id.trim();
      imgElem.alt = image.alt;
      imgElem.className = `${image.className} grid-image`;
      imgElem.setAttribute("data-index", index);

      imgElem.addEventListener("click", function () {
        if (imgElem.id === "Main-image") {
          openModal(index);
        } else {
          displayImageInMain(index);
        }
        updateImageOpacity(imgElem);
      });
     
      galleryElement.appendChild(imgElem);
    });
  }

  function displayImageInMain(index) {
    const { src, alt, class: className } = images[index];
    let mainImageElement = document.getElementById("Main-image");
    if (mainImageElement) {
      mainImageElement.src = src;
      mainImageElement.alt = alt;
      mainImageElement.class = className;
      // updateImageOpacity(mainImageElement);
    }
  }

  function openModal(index) {
    if (
      index >= 0 &&
      index < images.length &&
      images[index].id === "Main-image"
    ) {
      currentIndex = index;
      updateModalImage();
      modal.style.display = "block";
    }
    window;
  }

  function closeModal() {
    modal.style.display = "none";

    if (currentImageElement) {
      currentImageElement.style.opacity = "";
      currentImageElement.style.border = "none";
    }
  }

  function updateImageOpacity(newImageElement) {
    if (currentImageElement) {
      currentImageElement.style.opacity = "";
      currentImageElement.style.border = "none";
    }
    newImageElement.style.opacity = "0.5";
    newImageElement.style.border = "2px solid #ff7e1b";
    currentImageElement = newImageElement;
  }

  function updateModalImage() {
    const { src, alt, class: className } = images[currentIndex];
    featuredImage.src = src;
    featuredImage.alt = alt;
    featuredImage.className = className;
    const newSelectedImgElem = galleryElement.querySelector(
      `[data-index="${currentIndex}"]`
    );
    updateImageOpacity(newSelectedImgElem);
  }

  function changeImage(step) {
    currentIndex = (currentIndex + step + images.length) % images.length;
    updateModalImage();
    displayImageInMain(currentIndex);
  }

  const changeImageWithAnimation = (direction) => {
    changeImage(direction);
    featuredImage.style.animation = imageAnimation;
  };
  
  // Event listeners setup
   document.querySelector(".close").addEventListener("click", closeModal);
  
   document.querySelector(".prev").addEventListener("click", () => {
    changeImageWithAnimation(-1);
  });
  
  document.querySelector(".next").addEventListener("click", () => {
    changeImageWithAnimation(1);
  });
  
  document.querySelector(".Gprev").addEventListener("click", () => {
    changeImage(-1); // Assuming no animation desired for gallery previous
  });
  
  document.querySelector(".Gnext").addEventListener("click", () => {
    changeImage(1); // Assuming no animation desired for gallery next
  });


  // document.querySelector(".close").addEventListener("click", closeModal);
  // document
  //   .querySelector(".prev")
  //   .addEventListener("click", () => changeImage(-1));
  // document
  //   .querySelector(".next")
  //   .addEventListener("click", () => changeImage(1));
  // document
  //   .querySelector(".Gprev")
  //   .addEventListener("click", () => changeImage(-1));
  // document
  //   .querySelector(".Gnext")
  //   .addEventListener("click", () => changeImage(1));

  function fetchGalleryData() {
    fetch(imagesJson) 
      .then(response =>  response.json())
      .then(data => {
        // Assuming your JSON structure has `gallery_prod_01` property as an array
        images = data.gallery_prod_01;
        createGalleryItems(images); // Call with the fetched images
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }

  fetchGalleryData();
  console.log(images);

    // Close modal if outside click
    window.onclick = (event) => {
      if (event.target === modal) {
        closeModal();
        // updateImageOpacity(currentImageElement)
      }
    };
}