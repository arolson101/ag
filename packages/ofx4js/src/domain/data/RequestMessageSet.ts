import { MessageSetType } from './MessageSetType'
import { RequestMessage } from './RequestMessage'

/**
 * A message set enclosed in an OFX request envelope.
 */
export abstract class RequestMessageSet /*implements Comparable<RequestMessageSet>*/ {
  private version: string

  abstract getType(): MessageSetType

  constructor() {
    this.version = '1'
  }

  cast<T extends this>(): T {
    return this as T
  }

  /**
   * The version of this request message.
   *
   * @return The version of this request message.
   */
  getVersion(): string {
    return this.version
  }

  /**
   * The version of this request message.
   *
   * @param version The version of this request message.
   */
  setVersion(version: string): void {
    this.version = version
  }

  /**
   * The request messages for this request message set.
   *
   * @return The request messages for this request message set.
   */
  abstract getRequestMessages(): RequestMessage[]

  // Inherited.
  /*public compareTo(o: RequestMessageSet): number {
    return getType().compareTo(o.getType());
  }*/

  static contentCompare(left: RequestMessageSet, right: RequestMessageSet): number {
    return left.getType() - right.getType()
  }
}
