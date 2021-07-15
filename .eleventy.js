const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const pictureAsset = require('./src/modules/pictureAsset')
const groupByYear = require('./src/modules/groupByYear')

module.exports = function (eleventyConfig) {
  eleventyConfig.setTemplateFormats(['md', 'html', 'njk', 'css'])
  eleventyConfig.addPassthroughCopy('./src/favicon.svg')
  eleventyConfig.addPassthroughCopy('./src/assets')
  const engine = markdownIt({
    html: true,
  }).use(markdownItAnchor, {
    level: [1, 2, 3],
    permalinkAttrs: slug => ({ 'aria-label': 'permalink'}),
    permalinkSymbol: '',
    permalink: true,
  })
  eleventyConfig.setLibrary('md', engine)
  eleventyConfig.addShortcode('pictureAsset', pictureAsset)
  eleventyConfig.addNunjucksFilter('groupByYear', groupByYear);
  eleventyConfig.setBrowserSyncConfig({
    https: true,
  })
  eleventyConfig.addWatchTarget('src/**/*.js')
  eleventyConfig.addWatchTarget('module/*.js')
  eleventyConfig.addWatchTarget('src/**/*.css')
  return {
    dir: {
      input: 'src',
    },
  }
}
