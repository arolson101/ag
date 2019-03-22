import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { TransactionWrappedResponseMessage } from '../TransactionWrappedResponseMessage'
import { ProfileResponse } from './ProfileResponse'

export class ProfileResponseTransaction extends TransactionWrappedResponseMessage<ProfileResponse> {
  private message: ProfileResponse

  /**
   * The message.
   *
   * @return The message.
   */
  getMessage(): ProfileResponse {
    return this.message
  }

  /**
   * The message.
   *
   * @param message The message.
   */
  setMessage(message: ProfileResponse): void {
    this.message = message
  }

  // Inherited.
  getWrappedMessage(): ProfileResponse {
    return this.getMessage()
  }
}

Aggregate_add(ProfileResponseTransaction, 'PROFTRNRS')
ChildAggregate_add(ProfileResponseTransaction, {
  required: true,
  order: 30,
  type: ProfileResponse,
  read: ProfileResponseTransaction.prototype.getMessage,
  write: ProfileResponseTransaction.prototype.setMessage,
})
