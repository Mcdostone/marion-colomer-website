const sizeOf = require('image-size')
const path = require('path')

/**
 * @param {file} src Path to an image
 * @returns {array<Number>} Width and height of the given image
 */
module.exports = function dimension(src) {
  const absPath = path.join(path.resolve(__dirname, '..'), 'src', src)
  const dimensions = sizeOf(absPath)
  return [dimensions.width, dimensions.height]
}
