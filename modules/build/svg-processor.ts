import { promises as fs } from 'node:fs'
import path from 'node:path'
import { optimize } from 'svgo'
import { createHash } from 'node:crypto'
import { Document } from './document'
import { Processor } from './processor'

export class SvgProcessor implements Processor {
  private cache = new Map<string, string>()
  private toDelete = new Set<string>()

  async process(document: Document) {
    const elements = [document.querySelector<HTMLLinkElement>('[type="image/svg+xml"]'), ...document.querySelectorAll<HTMLLinkElement>('svg use')]
    for (const element of elements) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const url = await this.hitCacheOr(document, document.getAbsolutePath(element.getAttribute('href')!))
      element.setAttribute('href', url)
    }
  }

  async hitCacheOr(document: Document, itemPath: string): Promise<string> {
    if (!this.cache.has(itemPath)) {
      const { input, url } = await this.optimize(document, itemPath)
      this.toDelete = this.toDelete.add(input)
      this.cache = this.cache.set(itemPath, url)
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.cache.get(itemPath)!
  }

  async optimize(document: Document, itemPath: string) {
    const id = itemPath.split('#')[1]
    itemPath = itemPath.split('#')[0]
    const svgString = await fs.readFile(itemPath, { encoding: 'utf8' })
    const result = optimize(svgString, {
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              cleanupIDs: false,
              removeUselessDefs: false,
            },
          },
        },
      ],
    })
    const hash = createHash('sha256')
    hash.update(result.data)
    const hexHash = hash.digest('hex').slice(0, 10)
    const output = path.resolve(path.join(itemPath, '..', `${path.basename(itemPath, '.svg')}-${hexHash}.svg`))
    await fs.writeFile(output, result.data, { encoding: 'utf8' })
    return {
      input: itemPath,
      output,
      url: document.getUrl(output) + (id ? `#${id}` : ''),
    }
  }

  async finish() {
    for (const f of this.toDelete) {
      await fs.unlink(f)
    }
  }
}
