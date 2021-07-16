import lightGallery from 'lightgallery';
import "lightgallery/css/lightgallery.css"
lightGallery(document.getElementById('gallery'), {
  animateThumb: false,
  zoomFromOrigin: true,
  allowMediaOverlap: true,
  download: false,
  closable: true,
  mobileSettings: {
    showCloseIcon: true,
    closeOnTap: true
},
});
