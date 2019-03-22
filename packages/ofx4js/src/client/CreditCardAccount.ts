import { CreditCardAccountDetails } from '../domain/data/creditcard/CreditCardAccountDetails'
import { FinancialInstitutionAccount } from './FinancialInstitutionAccount'

export interface CreditCardAccount extends FinancialInstitutionAccount {
  /**
   * The details of the credit card account.
   *
   * @return The details of the credit card account.
   */
  getDetails(): CreditCardAccountDetails
}
