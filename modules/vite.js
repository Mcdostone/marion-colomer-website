const { JSDOM } = require('jsdom')
const path = require('path')
const os = require('os')
const fg = require('fast-glob')
const document = new JSDOM('').window.document
const isProduction = process.env.ELEVENTY_ENV === 'production'
const viteUrl = isProduction ? viteUrlForProduction() : viteUrlForDevelopment

process.env.VITE_URL ||= `http://${getHost(process.env.HOST)}:3000`

function viteUrlForDevelopment(url) {
  const viteUrl = new URL(process.env.VITE_URL || 'http://localhost:3000')
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
  return function (url) {
    return results[url]
  }
}

/**
 * @returns {string}
 */
function bootVite() {
  return isProduction
    ? ''
    : `<script type="module" src="${viteUrlForDevelopment('@vite/client')}"></script><script type="module" src="${viteUrlForDevelopment('src/client/main.js')}"></script>`
}

/**
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
  switch (type) {
    case 'link':
      attributes['href'] = url
      break
    case 'script':
      attributes['type'] = 'module'
      attributes['src'] = url
  }
  for (const key in attributes) {
    element.setAttribute(key, attributes[key])
  }
  return element
}

/** @return {string} */
function getHost(hostname) {
  if(hostname === '127.0.0.1' || hostname === 'localhost') {
    return 'localhost'
  }
  return Object.values(os.networkInterfaces())
  .flatMap((nInterface) => nInterface ?? [])
  .filter((detail) => detail && detail.address && detail.family === 'IPv4')
  .map((detail) => {
    const type = detail.address.includes('127.0.0.1')
      ? 'Local:   '
      : 'Network: '
    return detail.address.replace('127.0.0.1', hostname)
  }).slice(-1)
}


module.exports = {
  bootVite,
  vite,
  viteUrl,
}
