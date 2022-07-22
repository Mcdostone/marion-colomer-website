import path from 'node:path'
import { imagePath } from './asset'
import { Template } from '../../types/eleventy'

/**
 * Shortcut function for downloading image assets
 * @param {file} url
 * @returns {string}
 */
async function asset(this: Template, ...source: string[]): Promise<string> {
  const results = await Promise.all(
    source.map(async (s) => {
      //const picture = await imageShortcode.call(this, s)
      const absPath = await imagePath.call(this, s)
      // eslint-disable-next-line unicorn/prefer-module
      const relativeTo = path.relative(path.join(__dirname, '../src', 'pages'), absPath)
      const url = path.join('/' /*, this.ctx.eleventy.pathPrefix*/, relativeTo)
      //const found = picture.match(/src="(.*\.jpeg)"/)![1]
      return `<a class="asset" aria-label="download ${path.basename(url)}" href="${url}"><img src="${url}" /></a>`
    })
  )
  return results.join('')
}

export { asset }
