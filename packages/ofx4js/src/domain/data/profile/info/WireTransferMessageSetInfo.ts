import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../../meta/ChildAggregate_add'
import { AbstractMessageSetInfo } from '../AbstractMessageSetInfo'
import { WireTransferV1MessageSetInfo } from './WireTransferV1MessageSetInfo'

export class WireTransferMessageSetInfo extends AbstractMessageSetInfo {
  private version1Info!: WireTransferV1MessageSetInfo

  getVersion1Info(): WireTransferV1MessageSetInfo {
    return this.version1Info
  }

  setVersion1Info(version1Info: WireTransferV1MessageSetInfo): void {
    this.version1Info = version1Info
  }
}

Aggregate_add(WireTransferMessageSetInfo, 'WIREXFERMSGSET')
ChildAggregate_add(WireTransferMessageSetInfo, {
  order: 0,
  type: WireTransferV1MessageSetInfo,
  read: WireTransferMessageSetInfo.prototype.getVersion1Info,
  write: WireTransferMessageSetInfo.prototype.setVersion1Info,
})
