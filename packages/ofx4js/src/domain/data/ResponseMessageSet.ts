import { MessageSetType } from './MessageSetType'
import { ResponseMessage } from './ResponseMessage'

/**
 * A message set enclosed in a response envelope.
 */
export abstract class ResponseMessageSet /*implements Comparable<ResponseMessageSet>*/ {
  private version: string

  abstract getType(): MessageSetType

  constructor() {
    this.version = '1'
  }

  cast<T extends this>(): T {
    return this as T
  }

  /**
   * The version of this message set.
   *
   * @return The version of this message set.
   */
  getVersion(): string {
    return this.version
  }

  /**
   * The version of this message set.
   *
   * @param version The version of this message set.
   */
  setVersion(version: string): void {
    this.version = version
  }

  /**
   * The list of response messages.
   *
   * @return The list of response messages.
   */
  abstract getResponseMessages(): ResponseMessage[]
  /*
  // Inherited.
  public compareTo(o: ResponseMessageSet): number {
    return getType().compareTo(o.getType());
  }
*/

  static contentCompare(left: ResponseMessageSet, right: ResponseMessageSet): number {
    return left.getType() - right.getType()
  }
}
