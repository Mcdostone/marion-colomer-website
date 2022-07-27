import ColorThief from 'colorthief'
import path from 'node:path'
import { promises as fs } from 'node:fs'
import Image from '@11ty/eleventy-img'
import { Document } from './document'
import { Processor } from './processor'

interface ImageData {
  input: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
  html: string
}

export class ImageProcessor implements Processor {
  private cache = new Map<string, ImageData>()
  private toDelete = new Set<string>()

  async getPrimaryColor(file: string) {
    try {
      return await ColorThief.getColor(file).then(this.rgbToHex)
    } catch (error) {
      console.log(error)
      return ''
    }
  }

  rgbToHex(array: Array<number>) {
    return (
      '#' +
      array
        .map((x) => {
          const hex = x.toString(16)
          return hex.length === 1 ? '0' + hex : hex
        })
        .join('')
    )
  }

  async process(document: Document) {
    const images = document.querySelectorAll('img') as NodeListOf<HTMLImageElement>
    for (const image of images) {
      image.replaceWith(document.createRange().createContextualFragment(await this.hitCacheOr(document, image)))
    }

    const linksToImages = document.querySelectorAll('a[data-pswp-width]') as NodeListOf<HTMLAnchorElement>
    for (const link of linksToImages) {
      link.href = this.cache.get(document.getAbsolutePath(link.href))?.data.jpeg[0].url
    }
  }

  async hitCacheOr(document: Document, image: HTMLImageElement): Promise<string> {
    const imagePath = document.getAbsolutePath(image.src)
    if (!this.cache.has(imagePath)) {
      const data = await this.optimize(document, image)
      this.toDelete.add(data.input)
      this.cache = this.cache.set(data.input, data)
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.cache.get(imagePath)!.html
  }

  async optimize(document: Document, image: HTMLImageElement): Promise<ImageData> {
    // eslint-disable-next-line unicorn/no-array-reduce
    const options = image.getAttributeNames().reduce((accumulator, name) => {
      return { ...accumulator, [name]: image.getAttribute(name) }
    }, {})

    const imagePath = document.getAbsolutePath(image.src)
    options['alt'] = options['alt'] || ''
    const containerOptions = {}
    if (options['class']) {
      containerOptions['class'] = options['class']
      delete options['class']
    }
    const metadata = await Image(imagePath, {
      formats: ['jpeg', 'avif'],
      outputDir: path.resolve(path.dirname(imagePath)),
      urlPath: path.dirname(document.getUrl(imagePath)),
      filenameFormat: function (id: string, source: string, width: number, format: string) {
        const extension = path.extname(source)
        const name = path.basename(source, extension)
        return `${name}-${id}.${format}`
      },
    })
    const imageAttributes = {
      ...options,
      loading: 'lazy',
      decoding: 'async',
    }
    const markup = await Image.generateHTML(metadata, imageAttributes)
    const primaryColor = await this.getPrimaryColor(metadata.jpeg[0].outputPath)
    if (primaryColor !== '') {
      containerOptions['style'] = [containerOptions['style'], `--pc: ${primaryColor}`].filter((s) => s !== undefined).join(';')
    }
    return {
      input: imagePath,
      data: metadata,
      html: markup.replace(
        '<picture',
        `<picture${Object.entries(containerOptions)
          .map((source) => ` ${source[0]}="${source[1]}"`)
          .join('')}`
      ),
    }
  }

  async finish() {
    for (const f of this.toDelete) {
      await fs.unlink(f)
    }
  }
}
