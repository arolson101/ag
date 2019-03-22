import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { TransactionWrappedRequestMessage } from '../TransactionWrappedRequestMessage'
import { ProfileRequest } from './ProfileRequest'

export class ProfileRequestTransaction extends TransactionWrappedRequestMessage<ProfileRequest> {
  private message: ProfileRequest

  /**
   * The wrapped message.
   *
   * @return The wrapped message.
   */
  getMessage(): ProfileRequest {
    return this.message
  }

  /**
   * The wrapped message.
   *
   * @param message The wrapped message.
   */
  setMessage(message: ProfileRequest): void {
    this.message = message
  }

  // Inherited.
  setWrappedMessage(message: ProfileRequest): void {
    this.setMessage(message)
  }
}

Aggregate_add(ProfileRequestTransaction, 'PROFTRNRQ')
ChildAggregate_add(ProfileRequestTransaction, {
  required: true,
  order: 30,
  type: ProfileRequest,
  read: ProfileRequestTransaction.prototype.getMessage,
  write: ProfileRequestTransaction.prototype.setMessage,
})
