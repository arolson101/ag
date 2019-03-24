import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { RequestMessage } from '../RequestMessage'
import { SecurityRequest } from './SecurityRequest'

/**
 * Request aggregate for the security list.
 * @see "Section 13.8.2.2, OFX Spec"
 */
export class SecurityListRequest extends RequestMessage {
  private securityRequests!: SecurityRequest[]

  getSecurityRequests(): SecurityRequest[] {
    return this.securityRequests
  }

  setSecurityRequests(securityRequests: SecurityRequest[]): void {
    this.securityRequests = securityRequests
  }
}

Aggregate_add(SecurityListRequest, 'SECLISTRQ')
ChildAggregate_add(SecurityListRequest, {
  required: true,
  order: 10,
  type: Array,
  collectionEntryType: SecurityRequest,
  read: SecurityListRequest.prototype.getSecurityRequests,
  write: SecurityListRequest.prototype.setSecurityRequests,
})
