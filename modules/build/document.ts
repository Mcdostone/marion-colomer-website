import fs from 'node:fs/promises'
import { JSDOM } from 'jsdom'
import path from 'node:path'

export class Document {
  root: JSDOM

  constructor(readonly rootDirectory, readonly documentPath: string) {
    this.root = new JSDOM()
  }

  async load() {
    this.root = new JSDOM(await fs.readFile(this.documentPath, { encoding: 'utf8' }))
    return this
  }

  querySelector(query) {
    return this.root.window.document.querySelector(query) as HTMLElement
  }

  querySelectorAll(query) {
    return this.root.window.document.querySelectorAll(query) as NodeListOf<HTMLElement>
  }

  createRange() {
    return this.root.window.document.createRange()
  }

  serialize() {
    return this.root.serialize()
  }

  getAbsolutePath(itemPath: string) {
    return path.isAbsolute(itemPath) ? path.join(this.rootDirectory, itemPath) : path.resolve(path.dirname(this.documentPath), itemPath)
  }

  getUrl(itemPath) {
    return path.join('/', path.relative(this.rootDirectory, itemPath))
  }
}
