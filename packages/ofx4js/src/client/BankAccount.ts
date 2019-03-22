import { BankAccountDetails } from '../domain/data/banking/BankAccountDetails'
import { FinancialInstitutionAccount } from './FinancialInstitutionAccount'

export interface BankAccount extends FinancialInstitutionAccount {
  /**
   * The details of the account.
   *
   * @return The details of the account.
   */
  getDetails(): BankAccountDetails
}
