import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../../meta/ChildAggregate_add'
import { Element_add } from '../../../../meta/Element_add'
import { SecurityId } from '../../seclist/SecurityId'
import { SubAccountType, SubAccountType_fromOfx } from '../accounts/SubAccountType'
import { Inv401KSource, Inv401KSource_fromOfx } from './Inv401KSource'
import { PositionType, PositionType_fromOfx } from './PositionType'

/**
 * Class for the investment position aggregate.
 * @see "Section 13.9.2.6.1, OFX Spec"
 */
export class InvestmentPosition {
  private securityId: SecurityId
  private heldInAccount: string
  private positionType: string
  private units: number
  private unitPrice: number
  private marketValue: number
  private marketValueDate: Date
  private currencyCode: string
  private memo: string
  private inv401kSource: string

  /**
   * Gets the security id for the position. This is a required field according to the OFX spec.
   * @see "Section 13.9.2.6.1, OFX Spec"
   *
   * @return the security id for the position
   */
  getSecurityId(): SecurityId {
    return this.securityId
  }

  /**
   * Sets the security id for the position. This is a required field according to the OFX spec.
   * @see "Section 13.9.2.6.1, OFX Spec"
   *
   * @param securityId the security id for the position
   */
  setSecurityId(securityId: SecurityId): void {
    this.securityId = securityId
  }

  /**
   * Gets the sub-account type. One of "CASH", "MARGIN", "SHORT", "OTHER". This is a required field
   * according to the OFX spec.
   * @see "Section 13.9.2.6.1, OFX Spec"
   *
   * @return the sub-account type
   */
  getHeldInAccount(): string {
    return this.heldInAccount
  }

  /**
   * Sets the sub-account type. One of "CASH", "MARGIN", "SHORT", "OTHER". This is a required field
   * according to the OFX spec.
   * @see "Section 13.9.2.6.1, OFX Spec"
   *
   * @param heldInAccount the sub-account type
   */
  setHeldInAccount(heldInAccount: string): void {
    this.heldInAccount = heldInAccount
  }

  /**
   * Gets the sub-account type as one of the well-known types.
   * @see "Section 13.9.2.6.1, OFX Spec"
   *
   * @return the sub-account type or null if it's not one of the well-known types
   */
  getHeldInAccountEnum(): SubAccountType {
    return SubAccountType_fromOfx(this.getHeldInAccount())
  }

  /**
   * Gets the position type. One of SHORT or LONG. This is a required field according to the OFX
   * spec.
   * @see "Section 13.9.2.6.1, OFX Spec"
   *
   * @return the position type
   */
  getPositionType(): string {
    return this.positionType
  }

  /**
   * Sets the position type. One of SHORT or LONG. This is a required field according to the OFX
   * spec.
   * @see "Section 13.9.2.6.1, OFX Spec"
   *
   * @param positionType the position type
   */
  setPositionType(positionType: string): void {
    this.positionType = positionType
  }

  /**
   * Gets the position type as one of the well-known types.
   * @see "Section 13.9.2.6.1, OFX Spec"
   *
   * @return the position type or null if it's not one of the well-known types
   */
  getPositionTypeEnum(): PositionType {
    return PositionType_fromOfx(this.getPositionType())
  }

  /**
   * Gets the number of units in the position. For stocks, mutual funds, and others, this
   * is the number of shares. For bonds, this is the face value. For options, this is the number of
   * contacts. This is a required field according to the OFX spec.
   * @see "Section 13.9.2.6.1, OFX Spec"
   *
   * @return the number of units in the position
   */
  getUnits(): number {
    return this.units
  }

  /**
   * Sets the number of units in the position. For stocks, mutual funds, and others, this
   * is the number of shares. For bonds, this is the face value. For options, this is the number of
   * contacts. This is a required field according to the OFX spec.
   * @see "Section 13.9.2.6.1, OFX Spec"
   *
   * @param units the number of units in the position
   */
  setUnits(units: number): void {
    this.units = units
  }

  /**
   * Gets the price per commonly-quoted unit. For stocks, mutual funds, and others, this is the
   * share price. For bonds, this is the percentage of par. For options, this is the per share (not
   * per contact) price. This is a required field according to the OFX spec.
   * @see "Section 13.9.2.6.1, OFX Spec"
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
   * @see "Section 13.9.2.6.1, OFX Spec"
   *
   * @param unitPrice the per unit price
   */
  setUnitPrice(unitPrice: number): void {
    this.unitPrice = unitPrice
  }

  /**
   * Gets the market value of this position. This is a required field according to the OFX spec.
   * @see "Section 13.9.2.6.1, OFX Spec"
   *
   * @return the market value of the position
   */
  getMarketValue(): number {
    return this.marketValue
  }

  /**
   * Sets the market value of this position. This is a required field according to the OFX spec.
   * @see "Section 13.9.2.6.1, OFX Spec"
   *
   * @param marketValue the market value of the position
   */
  setMarketValue(marketValue: number): void {
    this.marketValue = marketValue
  }

  /**
   * Gets the date and time of the unit price and market value. This is a required field according
   * to the OFX spec.
   * @see "Section 13.9.2.6.1, OFX Spec"
   *
   * @return the market value date
   */
  getMarketValueDate(): Date {
    return this.marketValueDate
  }

  /**
   * Sets the date and time of the unit price and market value. This is a required field according
   * to the OFX spec.
   * @see "Section 13.9.2.6.1, OFX Spec"
   *
   * @param marketValueDate the market value date
   */
  setMarketValueDate(marketValueDate: Date): void {
    this.marketValueDate = marketValueDate
  }

  /**
   * Gets the currency code of the position. This is an optional field according to the OFX spec.
   * If not present, it's the default currency of the account.
   * @see "Section 13.9.2.6.1, OFX Spec"
   *
   * @return the currency code of the position or null for the default currency
   */
  getCurrencyCode(): string {
    return this.currencyCode
  }

  /**
   * Sets the currency code of the position. This is an optional field according to the OFX spec.
   * If not present, it's the default currency of the account.
   * @see "Section 13.9.2.6.1, OFX Spec"
   *
   * @param currencyCode the currency code of the position or null for the default currency
   */
  setCurrencyCode(currencyCode: string): void {
    this.currencyCode = currencyCode
  }

  /**
   * Gets the memo associated with the position. This is an optional field according to the OFX
   * spec.
   * @see "Section 13.9.2.6.1, OFX Spec"
   *
   * @return the memo
   */
  getMemo(): string {
    return this.memo
  }

  /**
   * Sets the memo associated with the position. This is an optional field according to the OFX
   * spec.
   * @see "Section 13.9.2.6.1, OFX Spec"
   *
   * @param memo the memo
   */
  setMemo(memo: string): void {
    this.memo = memo
  }

  /**
   * Gets the 401K source for the sale. Should be one of "PRETAX", "AFTERTAX", "MATCH",
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
   * Sets the 401K source for the sale. Should be one of "PRETAX", "AFTERTAX", "MATCH",
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
   * @return the 401k source or null if it's not one of the well-known types
   */
  get401kSourceEnum(): Inv401KSource {
    return Inv401KSource_fromOfx(this.get401kSource())
  }
}

Aggregate_add(InvestmentPosition, 'INVPOS')
ChildAggregate_add(InvestmentPosition, {
  required: true,
  order: 10,
  type: SecurityId,
  read: InvestmentPosition.prototype.getSecurityId,
  write: InvestmentPosition.prototype.setSecurityId,
})
Element_add(InvestmentPosition, {
  name: 'HELDINACCT',
  required: true,
  order: 20,
  type: String,
  read: InvestmentPosition.prototype.getHeldInAccount,
  write: InvestmentPosition.prototype.setHeldInAccount,
})
Element_add(InvestmentPosition, {
  name: 'POSTYPE',
  required: true,
  order: 30,
  type: String,
  read: InvestmentPosition.prototype.getPositionType,
  write: InvestmentPosition.prototype.setPositionType,
})
Element_add(InvestmentPosition, {
  name: 'UNITS',
  required: true,
  order: 40,
  type: Number,
  read: InvestmentPosition.prototype.getUnits,
  write: InvestmentPosition.prototype.setUnits,
})
Element_add(InvestmentPosition, {
  name: 'UNITPRICE',
  required: true,
  order: 50,
  type: Number,
  read: InvestmentPosition.prototype.getUnitPrice,
  write: InvestmentPosition.prototype.setUnitPrice,
})
Element_add(InvestmentPosition, {
  name: 'MKTVAL',
  required: true,
  order: 60,
  type: Number,
  read: InvestmentPosition.prototype.getMarketValue,
  write: InvestmentPosition.prototype.setMarketValue,
})
Element_add(InvestmentPosition, {
  name: 'DTPRICEASOF',
  required: true,
  order: 70,
  type: Date,
  read: InvestmentPosition.prototype.getMarketValueDate,
  write: InvestmentPosition.prototype.setMarketValueDate,
})
Element_add(InvestmentPosition, {
  name: 'CURRENCY',
  order: 80,
  type: String,
  read: InvestmentPosition.prototype.getCurrencyCode,
  write: InvestmentPosition.prototype.setCurrencyCode,
})
Element_add(InvestmentPosition, {
  name: 'MEMO',
  order: 90,
  type: String,
  read: InvestmentPosition.prototype.getMemo,
  write: InvestmentPosition.prototype.setMemo,
})
Element_add(InvestmentPosition, {
  name: 'INV401KSOURCE',
  order: 100,
  type: String,
  read: InvestmentPosition.prototype.get401kSource,
  write: InvestmentPosition.prototype.set401kSource,
})
