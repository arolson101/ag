import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { BaseSecurityInfo } from './BaseSecurityInfo'

/**
 * Aggregate for a list of securities.
 * @see "Section 13.8.4, OFX Spec"
 */
export class SecurityList {
  private securityInfos: BaseSecurityInfo[]

  getSecurityInfos(): BaseSecurityInfo[] {
    return this.securityInfos
  }

  setSecurityInfos(securityInfos: BaseSecurityInfo[]): void {
    this.securityInfos = securityInfos
  }
}

Aggregate_add(SecurityList, 'SECLIST')
ChildAggregate_add(SecurityList, {
  order: 10,
  type: Array,
  collectionEntryType: BaseSecurityInfo,
  read: SecurityList.prototype.getSecurityInfos,
  write: SecurityList.prototype.setSecurityInfos,
})
