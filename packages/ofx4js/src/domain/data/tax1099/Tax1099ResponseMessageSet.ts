import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_Add'
import { OFXException } from '../../../OFXException'
import { MessageSetType } from '../MessageSetType'
import { ResponseMessage } from '../ResponseMessage'
import { ResponseMessageSet } from '../ResponseMessageSet'
import { Tax1099ResponseTransaction } from './Tax1099ResponseTransaction'

export class Tax1099ResponseMessageSet extends ResponseMessageSet {
  private taxResponseTransaction!: Tax1099ResponseTransaction[]

  getType(): MessageSetType {
    return MessageSetType.tax1099
  }

  /**
   * The taxResponseTransaction list.
   *
   * Most OFX files have a single statement response, except MT2OFX
   * which outputs OFX with multiple statement responses
   * in a single banking response message set.
   *
   * @return The taxResponseTransaction list.
   */
  getTaxResponseTransaction(): Tax1099ResponseTransaction[] {
    return this.taxResponseTransaction
  }

  /**
   * The taxResponseTransaction.
   *
   * @param taxResponseTransaction The statement responses.
   */
  setTaxResponseTransaction(
    taxResponseTransaction: Tax1099ResponseTransaction | Tax1099ResponseTransaction[]
  ): void {
    if (taxResponseTransaction instanceof Array) {
      this.taxResponseTransaction = taxResponseTransaction as Tax1099ResponseTransaction[]
    } else if (taxResponseTransaction instanceof Tax1099ResponseTransaction) {
      this.taxResponseTransaction = [taxResponseTransaction as Tax1099ResponseTransaction]
    } else {
      throw new OFXException('invalid type')
    }
  }

  // Inherited.
  getResponseMessages(): ResponseMessage[] {
    return this.taxResponseTransaction
  }

  /**
   * The first statement response.
   *
   * @return the first bank statement response.
   * @deprecated Use getStatementResponses() because sometimes there are multiple responses
   */
  getStatementResponse(): Tax1099ResponseTransaction {
    if (!this.taxResponseTransaction || this.taxResponseTransaction.length === 0) {
      throw new Error('no taxresponseTransaction')
    }
    return this.taxResponseTransaction[0]
  }
}

Aggregate_add(Tax1099ResponseMessageSet, 'TAX1099MSGSRSV1')
ChildAggregate_add(Tax1099ResponseMessageSet, {
  order: 0,
  type: Array,
  collectionEntryType: Tax1099ResponseTransaction,
  read: Tax1099ResponseMessageSet.prototype.getTaxResponseTransaction,
  write: Tax1099ResponseMessageSet.prototype.setTaxResponseTransaction,
})
