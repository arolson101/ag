import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../../meta/ChildAggregate_add'
import { AbstractMessageSetInfo } from '../AbstractMessageSetInfo'
import { SignOnV1MessageSetInfo } from './SignOnV1MessageSetInfo'

export class SignOnMessageSetInfo extends AbstractMessageSetInfo {
  private version1Info!: SignOnV1MessageSetInfo

  getVersion1Info(): SignOnV1MessageSetInfo {
    return this.version1Info
  }

  setVersion1Info(version1Info: SignOnV1MessageSetInfo): void {
    this.version1Info = version1Info
  }
}

Aggregate_add(SignOnMessageSetInfo, 'SIGNONMSGSET')
ChildAggregate_add(SignOnMessageSetInfo, {
  order: 0,
  type: SignOnV1MessageSetInfo,
  read: SignOnMessageSetInfo.prototype.getVersion1Info,
  write: SignOnMessageSetInfo.prototype.setVersion1Info,
})
