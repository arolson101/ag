import { ChildAggregate_add } from '../../../../meta/ChildAggregate_add'
import { BaseInvestmentTransaction } from './BaseInvestmentTransaction'
import { InvestmentTransaction } from './InvestmentTransaction'
import { InvestmentTransactionType } from './TransactionType'

/**
 * Base class for investment transactions that aren't buys or sales..
 * <br>
 * This class exposes a read-only view of the flattened aggregates that are
 * common to all investment transactions as a convenience to application
 * developers who may not find the ofx aggregation model intuitive.
 */
export class BaseOtherInvestmentTransaction extends BaseInvestmentTransaction {
  private investmentTransaction: InvestmentTransaction

  constructor(transactionType: InvestmentTransactionType) {
    super(transactionType)
  }

  /**
   * Gets the {@link InvestmentTransaction} aggregate.
   *
   * @return the {@link InvestmentTransaction} aggregate
   */
  // @Override
  getInvestmentTransaction(): InvestmentTransaction {
    return this.investmentTransaction
  }

  /**
   * Sets the {@link InvestmentTransaction} aggregate.
   *
   * @param investmentTransaction the {@link InvestmentTransaction} aggregate
   */
  setInvestmentTransaction(investmentTransaction: InvestmentTransaction): void {
    this.investmentTransaction = investmentTransaction
  }
}

ChildAggregate_add(BaseOtherInvestmentTransaction, {
  order: 10,
  type: InvestmentTransaction,
  read: BaseOtherInvestmentTransaction.prototype.getInvestmentTransaction,
  write: BaseOtherInvestmentTransaction.prototype.setInvestmentTransaction,
})
