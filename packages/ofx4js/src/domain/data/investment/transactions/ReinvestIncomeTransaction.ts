import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../../meta/ChildAggregate_Add'
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
 * Transaction for reinvestment transactions.
 * @see "Section 13.9.2.4.4, OFX Spec"
 */
export class ReinvestIncomeTransaction extends BaseOtherInvestmentTransaction
  implements TransactionWithSecurity {
  private securityId!: SecurityId
  private incomeType!: string
  private total!: number
  private subAccountSecurity!: string
  private units!: number
  private unitPrice!: number
  private commission!: number
  private taxes!: number
  private fees!: number
  private load!: number
  private taxExempt!: boolean
  private currencyCode?: string
  private originalCurrencyInfo?: OriginalCurrency
  private inv401kSource!: string

  constructor() {
    super(InvestmentTransactionType.REINVEST_INCOME)
  }

  /**
   * Gets the id of the security that was reinvested in. This is a required field according to the
   * OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the security id of the security that was reinvested in
   */
  getSecurityId(): SecurityId {
    return this.securityId
  }

  /**
   * Sets the id of the security that was reinvested in. This is a required field according to the
   * OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param securityId the security id of the security that was reinvested in
   */
  setSecurityId(securityId: SecurityId): void {
    this.securityId = securityId
  }

  /**
   * Gets the type of income. One of "CGLONG" (long term capital gains), "CGSHORT" (short term
   * capital gains), "DIV" (dividend), INTEREST, or MISC. This is a required field according to the
   * OFX spec.
   * @see "Section 13.9.2.4.4, OFX Spec" This is a required field according to the OFX spec.
   *
   * @return the type of income
   */
  getIncomeType(): string {
    return this.incomeType
  }

  /**
   * Sets the type of income. One of "CGLONG" (long term capital gains), "CGSHORT" (short term
   * capital gains), "DIV" (dividend), INTEREST, or MISC. This is a required field according to the
   * OFX spec.
   * @see "Section 13.9.2.4.4, OFX Spec" This is a required field according to the OFX spec.
   *
   * @param incomeType the type of income
   */
  setIncomeType(incomeType: string): void {
    this.incomeType = incomeType
  }

  /**
   * Gets the type of income as one of the well-known types.
   *
   * @return the income type or null if it's not one of the well-known types
   */
  getIncomeTypeEnum(): IncomeType {
    return IncomeType_fromOfx(this.getIncomeType())
  }

  /**
   * Gets the total income received. This is a required field according to the OFX spec.
   * @see "Section 13.9.2.4.4, OFX Spec"
   *
   * @return the total
   */
  getTotal(): number {
    return this.total
  }

  /**
   * Sets the total income received. This is a required field according to the OFX spec.
   * @see "Section 13.9.2.4.4, OFX Spec"
   *
   * @param total the total
   */
  setTotal(total: number): void {
    this.total = total
  }

  /**
   * Gets the sub account type for the security (e.g. CASH, MARGIN, SHORT, OTHER). This is a
   * required field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the sub account type
   */
  getSubAccountSecurity(): string {
    return this.subAccountSecurity
  }

  /**
   * Sets the sub account type for the security (e.g. CASH, MARGIN, SHORT, OTHER). This is a
   * required field according to the OFX spec.
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
   * @return the type of null if it wasn't one of the well known types
   */
  getSubAccountSecurityEnum(): SubAccountType {
    return SubAccountType_fromOfx(this.getSubAccountSecurity())
  }

  /**
   * Gets the number of units of the security that was reinvested in. This is a required field
   * according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the number of units purchased
   */
  getUnits(): number {
    return this.units
  }

  /**
   * Sets the number of units of the security that was reinvested in. This is a required field
   * according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param units the number of units purchased
   */
  setUnits(units: number): void {
    this.units = units
  }

  /**
   * Gets the price per commonly-quoted unit. This is a required field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the per unit price
   */
  getUnitPrice(): number {
    return this.unitPrice
  }

  /**
   * Sets the price per commonly-quoted unit. This is a required field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param unitPrice the per unit price
   */
  setUnitPrice(unitPrice: number): void {
    this.unitPrice = unitPrice
  }

  /**
   * Gets the transaction commission for the reinvestment. This is an optional field according to
   * the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the transaction commision
   */
  getCommission(): number {
    return this.commission
  }

  /**
   * Sets the transaction commission for the reinvestment. This is an optional field according to
   * the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param commission the transaction commision
   */
  setCommission(commission: number): void {
    this.commission = commission
  }

  /**
   * Gets the taxes for the reinvestment. This is an optional field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the transaction taxes
   */
  getTaxes(): number {
    return this.taxes
  }

  /**
   * Sets the taxes for the reinvestment. This is an optional field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param taxes the transaction taxes
   */
  setTaxes(taxes: number): void {
    this.taxes = taxes
  }

  /**
   * Gets the fees for the reinvestment. This is an optional field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the transaction fees
   */
  getFees(): number {
    return this.fees
  }

  /**
   * Sets the fees for the reinvestment. This is an optional field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param fees the transaction fees
   */
  setFees(fees: number): void {
    this.fees = fees
  }

  /**
   * Gets the load for the reinvestment. This is an optional field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the load
   */
  getLoad(): number {
    return this.load
  }

  /**
   * Sets the load for the reinvestment. This is an optional field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param load the load
   */
  setLoad(load: number): void {
    this.load = load
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
   * @return the original currency info for the transaction.
   */
  getOriginalCurrencyInfo(): OriginalCurrency {
    return this.originalCurrencyInfo!
  }

  /**
   * Sets the original currency info for the transaction.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param originalCurrencyInfo the original currency info for the transaction.
   */
  setOriginalCurrencyInfo(originalCurrencyInfo: OriginalCurrency): void {
    this.originalCurrencyInfo = originalCurrencyInfo
    this.currencyCode = undefined
  }

  /**
   * Gets the 401K source for the reinvestment. Should be one of "PRETAX", "AFTERTAX", "MATCH",
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
   * Sets the 401K source for the reinvestment. Should be one of "PRETAX", "AFTERTAX", "MATCH",
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
   * @return the type of close or null if it's not well known
   */
  get401kSourceEnum(): Inv401KSource {
    return Inv401KSource_fromOfx(this.get401kSource())
  }
}

Aggregate_add(ReinvestIncomeTransaction, 'REINVEST')
ChildAggregate_add(ReinvestIncomeTransaction, {
  required: true,
  order: 20,
  type: SecurityId,
  read: ReinvestIncomeTransaction.prototype.getSecurityId,
  write: ReinvestIncomeTransaction.prototype.setSecurityId,
})
Element_add(ReinvestIncomeTransaction, {
  name: 'INCOMETYPE',
  required: true,
  order: 30,
  type: String,
  read: ReinvestIncomeTransaction.prototype.getIncomeType,
  write: ReinvestIncomeTransaction.prototype.setIncomeType,
})
Element_add(ReinvestIncomeTransaction, {
  name: 'TOTAL',
  required: true,
  order: 40,
  type: Number,
  read: ReinvestIncomeTransaction.prototype.getTotal,
  write: ReinvestIncomeTransaction.prototype.setTotal,
})
Element_add(ReinvestIncomeTransaction, {
  name: 'SUBACCTSEC',
  order: 50,
  type: String,
  read: ReinvestIncomeTransaction.prototype.getSubAccountSecurity,
  write: ReinvestIncomeTransaction.prototype.setSubAccountSecurity,
})
Element_add(ReinvestIncomeTransaction, {
  name: 'UNITS',
  required: true,
  order: 60,
  type: Number,
  read: ReinvestIncomeTransaction.prototype.getUnits,
  write: ReinvestIncomeTransaction.prototype.setUnits,
})
Element_add(ReinvestIncomeTransaction, {
  name: 'UNITPRICE',
  required: true,
  order: 70,
  type: Number,
  read: ReinvestIncomeTransaction.prototype.getUnitPrice,
  write: ReinvestIncomeTransaction.prototype.setUnitPrice,
})
Element_add(ReinvestIncomeTransaction, {
  name: 'COMMISSION',
  order: 80,
  type: Number,
  read: ReinvestIncomeTransaction.prototype.getCommission,
  write: ReinvestIncomeTransaction.prototype.setCommission,
})
Element_add(ReinvestIncomeTransaction, {
  name: 'TAXES',
  order: 90,
  type: Number,
  read: ReinvestIncomeTransaction.prototype.getTaxes,
  write: ReinvestIncomeTransaction.prototype.setTaxes,
})
Element_add(ReinvestIncomeTransaction, {
  name: 'FEES',
  order: 100,
  type: Number,
  read: ReinvestIncomeTransaction.prototype.getFees,
  write: ReinvestIncomeTransaction.prototype.setFees,
})
Element_add(ReinvestIncomeTransaction, {
  name: 'LOAD',
  order: 110,
  type: Number,
  read: ReinvestIncomeTransaction.prototype.getLoad,
  write: ReinvestIncomeTransaction.prototype.setLoad,
})
Element_add(ReinvestIncomeTransaction, {
  name: 'TAXEXEMPT',
  order: 120,
  type: Boolean,
  read: ReinvestIncomeTransaction.prototype.getTaxExempt,
  write: ReinvestIncomeTransaction.prototype.setTaxExempt,
})
Element_add(ReinvestIncomeTransaction, {
  name: 'CURRENCY',
  order: 130,
  type: String,
  read: ReinvestIncomeTransaction.prototype.getCurrencyCode,
  write: ReinvestIncomeTransaction.prototype.setCurrencyCode,
})
Element_add(ReinvestIncomeTransaction, {
  name: 'ORIGCURRENCY',
  order: 140,
  type: OriginalCurrency,
  read: ReinvestIncomeTransaction.prototype.getOriginalCurrencyInfo,
  write: ReinvestIncomeTransaction.prototype.setOriginalCurrencyInfo,
})
Element_add(ReinvestIncomeTransaction, {
  name: 'INV401KSOURCE',
  order: 150,
  type: String,
  read: ReinvestIncomeTransaction.prototype.get401kSource,
  write: ReinvestIncomeTransaction.prototype.set401kSource,
})
