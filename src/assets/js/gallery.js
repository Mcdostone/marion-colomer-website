import lightGallery from 'lightgallery';
import "lightgallery/css/lightgallery.css"


document.addEventListener("turbo:load", function() {
  const element = document.getElementById('gallery')
  if(!element) {
    return
  }
  lightGallery(element, {
    animateThumb: false,
    zoomFromOrigin: true,
    allowMediaOverlap: true,
    download: false,
    closable: true,
    mobileSettings: {
      showCloseIcon: true,
      closeOnTap: true
    },
  })
})
