import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../../meta/ChildAggregate_add'
import { AbstractMessageSetInfo } from '../AbstractMessageSetInfo'
import { InterbankTransferV1MessageSetInfo } from './InterbankTransferV1MessageSetInfo'

export class InterbankTransferMessageSetInfo extends AbstractMessageSetInfo {
  private version1Info!: InterbankTransferV1MessageSetInfo

  getVersion1Info(): InterbankTransferV1MessageSetInfo {
    return this.version1Info
  }

  setVersion1Info(version1Info: InterbankTransferV1MessageSetInfo): void {
    this.version1Info = version1Info
  }
}

Aggregate_add(InterbankTransferMessageSetInfo, 'INTERXFERMSGSET')
ChildAggregate_add(InterbankTransferMessageSetInfo, {
  order: 0,
  type: InterbankTransferV1MessageSetInfo,
  read: InterbankTransferMessageSetInfo.prototype.getVersion1Info,
  write: InterbankTransferMessageSetInfo.prototype.setVersion1Info,
})
