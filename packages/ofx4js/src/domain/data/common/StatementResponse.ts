import { AccountStatement } from '../../../client/AccountStatement'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { Element_add } from '../../../meta/Element_add'
import { ResponseMessage } from '../ResponseMessage'
import { BalanceInfo } from './BalanceInfo'
import { TransactionList } from './TransactionList'

// import java.util.Locale;

export abstract class StatementResponse extends ResponseMessage implements AccountStatement {
  private currencyCode!: string
  private transactionList!: TransactionList
  private ledgerBalance!: BalanceInfo
  private availableBalance!: BalanceInfo
  private marketingInfo!: string

  constructor() {
    super()
    // java.util.Currency.getInstance(Locale.US).getCurrencyCode().toUpperCase();
    this.currencyCode = 'USD'
  }

  /**
   * The currency code.
   *
   * @return The currency code.
   * @see java.util.Currency#getCurrencyCode()
   */
  getCurrencyCode(): string {
    return this.currencyCode
  }

  /**
   * The currency code.
   *
   * @param currencyCode The currency code.
   */
  setCurrencyCode(currencyCode: string): void {
    this.currencyCode = currencyCode
  }

  /**
   * The transaction list.
   *
   * @return The transaction list.
   */
  getTransactionList(): TransactionList {
    return this.transactionList
  }

  /**
   * The transaction list.
   *
   * @param transactionList The transaction list.
   */
  setTransactionList(transactionList: TransactionList): void {
    this.transactionList = transactionList
  }

  /**
   * The ledger balance.
   *
   * @return The ledger balance.
   */
  getLedgerBalance(): BalanceInfo {
    return this.ledgerBalance
  }

  /**
   * The ledger balance.
   *
   * @param ledgerBalance The ledger balance.
   */
  setLedgerBalance(ledgerBalance: BalanceInfo): void {
    this.ledgerBalance = ledgerBalance
  }

  /**
   * The available balance.
   *
   * @return The available balance.
   */
  getAvailableBalance(): BalanceInfo {
    return this.availableBalance
  }

  /**
   * The available balance.
   *
   * @param availableBalance The available balance.
   */
  setAvailableBalance(availableBalance: BalanceInfo): void {
    this.availableBalance = availableBalance
  }

  /**
   * Marketing information. (?)
   *
   * @return Marketing information.
   */
  getMarketingInfo(): string {
    return this.marketingInfo
  }

  /**
   * Marketing information. (?)
   *
   * @param marketingInfo Marketing information.
   */
  setMarketingInfo(marketingInfo: string): void {
    this.marketingInfo = marketingInfo
  }
}

Element_add(StatementResponse, {
  name: 'CURDEF',
  required: true,
  order: 0,
  type: String,
  read: StatementResponse.prototype.getCurrencyCode,
  write: StatementResponse.prototype.setCurrencyCode,
})
ChildAggregate_add(StatementResponse, {
  order: 20,
  type: TransactionList,
  read: StatementResponse.prototype.getTransactionList,
  write: StatementResponse.prototype.setTransactionList,
})
ChildAggregate_add(StatementResponse, {
  name: 'LEDGERBAL',
  order: 30,
  type: BalanceInfo,
  read: StatementResponse.prototype.getLedgerBalance,
  write: StatementResponse.prototype.setLedgerBalance,
})
ChildAggregate_add(StatementResponse, {
  name: 'AVAILBAL',
  order: 40,
  type: BalanceInfo,
  read: StatementResponse.prototype.getAvailableBalance,
  write: StatementResponse.prototype.setAvailableBalance,
})
Element_add(StatementResponse, {
  name: 'MKTGINFO',
  order: 50,
  type: String,
  read: StatementResponse.prototype.getMarketingInfo,
  write: StatementResponse.prototype.setMarketingInfo,
})
