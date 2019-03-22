import { Severity, StatusCode } from './StatusCode'

/**
 * Holder for an unknown status code.
 */
export class UnknownStatusCode extends StatusCode {
  private code: number
  private message: string
  private defaultSeverity: /*Status.*/ Severity

  constructor(code: number, message: string, defaultSeverity: /*Status.*/ Severity) {
    super()
    this.code = code
    this.message = message
    this.defaultSeverity = defaultSeverity
  }

  getCode(): number {
    return this.code
  }

  getMessage(): string {
    return this.message
  }

  getDefaultSeverity(): /*Status.*/ Severity {
    return this.defaultSeverity
  }

  // @Override
  toString(): string {
    return this.code.toString()
  }
}
