import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../../meta/ChildAggregate_add'
import { AbstractMessageSetInfo } from '../AbstractMessageSetInfo'
import { SignupV1MessageSetInfo } from './SignupV1MessageSetInfo'

export class SignupMessageSetInfo extends AbstractMessageSetInfo {
  private version1Info!: SignupV1MessageSetInfo

  getVersion1Info(): SignupV1MessageSetInfo {
    return this.version1Info
  }

  setVersion1Info(version1Info: SignupV1MessageSetInfo): void {
    this.version1Info = version1Info
  }
}

Aggregate_add(SignupMessageSetInfo, 'SIGNUPMSGSET')
ChildAggregate_add(SignupMessageSetInfo, {
  order: 0,
  type: SignupV1MessageSetInfo,
  read: SignupMessageSetInfo.prototype.getVersion1Info,
  write: SignupMessageSetInfo.prototype.setVersion1Info,
})
