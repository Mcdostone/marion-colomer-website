import markdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import pictureAsset from './modules/pictureAsset'
import groupByYear from './modules/groupByYear'
import dimensions from './modules/dimensions'
import url from './modules/url'
import { vite, viteUrl, bootVite } from './modules/vite'
import { Config, UserConfig } from './types/eleventy'

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
    host: process.env.HOST || '127.0.0.1',
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
