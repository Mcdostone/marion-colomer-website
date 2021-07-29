const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const pictureAsset = require('./modules/pictureAsset')
const groupByYear = require('./modules/groupByYear')
const dimensions = require('./modules/dimensions')
const url = require('./modules/url')
const {vite, viteUrl, bootVite} = require('./modules/vite')


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
    snippetOptions: {
      rule: {
        match: /<\/head>/i,
        fn: function (snippet, match) {
          return snippet + match
        },
      },
    },
  })
  //eleventyConfig.addWatchTarget('src/**/*.js')
  //eleventyConfig.addWatchTarget('module/*.js')
  //eleventyConfig.addWatchTarget('src/**/*.css')
  return {
    dir: {
      input: 'src',
    },
  }
}
