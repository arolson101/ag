import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { BaseBuyInvestmentTransaction } from './BaseBuyInvestmentTransaction'
import { InvestmentTransactionType } from './TransactionType'

/**
 * Transaction for buying other types of securities.
 * @see "Section 13.9.2.4.4, OFX Spec"
 */
export class BuyOtherTransaction extends BaseBuyInvestmentTransaction {
  constructor() {
    super(InvestmentTransactionType.BUY_OTHER)
  }
}

Aggregate_add(BuyOtherTransaction, 'BUYOTHER')
