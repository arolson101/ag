import sax, { SAXParser } from 'sax'
import { LOG } from '../log/Log'
import { DefaultHandler } from './DefaultHandler'
import { OFXHandler } from './OFXHandler'
import { OFXParseException } from './OFXParseException'
import { OFXReader } from './OFXReader'
import { OFXV2ContentHandler } from './OFXV2ContentHandler'
import { StringReader } from './StringReader'

function arraysEqual(a1: string[], a2: string[]) {
  if (a1.length !== a2.length) {
    return false
  }
  for (let i = 0; i < a1.length; i++) {
    if (a1[i] !== a2[i]) {
      return false
    }
  }
  return true
}

/**
 * Base class for an OFX reader.  Parses the headers and determines whether we're parsing an
 * OFX v2 or OFX v1 element.  For OFX v2, uses a standard SAX library.
 */
export /*abstract*/ class BaseOFXReader implements OFXReader {
  static OFX_2_PROCESSING_INSTRUCTION_PATTERN: RegExp = /<\\?OFX ([^\\?]+)\\?>/
  private contentHandler: OFXHandler

  constructor() {
    this.contentHandler = new DefaultHandler()
  }

  /**
   * The content handler.
   *
   * @return The content handler.
   */
  getContentHandler(): OFXHandler {
    return this.contentHandler
  }

  /**
   * The content handler.
   *
   * @param handler The content handler.
   */
  setContentHandler(handler: OFXHandler): void {
    this.contentHandler = handler
  }

  /**
   * Parse the reader, including the headers.
   *
   * @param reader The reader.
   */
  parse(reader: StringReader): void {
    let header: string = ''
    const firstElementStart = this.getFirstElementStart()
    const buffer: string[] = new Array(firstElementStart.length)
    reader.mark(/*firstElementStart.length*/)
    let ch: any = reader.read(buffer)
    while (ch !== -1 && !arraysEqual(buffer, firstElementStart)) {
      if (!this.contains(buffer, '<')) {
        // if the buffer contains a '<', then we might already have marked the beginning.
        reader.mark(/*firstElementStart.length*/)
      }
      ch = reader.read()
      const shifted: string = this.shiftAndAppend(buffer, ch)
      header += shifted
    }

    if (ch === -1) {
      throw new OFXParseException('Invalid OFX: no root <OFX> element!')
    } else {
      const matches = BaseOFXReader.OFX_2_PROCESSING_INSTRUCTION_PATTERN.exec(header)
      if (matches) {
        LOG.info('Processing OFX 2 header...')

        this.processOFXv2Headers(matches[1])
        reader.reset()
        this.parseV2FromFirstElement(reader.remainder())
      } else {
        LOG.info('Processing OFX 1 headers...')
        this.processOFXv1Headers(header)
        reader.reset()
        this.parseV1FromFirstElement(reader.remainder())
      }
    }
  }

  /**
   * The first characters of the first OFX element, '<', 'O', 'F', 'X'
   *
   * @return The first characters of the OFX element.
   */
  protected getFirstElementStart(): string[] {
    return ['<', 'O', 'F', 'X']
  }

  /**
   * Whether the specified buffer contains the specified character.
   *
   * @param buffer The buffer.
   * @param c The character to search for.
   * @return Whether the specified buffer contains the specified character.
   */
  private contains(buffer: string[], c: string): boolean {
    for (const ch of buffer) {
      if (ch === c) {
        return true
      }
    }
    return false
  }

  private shiftAndAppend(buffer: string[], c: string): string {
    const shifted = buffer[0]
    for (let i = 0; i + 1 < buffer.length; i++) {
      buffer[i] = buffer[i + 1]
    }
    buffer[buffer.length - 1] = c
    return shifted
  }

  /**
   * Parse an OFX version 1 stream from the first OFX element (defined by the
   * {@link #getFirstElementStart()} first element characters).
   *
   * @param text The text.
   */
  protected parseV1FromFirstElement(text: string): void {
    const strict = false
    const parser: SAXParser = sax.parser(strict, {})
    const handler = new OFXV2ContentHandler(this.getContentHandler())
    handler.install(parser)
    parser.write(text)
  }

  /**
   * Parse an OFX version 2 stream from the first OFX element (defined by the
   * {@link #getFirstElementStart()} first element characters).
   *
   * @param text The text.
   */
  protected parseV2FromFirstElement(text: string): void {
    const strict = true
    const parser: SAXParser = sax.parser(strict, {})
    const handler = new OFXV2ContentHandler(this.getContentHandler())
    handler.install(parser)
    parser.write(text)
  }

  /**
   * Process the given characters as OFX version 1 headers.
   *
   * @param chars The characters to process.
   */
  protected processOFXv1Headers(chars: string): void {
    const lines: string[] = chars.split(/(\n|\r\n)/)
    for (const line of lines) {
      const colonIndex: number = line.indexOf(':')
      if (colonIndex >= 0) {
        const name: string = line.substring(0, colonIndex)
        const value: string = line.length > colonIndex ? line.substring(colonIndex + 1) : ''
        this.contentHandler.onHeader(name, value)
      }
    }
  }

  /**
   * Process the given characters as OFX version 2 headers.
   *
   * @param chars The characters to process.
   */
  protected processOFXv2Headers(chars: string): /*throws OFXParseException*/ void {
    const nameValuePairs: string[] = chars.split('\\s+')
    for (const nameValuePair of nameValuePairs) {
      const equalsIndex: number = nameValuePair.indexOf('=')
      if (equalsIndex >= 0) {
        const name: string = nameValuePair.substring(0, equalsIndex)
        let value: string =
          nameValuePair.length > equalsIndex ? nameValuePair.substring(equalsIndex + 1) : ''
        value = value.replace('"', ' ')
        value = value.replace("'", ' ')
        value = value.trim()
        this.contentHandler.onHeader(name, value)
      }
    }
  }
}
