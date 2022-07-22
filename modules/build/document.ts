import fs from 'node:fs/promises'
import { JSDOM } from 'jsdom'
import path from 'node:path'

export class Document {
  root: JSDOM

  constructor(readonly rootDirectory, readonly documentPath: string, readonly baseUrl: string = '/') {
    this.root = new JSDOM()
  }

  async load() {
    this.root = new JSDOM(await fs.readFile(this.documentPath, { encoding: 'utf8' }))
    return this
  }

  querySelector<T>(query) {
    return this.root.window.document.querySelector(query) as T
  }

  querySelectorAll<T extends Node>(query) {
    return this.root.window.document.querySelectorAll(query) as NodeListOf<T>
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
    return path.join(this.baseUrl, path.relative(this.rootDirectory, itemPath))
  }
}
