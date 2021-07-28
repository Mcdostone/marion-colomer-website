const path = require('path')
const fs = require('fs/promises');
const fg = require('fast-glob');

const ROOT = path.resolve(process.cwd(), '_site')
/**
 * Shortcut function for downloading image assets
 * @param {string} url
 * @returns {string}
 */
module.exports = async function vite(url) {
  if(await fileExists(path.join(ROOT, url))) {
    return url
  }
  const dirname = path.dirname(url)
  const ext = path.extname(url)
  const basename = path.basename(url, ext)
  const query = path.join(ROOT, dirname, `${basename}*${ext}`)
  const results = await fg([query], { objectMode: true })
  if(results.length == 0) {
    throw new Error(`cannot find file: ${query}`)
  }
  return `${dirname}/${results[0].name}`
}

/**
 * @param {string} path
 * @returns {boolean}
 */
async function fileExists(path) {
  try {
    await fs.access(path)
    return true
  } catch (error) {
    return false
  }
}
