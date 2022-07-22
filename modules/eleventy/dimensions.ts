import sizeOf from 'image-size'
import path from 'node:path'

/**
 * @param {string} source Path to an image
 * @returns {array<Number>} Width and height of the given image
 */
function dimension(source: string) {
  // eslint-disable-next-line unicorn/prefer-module
  const absPath = path.join(path.resolve(__dirname, '..', '..'), 'src', source)
  const dimensions = sizeOf(absPath)
  return [dimensions.width, dimensions.height]
}

export default dimension
