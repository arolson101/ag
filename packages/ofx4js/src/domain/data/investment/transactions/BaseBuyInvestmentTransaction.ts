import { ChildAggregate_add } from '../../../../meta/ChildAggregate_add'
import { SecurityId } from '../../seclist/SecurityId'
import { SubAccountType, SubAccountType_fromOfx } from '../accounts/SubAccountType'
import { BaseInvestmentTransaction } from './BaseInvestmentTransaction'
import { BuyInvestmentTransaction } from './BuyInvestmentTransaction'
import { InvestmentTransaction } from './InvestmentTransaction'
import { OriginalCurrency } from './OriginalCurrency'
import { InvestmentTransactionType } from './TransactionType'
import { TransactionWithSecurity } from './TransactionWithSecurity'

/**
 * Base class for all investment transactions for buying securities.
 * <br>
 * This class exposes a read-only view of the flattened aggregates that are
 * common to all buy investment transactions as a convenience to application
 * developers who may not find the ofx aggregation model intuitive.
 */
export abstract class BaseBuyInvestmentTransaction extends BaseInvestmentTransaction
  implements TransactionWithSecurity {
  private buyInvestment!: BuyInvestmentTransaction

  constructor(transactionType: InvestmentTransactionType) {
    super(transactionType)
  }

  /**
   * Gets the buy investment transaction child aggregate.
   *
   * @return the buy investment transaction child aggregate
   */
  getBuyInvestment(): BuyInvestmentTransaction {
    return this.buyInvestment
  }

  /**
   * Sets the buy investment transaction child aggregate.
   *
   * @param buyInvestment the buy investment transaction child aggregate
   */
  setBuyInvestment(buyInvestment: BuyInvestmentTransaction): void {
    this.buyInvestment = buyInvestment
  }

  /**
   * Gets the investment transaction aggregate.
   *
   * @return the investment transaction aggregate
   */
  // @Overridden
  getInvestmentTransaction(): InvestmentTransaction {
    return this.getBuyInvestment().getInvestmentTransaction()
  }

  /**
   * Gets the id of the security that was bought. This is a required field according to the OFX
   * spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the security id of the security that was bought
   */
  getSecurityId(): SecurityId {
    return this.getBuyInvestment().getSecurityId()
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
    return this.getBuyInvestment().getUnits()
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
    return this.getBuyInvestment().getUnitPrice()
  }

  /**
   * Gets the portion of the unit price that is attributed to the dealer markup. This is an
   * optional field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the per unit markeup price
   */
  getMarkup(): number {
    return this.getBuyInvestment().getMarkup()
  }

  /**
   * Gets the transaction commission for the purchase. This is an optional field according to the
   * OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the transaction commision
   */
  getCommission(): number {
    return this.getBuyInvestment().getCommission()
  }

  /**
   * Gets the taxes for the purchase. This is an optional field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the transaction taxes
   */
  getTaxes(): number {
    return this.getBuyInvestment().getTaxes()
  }

  /**
   * Gets the fees for the purchase. This is an optional field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the transaction fees
   */
  getFees(): number {
    return this.getBuyInvestment().getFees()
  }

  /**
   * Gets the load for the purchase. This is an optional field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the load
   */
  getLoad(): number {
    return this.getBuyInvestment().getLoad()
  }

  /**
   * Gets the total for the purchase. Should be equal to
   * (units * (unitPrice + markup)) + (commision + fees + load + taxes) according to the OFX
   * spec. This is a required field according to the OFX spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the total
   */
  getTotal(): number {
    return this.getBuyInvestment().getTotal()
  }

  /**
   * Gets the currency code for the transaction. Only one of currency code or original currency
   * info should be set according to the OFX spec. If neither are set, means the default currency.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the currency code for the transaction
   */
  getCurrencyCode(): string {
    return this.getBuyInvestment().getCurrencyCode()
  }

  /**
   * Gets the original currency info for the transaction.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the original currency info for the transaction
   */
  getOriginalCurrencyInfo(): OriginalCurrency {
    return this.getBuyInvestment().getOriginalCurrencyInfo()
  }

  /**
   * Gets the sub account type for the security (e.g. CASH, MARGIN, SHORT, OTHER).
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the sub account type
   */
  getSubAccountSecurity(): string {
    return this.getBuyInvestment().getSubAccountSecurity()
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
   * Gets the sub account type that the money came from. (e.g. CASH, MARGIN, SHORT, OTHER).
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the sub account fund
   */
  getSubAccountFund(): string {
    return this.getBuyInvestment().getSubAccountFund()
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

ChildAggregate_add(BaseBuyInvestmentTransaction, {
  order: 10,
  type: BuyInvestmentTransaction,
  read: BaseBuyInvestmentTransaction.prototype.getBuyInvestment,
  write: BaseBuyInvestmentTransaction.prototype.setBuyInvestment,
})
