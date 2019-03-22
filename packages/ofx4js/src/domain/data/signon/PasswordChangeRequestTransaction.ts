import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { TransactionWrappedRequestMessage } from '../TransactionWrappedRequestMessage'
import { PasswordChangeRequest } from './PasswordChangeRequest'

export class PasswordChangeRequestTransaction extends TransactionWrappedRequestMessage<
  PasswordChangeRequest
> {
  private message: PasswordChangeRequest

  /**
   * The wrapped message.
   *
   * @return The wrapped message.
   */
  getMessage(): PasswordChangeRequest {
    return this.message
  }

  /**
   * The wrapped message.
   *
   * @param message The wrapped message.
   */
  setMessage(message: PasswordChangeRequest) {
    this.message = message
  }

  // Inherited.
  setWrappedMessage(message: PasswordChangeRequest): void {
    this.setMessage(message)
  }
}

Aggregate_add(PasswordChangeRequestTransaction, 'PINCHTRNRQ')
ChildAggregate_add(PasswordChangeRequestTransaction, {
  required: true,
  order: 30,
  type: PasswordChangeRequest,
  read: PasswordChangeRequestTransaction.prototype.getMessage,
  write: PasswordChangeRequestTransaction.prototype.setMessage,
})
