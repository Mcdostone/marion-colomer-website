import Image from '@11ty/eleventy-img'
import { getAverageColor } from 'fast-average-color-node'
import { promises as fs } from 'node:fs'
import path from 'node:path'

import { Document } from './document'
import { Processor } from './processor'

interface ImageData {
  input: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: any
}

export class ImageProcessor implements Processor {
  private cache = new Map<string, ImageData>()
  private toDelete = new Set<string>()

  async getPrimaryColor(file: string) {
    try {
      return await getAverageColor(file).then((result) => result.hex)
    } catch (error) {
      console.log(error)
      return ''
    }
  }

  async process(document: Document) {
    const images = document.querySelectorAll('img') as NodeListOf<HTMLImageElement>
    for (const image of images) {
      const data = await this.hitCacheOr(document, image)
      image.replaceWith(document.createRange().createContextualFragment(await this.generateHTML(data, image)))
      for (const link of document.querySelectorAll<HTMLAnchorElement>(`[href='${image.src}']`)) {
        link.href = data.metadata.avif[0].url
      }
    }
  }

  async hitCacheOr(document: Document, image: HTMLImageElement): Promise<ImageData> {
    const imagePath = document.getAbsolutePath(image.src)
    if (!this.cache.has(imagePath)) {
      const data = await this.optimize(document, image)
      this.toDelete = this.toDelete.add(data.input)
      this.cache = this.cache.set(data.input, data)
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.cache.get(imagePath)!
  }

  private async generateHTML(imageData: ImageData, image: HTMLImageElement): Promise<string> {
    // eslint-disable-next-line unicorn/no-array-reduce
    const options = image.getAttributeNames().reduce((accumulator, name) => {
      return { ...accumulator, [name]: image.getAttribute(name) }
    }, {})
    options['alt'] = options['alt'] || ''
    const containerOptions = {}
    if (options['class']) {
      containerOptions['class'] = options['class']
      delete options['class']
    }
    if (options['style']) {
      containerOptions['style'] = options['style']
      delete options['style']
    }
    const imageAttributes = {
      ...options,
      loading: 'lazy',
      decoding: 'async',
    }
    const markup = await Image.generateHTML(imageData.metadata, imageAttributes)
    const primaryColor = await this.getPrimaryColor(imageData.metadata.jpeg[0].outputPath)
    if (primaryColor !== '') {
      containerOptions['style'] = `${[containerOptions['style'], `--pc: ${primaryColor}`].filter((s) => s !== undefined).join(';')}`
    }
    return markup.replace(
      '<picture',
      `<picture${Object.entries(containerOptions)
        .map((source) => ` ${source[0]}="${source[1]}"`)
        .join('')}`
    )
  }

  async optimize(document: Document, image: HTMLImageElement): Promise<ImageData> {
    const imagePath = document.getAbsolutePath(image.src)
    const metadata = await Image(imagePath, {
      formats: ['avif', 'jpeg'],
      outputDir: path.resolve(path.dirname(imagePath)),
      urlPath: path.dirname(document.getUrl(imagePath)),
      filenameFormat: function (id, source, width, format) {
        const extension = path.extname(source)
        const name = path.basename(source, extension)
        return `${name}-${id}.${format}`
      },
    })
    return {
      input: imagePath,
      metadata: metadata,
    }
  }

  async finish() {
    for (const f of this.toDelete) {
      await fs.unlink(f)
    }
  }
}
