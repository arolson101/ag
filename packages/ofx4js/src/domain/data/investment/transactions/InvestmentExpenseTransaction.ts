import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../../meta/ChildAggregate_Add'
import { Element_add } from '../../../../meta/Element_add'
import { SecurityId } from '../../seclist/SecurityId'
import { SubAccountType, SubAccountType_fromOfx } from '../accounts/SubAccountType'
import { Inv401KSource, Inv401KSource_fromOfx } from '../positions/Inv401KSource'
import { BaseOtherInvestmentTransaction } from './BaseOtherInvestmentTransaction'
import { OriginalCurrency } from './OriginalCurrency'
import { InvestmentTransactionType } from './TransactionType'

/**
 * Transaction for an investment expense
 * @see "Section 13.9.2.4.4, OFX Spec"
 */
export class InvestmentExpenseTransaction extends BaseOtherInvestmentTransaction {
  private securityId!: SecurityId
  private total!: number
  private subAccountSecurity!: string
  private subAccountFund!: string
  private currencyCode?: string
  private originalCurrencyInfo?: OriginalCurrency
  private inv401kSource!: string

  constructor() {
    super(InvestmentTransactionType.INVESTMENT_EXPENSE)
  }

  /**
   * Gets the id of the security for the expense. This is a required field according to the OFX
   * spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the security id of the security for the expsense
   */
  getSecurityId(): SecurityId {
    return this.securityId
  }

  /**
   * Sets the id of the security for the expense. This is a required field according to the OFX
   * spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param securityId the security id of the security for the expsense
   */
  setSecurityId(securityId: SecurityId): void {
    this.securityId = securityId
  }

  /**
   * Gets the total for the expense.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the total
   */
  getTotal(): number {
    return this.total
  }

  /**
   * Sets the total for the expense.
   * @see "Section 13.9.2.4.3, OFX Spec"
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
   * @param subAccountSecurity the sub account type
   */
  setSubAccountSecurity(subAccountSecurity: string): void {
    this.subAccountSecurity = subAccountSecurity
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
   * Gets the sub account type for the fund. (e.g. CASH, MARGIN, SHORT, OTHER).
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the sub account fund
   */
  getSubAccountFund(): string {
    return this.subAccountFund
  }

  /**
   * Sets the sub account type for the fund. (e.g. CASH, MARGIN, SHORT, OTHER).
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param subAccountFund the sub account fund
   */
  setSubAccountFund(subAccountFund: string): void {
    this.subAccountFund = subAccountFund
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
   * Gets the currency code for the transaction. Only one of currency code or original currency
   * code should be set according to the OFX spec. If neither are set, means the default currency.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the currency code for the transaction
   */
  getCurrencyCode(): string {
    return this.currencyCode!
  }

  /**
   * sets the currency code for the transaction. Only one of currency code or original currency
   * code should be set according to the OFX spec. If neither are set, means the default currency.
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
   * @return the original currency info for the transaction
   */
  getOriginalCurrencyInfo(): OriginalCurrency {
    return this.originalCurrencyInfo!
  }

  /**
   * Sets the original currency info for the transaction.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param originalCurrencyInfo the original currency info for the transaction
   */
  setOriginalCurrencyInfo(originalCurrencyInfo: OriginalCurrency): void {
    this.originalCurrencyInfo = originalCurrencyInfo
    this.currencyCode = undefined
  }

  /**
   * Gets the 401K source for the transaction. Should be one of "PRETAX", "AFTERTAX", "MATCH",
   * "PROFITSHARING", "ROLLOVER", "OTHERVEST", "OTHERNONVEST".  This is an optional field
   * according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the 401k source
   */
  get401kSource(): string {
    return this.inv401kSource
  }

  /**
   * Sets the 401K source for the transaction. Should be one of "PRETAX", "AFTERTAX", "MATCH",
   * "PROFITSHARING", "ROLLOVER", "OTHERVEST", "OTHERNONVEST".  This is an optional field
   * according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param inv401kSource the 401k source
   */
  set401kSource(inv401kSource: string): void {
    this.inv401kSource = inv401kSource
  }

  /**
   * Gets the 401k source as one of the well-known types.
   *
   * @return the 401k source or null if its not one of the well-known types
   */
  get401kSourceEnum(): Inv401KSource {
    return Inv401KSource_fromOfx(this.get401kSource())
  }
}

Aggregate_add(InvestmentExpenseTransaction, 'INVEXPENSE')
ChildAggregate_add(InvestmentExpenseTransaction, {
  required: true,
  order: 20,
  type: SecurityId,
  read: InvestmentExpenseTransaction.prototype.getSecurityId,
  write: InvestmentExpenseTransaction.prototype.setSecurityId,
})
Element_add(InvestmentExpenseTransaction, {
  name: 'TOTAL',
  required: true,
  order: 30,
  type: Number,
  read: InvestmentExpenseTransaction.prototype.getTotal,
  write: InvestmentExpenseTransaction.prototype.setTotal,
})
Element_add(InvestmentExpenseTransaction, {
  name: 'SUBACCTSEC',
  order: 40,
  type: String,
  read: InvestmentExpenseTransaction.prototype.getSubAccountSecurity,
  write: InvestmentExpenseTransaction.prototype.setSubAccountSecurity,
})
Element_add(InvestmentExpenseTransaction, {
  name: 'SUBACCTFUND',
  order: 50,
  type: String,
  read: InvestmentExpenseTransaction.prototype.getSubAccountFund,
  write: InvestmentExpenseTransaction.prototype.setSubAccountFund,
})
Element_add(InvestmentExpenseTransaction, {
  name: 'CURRENCY',
  order: 60,
  type: String,
  read: InvestmentExpenseTransaction.prototype.getCurrencyCode,
  write: InvestmentExpenseTransaction.prototype.setCurrencyCode,
})
Element_add(InvestmentExpenseTransaction, {
  name: 'ORIGCURRENCY',
  order: 70,
  type: OriginalCurrency,
  read: InvestmentExpenseTransaction.prototype.getOriginalCurrencyInfo,
  write: InvestmentExpenseTransaction.prototype.setOriginalCurrencyInfo,
})
Element_add(InvestmentExpenseTransaction, {
  name: 'INV401KSOURCE',
  order: 180,
  type: String,
  read: InvestmentExpenseTransaction.prototype.get401kSource,
  write: InvestmentExpenseTransaction.prototype.set401kSource,
})
