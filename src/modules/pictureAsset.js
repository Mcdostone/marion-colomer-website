const sizeOf = require('image-size')
const path = require('path')
const ColorThief = require('colorthief');

/**
 * Shortcut function for downloading image assets
 * @param {file} src
 * @returns {string}
 */
module.exports = async function pictureAsset(src, options = {}) {
  options = Object.assign({}, { alt: "" }, options)
  const absPath = path.join(path.resolve(__dirname, ".."), src)
  const dimensions = sizeOf(absPath)
  const color = await ColorThief.getColor(absPath)
  return `<img style="background:${rgbToHex(color)}" ${Object.entries(options).map(e => `${e[0]}="${e[1]}"`).join(" ")} width="${dimensions.width}" height="${dimensions.height}" src="${src}" alt="${options.alt}">`
}


const rgbToHex = (array) => '#' + array.map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')
