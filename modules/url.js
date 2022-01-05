const path = require('path')

/**
 * Helper for URLs
 * @param {string} url
 * @returns {string} human-friendly name for an URL (basename of the file or the HTTP URL)
 */
module.exports = function urlFor(url) {
  if (url.startsWith('http')) {
    return url
  }
  return path.basename(url)
}
