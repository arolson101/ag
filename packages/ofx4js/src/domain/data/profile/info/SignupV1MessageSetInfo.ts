import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../../meta/ChildAggregate_add'
import { Element_add } from '../../../../meta/Element_add'
import { MessageSetType } from '../../MessageSetType'
import { VersionSpecificMessageSetInfo } from '../VersionSpecificMessageSetInfo'
import { ClientEnrollment } from './signup/ClientEnrollment'
import { OtherEnrollment } from './signup/OtherEnrollment'
import { WebEnrollment } from './signup/WebEnrollment'

/**
 * Servers use the Signup Message Set Profile Information to define how enrollment should proceed.
 *
 * This aggregate should contain 1 Enrollment option among <CLIENTENROLL>, <WEBENROLL>, or <OTHERENROLL>.
 * todo: review how best to enforce this constraint
 *
 * @see "Section 8.8 OFX Spec"
 */
export class SignupV1MessageSetInfo extends VersionSpecificMessageSetInfo {
  private clientEnrollment: ClientEnrollment
  private webEnrollment: WebEnrollment
  private otherEnrollment: OtherEnrollment
  private supportsClientUserInfoChanges: boolean
  private supportsAvailableAccounts: boolean
  private supportsClientServiceActivationRequests: boolean

  getMessageSetType(): MessageSetType {
    return MessageSetType.signup
  }

  getClientEnrollment(): ClientEnrollment {
    return this.clientEnrollment
  }

  setClientEnrollment(clientEnrollment: ClientEnrollment): void {
    this.clientEnrollment = clientEnrollment
  }

  getWebEnrollment(): WebEnrollment {
    return this.webEnrollment
  }

  setWebEnrollment(webEnrollment: WebEnrollment): void {
    this.webEnrollment = webEnrollment
  }

  getOtherEnrollment(): OtherEnrollment {
    return this.otherEnrollment
  }

  setOtherEnrollment(otherEnrollment: OtherEnrollment): void {
    this.otherEnrollment = otherEnrollment
  }

  /**
   * Y if server supports client-based user information changes,
   * @return Boolean
   */
  getSupportsClientUserInfoChanges(): boolean {
    return this.supportsClientUserInfoChanges
  }

  setSupportsClientUserInfoChanges(supportsClientUserInfoChanges: boolean): void {
    this.supportsClientUserInfoChanges = supportsClientUserInfoChanges
  }

  /**
   * Y if server can provide information on accounts with SVCSTATUS available,
   * N means client should expect to ask user for specific account information
   * @return Boolean
   */
  getSupportsAvailableAccounts(): boolean {
    return this.supportsAvailableAccounts
  }

  setSupportsAvailableAccounts(supportsAvailableAccounts: boolean): void {
    this.supportsAvailableAccounts = supportsAvailableAccounts
  }

  /**
   * Y if server allows clients to make service activation requests (<ACCTRQ>),
   * N if server will only advise clients via synchronization of service additions,
   * changes, or deletions.
   * @return Boolean
   */
  getSupportsClientServiceActivationRequests(): boolean {
    return this.supportsClientServiceActivationRequests
  }

  setSupportsClientServiceActivationRequests(
    supportsClientServiceActivationRequests: boolean
  ): void {
    this.supportsClientServiceActivationRequests = supportsClientServiceActivationRequests
  }
}

Aggregate_add(SignupV1MessageSetInfo, 'SIGNUPMSGSETV1')
ChildAggregate_add(SignupV1MessageSetInfo, {
  name: 'CLIENTENROLL',
  order: 10,
  type: ClientEnrollment,
  read: SignupV1MessageSetInfo.prototype.getClientEnrollment,
  write: SignupV1MessageSetInfo.prototype.setClientEnrollment,
})
ChildAggregate_add(SignupV1MessageSetInfo, {
  name: 'WEBENROLL',
  order: 20,
  type: WebEnrollment,
  read: SignupV1MessageSetInfo.prototype.getWebEnrollment,
  write: SignupV1MessageSetInfo.prototype.setWebEnrollment,
})
ChildAggregate_add(SignupV1MessageSetInfo, {
  name: 'OTHERENROLL',
  order: 30,
  type: OtherEnrollment,
  read: SignupV1MessageSetInfo.prototype.getOtherEnrollment,
  write: SignupV1MessageSetInfo.prototype.setOtherEnrollment,
})
Element_add(SignupV1MessageSetInfo, {
  name: 'CHGUSERINFO',
  required: true,
  order: 40,
  type: Boolean,
  read: SignupV1MessageSetInfo.prototype.getSupportsClientUserInfoChanges,
  write: SignupV1MessageSetInfo.prototype.setSupportsClientUserInfoChanges,
})
Element_add(SignupV1MessageSetInfo, {
  name: 'AVAILACCTS',
  required: true,
  order: 50,
  type: Boolean,
  read: SignupV1MessageSetInfo.prototype.getSupportsAvailableAccounts,
  write: SignupV1MessageSetInfo.prototype.setSupportsAvailableAccounts,
})
Element_add(SignupV1MessageSetInfo, {
  name: 'CLIENTACTREQ',
  required: true,
  order: 60,
  type: Boolean,
  read: SignupV1MessageSetInfo.prototype.getSupportsClientServiceActivationRequests,
  write: SignupV1MessageSetInfo.prototype.setSupportsClientServiceActivationRequests,
})
