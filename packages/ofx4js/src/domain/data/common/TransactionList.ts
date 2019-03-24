import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { Element_add } from '../../../meta/Element_add'
import { Transaction } from './Transaction'

// import java.util.Date;
// import java.util.List;

export class TransactionList {
  private start!: Date
  private end!: Date
  private transactions!: Transaction[]

  /**
   * The start date.
   *
   * @return The start date.
   */
  getStart(): Date {
    return this.start
  }

  /**
   * The start date.
   *
   * @param start The start date.
   */
  setStart(start: Date): void {
    this.start = start
  }

  /**
   * The end date.
   *
   * @return The end date.
   */
  getEnd(): Date {
    return this.end
  }

  /**
   * The end date.
   *
   * @param end The end date.
   */
  setEnd(end: Date): void {
    this.end = end
  }

  /**
   * The transaction list.
   *
   * @return The transaction list.
   */
  getTransactions(): Transaction[] {
    return this.transactions
  }

  /**
   * The transaction list.
   *
   * @param transactions The transaction list.
   */
  setTransactions(transactions: Transaction[]): void {
    this.transactions = transactions
  }
}

Aggregate_add(TransactionList, 'BANKTRANLIST')
Element_add(TransactionList, {
  name: 'DTSTART',
  required: true,
  order: 0,
  type: Date,
  read: TransactionList.prototype.getStart,
  write: TransactionList.prototype.setStart,
})
Element_add(TransactionList, {
  name: 'DTEND',
  required: true,
  order: 10,
  type: Date,
  read: TransactionList.prototype.getEnd,
  write: TransactionList.prototype.setEnd,
})
ChildAggregate_add(TransactionList, {
  order: 20,
  type: Array,
  collectionEntryType: Transaction,
  read: TransactionList.prototype.getTransactions,
  write: TransactionList.prototype.setTransactions,
})
