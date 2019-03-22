import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../../meta/ChildAggregate_add'
import { MessageSetType } from '../../MessageSetType'
import { RequestMessage } from '../../RequestMessage'
import { RequestMessageSet } from '../../RequestMessageSet'
import { InvestmentStatementRequestTransaction } from './InvestmentStatementRequestTransaction'

/**
 * Investment statement request message set.
 * @see "Section 13.7.1.2.1, OFX Spec"
 */
export class InvestmentStatementRequestMessageSet extends RequestMessageSet {
  private statementRequest: InvestmentStatementRequestTransaction

  getType(): MessageSetType {
    return MessageSetType.investment
  }

  /**
   * Gets the statement request.
   *
   * @return the request
   */
  getStatementRequest(): InvestmentStatementRequestTransaction {
    return this.statementRequest
  }

  /**
   * Sets the statement request.
   *
   * @param statementRequest the request
   */
  setStatementRequest(statementRequest: InvestmentStatementRequestTransaction): void {
    this.statementRequest = statementRequest
  }

  // Inherited.
  getRequestMessages(): RequestMessage[] {
    const requestMessages: RequestMessage[] = new Array<RequestMessage>()
    if (this.getStatementRequest() != null) {
      requestMessages.push(this.getStatementRequest())
    }
    return requestMessages
  }
}

Aggregate_add(InvestmentStatementRequestMessageSet, 'INVSTMTMSGSRQV1')
ChildAggregate_add(InvestmentStatementRequestMessageSet, {
  order: 0,
  type: InvestmentStatementRequestTransaction,
  read: InvestmentStatementRequestMessageSet.prototype.getStatementRequest,
  write: InvestmentStatementRequestMessageSet.prototype.setStatementRequest,
})
