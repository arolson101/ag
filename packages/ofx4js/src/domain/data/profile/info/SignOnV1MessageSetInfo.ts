import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { MessageSetType } from '../../MessageSetType'
import { VersionSpecificMessageSetInfo } from '../VersionSpecificMessageSetInfo'

export class SignOnV1MessageSetInfo extends VersionSpecificMessageSetInfo {
  getMessageSetType(): MessageSetType {
    return MessageSetType.signon
  }
}

Aggregate_add(SignOnV1MessageSetInfo, 'SIGNONMSGSETV1')
