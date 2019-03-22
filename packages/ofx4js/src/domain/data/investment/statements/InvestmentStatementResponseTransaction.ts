import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../../meta/ChildAggregate_add'
import { TransactionWrappedResponseMessage } from '../../TransactionWrappedResponseMessage'
import { InvestmentStatementResponse } from './InvestmentStatementResponse'

/**
 * Investment statement transaction response.
 * @see "Section 13.9.2.1, OFX Spec"
 */
export class InvestmentStatementResponseTransaction extends TransactionWrappedResponseMessage<
  InvestmentStatementResponse
> {
  private message: InvestmentStatementResponse

  /**
   * Gets the the statement response message.
   *
   * @return the statement response message.
   */
  getMessage(): InvestmentStatementResponse {
    return this.message
  }

  /**
   * Sets the the statement response message.
   *
   * @param message the statement response message.
   */
  setMessage(message: InvestmentStatementResponse): void {
    this.message = message
  }

  // Inherited.
  getWrappedMessage(): InvestmentStatementResponse {
    return this.getMessage()
  }
}

Aggregate_add(InvestmentStatementResponseTransaction, 'INVSTMTTRNRS')
ChildAggregate_add(InvestmentStatementResponseTransaction, {
  required: true,
  order: 30,
  type: InvestmentStatementResponse,
  read: InvestmentStatementResponseTransaction.prototype.getMessage,
  write: InvestmentStatementResponseTransaction.prototype.setMessage,
})
