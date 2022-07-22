import fs from 'node:fs/promises'
import { minify } from 'html-minifier-terser'
import { Processor } from './processor'
import { Document } from './document'

export class HtmlProcessor implements Processor {
  async process(document: Document) {
    const result = await minify(document.serialize(), {
      removeAttributeQuotes: false,
      removeTagWhitespace: false,
      removeComments: true,
      sortAttributes: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      decodeEntities: true,
    })
    await fs.writeFile(document.documentPath, result)
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  finish() {}
}
