const sizeOf = require('image-size')
const path = require('path')

/**
 * Shortcut function for downloading image assets
 * @param {file} src
 * @returns {string}
 */
module.exports = function dimension(src) {
  const absPath = path.join(path.resolve(__dirname, ".."), src)
  const dimensions = sizeOf(absPath)
  return [dimensions.width, dimensions.height]
}
