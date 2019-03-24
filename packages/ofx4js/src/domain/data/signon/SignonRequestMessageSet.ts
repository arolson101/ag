import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { MessageSetType } from '../MessageSetType'
import { RequestMessage } from '../RequestMessage'
import { RequestMessageSet } from '../RequestMessageSet'
import { PasswordChangeRequestTransaction } from './PasswordChangeRequestTransaction'
import { SignonRequest } from './SignonRequest'

/**
 * The sign-on request message set.
 *
 * @see "Section 2.5, OFX Spec."
 */
export class SignonRequestMessageSet extends RequestMessageSet {
  private signonRequest!: SignonRequest
  private passwordChangeRequest!: PasswordChangeRequestTransaction

  getType(): MessageSetType {
    return MessageSetType.signon
  }

  /**
   * The message for this message set.
   *
   * @return The message for this message set.
   */
  getSignonRequest(): SignonRequest {
    return this.signonRequest
  }

  /**
   * The message for this message set.
   *
   * @param signonRequest The message for this message set.
   */
  setSignonRequest(signonRequest: SignonRequest): void {
    this.signonRequest = signonRequest
  }

  /**
   * The password change request.
   *
   * @return The password change request.
   */
  getPasswordChangeRequest(): PasswordChangeRequestTransaction {
    return this.passwordChangeRequest
  }

  /**
   * The password change request.
   *
   * @param passwordChangeRequest The password change request.
   */
  setPasswordChangeRequest(passwordChangeRequest: PasswordChangeRequestTransaction): void {
    this.passwordChangeRequest = passwordChangeRequest
  }

  // todo: challenge request/response

  // Inherited.
  getRequestMessages(): RequestMessage[] {
    const requestMessages: RequestMessage[] = new Array<RequestMessage>()

    if (this.getSignonRequest() != null) {
      requestMessages.push(this.getSignonRequest())
    }

    if (this.getPasswordChangeRequest() != null) {
      requestMessages.push(this.getPasswordChangeRequest())
    }

    return requestMessages
  }
}

Aggregate_add(SignonRequestMessageSet, 'SIGNONMSGSRQV1')
ChildAggregate_add(SignonRequestMessageSet, {
  required: true,
  order: 0,
  type: SignonRequest,
  read: SignonRequestMessageSet.prototype.getSignonRequest,
  write: SignonRequestMessageSet.prototype.setSignonRequest,
})
ChildAggregate_add(SignonRequestMessageSet, {
  order: 10,
  type: PasswordChangeRequestTransaction,
  read: SignonRequestMessageSet.prototype.getPasswordChangeRequest,
  write: SignonRequestMessageSet.prototype.setPasswordChangeRequest,
})
