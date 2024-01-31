import imagesJson from "../data/gallery.json";

const assets = {
 mainImage : require ( "../assets/image-product-1.jpg" ),
 imageOne  : require ("../assets/image-product-1.jpg"),
 imageTwo  : require ("../assets/image-product-2.jpg"),
 imageThree: require ("../assets/image-product-3.jpg"),
 imageFour : require ("../assets/image-product-4.jpg")
};

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
        let imgElem = document.createElement('img');
        imgElem.src = image.src;
        imgElem.id = image.id.trim();
        imgElem.alt = image.alt;
        imgElem.className = `${image.className} grid-image`;
        imgElem.setAttribute('data-index', index);
      

        imgElem.addEventListener('click', function(){
            if(imgElem.id === 'Main-image'){
            openModal(index);
          }else{
              displayImageInMain(index);
          } 
          updateImageOpacity(imgElem);
        });
        galleryElement.appendChild(imgElem);
    });
}

  function displayImageInMain(index) {
    const { src, alt,  className } = images[index];
    let mainImageElement = document.getElementById("Main-image");
    if (mainImageElement) {
      mainImageElement.src = src;
      mainImageElement.alt = alt;
      mainImageElement.className = className;
      // updateImageOpacity(mainImageElement);
    }
  }

  function openModal(index) {
    if (
      index >= 0 &&
      index < images.length
    ) {
    // Make sure that we do not open the modal for the main image or index 0
      currentIndex = index;
      updateModalImage(); // Assuming this function sets the correct image in the modal
      modal.style.display = "block";
  }
  window
}
  
  function closeModal() {
    modal.style.display = "none";

    if (currentImageElement) {
      currentImageElement.style.opacity = "";
      currentImageElement.style.border = "none";
    }
  }

  function updateImageOpacity(newImageElement) {
    // Reset styles on the previous selected image wrapper
    if ( currentImageElement) {
      currentImageElement.style.opacity = "";
      currentImageElement.style.border = "none";
    }
          // Update styles on the new selected image wrapper
       newImageElement.style.opacity = "0.5";
       newImageElement.style.border = "2px solid #ff7e1b";
       currentImageElement = newImageElement;
  }

  function updateModalImage() {
    const { src, alt, className } = images[currentIndex];
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

    if (step < 0 && currentIndex === 0) {
      currentIndex = images.length - 1;
    } else if (step > 0 && currentIndex === 0) {
      currentIndex = 1;
    }

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

      console.log(imagesJson);
  }

  fetchGalleryData();
  console.log(imagesJson);

    // Close modal if outside click
    window.onclick = (event) => {
      if (event.target === modal) {
        closeModal();
        updateImageOpacity(currentImageElement)
      }
    };
}

