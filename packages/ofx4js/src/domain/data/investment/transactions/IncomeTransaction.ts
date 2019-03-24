import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../../meta/ChildAggregate_add'
import { Element_add } from '../../../../meta/Element_add'
import { SecurityId } from '../../seclist/SecurityId'
import { SubAccountType, SubAccountType_fromOfx } from '../accounts/SubAccountType'
import { Inv401KSource, Inv401KSource_fromOfx } from '../positions/Inv401KSource'
import { BaseOtherInvestmentTransaction } from './BaseOtherInvestmentTransaction'
import { IncomeType, IncomeType_fromOfx } from './IncomeType'
import { OriginalCurrency } from './OriginalCurrency'
import { InvestmentTransactionType } from './TransactionType'
import { TransactionWithSecurity } from './TransactionWithSecurity'

/**
 * Transaction for investment income that is realized as cash into the investment account.
 * @see "Section 13.9.2.4.4, OFX Spec"
 */
export class IncomeTransaction extends BaseOtherInvestmentTransaction
  implements TransactionWithSecurity {
  private securityId!: SecurityId
  private incomeType!: string
  private total!: number
  private subAccountSecurity!: string
  private subAccountFund!: string
  private taxExempt!: boolean
  private withholding!: number
  private currencyCode?: string
  private originalCurrencyInfo?: OriginalCurrency
  private inv401kSource!: string

  constructor() {
    super(InvestmentTransactionType.INCOME)
  }

  /**
   * Gets the id of the security that the income was for. This is a required field according to the
   * OFX spec.
   * @see "Section 13.9.2.4.4, OFX Spec"
   *
   * @return the security id of the security that the income was for
   */
  getSecurityId(): SecurityId {
    return this.securityId
  }

  /**
   * Sets the id of the security that the income was for. This is a required field according to the
   * OFX spec.
   * @see "Section 13.9.2.4.4, OFX Spec"
   *
   * @param securityId the security id of the security that the income was for
   */
  setSecurityId(securityId: SecurityId): void {
    this.securityId = securityId
  }

  /**
   * Gets the type of income. One of "CGLONG" (long term capital gains), "CGSHORT" (short term
   * capital gains), "DIV" (dividend), INTEREST, or MISC>
   * @see "Section 13.9.2.4.4, OFX Spec" This is a required field according to the OFX spec.
   *
   * @return the type of income
   */
  getIncomeType(): string {
    return this.incomeType
  }

  /**
   * Sets the type of income. One of "CGLONG" (long term capital gains), "CGSHORT" (short term
   * capital gains), "DIV" (dividend), INTEREST, or MISC>
   * @see "Section 13.9.2.4.4, OFX Spec" This is a required field according to the OFX spec.
   *
   * @param incomeType the type of income
   */
  setIncomeType(incomeType: string): void {
    this.incomeType = incomeType
  }

  /**
   * Gets the income type as one of the well-known types.
   *
   * @return the income type or null if it's not well known
   */
  getIncomeTypeEnum(): IncomeType {
    return IncomeType_fromOfx(this.getIncomeType())
  }

  /**
   * Gets the total income received.
   * @see "Section 13.9.2.4.4, OFX Spec"
   *
   * @return the total
   */
  getTotal(): number {
    return this.total
  }

  /**
   * Sets the total income received.
   * @see "Section 13.9.2.4.4, OFX Spec"
   *
   * @param total the total
   */
  setTotal(total: number): void {
    this.total = total
  }

  /**
   * Gets the sub account type for the security (e.g. CASH, MARGIN, SHORT, OTHER).
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the sub account type
   */
  getSubAccountSecurity(): string {
    return this.subAccountSecurity
  }

  /**
   * Sets the sub account type for the security (e.g. CASH, MARGIN, SHORT, OTHER).
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param subAcctSec the sub account type
   */
  setSubAccountSecurity(subAcctSec: string): void {
    this.subAccountSecurity = subAcctSec
  }

  /**
   * Gets the result of getSubAccountSecurity as one of the well-known types.
   *
   * @return the type of null if it wasn't one of the well known types.
   */
  getSubAccountSecurityEnum(): SubAccountType {
    return SubAccountType_fromOfx(this.getSubAccountSecurity())
  }

  /**
   * Gets the sub account type that the security is from (e.g. CASH, MARGIN, SHORT, OTHER).
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the sub account fund for the transaction
   */
  getSubAccountFund(): string {
    return this.subAccountFund
  }

  /**
   * Sets the sub account type that the security is from (e.g. CASH, MARGIN, SHORT, OTHER).
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param subAcctFund the sub account fund for the transaction
   */
  setSubAccountFund(subAcctFund: string): void {
    this.subAccountFund = subAcctFund
  }

  /**
   * Gets the result of getSubAccountFund as one of the well-known types.
   *
   * @return the type of null if it wasn't one of the well known types
   */
  getSubAccountFundEnum(): SubAccountType {
    return SubAccountType_fromOfx(this.getSubAccountFund())
  }

  /**
   * Gets whether the income was tax exempt. This is an optional field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return whether the transaction was tax exempt
   */
  getTaxExempt(): boolean {
    return this.taxExempt
  }

  /**
   * Sets whether the income was tax exempt. This is an optional field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param taxExempt whether the transaction was tax exempt
   */
  setTaxExempt(taxExempt: boolean): void {
    this.taxExempt = taxExempt
  }

  /**
   * Gets the withholding for the income. This is an optional field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the withholding
   */
  getWithholding(): number {
    return this.withholding
  }

  /**
   * Sets the withholding for the income. This is an optional field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param withholding the withholding
   */
  setWithholding(withholding: number): void {
    this.withholding = withholding
  }

  /**
   * Gets the currency code for the transaction. Only one of currency code or original currency
   * info should be set according to the OFX spec. If neither are set, means the default currency.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the currency code for the transaction
   */
  getCurrencyCode(): string {
    return this.currencyCode!
  }

  /**
   * Sets the currency code for the transaction. Only one of currency code or original currency
   * info should be set according to the OFX spec. If neither are set, means the default currency.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param currencyCode the currency code for the transaction
   */
  setCurrencyCode(currencyCode: string): void {
    this.currencyCode = currencyCode
    this.originalCurrencyInfo = undefined
  }

  /**
   * Gets the original currency info for the transaction.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the currency info for the transaction
   */
  getOriginalCurrencyInfo(): OriginalCurrency {
    return this.originalCurrencyInfo!
  }

  /**
   * Sets the original currency info for the transaction.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param originalCurrencyInfo the currency info for the transaction
   */
  setOriginalCurrencyInfo(originalCurrencyInfo: OriginalCurrency): void {
    this.originalCurrencyInfo = originalCurrencyInfo
    this.currencyCode = undefined
  }

  /**
   * Gets the 401K source for the sale. Should be one of "PRETAX", "AFTERTAX", "MATCH",
   * "PROFITSHARING", "ROLLOVER", "OTHERVEST", "OTHERNONVEST".  This is an optional field
   * according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the state withholding
   */
  get401kSource(): string {
    return this.inv401kSource
  }

  /**
   * Sets the 401K source for the sale. Should be one of "PRETAX", "AFTERTAX", "MATCH",
   * "PROFITSHARING", "ROLLOVER", "OTHERVEST", "OTHERNONVEST".  This is an optional field
   * according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param inv401kSource the state withholding
   */
  set401kSource(inv401kSource: string): void {
    this.inv401kSource = inv401kSource
  }

  /**
   * Gets the 401(k) source as one of the well-known types.
   *
   * @return the type of close or null if it's not well known.
   */
  get401kSourceEnum(): Inv401KSource {
    return Inv401KSource_fromOfx(this.get401kSource())
  }
}

Aggregate_add(IncomeTransaction, 'INCOME')
ChildAggregate_add(IncomeTransaction, {
  required: true,
  order: 20,
  type: SecurityId,
  read: IncomeTransaction.prototype.getSecurityId,
  write: IncomeTransaction.prototype.setSecurityId,
})
Element_add(IncomeTransaction, {
  name: 'INCOMETYPE',
  required: true,
  order: 30,
  type: String,
  read: IncomeTransaction.prototype.getIncomeType,
  write: IncomeTransaction.prototype.setIncomeType,
})
Element_add(IncomeTransaction, {
  name: 'TOTAL',
  required: true,
  order: 40,
  type: Number,
  read: IncomeTransaction.prototype.getTotal,
  write: IncomeTransaction.prototype.setTotal,
})
Element_add(IncomeTransaction, {
  name: 'SUBACCTSEC',
  order: 50,
  type: String,
  read: IncomeTransaction.prototype.getSubAccountSecurity,
  write: IncomeTransaction.prototype.setSubAccountSecurity,
})
Element_add(IncomeTransaction, {
  name: 'SUBACCTFUND',
  order: 60,
  type: String,
  read: IncomeTransaction.prototype.getSubAccountFund,
  write: IncomeTransaction.prototype.setSubAccountFund,
})
Element_add(IncomeTransaction, {
  name: 'TAXEXEMPT',
  order: 70,
  type: Boolean,
  read: IncomeTransaction.prototype.getTaxExempt,
  write: IncomeTransaction.prototype.setTaxExempt,
})
Element_add(IncomeTransaction, {
  name: 'WITHHOLDING',
  order: 80,
  type: Number,
  read: IncomeTransaction.prototype.getWithholding,
  write: IncomeTransaction.prototype.setWithholding,
})
Element_add(IncomeTransaction, {
  name: 'CURRENCY',
  order: 90,
  type: String,
  read: IncomeTransaction.prototype.getCurrencyCode,
  write: IncomeTransaction.prototype.setCurrencyCode,
})
ChildAggregate_add(IncomeTransaction, {
  order: 120,
  type: OriginalCurrency,
  read: IncomeTransaction.prototype.getOriginalCurrencyInfo,
  write: IncomeTransaction.prototype.setOriginalCurrencyInfo,
})
Element_add(IncomeTransaction, {
  name: 'INV401KSOURCE',
  order: 110,
  type: String,
  read: IncomeTransaction.prototype.get401kSource,
  write: IncomeTransaction.prototype.set401kSource,
})
