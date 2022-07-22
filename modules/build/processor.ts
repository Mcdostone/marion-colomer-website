import { Document } from './document'

export interface Processor {
  process(document: Document)
  finish()
}
