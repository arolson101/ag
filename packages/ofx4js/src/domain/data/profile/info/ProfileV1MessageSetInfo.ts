import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { MessageSetType } from '../../MessageSetType'
import { VersionSpecificMessageSetInfo } from '../VersionSpecificMessageSetInfo'

export class ProfileV1MessageSetInfo extends VersionSpecificMessageSetInfo {
  getMessageSetType(): MessageSetType {
    return MessageSetType.profile
  }
}

Aggregate_add(ProfileV1MessageSetInfo, 'PROFMSGSETV1')
