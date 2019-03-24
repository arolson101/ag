import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../../meta/ChildAggregate_add'
import { AbstractMessageSetInfo } from '../AbstractMessageSetInfo'
import { EmailV1MessageSetInfo } from './EmailV1MessageSetInfo'

export class EmailMessageSetInfo extends AbstractMessageSetInfo {
  private version1Info!: EmailV1MessageSetInfo

  getVersion1Info(): EmailV1MessageSetInfo {
    return this.version1Info
  }

  setVersion1Info(version1Info: EmailV1MessageSetInfo): void {
    this.version1Info = version1Info
  }
}

Aggregate_add(EmailMessageSetInfo, 'EMAILMSGSET')
ChildAggregate_add(EmailMessageSetInfo, {
  order: 0,
  type: EmailV1MessageSetInfo,
  read: EmailMessageSetInfo.prototype.getVersion1Info,
  write: EmailMessageSetInfo.prototype.setVersion1Info,
})
