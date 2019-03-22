// tslint:disable:max-line-length
import { InvestmentAccountDetails } from '../domain/data/investment/accounts/InvestmentAccountDetails'
import { InvestmentStatementResponse } from '../domain/data/investment/statements/InvestmentStatementResponse'
import { SecurityList } from '../domain/data/seclist/SecurityList'
import { SecurityRequest } from '../domain/data/seclist/SecurityRequest'
import { FinancialInstitutionAccount } from './FinancialInstitutionAccount'

export interface InvestmentAccount extends FinancialInstitutionAccount {
  /**
   * Read an account statement.
   *
   * @param start The start date of the statement.
   * @param end The end date of the statement.
   * @throws OFXException if there's an error talking to the brokerage
   * @return The account statement.
   */
  // Overriden for type covariance
  readStatement(
    start: Date,
    end: Date
  ): /*throws OFXException*/ Promise<InvestmentStatementResponse>

  /**
   * Reads a list of securities from the brokerage
   *
   * @param securities the securities to read
   * @return The security response containing the security infos
   * @throws OFXException if there's an error talking to the brokerage
   */
  readSecurityList(securities: SecurityRequest[]): /*throws OFXException*/ Promise<SecurityList>

  /**
   * The details of the account.
   *
   * @return The details of the account.
   */
  getDetails(): InvestmentAccountDetails
}
