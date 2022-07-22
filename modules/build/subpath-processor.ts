import path from 'node:path'
import { Document } from './document'
import { Processor } from './processor'

export class SubpathProcessor implements Processor {
  async process(document: Document) {
    for (const element of [...document.querySelectorAll('body [src]')] as HTMLScriptElement[]) {
      if (element.tagName !== 'IMG') {
        element.src = this.getNewPath(element.src, document.baseUrl)
      }
    }
    for (const element of [...document.querySelectorAll('body [href]:not([data-pswp-width])')] as HTMLAnchorElement[]) {
      element.href = this.getNewPath(element.href, document.baseUrl)
    }
  }

  getNewPath(url: string, baseUrl: string) {
    return url.startsWith('/') ? path.join(baseUrl, url) : url
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  finish() {}
}
