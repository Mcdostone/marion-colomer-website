import { promises as fs } from 'node:fs'
import path from 'node:path'
import { Manifest } from 'vite'
import { Document } from './document'
import { Processor } from './processor'

export class ViteProcessor implements Processor {
  constructor(private readonly manifest: Manifest, private readonly manifestPath: string) {}

  async process(document: Document) {
    const links = document.querySelectorAll('link[rel=stylesheet]') as NodeListOf<HTMLLinkElement>
    for (const link of links) {
      link.href = document.getUrl(this.getFile(link.href))
    }

    const scripts = document.querySelectorAll('script[src]') as NodeListOf<HTMLScriptElement>
    for (const script of scripts) {
      script.src = document.getUrl(this.getFile(script.src))
    }
  }

  async finish() {
    await fs.unlink(this.manifestPath)
  }

  private getFile(entry: string) {
    if (entry.startsWith('/')) {
      entry = entry.slice(1)
    }
    entry = path.normalize(entry)
    return path.join(path.dirname(this.manifestPath), this.manifest[entry].file)
  }
}
