const sizeOf = require('image-size')
const path = require('path')
const ColorThief = require('colorthief')

// Disable color thief during development because it's slow
const isProduction = process.env.ELEVENTY_ENV === 'production'

/**
 * 
 * @param {file} src Path to the image
 * @returns {string} img HTML tag with the dimensions and the main color of the given image
 */
module.exports = async function pictureAsset(src, options = {}) {
  options = Object.assign({}, { alt: '' }, options)
  const absPath = path.join(path.resolve(__dirname, '..'), 'src', src)
  const dimensions = sizeOf(absPath)
  const color = isProduction ? await ColorThief.getColor(absPath) : [0, 0, 0]
  return `<img style="background:${rgbToHex(color)}" ${Object.entries(options)
    .map((e) => `${e[0]}="${e[1]}"`)
    .join(' ')} width="${dimensions.width}" height="${dimensions.height}" src="${src}">`
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
