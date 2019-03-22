import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../../meta/ChildAggregate_add'
import { Element_add } from '../../../../meta/Element_add'
import { SecurityId } from '../../seclist/SecurityId'
import { SubAccountType, SubAccountType_fromOfx } from '../accounts/SubAccountType'
import { InvestmentTransaction } from './InvestmentTransaction'
import { OriginalCurrency } from './OriginalCurrency'

/**
 * Buy investment transaction aggregate ("INVBUY").
 * @see "Section 13.9.2.4.3, OFX Spec"
 */
export class BuyInvestmentTransaction {
  private investmentTransaction: InvestmentTransaction
  private securityId: SecurityId
  private units: number
  private unitPrice: number
  private markup: number
  private commission: number
  private taxes: number
  private fees: number
  private load: number
  private total: number
  private currencyCode: string
  private originalCurrencyInfo: OriginalCurrency
  private subAccountSecurity: string
  private subAccountFund: string

  /**
   * Gets the investment transaction child aggregate.
   *
   * @return the investment transaction child aggregate
   */
  getInvestmentTransaction(): InvestmentTransaction {
    return this.investmentTransaction
  }

  /**
   * Sets the investment transaction child aggregate.
   *
   * @param investmentTransaction the investment transaction child aggregate
   */
  setInvestmentTransaction(investmentTransaction: InvestmentTransaction): void {
    this.investmentTransaction = investmentTransaction
  }

  /**
   * Gets the id of the security that was bought. This is a required field according to the OFX
   * spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the security id of the security that was bought
   */
  getSecurityId(): SecurityId {
    return this.securityId
  }

  /**
   * Sets the id of the security that was bought. This is a required field according to the OFX
   * spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param securityId the security id of the security that was bought
   */
  setSecurityId(securityId: SecurityId): void {
    this.securityId = securityId
  }

  /**
   * Gets the number of units of the security that was bought. For security-based actions other
   * than stock splits, this is the quantity bought. For stocks, mutual funds, and others, this
   * is the number of shares. For bonds, this is the face value. For options, this is the number of
   * contacts. This is a required field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the number of units purchased.
   */
  getUnits(): number {
    return this.units
  }

  /**
   * Sets the number of units of the security that was bought. For security-based actions other
   * than stock splits, this is the quantity bought. For stocks, mutual funds, and others, this
   * is the number of shares. For bonds, this is the face value. For options, this is the number of
   * contacts. This is a required field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param units the number of units purchased.
   */
  setUnits(units: number): void {
    this.units = units
  }

  /**
   * Gets the price per commonly-quoted unit. For stocks, mutual funds, and others, this is the
   * share price. For bonds, this is the percentage of par. For options, this is the per share (not
   * per contact) price. This is a required field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the per unit price
   */
  getUnitPrice(): number {
    return this.unitPrice
  }

  /**
   * Sets the price per commonly-quoted unit. For stocks, mutual funds, and others, this is the
   * share price. For bonds, this is the percentage of par. For options, this is the per share (not
   * per contact) price. This is a required field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param unitPrice the per unit price
   */
  setUnitPrice(unitPrice: number): void {
    this.unitPrice = unitPrice
  }

  /**
   * Gets the portion of the unit price that is attributed to the dealer markup. This is an
   * optional field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the per unit markeup price
   */
  getMarkup(): number {
    return this.markup
  }

  /**
   * Sets the portion of the unit price that is attributed to the dealer markup. This is an
   * optional field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param markup the per unit markeup price
   */
  setMarkup(markup: number): void {
    this.markup = markup
  }

  /**
   * Gets the transaction commission for the purchase. This is an optional field according to the
   * OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the transaction commision
   */
  getCommission(): number {
    return this.commission
  }

  /**
   * Sets the transaction commission for the purchase. This is an optional field according to the
   * OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param commission the transaction commision
   */
  setCommission(commission: number): void {
    this.commission = commission
  }

  /**
   * Gets the taxes for the purchase. This is an optional field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the transaction taxes
   */
  getTaxes(): number {
    return this.taxes
  }

  /**
   * Sets the taxes for the purchase. This is an optional field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param taxes the transaction taxes
   */
  setTaxes(taxes: number): void {
    this.taxes = taxes
  }

  /**
   * Gets the fees for the purchase. This is an optional field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the transaction fees
   */
  getFees(): number {
    return this.fees
  }

  /**
   * Sets the fees for the purchase. This is an optional field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param fees the transaction fees
   */
  setFees(fees: number): void {
    this.fees = fees
  }

  /**
   * Gets the load for the purchase. This is an optional field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the load
   */
  getLoad(): number {
    return this.load
  }

  /**
   * Sets the load for the purchase. This is an optional field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param load the load
   */
  setLoad(load: number): void {
    this.load = load
  }

  /**
   * Gets the total for the purchase. Should be equal to
   * (units * (unitPrice + markup)) + (commision + fees + taxes) according to the OFX
   * spec. This is a required field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the total
   */
  getTotal(): number {
    return this.total
  }

  /**
   * Sets the total for the purchase. Should be equal to
   * (units * (unitPrice + markup)) + (commision + fees + taxes) according to the OFX
   * spec. This is a required field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param total the total
   */
  setTotal(total: number): void {
    this.total = total
  }

  /**
   * Gets the currency code for the transaction. Only one of currency code or original currency
   * info should be set according to the OFX spec. If neither are set, means the default currency.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the currency code for the transaction.
   */
  getCurrencyCode(): string {
    return this.currencyCode
  }

  /**
   * Sets the currency code for the transaction. Only one of currency code or original currency
   * info may be set according to the OFX spec. If neither are set, means the default currency.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param currencyCode the currency code for the transaction.
   */
  setCurrencyCode(currencyCode: string): void {
    this.currencyCode = currencyCode
    this.originalCurrencyInfo = null
  }

  /**
   * Gets the original currency info for the transaction.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the original currency info for the transaction
   */
  getOriginalCurrencyInfo(): OriginalCurrency {
    return this.originalCurrencyInfo
  }

  /**
   * Sets the original currency info for the transaction
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param originalCurrencyInfo the original currency info for the transaction
   */
  setOriginalCurrencyInfo(originalCurrencyInfo: OriginalCurrency): void {
    this.originalCurrencyInfo = originalCurrencyInfo
    this.currencyCode = null
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
   * Gets the sub account type that the money came from. (e.g. CASH, MARGIN, SHORT, OTHER).
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the sub account fund
   */
  getSubAccountFund(): string {
    return this.subAccountFund
  }

  /**
   * Sets the sub account type that the money came from. (e.g. CASH, MARGIN, SHORT, OTHER).
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param subAcctFund the sub account fund
   */
  setSubAccountFund(subAcctFund: string): void {
    this.subAccountFund = subAcctFund
  }

  /**
   * Gets the result of getSubAccountFund as one of the well-known types.
   *
   * @return the type or null if it wasn't one of the well known types.
   */
  getSubAccountFundEnum(): SubAccountType {
    return SubAccountType_fromOfx(this.getSubAccountFund())
  }
}

Aggregate_add(BuyInvestmentTransaction, 'INVBUY')
ChildAggregate_add(BuyInvestmentTransaction, {
  order: 10,
  type: InvestmentTransaction,
  read: BuyInvestmentTransaction.prototype.getInvestmentTransaction,
  write: BuyInvestmentTransaction.prototype.setInvestmentTransaction,
})
ChildAggregate_add(BuyInvestmentTransaction, {
  required: true,
  order: 20,
  type: SecurityId,
  read: BuyInvestmentTransaction.prototype.getSecurityId,
  write: BuyInvestmentTransaction.prototype.setSecurityId,
})
Element_add(BuyInvestmentTransaction, {
  name: 'UNITS',
  required: true,
  order: 30,
  type: Number,
  read: BuyInvestmentTransaction.prototype.getUnits,
  write: BuyInvestmentTransaction.prototype.setUnits,
})
Element_add(BuyInvestmentTransaction, {
  name: 'UNITPRICE',
  required: true,
  order: 40,
  type: Number,
  read: BuyInvestmentTransaction.prototype.getUnitPrice,
  write: BuyInvestmentTransaction.prototype.setUnitPrice,
})
Element_add(BuyInvestmentTransaction, {
  name: 'MARKUP',
  order: 50,
  type: Number,
  read: BuyInvestmentTransaction.prototype.getMarkup,
  write: BuyInvestmentTransaction.prototype.setMarkup,
})
Element_add(BuyInvestmentTransaction, {
  name: 'COMMISSION',
  order: 60,
  type: Number,
  read: BuyInvestmentTransaction.prototype.getCommission,
  write: BuyInvestmentTransaction.prototype.setCommission,
})
Element_add(BuyInvestmentTransaction, {
  name: 'TAXES',
  order: 70,
  type: Number,
  read: BuyInvestmentTransaction.prototype.getTaxes,
  write: BuyInvestmentTransaction.prototype.setTaxes,
})
Element_add(BuyInvestmentTransaction, {
  name: 'FEES',
  order: 80,
  type: Number,
  read: BuyInvestmentTransaction.prototype.getFees,
  write: BuyInvestmentTransaction.prototype.setFees,
})
Element_add(BuyInvestmentTransaction, {
  name: 'LOAD',
  order: 90,
  type: Number,
  read: BuyInvestmentTransaction.prototype.getLoad,
  write: BuyInvestmentTransaction.prototype.setLoad,
})
Element_add(BuyInvestmentTransaction, {
  name: 'TOTAL',
  required: true,
  order: 100,
  type: Number,
  read: BuyInvestmentTransaction.prototype.getTotal,
  write: BuyInvestmentTransaction.prototype.setTotal,
})
Element_add(BuyInvestmentTransaction, {
  name: 'CURRENCY',
  order: 110,
  type: String,
  read: BuyInvestmentTransaction.prototype.getCurrencyCode,
  write: BuyInvestmentTransaction.prototype.setCurrencyCode,
})
ChildAggregate_add(BuyInvestmentTransaction, {
  order: 120,
  type: OriginalCurrency,
  read: BuyInvestmentTransaction.prototype.getOriginalCurrencyInfo,
  write: BuyInvestmentTransaction.prototype.setOriginalCurrencyInfo,
})
Element_add(BuyInvestmentTransaction, {
  name: 'SUBACCTSEC',
  order: 130,
  type: String,
  read: BuyInvestmentTransaction.prototype.getSubAccountSecurity,
  write: BuyInvestmentTransaction.prototype.setSubAccountSecurity,
})
Element_add(BuyInvestmentTransaction, {
  name: 'SUBACCTFUND',
  order: 140,
  type: String,
  read: BuyInvestmentTransaction.prototype.getSubAccountFund,
  write: BuyInvestmentTransaction.prototype.setSubAccountFund,
})
