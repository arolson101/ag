import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { Element_add } from '../../../../meta/Element_add'
import { SubAccountType } from '../accounts/SubAccountType'
import { BaseOtherInvestmentTransaction } from './BaseOtherInvestmentTransaction'
import { OriginalCurrency } from './OriginalCurrency'
import { InvestmentTransactionType } from './TransactionType'

/**
 * Transaction for journal security transactions between sub-accounts within the same investment
 * account.
 * @see "Section 13.9.2.4.4, OFX Spec"
 */
export class MarginInterestTransaction extends BaseOtherInvestmentTransaction {
  private total!: number
  private subAccountFund!: string
  private currencyCode?: string
  private originalCurrencyInfo?: OriginalCurrency

  constructor() {
    super(InvestmentTransactionType.MARGIN_INTEREST)
  }

  /**
   * Gets the sub account type the margin interest affects (e.g. CASH, MARGIN, SHORT, OTHER).
   * @see "Section 13.9.2.4.4, OFX Spec"
   *
   * @return the sub account type
   */
  getSubAccountFund(): string {
    return this.subAccountFund!
  }

  /**
   * Sets the sub account type the margin interest affects (e.g. CASH, MARGIN, SHORT, OTHER).
   * @see "Section 13.9.2.4.4, OFX Spec"
   *
   * @param subAccountFund the sub account type
   */
  setSubAccountFund(subAccountFund: string): void {
    this.subAccountFund = subAccountFund
  }

  /**
   * Gets the result of getSubAccountFund as one of the well-known types.
   *
   * @return the type of null if it wasn't one of the well known types.
   */
  getSubAccountFundEnum(): SubAccountType {
    const type: string | undefined = this.getSubAccountFund()
    return type ? SubAccountType[type as any] : (null as any)
  }

  /**
   * Gets the total for the transaction.
   * @see "Section 13.9.2.4.4, OFX Spec"
   *
   * @return the total
   */
  getTotal(): number {
    return this.total
  }

  /**
   * Sets the total for the transaction.
   * @see "Section 13.9.2.4.4, OFX Spec"
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
    return this.currencyCode!
  }

  /**
   * Sets the currency code for the transaction. Only one of currency code or original currency
   * info should be set according to the OFX spec. If neither are set, means the default currency.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param currencyCode the currency code for the transaction.
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
   * @param originalCurrency the original currency info for the transaction.
   */
  setOriginalCurrencyInfo(originalCurrency: OriginalCurrency): void {
    this.originalCurrencyInfo = originalCurrency
    this.currencyCode = undefined
  }
}

Aggregate_add(MarginInterestTransaction, 'MARGININTEREST')
Element_add(MarginInterestTransaction, {
  name: 'SUBACCTFUND',
  order: 30,
  type: String,
  read: MarginInterestTransaction.prototype.getSubAccountFund,
  write: MarginInterestTransaction.prototype.setSubAccountFund,
})
Element_add(MarginInterestTransaction, {
  name: 'TOTAL',
  order: 40,
  type: Number,
  read: MarginInterestTransaction.prototype.getTotal,
  write: MarginInterestTransaction.prototype.setTotal,
})
Element_add(MarginInterestTransaction, {
  name: 'CURRENCY',
  order: 110,
  type: String,
  read: MarginInterestTransaction.prototype.getCurrencyCode,
  write: MarginInterestTransaction.prototype.setCurrencyCode,
})
Element_add(MarginInterestTransaction, {
  name: 'ORIGCURRENCY',
  order: 120,
  type: OriginalCurrency,
  read: MarginInterestTransaction.prototype.getOriginalCurrencyInfo,
  write: MarginInterestTransaction.prototype.setOriginalCurrencyInfo,
})
