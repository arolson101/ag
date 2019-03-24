// tslint:disable:max-line-length
import { StatementRange } from '../../domain/data/common/StatementRange'
import { InvestmentAccountDetails } from '../../domain/data/investment/accounts/InvestmentAccountDetails'
import { IncludePosition } from '../../domain/data/investment/statements/IncludePosition'
import { InvestmentStatementRequest } from '../../domain/data/investment/statements/InvestmentStatementRequest'
import { InvestmentStatementRequestMessageSet } from '../../domain/data/investment/statements/InvestmentStatementRequestMessageSet'
import { InvestmentStatementRequestTransaction } from '../../domain/data/investment/statements/InvestmentStatementRequestTransaction'
import { InvestmentStatementResponse } from '../../domain/data/investment/statements/InvestmentStatementResponse'
import { InvestmentStatementResponseMessageSet } from '../../domain/data/investment/statements/InvestmentStatementResponseMessageSet'
import { InvestmentStatementResponseTransaction } from '../../domain/data/investment/statements/InvestmentStatementResponseTransaction'
import { MessageSetType } from '../../domain/data/MessageSetType'
import { RequestEnvelope } from '../../domain/data/RequestEnvelope'
import { RequestMessageSet } from '../../domain/data/RequestMessageSet'
import { ResponseEnvelope } from '../../domain/data/ResponseEnvelope'
import { SecurityList } from '../../domain/data/seclist/SecurityList'
import { SecurityListRequest } from '../../domain/data/seclist/SecurityListRequest'
import { SecurityListRequestMessageSet } from '../../domain/data/seclist/SecurityListRequestMessageSet'
import { SecurityListRequestTransaction } from '../../domain/data/seclist/SecurityListRequestTransaction'
import { SecurityListResponseMessageSet } from '../../domain/data/seclist/SecurityListResponseMessageSet'
import { SecurityRequest } from '../../domain/data/seclist/SecurityRequest'
import { OFXException } from '../../OFXException'
import { InvestmentAccount } from '../InvestmentAccount'
import { FinancialInstitutionImpl } from './FinancialInstitutionImpl'

export class InvestmentAccountImpl implements InvestmentAccount {
  private details: InvestmentAccountDetails
  private username: string
  private password: string
  private institution: FinancialInstitutionImpl

  constructor(
    details: InvestmentAccountDetails,
    username: string,
    password: string,
    institution: FinancialInstitutionImpl
  ) {
    this.details = details
    this.username = username
    this.password = password
    this.institution = institution
  }

  readStatement(
    start: Date,
    end: Date
  ): /*throws OFXException*/ Promise<InvestmentStatementResponse> {
    const range: StatementRange = new StatementRange()
    range.setIncludeTransactions(true)
    range.setStart(start)
    range.setEnd(end)

    const request: RequestEnvelope = this.institution.createAuthenticatedRequest(
      this.username,
      this.password
    )
    const requestTransaction: InvestmentStatementRequestTransaction = new InvestmentStatementRequestTransaction()
    requestTransaction.setWrappedMessage(this.createStatementRequest(this.getDetails(), range))
    request.getMessageSets().insert(this.createStatementRequestMessageSet(requestTransaction))

    return this.institution.sendRequest(request).then(
      (response: ResponseEnvelope): InvestmentStatementResponse => {
        this.institution.doGeneralValidationChecks(request, response)
        return this.unwrapStatementResponse(response)
      }
    )
  }

  readSecurityList(securities: SecurityRequest[]): /*throws OFXException*/ Promise<SecurityList> {
    const request: RequestEnvelope = this.institution.createAuthenticatedRequest(
      this.username,
      this.password
    )
    const requestTransaction: SecurityListRequestTransaction = new SecurityListRequestTransaction()
    requestTransaction.setWrappedMessage(this.createSecurityListRequest(securities))
    request.getMessageSets().insert(this.createSecurityListRequestMessageSet(requestTransaction))

    return this.institution.sendRequest(request).then(
      (response: ResponseEnvelope): SecurityList => {
        this.institution.doGeneralValidationChecks(request, response)

        return this.unwrapSecurityList(response)
      }
    )
  }

  /**
   * The details of this account.
   *
   * @return The details of this account.
   */
  getDetails(): InvestmentAccountDetails {
    return this.details
  }

  private unwrapStatementResponse(
    response: ResponseEnvelope
  ): /*throws OFXException*/ InvestmentStatementResponse {
    const investmentStatementSet: InvestmentStatementResponseMessageSet = response.getMessageSet(
      MessageSetType.investment
    ) as InvestmentStatementResponseMessageSet
    if (investmentStatementSet == null) {
      throw new OFXException('No investment response message set.')
    }

    const statementTransactionResponse: InvestmentStatementResponseTransaction | null = investmentStatementSet.getStatementResponse()
    if (statementTransactionResponse == null) {
      throw new OFXException('No investment statement response transaction.')
    }

    const statement: InvestmentStatementResponse = statementTransactionResponse.getMessage()
    if (statement == null) {
      throw new OFXException('No investment statement in the transaction.')
    }

    // See if there's a security list -- often sent back with an account statement by servers.
    const securityListMessageSet: SecurityListResponseMessageSet = response.getMessageSet(
      MessageSetType.investment_security
    ) as SecurityListResponseMessageSet
    if (securityListMessageSet != null) {
      statement.setSecurityList(securityListMessageSet.getSecurityList())
    }

    return statement
  }

  private createStatementRequestMessageSet(
    transaction: InvestmentStatementRequestTransaction
  ): RequestMessageSet {
    const investmentStatementRequest: InvestmentStatementRequestMessageSet = new InvestmentStatementRequestMessageSet()
    investmentStatementRequest.setStatementRequest(transaction)
    return investmentStatementRequest
  }

  private createStatementRequest(
    details: InvestmentAccountDetails,
    range: StatementRange
  ): InvestmentStatementRequest {
    const investRequest: InvestmentStatementRequest = new InvestmentStatementRequest()
    investRequest.setAccount(details)
    investRequest.setStatementRange(range)
    investRequest.setIncludePosition(new IncludePosition())
    return investRequest
  }

  private createSecurityListRequestMessageSet(
    transaction: SecurityListRequestTransaction
  ): RequestMessageSet {
    const securityListRequest: SecurityListRequestMessageSet = new SecurityListRequestMessageSet()
    securityListRequest.setSecurityListRequest(transaction)
    return securityListRequest
  }

  private createSecurityListRequest(securities: SecurityRequest[]): SecurityListRequest {
    const securityListRequest: SecurityListRequest = new SecurityListRequest()
    securityListRequest.setSecurityRequests(securities)
    return securityListRequest
  }

  private unwrapSecurityList(response: ResponseEnvelope): /*throws OFXException*/ SecurityList {
    const securityListSet: SecurityListResponseMessageSet = response.getMessageSet(
      MessageSetType.investment_security
    ) as SecurityListResponseMessageSet
    if (securityListSet == null) {
      throw new OFXException('No security list response message set.')
    }

    const securityList: SecurityList = securityListSet.getSecurityList()
    if (securityList == null) {
      throw new OFXException('No security list response transaction.')
    }

    return securityList
  }
}
