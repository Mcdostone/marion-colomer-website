import path from 'node:path'

/**
 * Helper for URLs
 * @param {string} url
 * @returns {string} human-friendly name for an URL (basename of the file or the HTTP URL)
 */
function urlFor(url) {
  if (url.startsWith('http')) {
    return url
  }
  return path.basename(url)
}

export default urlFor
