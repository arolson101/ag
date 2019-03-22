import { FinancialInstitutionProfile } from '../../../client/FinancialInstitutionProfile'
import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { Element_add } from '../../../meta/Element_add'
import { OFXException } from '../../../OFXException'
import { MessageSetProfile } from '../MessageSetProfile'
import { MessageSetType } from '../MessageSetType'
import { ResponseMessage } from '../ResponseMessage'
import { SignonProfile } from '../SignonProfile'
import { MessageSetInfoList } from './MessageSetInfoList'
import { SignonInfoList } from './SignonInfoList'

// import java.net.URL;

/**
 * @see "Section 7.2 OFX Spec"
 */
export class ProfileResponse extends ResponseMessage implements FinancialInstitutionProfile {
  private messageSetList: MessageSetInfoList
  private signonInfoList: SignonInfoList
  private timestamp: Date
  private financialInstitutionName: string
  private address1: string
  private address2: string
  private address3: string
  private city: string
  private state: string
  private zip: string
  private country: string
  private customerServicePhone: string
  private technicalSupportPhone: string
  private fax: string
  private siteURL: string
  private email: string

  /**
   * List of message set information.
   * @return List of message set information.
   */
  getMessageSetList(): MessageSetInfoList {
    return this.messageSetList
  }

  /**
   * List of message set information.
   *
   * @param messageSetList List of message set information.
   */
  setMessageSetList(messageSetList: MessageSetInfoList): void {
    this.messageSetList = messageSetList
  }

  /**
   * List of signon information.
   *
   * @return List of signon information.
   */
  getSignonInfoList(): SignonInfoList {
    return this.signonInfoList
  }

  /**
   * List of signon information.
   *
   * @param signonInfoList List of signon information.
   */
  setSignonInfoList(signonInfoList: SignonInfoList): void {
    this.signonInfoList = signonInfoList
  }

  // Inherited.
  getResponseMessageName(): string {
    return 'profile'
  }

  // Inherited.
  getLastUpdated(): Date {
    return this.getTimestamp()
  }

  /**
   * The timestamp of this profile update.
   *
   * @return The timestamp of this profile update.
   */
  getTimestamp(): Date {
    return this.timestamp
  }

  /**
   * The timestamp of this profile update.
   *
   * @param timestamp The timestamp of this profile update.
   */
  setTimestamp(timestamp: Date): void {
    this.timestamp = timestamp
  }

  /**
   * The name of the financial institution.
   *
   * @return The name of the financial institution.
   */
  getFinancialInstitutionName(): string {
    return this.financialInstitutionName
  }

  /**
   * The name of the financial institution.
   *
   * @param financialInstitutionName The name of the financial institution.
   */
  setFinancialInstitutionName(financialInstitutionName: string): void {
    this.financialInstitutionName = financialInstitutionName
  }

  /**
   * The address of the financial institution.
   *
   * @return The address of the financial institution.
   */
  getAddress1(): string {
    return this.address1
  }

  /**
   * The address of the financial institution.
   *
   * @param address1 The address of the financial institution.
   */
  setAddress1(address1: string): void {
    this.address1 = address1
  }

  /**
   * The address of the financial institution.
   *
   * @return The address of the financial institution.
   */
  getAddress2(): string {
    return this.address2
  }

  /**
   * The address of the financial institution.
   *
   * @param address2 The address of the financial institution.
   */
  setAddress2(address2: string): void {
    this.address2 = address2
  }

  /**
   * The address of the financial institution.
   *
   * @return The address of the financial institution.
   */
  getAddress3(): string {
    return this.address3
  }

  /**
   * The address of the financial institution.
   *
   * @param address3 The address of the financial institution.
   */
  setAddress3(address3: string): void {
    this.address3 = address3
  }

  /**
   * The city of the financial institution.
   *
   * @return The city of the financial institution.
   */
  getCity(): string {
    return this.city
  }

  /**
   * The city of the financial institution.
   *
   * @param city The city of the financial institution.
   */
  setCity(city: string): void {
    this.city = city
  }

  /**
   * The state of this financial institution.
   *
   * @return The state of this financial institution.
   */
  getState(): string {
    return this.state
  }

  /**
   * The state of this financial institution.
   *
   * @param state The state of this financial institution.
   */
  setState(state: string): void {
    this.state = state
  }

  /**
   * The postal code of this financial institution.
   *
   * @return The postal code of this financial institution.
   */
  getZip(): string {
    return this.zip
  }

  /**
   * The postal code of this financial institution.
   *
   * @param zip The postal code of this financial institution.
   */
  setZip(zip: string): void {
    this.zip = zip
  }

  /**
   * The country code for this financial institution.
   *
   * @return The country code for this financial institution.
   * @see java.util.Locale#getISO3Country()
   */
  getCountry(): string {
    return this.country
  }

  /**
   * The country code for this financial institution.
   *
   * @param country The country code for this financial institution.
   */
  setCountry(country: string): void {
    this.country = country
  }

  /**
   * The phone number to customer service.
   *
   * @return The phone number to customer service.
   */
  getCustomerServicePhone(): string {
    return this.customerServicePhone
  }

  /**
   * The phone number to customer service.
   *
   * @param customerServicePhone The phone number to customer service.
   */
  setCustomerServicePhone(customerServicePhone: string): void {
    this.customerServicePhone = customerServicePhone
  }

  /**
   * The phone number to tech support.
   *
   * @return The phone number to tech support.
   */
  getTechnicalSupportPhone(): string {
    return this.technicalSupportPhone
  }

  /**
   * The phone number to tech support.
   *
   * @param technicalSupportPhone The phone number to tech support.
   */
  setTechnicalSupportPhone(technicalSupportPhone: string): void {
    this.technicalSupportPhone = technicalSupportPhone
  }

  /**
   * The fax number.
   *
   * @return The fax number.
   */
  getFax(): string {
    return this.fax
  }

  /**
   * The fax number.
   *
   * @param fax The fax number.
   */
  setFax(fax: string): void {
    this.fax = fax
  }

  /**
   * URL for the financial institution.
   *
   * @return URL for the financial institution.
   */
  getSiteURL(): string {
    return this.siteURL
  }

  /**
   * URL for the financial institution.
   *
   * @param siteURL URL for the financial institution.
   */
  setSiteURL(siteURL: string): void {
    this.siteURL = siteURL
  }

  /**
   * The email for this FI
   *
   * @return The email for this FI
   */
  getEmail(): string {
    return this.email
  }

  /**
   * The email for this FI
   *
   * @param email The email for this FI
   */
  setEmail(email: string): void {
    this.email = email
  }

  getMessageSetProfile(type: MessageSetType, version: string = null): MessageSetProfile {
    return version === null
      ? this.getMessageSetProfile_noversion(type)
      : this.getMessageSetProfile_version(type, version)
  }

  getMessageSetProfile_noversion(type: MessageSetType): MessageSetProfile {
    const profiles: MessageSetProfile[] = this.getProfiles(type)
    if (profiles.length > 1) {
      throw new OFXException('More than one profile of type ' + type)
    } else if (profiles.length == 0) {
      return null
    } else {
      return profiles[0]
    }
  }

  /**
   * Get all the profiles of the specified type.
   *
   * @param type The type.
   * @return The profiles.
   */
  protected getProfiles(type: MessageSetType): MessageSetProfile[] {
    const profiles: MessageSetProfile[] = new Array<MessageSetProfile>()
    if (this.getMessageSetList() != null && this.getMessageSetList().getInformationList() != null) {
      for (const info of this.getMessageSetList().getInformationList()) {
        if (info.getVersionSpecificInformationList() != null) {
          for (const versionSpecificInfo of info.getVersionSpecificInformationList()) {
            if (versionSpecificInfo.getMessageSetType() == type) {
              profiles.push(versionSpecificInfo)
            }
          }
        }
      }
    }
    return profiles
  }

  getMessageSetProfile_version(type: MessageSetType, version: string): MessageSetProfile {
    for (const profile of this.getProfiles(type)) {
      if (version == null) {
        if (profile.getVersion() == null) {
          return profile
        }
      } else if (version === profile.getVersion()) {
        return profile
      }
    }

    return null
  }

  getSignonProfile(messageSet: MessageSetProfile): SignonProfile {
    if (this.getSignonInfoList() != null && this.getSignonInfoList().getInfoList() != null) {
      for (const signonInfo of this.getSignonInfoList().getInfoList()) {
        if (messageSet.getRealm() == null) {
          if (signonInfo.getRealm() == null) {
            return signonInfo
          }
        } else if (messageSet.getRealm() === signonInfo.getRealm()) {
          return signonInfo
        }
      }
    }
    return null
  }
}

Aggregate_add(ProfileResponse, 'PROFRS')
ChildAggregate_add(ProfileResponse, {
  order: 0,
  type: MessageSetInfoList,
  read: ProfileResponse.prototype.getMessageSetList,
  write: ProfileResponse.prototype.setMessageSetList,
})
ChildAggregate_add(ProfileResponse, {
  order: 10,
  type: SignonInfoList,
  read: ProfileResponse.prototype.getSignonInfoList,
  write: ProfileResponse.prototype.setSignonInfoList,
})
Element_add(ProfileResponse, {
  name: 'DTPROFUP',
  order: 20,
  type: Date,
  read: ProfileResponse.prototype.getTimestamp,
  write: ProfileResponse.prototype.setTimestamp,
})
Element_add(ProfileResponse, {
  name: 'FINAME',
  order: 30,
  type: String,
  read: ProfileResponse.prototype.getFinancialInstitutionName,
  write: ProfileResponse.prototype.setFinancialInstitutionName,
})
Element_add(ProfileResponse, {
  name: 'ADDR1',
  required: true,
  order: 40,
  type: String,
  read: ProfileResponse.prototype.getAddress1,
  write: ProfileResponse.prototype.setAddress1,
})
Element_add(ProfileResponse, {
  name: 'ADDR2',
  order: 50,
  type: String,
  read: ProfileResponse.prototype.getAddress2,
  write: ProfileResponse.prototype.setAddress2,
})
Element_add(ProfileResponse, {
  name: 'ADDR3',
  order: 60,
  type: String,
  read: ProfileResponse.prototype.getAddress3,
  write: ProfileResponse.prototype.setAddress3,
})
Element_add(ProfileResponse, {
  name: 'CITY',
  required: true,
  order: 70,
  type: String,
  read: ProfileResponse.prototype.getCity,
  write: ProfileResponse.prototype.setCity,
})
Element_add(ProfileResponse, {
  name: 'STATE',
  required: true,
  order: 80,
  type: String,
  read: ProfileResponse.prototype.getState,
  write: ProfileResponse.prototype.setState,
})
Element_add(ProfileResponse, {
  name: 'POSTALCODE',
  required: true,
  order: 90,
  type: String,
  read: ProfileResponse.prototype.getZip,
  write: ProfileResponse.prototype.setZip,
})
Element_add(ProfileResponse, {
  name: 'COUNTRY',
  required: true,
  order: 100,
  type: String,
  read: ProfileResponse.prototype.getCountry,
  write: ProfileResponse.prototype.setCountry,
})
Element_add(ProfileResponse, {
  name: 'CSPHONE',
  order: 110,
  type: String,
  read: ProfileResponse.prototype.getCustomerServicePhone,
  write: ProfileResponse.prototype.setCustomerServicePhone,
})
Element_add(ProfileResponse, {
  name: 'TSPHONE',
  order: 120,
  type: String,
  read: ProfileResponse.prototype.getTechnicalSupportPhone,
  write: ProfileResponse.prototype.setTechnicalSupportPhone,
})
Element_add(ProfileResponse, {
  name: 'FAXPHONE',
  order: 130,
  type: String,
  read: ProfileResponse.prototype.getFax,
  write: ProfileResponse.prototype.setFax,
})
Element_add(ProfileResponse, {
  name: 'URL',
  order: 140,
  type: String,
  read: ProfileResponse.prototype.getSiteURL,
  write: ProfileResponse.prototype.setSiteURL,
})
Element_add(ProfileResponse, {
  name: 'EMAIL',
  order: 150,
  type: String,
  read: ProfileResponse.prototype.getEmail,
  write: ProfileResponse.prototype.setEmail,
})
