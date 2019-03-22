import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { MessageSetType } from '../MessageSetType'
import { RequestMessage } from '../RequestMessage'
import { RequestMessageSet } from '../RequestMessageSet'
import { ProfileRequestTransaction } from './ProfileRequestTransaction'

/**
 * @see "Section 7 OFX Spec"
 */
export class ProfileRequestMessageSet extends RequestMessageSet {
  private profileRequest: ProfileRequestTransaction

  getType(): MessageSetType {
    return MessageSetType.profile
  }

  /**
   * The profile request.
   *
   * @return The profile request.
   */
  getProfileRequest(): ProfileRequestTransaction {
    return this.profileRequest
  }

  /**
   * The profile request.
   *
   * @param profileRequest The profile request.
   */
  setProfileRequest(profileRequest: ProfileRequestTransaction): void {
    this.profileRequest = profileRequest
  }

  // Inherited.
  getRequestMessages(): RequestMessage[] {
    const requestMessages: RequestMessage[] = new Array<RequestMessage>()
    if (this.getProfileRequest() != null) {
      requestMessages.push(this.getProfileRequest())
    }
    return requestMessages
  }
}

Aggregate_add(ProfileRequestMessageSet, 'PROFMSGSRQV1')
ChildAggregate_add(ProfileRequestMessageSet, {
  required: true,
  order: 0,
  type: ProfileRequestTransaction,
  read: ProfileRequestMessageSet.prototype.getProfileRequest,
  write: ProfileRequestMessageSet.prototype.setProfileRequest,
})
