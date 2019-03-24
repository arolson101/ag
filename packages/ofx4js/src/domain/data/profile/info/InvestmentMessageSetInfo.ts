import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../../meta/ChildAggregate_add'
import { AbstractMessageSetInfo } from '../AbstractMessageSetInfo'
import { InvestmentV1MessageSetInfo } from './InvestmentV1MessageSetInfo'

export class InvestmentMessageSetInfo extends AbstractMessageSetInfo {
  private version1Info!: InvestmentV1MessageSetInfo

  getVersion1Info(): InvestmentV1MessageSetInfo {
    return this.version1Info
  }

  setVersion1Info(version1Info: InvestmentV1MessageSetInfo): void {
    this.version1Info = version1Info
  }
}

Aggregate_add(InvestmentMessageSetInfo, 'INVSTMTMSGSET')
ChildAggregate_add(InvestmentMessageSetInfo, {
  order: 0,
  type: InvestmentV1MessageSetInfo,
  read: InvestmentMessageSetInfo.prototype.getVersion1Info,
  write: InvestmentMessageSetInfo.prototype.setVersion1Info,
})
