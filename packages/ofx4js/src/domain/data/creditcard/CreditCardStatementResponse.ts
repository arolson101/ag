import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_Add'
import { StatementResponse } from '../common/StatementResponse'
import { CreditCardAccountDetails } from './CreditCardAccountDetails'

export class CreditCardStatementResponse extends StatementResponse {
  private account!: CreditCardAccountDetails

  getResponseMessageName(): string {
    return 'credit card statement'
  }

  /**
   * The account for the statement.
   *
   * @return The account for the statement.
   */
  getAccount(): CreditCardAccountDetails {
    return this.account
  }

  /**
   * The account for the statement.
   *
   * @param account The account for the statement.
   */
  setAccount(account: CreditCardAccountDetails): void {
    this.account = account
  }
}

Aggregate_add(CreditCardStatementResponse, 'CCSTMTRS')
ChildAggregate_add(CreditCardStatementResponse, {
  name: 'CCACCTFROM',
  order: 10,
  type: CreditCardAccountDetails,
  read: CreditCardStatementResponse.prototype.getAccount,
  write: CreditCardStatementResponse.prototype.setAccount,
})
