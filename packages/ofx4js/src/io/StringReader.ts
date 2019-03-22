import { ok as assert } from 'assert'

export class StringReader {
  private _text: string
  private _cursor: number
  private _mark: number

  constructor(text: string) {
    this._text = text
    this._cursor = 0
    this._mark = 0
  }

  read(cbuf?: string[], offset?: number, length?: number): number | string {
    if (this._cursor >= this._text.length) {
      return -1
    } else {
      if (arguments.length === 0) {
        return this.readChar()
      } else {
        offset = offset || 0
        length = length || cbuf.length
        length = Math.min(length, this._text.length - this._cursor)
        for (let i = 0; i < length; i++) {
          cbuf[offset + i] = this.readChar()
        }
        return length
      }
    }
  }

  readChar(): string {
    assert(this._cursor < this._text.length)
    const ch = this._text[this._cursor]
    this._cursor++
    return ch
  }

  close(): void {
    this._text = null
    this._cursor = null
    this._mark = null
  }

  mark(/*readLimit*/): void {
    this._mark = this._cursor
  }

  reset(): void {
    this._cursor = this._mark
  }

  remainder(): string {
    return this._text.substring(this._cursor)
  }
}
