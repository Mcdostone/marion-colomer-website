import path from 'node:path'
import { Document } from './document'
import { Processor } from './processor'

export class SubpathProcessor implements Processor {
  constructor(private readonly subPath: string) {}

  async process(document: Document) {
    for (const element of [...document.querySelectorAll('[src]')] as HTMLScriptElement[]) {
      element.src = this.getNewPath(element.src)
    }
    for (const element of [...document.querySelectorAll('[href]')] as HTMLAnchorElement[]) {
      element.href = this.getNewPath(element.href)
    }
  }

  getNewPath(url: string) {
    const ok = url.startsWith('/') ? path.join('/', this.subPath, url) : url
    return ok
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  finish() {}
}
