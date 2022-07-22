import fs from 'node:fs/promises'
import path from 'node:path'
import { ImageProcessor } from './image-processor'
import { SvgProcessor } from './svg-processor'
import { Document } from './document'
import { ViteProcessor } from './vite-processor'
import { HtmlProcessor } from './html-processor'
import { Processor } from './processor'
import { SubpathProcessor } from './subpath-processor'

class PostProcessor implements Processor {
  constructor(private readonly rootDirectory, private readonly modules: Processor[]) {}

  async run() {
    await this.walk(this.rootDirectory)
  }

  async finish() {
    for (const m of this.modules) {
      await m.finish()
    }
  }

  private async walk(directory: string) {
    const items = await fs.readdir(directory)
    for (const item of items) {
      const itemPath = path.join(directory, item)
      switch (path.extname(itemPath)) {
        case '.html':
          // eslint-disable-next-line no-case-declarations
          const document = await new Document(this.rootDirectory, itemPath).load()
          await this.process(document)
          break
      }
      const stats = await fs.stat(itemPath)
      if (stats.isDirectory()) {
        await this.walk(itemPath)
      }
    }
  }

  async process(document: Document) {
    for (const m of this.modules) {
      await m.process(document)
    }
  }
}

async function start() {
  const viteManifestPath = path.resolve(process.argv[1], '../../../_site/manifest.json')
  const manifest = await fs.readFile(viteManifestPath, 'utf8').then(JSON.parse)
  const root = path.resolve(process.argv[2])
  const subPath = process.argv[3] || '/'
  const modules = [new ImageProcessor(), new SvgProcessor(), new ViteProcessor(manifest, viteManifestPath), new SubpathProcessor(subPath), new HtmlProcessor()]

  const processor = new PostProcessor(root, modules)
  await processor.run()
  await processor.finish()
  if (subPath !== '/') {
    const temporary = path.resolve(root, '..', '__site')
    await fs.rename(root, temporary)
    await fs.mkdir(root, { recursive: true })
    await fs.rename(temporary, path.join(root, subPath))
  }
}

// eslint-disable-next-line unicorn/prefer-top-level-await
start()
