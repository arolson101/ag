import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { MessageSetType } from '../MessageSetType'
import { ResponseMessage } from '../ResponseMessage'
import { ResponseMessageSet } from '../ResponseMessageSet'
import { CreditCardStatementResponseTransaction } from './CreditCardStatementResponseTransaction'

export class CreditCardResponseMessageSet extends ResponseMessageSet {
  private statementResponses: CreditCardStatementResponseTransaction[]

  getType(): MessageSetType {
    return MessageSetType.creditcard
  }

  /**
   * The statement response list.
   *
   * Most OFX files have a single statement response, except MT2OFX
   * which outputs OFX with multiple statement responses
   * in a single banking response message set.
   *
   * @return The statement response list.
   */
  getStatementResponses(): CreditCardStatementResponseTransaction[] {
    return this.statementResponses
  }

  /**
   * The statement reponse list.
   *
   * @param statementResponses The statement response list.
   */
  setStatementResponses(statementResponses: CreditCardStatementResponseTransaction[]): void {
    this.statementResponses = statementResponses
  }

  /**
   * The first statement response.
   *
   * @return the first bank statement response.
   * @deprecated Use getStatementResponses() because sometimes there are multiple responses
   */
  getStatementResponse(): CreditCardStatementResponseTransaction {
    return this.statementResponses == null || this.statementResponses.length == 0
      ? null
      : this.statementResponses[0]
  }

  /**
   * The statement response.
   *
   * @param statementResponse The statement response.
   */
  setStatementResponse(statementResponse: CreditCardStatementResponseTransaction): void {
    this.statementResponses = [statementResponse]
  }

  // Inherited.
  getResponseMessages(): ResponseMessage[] {
    return this.statementResponses
  }
}

Aggregate_add(CreditCardResponseMessageSet, 'CREDITCARDMSGSRSV1')
ChildAggregate_add(CreditCardResponseMessageSet, {
  order: 0,
  type: Array,
  collectionEntryType: CreditCardStatementResponseTransaction,
  read: CreditCardResponseMessageSet.prototype.getStatementResponses,
  write: CreditCardResponseMessageSet.prototype.setStatementResponses,
})
