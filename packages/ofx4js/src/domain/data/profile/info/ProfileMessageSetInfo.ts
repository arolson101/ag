import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../../meta/ChildAggregate_add'
import { AbstractMessageSetInfo } from '../AbstractMessageSetInfo'
import { ProfileV1MessageSetInfo } from './ProfileV1MessageSetInfo'

export class ProfileMessageSetInfo extends AbstractMessageSetInfo {
  private version1Info: ProfileV1MessageSetInfo

  getVersion1Info(): ProfileV1MessageSetInfo {
    return this.version1Info
  }

  setVersion1Info(version1Info: ProfileV1MessageSetInfo): void {
    this.version1Info = version1Info
  }
}

Aggregate_add(ProfileMessageSetInfo, 'PROFMSGSET')
ChildAggregate_add(ProfileMessageSetInfo, {
  order: 0,
  type: ProfileV1MessageSetInfo,
  read: ProfileMessageSetInfo.prototype.getVersion1Info,
  write: ProfileMessageSetInfo.prototype.setVersion1Info,
})
