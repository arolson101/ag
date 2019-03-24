import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_Add'
import { Element_add } from '../../../meta/Element_add'
import { SecurityId } from './SecurityId'

/**
 * Info about a security.
 * @see "Section 13.8.5.1, OFX Spec"
 */
export class SecurityInfo {
  private securityId!: SecurityId
  private securityName!: string
  private tickerSymbol!: string
  private fiId!: string
  private rating!: string
  private unitPrice!: number
  private marketValueDate!: Date
  private currencyCode!: string
  private memo!: string

  /**
   * Gets the unique security id for the security. This is a required field according to the OFX
   * spec.
   *
   * @return the security id
   */
  getSecurityId(): SecurityId {
    return this.securityId
  }

  /**
   * Sets the unique security id for the security. This is a required field according to the OFX
   * spec.
   *
   * @param securityId the security id
   */
  setSecurityId(securityId: SecurityId): void {
    this.securityId = securityId
  }

  /**
   * Gets the full name of the security. This is a required field according to the OFX spec.
   *
   * @return the full name of the security
   */
  getSecurityName(): string {
    return this.securityName
  }

  /**
   * Sets the full name of the security. This is a required field according to the OFX spec.
   *
   * @param securityName the full name of the security
   */
  setSecurityName(securityName: string): void {
    this.securityName = securityName
  }

  /**
   * Gets the ticker symbol for the security. This is an optional field according to the OFX spec.
   *
   * @return the ticket symbol or null if there's no ticker symbol
   */
  getTickerSymbol(): string {
    return this.tickerSymbol
  }

  /**
   * Sets the ticker symbol for the security. This is an optional field according to the OFX spec.
   *
   * @param tickerSymbol the ticket symbol or null if there's no ticker symbol
   */
  setTickerSymbol(tickerSymbol: string): void {
    this.tickerSymbol = tickerSymbol
  }

  /**
   * Gets the FI ID number for the security. This is an optional field according to the OFX spec.
   *
   * @return the FI ID number for the security
   */
  getFiId(): string {
    return this.fiId
  }

  /**
   * Sets the FI ID number for the security. This is an optional field according to the OFX spec.
   *
   * @param fiId the FI ID number for the security
   */
  setFiId(fiId: string): void {
    this.fiId = fiId
  }

  /**
   * Gets the rating of the security. This is an optional field according to the OFX spec.
   *
   * @return the rating
   */
  getRating(): string {
    return this.rating
  }

  /**
   * Sets the rating of the security. This is an optional field according to the OFX spec.
   *
   * @param rating the rating
   */
  setRating(rating: string): void {
    this.rating = rating
  }

  /**
   * Gets the price per commonly-quoted unit. For stocks, mutual funds, and others, this is the
   * share price. For bonds, this is the percentage of par. For options, this is the per share (not
   * per contact) price. This is a noptional field according to the OFX spec.
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
   * per contact) price. This is an optional field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param unitPrice the per unit price
   */
  setUnitPrice(unitPrice: number): void {
    this.unitPrice = unitPrice
  }

  /**
   * Gets the date as-of for the unit price. This is an optional field according to the OFX spec.
   *
   * @return the date as-of for the unit price
   */
  getUnitPriceAsOfDate(): Date {
    return this.marketValueDate
  }

  /**
   * Sets the date as-of for the unit price. This is an optional field according to the OFX spec.
   *
   * param marketValueDate the date as-of for the unit price
   */
  setUnitPriceAsOfDate(marketValueDate: Date): void {
    this.marketValueDate = marketValueDate
  }

  /**
   * Gets the overriding currency code for the security. If not set, implies the default currency.
   * This is an optional field according to the OFX spec.
   *
   * @return the overriding currency code or null to mean the default currency
   */
  getCurrencyCode(): string {
    return this.currencyCode
  }

  /**
   * Sets the overriding currency code for the security. If not set, implies the default currency.
   * This is an optional field according to the OFX spec.
   *
   * @param currencyCode the overriding currency code or null to mean the default currency
   */
  setCurrencyCode(currencyCode: string): void {
    this.currencyCode = currencyCode
  }

  /**
   * Gets any memo associated with the security. This is an optional field according to the OFX
   * spec.
   *
   * @return the memo
   */
  getMemo(): string {
    return this.memo
  }

  /**
   * Sets any memo associated with the security. This is an optional field according to the OFX
   * spec.
   *
   * @param memo the memo
   */
  setMemo(memo: string): void {
    this.memo = memo
  }
}

Aggregate_add(SecurityInfo, 'SECINFO')
ChildAggregate_add(SecurityInfo, {
  required: true,
  order: 10,
  type: SecurityId,
  read: SecurityInfo.prototype.getSecurityId,
  write: SecurityInfo.prototype.setSecurityId,
})
Element_add(SecurityInfo, {
  name: 'SECNAME',
  required: true,
  order: 20,
  type: String,
  read: SecurityInfo.prototype.getSecurityName,
  write: SecurityInfo.prototype.setSecurityName,
})
Element_add(SecurityInfo, {
  name: 'TICKER',
  order: 30,
  type: String,
  read: SecurityInfo.prototype.getTickerSymbol,
  write: SecurityInfo.prototype.setTickerSymbol,
})
Element_add(SecurityInfo, {
  name: 'FIID',
  order: 40,
  type: String,
  read: SecurityInfo.prototype.getFiId,
  write: SecurityInfo.prototype.setFiId,
})
Element_add(SecurityInfo, {
  name: 'RATING',
  order: 50,
  type: String,
  read: SecurityInfo.prototype.getRating,
  write: SecurityInfo.prototype.setRating,
})
Element_add(SecurityInfo, {
  name: 'UNITPRICE',
  order: 60,
  type: Number,
  read: SecurityInfo.prototype.getUnitPrice,
  write: SecurityInfo.prototype.setUnitPrice,
})
Element_add(SecurityInfo, {
  name: 'DTASOF',
  order: 70,
  type: Date,
  read: SecurityInfo.prototype.getUnitPriceAsOfDate,
  write: SecurityInfo.prototype.setUnitPriceAsOfDate,
})
Element_add(SecurityInfo, {
  name: 'CURRENCY',
  order: 80,
  type: String,
  read: SecurityInfo.prototype.getCurrencyCode,
  write: SecurityInfo.prototype.setCurrencyCode,
})
Element_add(SecurityInfo, {
  name: 'MEMO',
  order: 90,
  type: String,
  read: SecurityInfo.prototype.getMemo,
  write: SecurityInfo.prototype.setMemo,
})
