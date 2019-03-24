import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../../meta/ChildAggregate_Add'
import { AbstractMessageSetInfo } from '../AbstractMessageSetInfo'
import { SecurityListV1MessageSetInfo } from './SecurityListV1MessageSetInfo'

export class SecurityListMessageSetInfo extends AbstractMessageSetInfo {
  private version1Info!: SecurityListV1MessageSetInfo

  getVersion1Info(): SecurityListV1MessageSetInfo {
    return this.version1Info
  }

  setVersion1Info(version1Info: SecurityListV1MessageSetInfo): void {
    this.version1Info = version1Info
  }
}

Aggregate_add(SecurityListMessageSetInfo, 'SECLISTMSGSET')
ChildAggregate_add(SecurityListMessageSetInfo, {
  order: 0,
  type: SecurityListV1MessageSetInfo,
  read: SecurityListMessageSetInfo.prototype.getVersion1Info,
  write: SecurityListMessageSetInfo.prototype.setVersion1Info,
})
