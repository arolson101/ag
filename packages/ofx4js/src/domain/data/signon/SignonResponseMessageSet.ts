import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_Add'
import { MessageSetType } from '../MessageSetType'
import { ResponseMessage } from '../ResponseMessage'
import { ResponseMessageSet } from '../ResponseMessageSet'
import { PasswordChangeResponseTransaction } from './PasswordChangeResponseTransaction'
import { SignonResponse } from './SignonResponse'

/**
 * The sign-on response message set.
 *
 * @see "Section 2.5, OFX Spec."
 */
export class SignonResponseMessageSet extends ResponseMessageSet {
  private signonResponse!: SignonResponse
  private passwordChangeResponse!: PasswordChangeResponseTransaction

  getType(): MessageSetType {
    return MessageSetType.signon
  }

  /**
   * The message for this message set.
   *
   * @return The message for this message set.
   */
  getSignonResponse(): SignonResponse {
    return this.signonResponse
  }

  /**
   * The message for this message set.
   *
   * @param signonResponse The message for this message set.
   */
  setSignonResponse(signonResponse: SignonResponse): void {
    this.signonResponse = signonResponse
  }

  /**
   * The password change response.
   *
   * @return The password change response.
   */
  getPasswordChangeResponse(): PasswordChangeResponseTransaction {
    return this.passwordChangeResponse
  }

  /**
   * The password change response.
   *
   * @param passwordChangeResponse The password change response.
   */
  setPasswordChangeResponse(passwordChangeResponse: PasswordChangeResponseTransaction): void {
    this.passwordChangeResponse = passwordChangeResponse
  }

  // todo: challenge request/response

  // Inherited.
  getResponseMessages(): ResponseMessage[] {
    const messages: ResponseMessage[] = new Array<ResponseMessage>()

    if (this.getSignonResponse() != null) {
      messages.push(this.getSignonResponse())
    }

    return messages
  }
}

Aggregate_add(SignonResponseMessageSet, 'SIGNONMSGSRSV1')
ChildAggregate_add(SignonResponseMessageSet, {
  order: 0,
  type: SignonResponse,
  read: SignonResponseMessageSet.prototype.getSignonResponse,
  write: SignonResponseMessageSet.prototype.setSignonResponse,
})
ChildAggregate_add(SignonResponseMessageSet, {
  order: 10,
  type: PasswordChangeResponseTransaction,
  read: SignonResponseMessageSet.prototype.getPasswordChangeResponse,
  write: SignonResponseMessageSet.prototype.setPasswordChangeResponse,
})
