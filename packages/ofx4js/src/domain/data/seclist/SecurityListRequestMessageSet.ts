import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_Add'
import { MessageSetType } from '../MessageSetType'
import { RequestMessage } from '../RequestMessage'
import { RequestMessageSet } from '../RequestMessageSet'
import { SecurityListRequestTransaction } from './SecurityListRequestTransaction'

/**
 * Security list request message set.
 * @see "Section 13.7.2.2.1, OFX Spec"
 */
export class SecurityListRequestMessageSet extends RequestMessageSet {
  private securityListRequest!: SecurityListRequestTransaction

  getType(): MessageSetType {
    return MessageSetType.investment
  }

  /**
   * Gets the security list request.
   *
   * @return the request
   */
  getSecurityListRequest(): SecurityListRequestTransaction {
    return this.securityListRequest
  }

  /**
   * Sets the security list request.
   *
   * @param statementRequest the request
   */
  setSecurityListRequest(statementRequest: SecurityListRequestTransaction): void {
    this.securityListRequest = statementRequest
  }

  // Inherited.
  getRequestMessages(): RequestMessage[] {
    const requestMessages: RequestMessage[] = new Array<RequestMessage>()
    if (this.getSecurityListRequest() != null) {
      requestMessages.push(this.getSecurityListRequest())
    }
    return requestMessages
  }
}

Aggregate_add(SecurityListRequestMessageSet, 'SECLISTMSGSRQV1')
ChildAggregate_add(SecurityListRequestMessageSet, {
  order: 0,
  type: SecurityListRequestTransaction,
  read: SecurityListRequestMessageSet.prototype.getSecurityListRequest,
  write: SecurityListRequestMessageSet.prototype.setSecurityListRequest,
})
