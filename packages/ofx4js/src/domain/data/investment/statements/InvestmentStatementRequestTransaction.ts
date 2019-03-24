import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../../meta/ChildAggregate_Add'
import { TransactionWrappedRequestMessage } from '../../TransactionWrappedRequestMessage'
import { InvestmentStatementRequest } from './InvestmentStatementRequest'

/**
 * Investment statement transaction request.
 * @see "Section 13.9.1.1, OFX Spec"
 */
export class InvestmentStatementRequestTransaction extends TransactionWrappedRequestMessage<
  InvestmentStatementRequest
> {
  private message!: InvestmentStatementRequest

  /**
   * Gets the the statement request message.
   *
   * @return the statement request message.
   */
  getMessage(): InvestmentStatementRequest {
    return this.message
  }

  /**
   * Sets the the statement request message.
   *
   * @param message the statement request message.
   */
  setMessage(message: InvestmentStatementRequest): void {
    this.message = message
  }

  // Inherited.
  setWrappedMessage(message: InvestmentStatementRequest): void {
    this.setMessage(message)
  }
}

Aggregate_add(InvestmentStatementRequestTransaction, 'INVSTMTTRNRQ')
ChildAggregate_add(InvestmentStatementRequestTransaction, {
  required: true,
  order: 30,
  type: InvestmentStatementRequest,
  read: InvestmentStatementRequestTransaction.prototype.getMessage,
  write: InvestmentStatementRequestTransaction.prototype.setMessage,
})
