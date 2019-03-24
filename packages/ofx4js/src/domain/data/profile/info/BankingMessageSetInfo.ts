import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../../meta/ChildAggregate_add'
import { AbstractMessageSetInfo } from '../AbstractMessageSetInfo'
import { BankingV1MessageSetInfo } from './BankingV1MessageSetInfo'

export class BankingMessageSetInfo extends AbstractMessageSetInfo {
  private version1Info!: BankingV1MessageSetInfo

  getVersion1Info(): BankingV1MessageSetInfo {
    return this.version1Info
  }

  setVersion1Info(version1Info: BankingV1MessageSetInfo): void {
    this.version1Info = version1Info
  }
}

Aggregate_add(BankingMessageSetInfo, 'BANKMSGSET')
ChildAggregate_add(BankingMessageSetInfo, {
  order: 0,
  type: BankingV1MessageSetInfo,
  read: BankingMessageSetInfo.prototype.getVersion1Info,
  write: BankingMessageSetInfo.prototype.setVersion1Info,
})
