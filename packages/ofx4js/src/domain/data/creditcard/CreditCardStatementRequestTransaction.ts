import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { TransactionWrappedRequestMessage } from '../TransactionWrappedRequestMessage'
import { CreditCardStatementRequest } from './CreditCardStatementRequest'

export class CreditCardStatementRequestTransaction extends TransactionWrappedRequestMessage<
  CreditCardStatementRequest
> {
  private message: CreditCardStatementRequest

  /**
   * The message.
   *
   * @return The message.
   */
  getMessage(): CreditCardStatementRequest {
    return this.message
  }

  /**
   * The message.
   *
   * @param message The message.
   *
   */
  setMessage(message: CreditCardStatementRequest): void {
    this.message = message
  }

  // Inherited.
  setWrappedMessage(message: CreditCardStatementRequest): void {
    this.setMessage(message)
  }
}

Aggregate_add(CreditCardStatementRequestTransaction, 'CCSTMTTRNRQ')
ChildAggregate_add(CreditCardStatementRequestTransaction, {
  required: true,
  order: 30,
  type: CreditCardStatementRequest,
  read: CreditCardStatementRequestTransaction.prototype.getMessage,
  write: CreditCardStatementRequestTransaction.prototype.setMessage,
})
