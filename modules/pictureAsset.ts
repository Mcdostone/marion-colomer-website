import sizeOf from 'image-size'
import path from 'path'
import ColorThief from 'colorthief'

// Disable color thief during development because it's slow
const isProduction = process.env.ELEVENTY_ENV === 'production'

/**
 *
 * @param {src} Path to the image
 * @returns {string} img HTML tag with the dimensions and the main color of the given image
 */
async function pictureAsset(src, options = {}) {
  options = Object.assign({}, { alt: '' }, options)
  const absPath = path.join(path.resolve(__dirname, '..'), 'src', src)
  const dimensions = sizeOf(absPath)
  const color = isProduction ? await ColorThief.getColor(absPath) : [0, 0, 0]
  options['width'] = dimensions.width
  options['height'] = dimensions.height
  const withoutExtension = path.join('/', this.ctx.pathPrefix, path.dirname(src), path.basename(src, path.extname(src)))
  const cls = options['class'] ? ` class="${options['class']}"` : ''
  delete options['class']

  return `<picture${cls} style="--primary-color:${rgbToHex(color)}">
  ${isProduction ? `<source srcset="${withoutExtension}.avif" type="image/avif" />` : ''}
  <img src="${path.join('/', this.ctx.pathPrefix, src)}" ${Object.entries(options)
    .map((e) => `${e[0]}="${e[1]}"`)
    .join(' ')}/>
</picture>`
}

/**
 * @param {array<Number>} array
 * @return {string}
 */
function rgbToHex(array) {
  return (
    '#' +
    array
      .map((x) => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}

export default pictureAsset