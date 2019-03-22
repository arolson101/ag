import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { TransactionWrappedResponseMessage } from '../TransactionWrappedResponseMessage'
import { CreditCardStatementResponse } from './CreditCardStatementResponse'

export class CreditCardStatementResponseTransaction extends TransactionWrappedResponseMessage<
  CreditCardStatementResponse
> {
  private message: CreditCardStatementResponse

  /**
   * The message.
   *
   * @return The message.
   */
  getMessage(): CreditCardStatementResponse {
    return this.message
  }

  /**
   * The message.
   *
   * @param message The message.
   */
  setMessage(message: CreditCardStatementResponse): void {
    this.message = message
  }

  // Inherited.
  getWrappedMessage(): CreditCardStatementResponse {
    return this.getMessage()
  }
}

Aggregate_add(CreditCardStatementResponseTransaction, 'CCSTMTTRNRS')
ChildAggregate_add(CreditCardStatementResponseTransaction, {
  required: true,
  order: 30,
  type: CreditCardStatementResponse,
  read: CreditCardStatementResponseTransaction.prototype.getMessage,
  write: CreditCardStatementResponseTransaction.prototype.setMessage,
})
