import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { Element_add } from '../../../meta/Element_add'
import { OFXException } from '../../../OFXException'
import { BankAccountInfo } from '../banking/BankAccountInfo'
import { AccountInfo } from '../common/AccountInfo'
import { CreditCardAccountInfo } from '../creditcard/CreditCardAccountInfo'
import { InvestmentAccountInfo } from '../investment/accounts/InvestmentAccountInfo'

export class AccountProfile {
  private description: string
  private phone: string
  private bankSpecifics: BankAccountInfo
  private creditCardSpecifics: CreditCardAccountInfo
  private investSpecifics: InvestmentAccountInfo

  /**
   * Description of the account.
   *
   * @return The description of the account.
   */
  getDescription(): string {
    return this.description
  }

  /**
   * The description of the account.
   *
   * @param description The description of the account.
   */
  setDescription(description: string): void {
    this.description = description
  }

  /**
   * Phone number for the account.
   *
   * @return Phone number for the account.
   */
  getPhone(): string {
    return this.phone
  }

  /**
   * Phone number for the account.
   *
   * @param phone Phone number for the account.
   */
  setPhone(phone: string): void {
    this.phone = phone
  }

  /**
   * Account specifics.
   *
   * @return Account specifics.
   */
  getSpecifics(): AccountInfo {
    if (this.getBankSpecifics() != null && this.getCreditCardSpecifics() != null) {
      throw new OFXException('Only one account specifics aggregate can be set at a time.')
    } else if (this.getBankSpecifics() != null) {
      return this.getBankSpecifics()
    } else if (this.getInvestmentSpecifics() != null) {
      return this.getInvestmentSpecifics()
    } else {
      return this.getCreditCardSpecifics()
    }
  }

  /**
   * Account specifics.
   *
   * @param specifics Account specifics.
   */
  setSpecifics(specifics: AccountInfo): void {
    if (specifics instanceof BankAccountInfo) {
      this.setBankSpecifics(specifics as BankAccountInfo)
    } else if (specifics instanceof CreditCardAccountInfo) {
      this.setCreditCardSpecifics(specifics as CreditCardAccountInfo)
    } else if (specifics instanceof InvestmentAccountInfo) {
      this.setInvestmentSpecifics(specifics as InvestmentAccountInfo)
    } else {
      throw new OFXException('Unknown specifics type: ' + specifics)
    }
  }

  /**
   * Bank-specific info.
   *
   * @return Bank-specific info.
   */
  getBankSpecifics(): BankAccountInfo {
    return this.bankSpecifics
  }

  /**
   * Bank-specific info.
   *
   * @param bankSpecifics Bank-specific info.
   */
  setBankSpecifics(bankSpecifics: BankAccountInfo): void {
    this.creditCardSpecifics = null
    this.investSpecifics = null
    this.bankSpecifics = bankSpecifics
  }

  /**
   * Credit-card account info.
   *
   * @return Credit-card account info.
   */
  getCreditCardSpecifics(): CreditCardAccountInfo {
    return this.creditCardSpecifics
  }

  /**
   * Credit-card account info.
   *
   * @param creditCardSpecifics Credit-card account info.
   */
  setCreditCardSpecifics(creditCardSpecifics: CreditCardAccountInfo): void {
    this.bankSpecifics = null
    this.investSpecifics = null
    this.creditCardSpecifics = creditCardSpecifics
  }

  /**
   * Investment account info.
   *
   * @return Investment account info.
   */
  getInvestmentSpecifics(): InvestmentAccountInfo {
    return this.investSpecifics
  }

  /**
   * Investment account info.
   *
   * @param investSpecifics Investment account info.
   */
  setInvestmentSpecifics(investSpecifics: InvestmentAccountInfo): void {
    this.bankSpecifics = null
    this.creditCardSpecifics = null
    this.investSpecifics = investSpecifics
  }
}

Aggregate_add(AccountProfile, 'ACCTINFO')
Element_add(AccountProfile, {
  name: 'DESC',
  order: 0,
  type: String,
  read: AccountProfile.prototype.getDescription,
  write: AccountProfile.prototype.setDescription,
})
Element_add(AccountProfile, {
  name: 'PHONE',
  order: 10,
  type: String,
  read: AccountProfile.prototype.getPhone,
  write: AccountProfile.prototype.setPhone,
})
ChildAggregate_add(AccountProfile, {
  order: 20,
  type: BankAccountInfo,
  read: AccountProfile.prototype.getBankSpecifics,
  write: AccountProfile.prototype.setBankSpecifics,
})
ChildAggregate_add(AccountProfile, {
  order: 30,
  type: CreditCardAccountInfo,
  read: AccountProfile.prototype.getCreditCardSpecifics,
  write: AccountProfile.prototype.setCreditCardSpecifics,
})
ChildAggregate_add(AccountProfile, {
  order: 40,
  type: InvestmentAccountInfo,
  read: AccountProfile.prototype.getInvestmentSpecifics,
  write: AccountProfile.prototype.setInvestmentSpecifics,
})
