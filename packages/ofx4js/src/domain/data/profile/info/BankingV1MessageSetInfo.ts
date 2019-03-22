import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../../meta/ChildAggregate_add'
import { Element_add } from '../../../../meta/Element_add'
import { AccountType } from '../../banking/AccountType'
import { MessageSetType } from '../../MessageSetType'
import { VersionSpecificMessageSetInfo } from '../VersionSpecificMessageSetInfo'
import { EmailProfile } from './banking/EmailProfile'
import { StopCheckProfile } from './banking/StopCheckProfile'
import { ImageProfile } from './common/ImageProfile'
import { TransferProfile } from './common/TransferProfile'

/**
 * Banking Message Set Profile
 * @see "Section 11.13.2.1 OFX Spec"
 */
export class BankingV1MessageSetInfo extends VersionSpecificMessageSetInfo {
  private invalidAccountTypes: AccountType[]
  private closingAvail: boolean
  private transferProfile: TransferProfile
  private stopCheckProfile: StopCheckProfile
  private emailProfile: EmailProfile
  private imageProfile: ImageProfile

  getMessageSetType(): MessageSetType {
    return MessageSetType.banking
  }

  /**
   * The invalidAccountTypes list.
   *
   * @return The invalidAccountTypes list.
   */
  getInvalidAccountTypes(): AccountType[] {
    return this.invalidAccountTypes
  }

  /**
   * The invalidAccountTypes list.
   *
   * @param invalidAccountTypes The invalidAccountTypes list.
   */
  setInvalidAccountTypes(invalidAccountTypes: AccountType[]): void {
    this.invalidAccountTypes = invalidAccountTypes
  }

  /**
   * Gets whether closing statement information is available
   *
   * @return whether closing statement information is available
   */
  getClosingAvail(): boolean {
    return this.closingAvail
  }

  /**
   * Sets whether closing statement information is available
   *
   * @param closingAvail whether closing statement information is available
   */
  setClosingAvail(closingAvail: boolean): void {
    this.closingAvail = closingAvail
  }

  getTransferProfile(): TransferProfile {
    return this.transferProfile
  }

  setTransferProfile(transferProfile: TransferProfile): void {
    this.transferProfile = transferProfile
  }

  getStopCheckProfile(): StopCheckProfile {
    return this.stopCheckProfile
  }

  setStopCheckProfile(stopCheckProfile: StopCheckProfile): void {
    this.stopCheckProfile = stopCheckProfile
  }

  getEmailProfile(): EmailProfile {
    return this.emailProfile
  }

  setEmailProfile(emailProfile: EmailProfile): void {
    this.emailProfile = emailProfile
  }

  getImageProfile(): ImageProfile {
    return this.imageProfile
  }

  setImageProfile(imageProfile: ImageProfile): void {
    this.imageProfile = imageProfile
  }
}

Aggregate_add(BankingV1MessageSetInfo, 'BANKMSGSETV1')
ChildAggregate_add(BankingV1MessageSetInfo, {
  order: 10,
  type: Array,
  collectionEntryType: AccountType,
  read: BankingV1MessageSetInfo.prototype.getInvalidAccountTypes,
  write: BankingV1MessageSetInfo.prototype.setInvalidAccountTypes,
})
Element_add(BankingV1MessageSetInfo, {
  name: 'CLOSINGAVAIL',
  required: true,
  order: 20,
  type: Boolean,
  read: BankingV1MessageSetInfo.prototype.getClosingAvail,
  write: BankingV1MessageSetInfo.prototype.setClosingAvail,
})
ChildAggregate_add(BankingV1MessageSetInfo, {
  name: 'XFERPROF',
  order: 30,
  type: TransferProfile,
  read: BankingV1MessageSetInfo.prototype.getTransferProfile,
  write: BankingV1MessageSetInfo.prototype.setTransferProfile,
})
ChildAggregate_add(BankingV1MessageSetInfo, {
  name: 'STPCKPROF',
  order: 40,
  type: StopCheckProfile,
  read: BankingV1MessageSetInfo.prototype.getStopCheckProfile,
  write: BankingV1MessageSetInfo.prototype.setStopCheckProfile,
})
ChildAggregate_add(BankingV1MessageSetInfo, {
  name: 'EMAILPROF',
  required: true,
  order: 50,
  type: EmailProfile,
  read: BankingV1MessageSetInfo.prototype.getEmailProfile,
  write: BankingV1MessageSetInfo.prototype.setEmailProfile,
})
ChildAggregate_add(BankingV1MessageSetInfo, {
  name: 'IMAGEPROF',
  order: 60,
  type: ImageProfile,
  read: BankingV1MessageSetInfo.prototype.getImageProfile,
  write: BankingV1MessageSetInfo.prototype.setImageProfile,
})
