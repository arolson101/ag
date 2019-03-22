// tslint:disable:max-line-length
import { RequestEnvelope } from '../../domain/data/RequestEnvelope'
import { ResponseEnvelope } from '../../domain/data/ResponseEnvelope'
import { AggregateMarshaller } from '../../io/AggregateMarshaller'
import { AggregateUnmarshaller } from '../../io/AggregateUnmarshaller'
import { OFXWriter } from '../../io/OFXWriter'
import { OutputBuffer } from '../../io/StreamWriter'
import { StringReader } from '../../io/StringReader'
import { OFXV1Writer } from '../../io/v1/OFXV1Writer'
import { LOG } from '../../log/Log'
import { OFXException } from '../../OFXException'
import { OFXConnection } from './OFXConnection'
import { OFXConnectionException } from './OFXConnectionException'

// import java.io.*;
// import java.net.HttpURLConnection;
// import java.net.URL;

export interface HeadersObject {
  [header: string]: string
}
export type AjaxHandler = (
  url: string,
  verb: string,
  headers: HeadersObject,
  data: string,
  async: boolean
) => Promise<string>

function DefaultAjaxHandler(
  url: string,
  verb: string,
  headers: HeadersObject,
  data: string,
  async: boolean
): Promise<string> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    let onloadCalled: boolean = false
    request.open('POST', url, async)
    for (const header of Object.keys(headers)) {
      request.setRequestHeader(header, headers[header])
    }
    request.onload = () => {
      onloadCalled = true
      if (request.status >= 200 && request.status < 300) {
        resolve(request.responseText)
      } else if (request.status >= 400 && request.status < 500) {
        reject(
          new OFXException(
            'Error ' + request.status + ' with client request: ' + request.responseText
          )
        )
      } else {
        reject(new OFXException('Invalid response code from OFX server: ' + request.status))
      }
    }
    request.onerror = () => {
      reject(new OFXException('Network error'))
    }

    request.send(data)

    if (!async && !onloadCalled) {
      ;(request as any).onload()
    }
  })
}

/**
 * Base implementation for an OFX connection.
 */
export class OFXV1Connection implements OFXConnection {
  private async: boolean
  private marshaller: AggregateMarshaller
  private unmarshaller: AggregateUnmarshaller<ResponseEnvelope>
  private ajax: AjaxHandler

  constructor() {
    this.async = true
    this.marshaller = new AggregateMarshaller()
    this.unmarshaller = new AggregateUnmarshaller<ResponseEnvelope>(ResponseEnvelope)
    this.ajax = DefaultAjaxHandler
  }

  // Inherited.
  sendRequest(request: RequestEnvelope, url: string): Promise<ResponseEnvelope> {
    //    if (!url.protocol().toLowerCase().startsWith("http")) {
    //      throw new OFXException("Invalid URL: " + url + " only http(s) is supported.");
    //    }

    // marshal to memory so we can determine the size...
    const outBuffer = new OutputBuffer()
    const ofxWriter: OFXWriter = this.newOFXWriter(outBuffer)
    this.getMarshaller().marshal(request, ofxWriter)
    ofxWriter.close()
    this.logRequest(outBuffer)
    return this.sendBuffer(url, outBuffer).then(
      (in_: string): ResponseEnvelope => {
        this.logResponse(in_)
        return this.unmarshal(in_)
      }
    )
  }

  /**
   * Log a request buffer.
   *
   * @param outBuffer The buffer to log.
   */
  protected logRequest(outBuffer: OutputBuffer): /*throws UnsupportedEncodingException*/ void {
    LOG.info('Marshalling ' + outBuffer.size() + ' bytes of the OFX request.')
    LOG.debug(outBuffer.toString('utf-8'))
  }

  protected logResponse(inBuffer: string) {
    LOG.debug('Received OFX response:', inBuffer)
  }

  /**
   * Send the specified buffer to the specified URL.
   *
   * @param url The URL.
   * @param outBuffer The buffer.
   * @return a promise that resolves with the response.
   */
  protected sendBuffer(
    url: string,
    outBuffer: OutputBuffer
  ): /*throws IOException, OFXConnectionException*/ Promise<string> {
    const outText = outBuffer.toString()
    const async: boolean = this.getAsync()
    const headers: HeadersObject = {
      'Content-Type': 'application/x-ofx',
      Accept: '*/*, application/x-ofx',
    }

    return this.ajax(url, 'POST', headers, outText, async)
  }

  /**
   * Unmarshal the input stream.
   *
   * @param in The input stream.
   * @return The response envelope.
   */
  protected unmarshal(
    in_: string
  ): /*throws IOException, OFXConnectionException*/ ResponseEnvelope {
    try {
      const reader = new StringReader(in_)
      return this.getUnmarshaller().unmarshal(reader)
    } catch (e) {
      throw new OFXConnectionException('Unable to parse the OFX response.', e)
    }
  }

  /**
   * Create a new OFX writer.
   *
   * @param out The output stream for the writer.
   * @return The OFX writer.
   */
  protected newOFXWriter(out: OutputBuffer): OFXWriter {
    return new OFXV1Writer(out)
  }

  /**
   * The marshaller.
   *
   * @return The marshaller.
   */
  getMarshaller(): AggregateMarshaller {
    return this.marshaller
  }

  /**
   * The marshaller.
   *
   * @param marshaller The marshaller.
   */
  setMarshaller(marshaller: AggregateMarshaller): void {
    this.marshaller = marshaller
  }

  /**
   * The unmarshaller.
   *
   * @return The unmarshaller.
   */
  getUnmarshaller(): AggregateUnmarshaller<ResponseEnvelope> {
    return this.unmarshaller
  }

  /**
   * The unmarshaller.
   *
   * @param unmarshaller The unmarshaller.
   */
  setUnmarshaller(unmarshaller: AggregateUnmarshaller<ResponseEnvelope>): void {
    this.unmarshaller = unmarshaller
  }

  /**
   * Async mode
   *
   * @return {bool} Whether in async mode.
   */
  getAsync() {
    return this.async
  }

  /**
   * Async mode
   *
   * @param {bool} async async mode.
   */
  setAsync(async: boolean) {
    this.async = async
  }

  /**
   * Async mode
   *
   * @return {bool} Whether in async mode.
   */
  getAjax() {
    return this.ajax
  }

  /**
   * Async mode
   *
   * @param {bool} async async mode.
   */
  setAjax(ajax: AjaxHandler) {
    this.ajax = ajax
  }
}
