const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const pictureAsset = require('./src/modules/pictureAsset')
const groupByYear = require('./src/modules/groupByYear')
const dimensions = require('./src/modules/dimensions')
const url = require('./src/modules/url')

module.exports = function (eleventyConfig) {
  eleventyConfig.setTemplateFormats(['md', 'html', 'njk', 'css'])
  eleventyConfig.addPassthroughCopy('./src/favicon.svg')
  eleventyConfig.addPassthroughCopy('./src/assets/images')
  eleventyConfig.addPassthroughCopy('./src/assets/uploads')
  eleventyConfig.addPassthroughCopy({ './src/assets/css': false })
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
  eleventyConfig.addNunjucksFilter('dimensions', dimensions)
  eleventyConfig.setBrowserSyncConfig({
    https: true,
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
