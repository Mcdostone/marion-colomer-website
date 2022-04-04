import sizeOf from 'image-size'
import path from 'node:path'

/**
 * @param {src} src Path to an image
 * @returns {array<Number>} Width and height of the given image
 */
function dimension(src: string) {
  const absPath = path.join(path.resolve(__dirname, '..'), 'src', src)
  const dimensions = sizeOf(absPath)
  return [dimensions.width, dimensions.height]
}

export default dimension
