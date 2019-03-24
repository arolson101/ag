import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { TransactionWrappedRequestMessage } from '../TransactionWrappedRequestMessage'
import { Tax1099Request } from './Tax1099Request'

export class Tax1099RequestTransaction extends TransactionWrappedRequestMessage<Tax1099Request> {
  private tax1099Request!: Tax1099Request

  /**
   * The tax1099Request.
   *
   * @return The tax1099Request.
   */
  getTax1099Request(): Tax1099Request {
    return this.tax1099Request
  }

  /**
   * The tax1099Request.
   *
   * @param tax1099Request The message.
   *
   */
  setTax1099Request(tax1099Request: Tax1099Request): void {
    this.tax1099Request = tax1099Request
  }

  // Inherited.
  setWrappedMessage(tax1099Request: Tax1099Request): void {
    this.setTax1099Request(tax1099Request)
  }
}

Aggregate_add(Tax1099RequestTransaction, 'TAX1099TRNRQ')
ChildAggregate_add(Tax1099RequestTransaction, {
  required: true,
  order: 30,
  type: Tax1099Request,
  read: Tax1099RequestTransaction.prototype.getTax1099Request,
  write: Tax1099RequestTransaction.prototype.setTax1099Request,
})
