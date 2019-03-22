import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../../meta/ChildAggregate_add'
import { AbstractMessageSetInfo } from '../AbstractMessageSetInfo'
import { BillpayV1MessageSetInfo } from './BillpayV1MessageSetInfo'

export class BillpayMessageSetInfo extends AbstractMessageSetInfo {
  private version1Info: BillpayV1MessageSetInfo

  getVersion1Info(): BillpayV1MessageSetInfo {
    return this.version1Info
  }

  setVersion1Info(version1Info: BillpayV1MessageSetInfo): void {
    this.version1Info = version1Info
  }
}

Aggregate_add(BillpayMessageSetInfo, 'BILLPAYMSGSET')
ChildAggregate_add(BillpayMessageSetInfo, {
  order: 0,
  type: BillpayV1MessageSetInfo,
  read: BillpayMessageSetInfo.prototype.getVersion1Info,
  write: BillpayMessageSetInfo.prototype.setVersion1Info,
})
