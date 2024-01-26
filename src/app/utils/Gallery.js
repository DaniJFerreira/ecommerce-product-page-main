import imageJason from "../../../data/gallery.json";

export async function Gallery() {

  let currentIndex = 0;
  let images = imageJason.gallery_prod_01;
  let currentImageElement = 0;

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

  document.querySelector(".close").addEventListener("click", closeModal);
  document
    .querySelector(".prev")
    .addEventListener("click", () => changeImage(-1));
  document
    .querySelector(".next")
    .addEventListener("click", () => changeImage(1));
  document
    .querySelector(".Gprev")
    .addEventListener("click", () => changeImage(-1));
  document
    .querySelector(".Gnext")
    .addEventListener("click", () => changeImage(1));

  // Close modal if outside click
  window.onclick = (event) => {
    if (event.target === modal) {
      closeModal();
      // updateImageOpacity(currentImageElement)
    }
  };

  createGalleryItems(images);
}
