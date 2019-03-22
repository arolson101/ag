export declare class Error {
  name: string
  message: string
  stack: string
  constructor(message?: string)
}

/**
 * Base exception class.
 */
export class OFXException extends Error {
  private innerError?: Error

  constructor(message?: string, e?: Error) {
    super(message)
    this.innerError = e
  }
}
