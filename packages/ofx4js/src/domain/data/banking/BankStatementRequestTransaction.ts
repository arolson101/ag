import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { TransactionWrappedRequestMessage } from '../TransactionWrappedRequestMessage'
import { BankStatementRequest } from './BankStatementRequest'

export class BankStatementRequestTransaction extends TransactionWrappedRequestMessage<
  BankStatementRequest
> {
  private message!: BankStatementRequest

  /**
   * The message.
   *
   * @return The message.
   */
  getMessage(): BankStatementRequest {
    return this.message
  }

  /**
   * The message.
   *
   * @param message The message.
   *
   */
  setMessage(message: BankStatementRequest): void {
    this.message = message
  }

  // Inherited.
  setWrappedMessage(message: BankStatementRequest): void {
    this.setMessage(message)
  }
}

Aggregate_add(BankStatementRequestTransaction, 'STMTTRNRQ')
ChildAggregate_add(BankStatementRequestTransaction, {
  required: true,
  order: 30,
  type: BankStatementRequest,
  read: BankStatementRequestTransaction.prototype.getMessage,
  write: BankStatementRequestTransaction.prototype.setMessage,
})
