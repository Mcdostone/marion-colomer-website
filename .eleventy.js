const markdownIt = require('markdown-it')
const { createServer } = require('vite')
const os = require('os')
const markdownItAnchor = require('markdown-it-anchor')
const pictureAsset = require('./modules/pictureAsset')
const groupByYear = require('./modules/groupByYear')
const dimensions = require('./modules/dimensions')
const url = require('./modules/url')
const { vite, viteUrl, bootVite } = require('./modules/vite')

process.env.DEBUG= "vite:*"
process.env.HOST ||= 'localhost'
process.env.VITE_URL ||= `http://${getHost(process.env.HOST)}:3000`

/** Vite server */
async function main() {
  if (process.env.ELEVENTY_ENV !== 'production') {
    const url = new URL(process.env.VITE_URL);
    const server = await createServer({
      configFile: './vite.config.js',
      mode: 'development',
      server: {
        port: url.port,
        host: '0.0.0.0'
      },
    })
    await server.listen()
    server.printUrls()
  }
}

main()


module.exports = function (eleventyConfig) {
  eleventyConfig.setTemplateFormats(['md', 'html', 'njk'])
  eleventyConfig.addPassthroughCopy('./src/assets/images')
  eleventyConfig.addPassthroughCopy('./src/assets/uploads')
  const engine = markdownIt({
    html: true,
  }).use(markdownItAnchor, {
    level: [1, 2, 3],
    permalinkAttrs: (_) => ({ 'aria-label': 'permalink' }),
    permalinkSymbol: '',
    permalink: true,
  })
  eleventyConfig.setLibrary('md', engine)
  eleventyConfig.addNunjucksAsyncShortcode('pictureAsset', pictureAsset)
  eleventyConfig.addNunjucksFilter('groupByYear', groupByYear)
  eleventyConfig.addNunjucksFilter('url', url)
  eleventyConfig.addNunjucksShortcode('vite', vite)
  eleventyConfig.addNunjucksShortcode('viteUrl', viteUrl)
  eleventyConfig.addNunjucksShortcode('bootVite', bootVite)
  eleventyConfig.addNunjucksFilter('dimensions', dimensions)
  eleventyConfig.setBrowserSyncConfig({
    https: false,
    host: '0.0.0.0',
    ghostMode: true,
    snippet: true,
    snippetOptions: {
      rule: {
        match: /<\/head>/i,
        fn: function (snippet, match) {
          return snippet + match
        },
      },
    },
  })
  return {
    dir: {
      input: 'src',
    },
  }
  
}

/** @return {string} */
function getHost(hostname) {
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
