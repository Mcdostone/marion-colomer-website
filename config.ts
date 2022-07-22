import markdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import groupByYear from './modules/eleventy/group-by-year'
import dimensions from './modules/eleventy/dimensions'

import { vite, viteUrl, bootVite } from './modules/eleventy/vite'

// eslint-disable-next-line unicorn/prefer-module
module.exports = function (eleventyConfig) {
  eleventyConfig.setTemplateFormats(['md', 'html', 'njk'])
  eleventyConfig.addPassthroughCopy('./src/assets/images')
  eleventyConfig.addPassthroughCopy('./src/assets/uploads')
  const engine = markdownIt({
    html: true,
  }).use(markdownItAnchor, {
    level: [1, 2, 3],
    permalinkAttrs: () => ({ 'aria-label': 'permalink' }),
    permalinkSymbol: '',
    permalink: true,
  })
  eleventyConfig.setLibrary('md', engine)
  eleventyConfig.addNunjucksFilter('groupByYear', groupByYear)
  eleventyConfig.addNunjucksShortcode('vite', vite)
  eleventyConfig.addNunjucksShortcode('viteUrl', viteUrl)
  eleventyConfig.addNunjucksShortcode('bootVite', bootVite)
  eleventyConfig.addNunjucksFilter('dimensions', dimensions)
  return {
    dir: {
      input: 'src',
    },
  }
}
