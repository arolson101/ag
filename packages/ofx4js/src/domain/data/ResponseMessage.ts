/**
 * A message applicable to a response message set.
 */
export abstract class ResponseMessage {
  /**
   * The name of the response message.
   *
   * @return The name of the response message.
   */
  abstract getResponseMessageName(): string
}
