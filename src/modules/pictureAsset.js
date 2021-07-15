const sizeOf = require('image-size')
const path = require('path')

/**
 * Shortcut function for downloading image assets
 * @param {file} src
 * @returns {string}
 */
module.exports = function pictureAsset(src, options = {}) {
  options = Object.assign({}, options, { alt: "" })
  const absPath = path.join(path.resolve(__dirname, ".."), src)
  const dimensions = sizeOf(absPath)
  return `<img ${Object.entries(options).map(e => `${e[0]}="${e[1]}"`).join(" ")} width="${dimensions.width}" height="${dimensions.height}" src="${src}" alt="${options.alt}">`
}
