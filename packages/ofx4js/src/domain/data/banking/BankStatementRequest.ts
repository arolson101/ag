import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { StatementRequest } from '../common/StatementRequest'
import { BankAccountDetails } from './BankAccountDetails'

export class BankStatementRequest extends StatementRequest {
  private account!: BankAccountDetails

  /**
   * The account details.
   *
   * @return The account details.
   */
  getAccount(): BankAccountDetails {
    return this.account
  }

  /**
   * The account details.
   *
   * @param account The account details.
   */
  setAccount(account: BankAccountDetails): void {
    this.account = account
  }
}

Aggregate_add(BankStatementRequest, 'STMTRQ')
ChildAggregate_add(BankStatementRequest, {
  name: 'BANKACCTFROM',
  required: true,
  order: 0,
  type: BankAccountDetails,
  read: BankStatementRequest.prototype.getAccount,
  write: BankStatementRequest.prototype.setAccount,
})
