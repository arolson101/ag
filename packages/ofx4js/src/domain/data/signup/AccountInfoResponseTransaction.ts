import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_Add'
import { TransactionWrappedResponseMessage } from '../TransactionWrappedResponseMessage'
import { AccountInfoResponse } from './AccountInfoResponse'

export class AccountInfoResponseTransaction extends TransactionWrappedResponseMessage<
  AccountInfoResponse
> {
  private message!: AccountInfoResponse

  /**
   * The wrapped message.
   *
   * @return The wrapped message.
   */
  getMessage(): AccountInfoResponse {
    return this.message
  }

  /**
   * The wrapped message.
   *
   * @param message The wrapped message.
   */
  setMessage(message: AccountInfoResponse): void {
    this.message = message
  }

  // Inherited.
  getWrappedMessage(): AccountInfoResponse {
    return this.getMessage()
  }
}

Aggregate_add(AccountInfoResponseTransaction, 'ACCTINFOTRNRS')
ChildAggregate_add(AccountInfoResponseTransaction, {
  required: true,
  order: 30,
  type: AccountInfoResponse,
  read: AccountInfoResponseTransaction.prototype.getMessage,
  write: AccountInfoResponseTransaction.prototype.setMessage,
})
