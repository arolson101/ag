import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_Add'
import { TransactionWrappedResponseMessage } from '../TransactionWrappedResponseMessage'
import { BankStatementResponse } from './BankStatementResponse'

export class BankStatementResponseTransaction extends TransactionWrappedResponseMessage<
  BankStatementResponse
> {
  private message!: BankStatementResponse

  /**
   * The message.
   *
   * @return The message.
   */
  getMessage(): BankStatementResponse {
    return this.message
  }

  /**
   * The message.
   *
   * @param message The message.
   */
  setMessage(message: BankStatementResponse): void {
    this.message = message
  }

  // Inherited.
  getWrappedMessage(): BankStatementResponse {
    return this.getMessage()
  }
}

Aggregate_add(BankStatementResponseTransaction, 'STMTTRNRS')
ChildAggregate_add(BankStatementResponseTransaction, {
  required: true,
  order: 30,
  type: BankStatementResponse,
  read: BankStatementResponseTransaction.prototype.getMessage,
  write: BankStatementResponseTransaction.prototype.setMessage,
})
