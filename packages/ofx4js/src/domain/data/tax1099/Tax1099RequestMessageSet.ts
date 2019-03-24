import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { MessageSetType } from '../MessageSetType'
import { RequestMessage } from '../RequestMessage'
import { RequestMessageSet } from '../RequestMessageSet'
import { Tax1099RequestTransaction } from './Tax1099RequestTransaction'

export class Tax1099RequestMessageSet extends RequestMessageSet {
  private taxRequestTransaction!: Tax1099RequestTransaction

  getType(): MessageSetType {
    return MessageSetType.tax1099
  }

  /**
   * The statement request.
   *
   * @return The statement request.
   */
  getTaxRequestTransaction(): Tax1099RequestTransaction {
    return this.taxRequestTransaction
  }

  /**
   * The statement request.
   *
   * @param taxRequestTransaction The statement request.
   */
  setTaxRequestTransaction(taxRequestTransaction: Tax1099RequestTransaction) {
    this.taxRequestTransaction = taxRequestTransaction
  }

  // Inherited.
  getRequestMessages(): RequestMessage[] {
    const requestMessages: RequestMessage[] = new Array<RequestMessage>()
    if (this.getTaxRequestTransaction() != null) {
      requestMessages.push(this.getTaxRequestTransaction())
    }
    return requestMessages
  }
}

Aggregate_add(Tax1099RequestMessageSet, 'TAX1099MSGSRQV1')
ChildAggregate_add(Tax1099RequestMessageSet, {
  order: 0,
  type: Tax1099RequestTransaction,
  read: Tax1099RequestMessageSet.prototype.getTaxRequestTransaction,
  write: Tax1099RequestMessageSet.prototype.setTaxRequestTransaction,
})
