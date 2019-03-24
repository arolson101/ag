import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { StatementResponse } from '../common/StatementResponse'
import { BankAccountDetails } from './BankAccountDetails'

export class BankStatementResponse extends StatementResponse {
  private account!: BankAccountDetails

  getResponseMessageName(): string {
    return 'bank statement'
  }

  /**
   * The account for the statement.
   *
   * @return The account for the statement.
   */
  getAccount(): BankAccountDetails {
    return this.account
  }

  /**
   * The account for the statement.
   *
   * @param account The account for the statement.
   */
  setAccount(account: BankAccountDetails): void {
    this.account = account
  }
}

Aggregate_add(BankStatementResponse, 'STMTRS')
ChildAggregate_add(BankStatementResponse, {
  name: 'BANKACCTFROM',
  order: 10,
  type: BankAccountDetails,
  read: BankStatementResponse.prototype.getAccount,
  write: BankStatementResponse.prototype.setAccount,
})
