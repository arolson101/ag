import { StringMap } from '../../collections/collections'
import { OFXException } from '../../OFXException'
import { OutputBuffer, StreamWriter } from '../StreamWriter'
import { OFXV1Writer } from '../v1/OFXV1Writer'

/**
 * OFX writer to XML, suitable for OFX version 2.0.
 */
export class OFXV2Writer extends OFXV1Writer {
  constructor(out: OutputBuffer | StreamWriter) {
    super(out)
  }

  // @Override
  protected newWriter(out: OutputBuffer): /*throws UnsupportedEncodingException*/ StreamWriter {
    return new StreamWriter(out, 'UTF-8')
  }

  writeHeaders(headers: StringMap): /*throws IOException*/ void {
    if (this.headersWritten) {
      throw new OFXException('Headers have already been written!')
    }

    // write out the XML PI
    this.print('<?xml version="1.0" encoding="utf-8" ?>')
    let security: string = headers.SECURITY
    if (security == null) {
      security = 'NONE'
    }
    let olduid: string = headers.OLDFILEUID
    if (olduid == null) {
      olduid = 'NONE'
    }
    // println(olduid);
    let uid: string = headers.NEWFILEUID
    if (uid == null) {
      uid = 'NONE'
    }

    this.print(
      '<?OFX OFXHEADER="200" VERSION="202" SECURITY="' +
        security +
        '" OLDFILEUID="' +
        olduid +
        '" NEWFILEUID="' +
        uid +
        '"?>'
    )
    this.headersWritten = true
  }

  writeElement(name: string, value: string): void {
    super.writeElement(name, value)
    this.print('</')
    this.print(name)
    this.print('>')
  }

  // @Override
  isWriteAttributesOnNewLine(): boolean {
    return false
  }
}
