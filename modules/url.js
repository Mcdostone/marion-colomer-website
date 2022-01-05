const path = require('path')

/**
 * @param {string} url
 * @returns {string}
 */
module.exports = function urlFor(url) {
  if (url.startsWith('http')) {
    return url
  }
  return path.basename(url)
}
