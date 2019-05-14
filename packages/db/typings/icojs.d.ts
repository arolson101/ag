declare module 'icojs/index.js' {
  export interface ParsedImage {
    width: number
    height: number
    bpp: number
    buffer: ArrayBuffer
  }

  export function isICO(source: ArrayBuffer | Buffer): boolean

  export function parse(buffer: ArrayBuffer | Buffer, mime?: string): Promise<ParsedImage[]>

  export function parseSync(buffer: ArrayBuffer | Buffer, mime?: string): ParsedImage[]
}
