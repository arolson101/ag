import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../../meta/ChildAggregate_add'
import { MessageSetType } from '../../MessageSetType'
import { ResponseMessage } from '../../ResponseMessage'
import { ResponseMessageSet } from '../../ResponseMessageSet'
import { InvestmentStatementResponseTransaction } from './InvestmentStatementResponseTransaction'

/**
 * Investment statement response message set.
 * @see "Section 13.7.1.2.2, OFX Spec"
 */
export class InvestmentStatementResponseMessageSet extends ResponseMessageSet {
  private statementResponses: InvestmentStatementResponseTransaction[]

  getType(): MessageSetType {
    return MessageSetType.investment
  }

  /**
   * Gets the statement response list. Most OFX files have a single statement response.
   *
   * @return the statement response list
   */
  getStatementResponses(): InvestmentStatementResponseTransaction[] {
    return this.statementResponses
  }

  /**
   * Sets the statement reponse list. Most OFX files have a single statement response.
   *
   * @param statementResponses the statement response list
   */
  setStatementResponses(statementResponses: InvestmentStatementResponseTransaction[]): void {
    this.statementResponses = statementResponses
  }

  /**
   * Gets the first statement response. Use getStatementResponses() if you are expecting multiple
   * responses.
   *
   * @return the first investment statement response.
   */
  getStatementResponse(): InvestmentStatementResponseTransaction {
    return this.statementResponses == null || this.statementResponses.length == 0
      ? null
      : this.statementResponses[0]
  }

  /**
   * Sets the statement response if there is a single response.
   *
   * @param statementResponse The statement response.
   */
  setStatementResponse(statementResponse: InvestmentStatementResponseTransaction): void {
    this.statementResponses = [statementResponse]
  }

  // Inherited.
  getResponseMessages(): ResponseMessage[] {
    return this.statementResponses
  }
}

Aggregate_add(InvestmentStatementResponseMessageSet, 'INVSTMTMSGSRSV1')
ChildAggregate_add(InvestmentStatementResponseMessageSet, {
  order: 0,
  type: Array,
  collectionEntryType: InvestmentStatementResponseTransaction,
  read: InvestmentStatementResponseMessageSet.prototype.getStatementResponses,
  write: InvestmentStatementResponseMessageSet.prototype.setStatementResponses,
})
