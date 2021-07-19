const sizeOf = require('image-size')
const path = require('path')

/**
 * Shortcut function for downloading image assets
 * @param {string} url
 * @returns {string}
 */
module.exports = function dimension(url) {
  if (url.startsWith('http')) {
    return url
  }
  return path.basename(url)
}
