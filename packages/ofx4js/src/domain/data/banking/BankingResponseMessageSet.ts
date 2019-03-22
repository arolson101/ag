import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { MessageSetType } from '../MessageSetType'
import { ResponseMessage } from '../ResponseMessage'
import { ResponseMessageSet } from '../ResponseMessageSet'
import { BankStatementResponseTransaction } from './BankStatementResponseTransaction'

export class BankingResponseMessageSet extends ResponseMessageSet {
  private statementResponses: BankStatementResponseTransaction[]

  getType(): MessageSetType {
    return MessageSetType.banking
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
  getStatementResponses(): BankStatementResponseTransaction[] {
    return this.statementResponses
  }

  /**
   * The statement response.
   *
   * @param statementResponses The statement responses.
   */
  setStatementResponses(statementResponses: BankStatementResponseTransaction[]): void {
    this.statementResponses = statementResponses
  }

  // Inherited.
  getResponseMessages(): ResponseMessage[] {
    return this.statementResponses
  }

  /**
   * The first statement response.
   *
   * @return the first bank statement response.
   * @deprecated Use getStatementResponses() because sometimes there are multiple responses
   */
  getStatementResponse(): BankStatementResponseTransaction {
    return this.statementResponses == null || this.statementResponses.length == 0
      ? null
      : this.statementResponses[0]
  }

  setStatementResponse(statementResponse: BankStatementResponseTransaction): void {
    this.statementResponses = [statementResponse]
  }
}

Aggregate_add(BankingResponseMessageSet, 'BANKMSGSRSV1')
ChildAggregate_add(BankingResponseMessageSet, {
  order: 0,
  type: Array,
  collectionEntryType: BankStatementResponseTransaction,
  read: BankingResponseMessageSet.prototype.getStatementResponses,
  write: BankingResponseMessageSet.prototype.setStatementResponses,
})
