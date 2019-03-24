import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { MessageSetType } from '../MessageSetType'
import { ResponseMessage } from '../ResponseMessage'
import { ResponseMessageSet } from '../ResponseMessageSet'
import { ProfileResponseTransaction } from './ProfileResponseTransaction'

/**
 * @see "Section 7 OFX Spec"
 */
export class ProfileResponseMessageSet extends ResponseMessageSet {
  private profileResponse!: ProfileResponseTransaction

  getType(): MessageSetType {
    return MessageSetType.profile
  }

  /**
   * The profile response.
   *
   * @return The profile response.
   */
  getProfileResponse(): ProfileResponseTransaction {
    return this.profileResponse
  }

  /**
   * The profile response.
   *
   * @param profileResponse The profile response.
   */
  setProfileResponse(profileResponse: ProfileResponseTransaction): void {
    this.profileResponse = profileResponse
  }

  // Inherited.
  getResponseMessages(): ResponseMessage[] {
    const messages: ResponseMessage[] = new Array<ResponseMessage>()

    if (this.getProfileResponse() != null) {
      messages.push(this.getProfileResponse())
    }

    return messages
  }
}

Aggregate_add(ProfileResponseMessageSet, 'PROFMSGSRSV1')
ChildAggregate_add(ProfileResponseMessageSet, {
  required: true,
  order: 0,
  type: ProfileResponseTransaction,
  read: ProfileResponseMessageSet.prototype.getProfileResponse,
  write: ProfileResponseMessageSet.prototype.setProfileResponse,
})
