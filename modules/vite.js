
const {JSDOM } = require('jsdom')
const path = require('path')
const fg = require('fast-glob')
const document = new JSDOM('').window.document
const isProduction = process.env.ELEVENTY_ENV === 'production'
const viteUrl = isProduction ? viteUrlForProduction() : viteUrlForDevelopment

function viteUrlForDevelopment(url) {
  const viteUrl = new URL('http://localhost:3000')
  viteUrl.pathname = url
  return viteUrl.toString()
}

/**
 *
 * @param {string} url
 * @returns {string}
 */
function viteUrlForProduction() {
  const cwd = path.join(path.resolve(__dirname, '..'), '_site')
  const query = path.join('assets', '**')
  const matches = fg.sync([query], { cwd, onlyFiles: true })
  const results = matches.reduce((accumulator, file) => {
      const dirname = path.dirname(file)
      const parts = path.basename(file).split('.')
      accumulator[`/${dirname}/${parts[0]}.${parts[parts.length - 1]}`] = `/${file}`
      return accumulator
  }, {})
  return function(url) {
    return results[url]
  }
}

/**
 * @returns {string}
 */
 function bootVite() {
  return isProduction ? '' : `<script type="module" src="http://localhost:3000/@vite/client"></script><script type="module" src="http://localhost:3000/src/client/main.js"></script>`
}

/**
 * Shortcut function for downloading image assets
 * @param {string} url
 * @param {Object} attributes
 * @returns {string}
 */
function vite(url, type, attributes = {}) {
  return createElement(viteUrl(url), type, attributes).outerHTML
}

/**
 * @param {string} url
 * @param {Object} attributes
 * @returns {string}
 */
function createElement(url, type, attributes = {}) {
  element = document.createElement(type)
  switch(type) {
    case 'link':
      attributes['href'] = url
      break
    case 'script':
      attributes['type'] = 'module'
      attributes['src'] = url
  }
  for(const key in attributes) {
    element.setAttribute(key, attributes[key])
  }
  return element
}


module.exports = {
  bootVite,
  vite,
  viteUrl
}

