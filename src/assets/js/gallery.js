import PhotoSwipe from 'photoswipe'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/dist/photoswipe.css'

let gallery

const arrowPreviousSVG = `
<svg id="arrow" viewBox="0 0 443.52 443.52" aria-hidden="true" class="pswp__icn">
  <path d="M143.492 221.863L336.226 29.129c6.663-6.664 6.663-17.468 0-24.132-6.665-6.662-17.468-6.662-24.132 0l-204.8 204.8c-6.662 6.664-6.662 17.468 0 24.132l204.8 204.8c6.78 6.548 17.584 6.36 24.132-.42 6.387-6.614 6.387-17.099 0-23.712L143.492 221.863z"/>
</svg>`

const closeSVG = `<svg xmlns="http://www.w3.org/2000/svg"  aria-hidden="true" class="pswp__icn" viewBox="0 0 241.171 241.171">
  <path d="M138.138 120.754l99.118-98.576a11.931 11.931 0 000-17.011c-4.74-4.704-12.439-4.704-17.179 0l-99.033 98.492-99.949-99.96c-4.74-4.752-12.439-4.752-17.179 0-4.74 4.764-4.74 12.475 0 17.227l99.876 99.888L3.555 220.497c-4.74 4.704-4.74 12.319 0 17.011 4.74 4.704 12.439 4.704 17.179 0l100.152-99.599 99.551 99.563c4.74 4.752 12.439 4.752 17.179 0 4.74-4.764 4.74-12.475 0-17.227l-99.478-99.491z"/>
</svg>
`

function initGallery() {
  const element = document.querySelector('#gallery')
  if (!element || gallery != undefined) {
    return
  }
  gallery = new PhotoSwipeLightbox({
    gallerySelector: '#gallery',
    childSelector: 'a',
    closeSVG,
    arrowPreviousSVG,
    arrowNextSVG: arrowPreviousSVG,
    clickToCloseNonZoomable: true,
    allowPanToNext: false,
    initialZoomLevel: 'fit',
    secondaryZoomLevel: 'fit',
    maxZoomLevel: 'fit',
    pinchToClose: false,
    pswpModule: PhotoSwipe,
  })
  gallery.init()
}

document.addEventListener('turbo:before-render', (event) => {
  if (gallery !== undefined) {
    gallery.destroy()
    gallery = undefined
  }
})

document.addEventListener('turbo:load', function () {
  initGallery()
})

initGallery()
