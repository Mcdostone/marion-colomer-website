import markdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import groupByYear from './modules/eleventy/groupByYear'
import dimensions from './modules/eleventy/dimensions'
global.pathPrefix = process.env.PATH_PREFIX || '/'

import { vite, viteUrl, bootVite } from './modules/eleventy/vite'

module.exports = function (eleventyConfig) {
  const pathPrefix = global.pathPrefix
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
  //eleventyConfig.addNunjucksAsyncShortcode('pictureAsset', pictureAsset)
  eleventyConfig.addNunjucksFilter('groupByYear', groupByYear)
  //eleventyConfig.addNunjucksFilter('url', url)
  eleventyConfig.addNunjucksShortcode('vite', vite)
  eleventyConfig.addNunjucksShortcode('viteUrl', viteUrl)
  eleventyConfig.addNunjucksShortcode('bootVite', bootVite)
  eleventyConfig.addNunjucksFilter('dimensions', dimensions)
  eleventyConfig.addFilter('debugger', (...args) => {
    console.log(...args)
    debugger
    return args
  })
  eleventyConfig.addGlobalData('pathPrefix', pathPrefix)
  return {
    dir: {
      input: 'src',
    },
    pathPrefix,
  }
}
