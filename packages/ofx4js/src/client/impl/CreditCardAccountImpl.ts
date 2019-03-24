// tslint:disable:max-line-length
import { StatementRange } from '../../domain/data/common/StatementRange'
import { StatementRequest } from '../../domain/data/common/StatementRequest'
import { StatementResponse } from '../../domain/data/common/StatementResponse'
import { CreditCardAccountDetails } from '../../domain/data/creditcard/CreditCardAccountDetails'
import { CreditCardRequestMessageSet } from '../../domain/data/creditcard/CreditCardRequestMessageSet'
import { CreditCardResponseMessageSet } from '../../domain/data/creditcard/CreditCardResponseMessageSet'
import { CreditCardStatementRequest } from '../../domain/data/creditcard/CreditCardStatementRequest'
import { CreditCardStatementRequestTransaction } from '../../domain/data/creditcard/CreditCardStatementRequestTransaction'
import { CreditCardStatementResponse } from '../../domain/data/creditcard/CreditCardStatementResponse'
import { CreditCardStatementResponseTransaction } from '../../domain/data/creditcard/CreditCardStatementResponseTransaction'
import { MessageSetType } from '../../domain/data/MessageSetType'
import { RequestMessage } from '../../domain/data/RequestMessage'
import { RequestMessageSet } from '../../domain/data/RequestMessageSet'
import { ResponseEnvelope } from '../../domain/data/ResponseEnvelope'
import { TransactionWrappedRequestMessage } from '../../domain/data/TransactionWrappedRequestMessage'
import { OFXException } from '../../OFXException'
import { CreditCardAccount } from '../CreditCardAccount'
import { BaseAccountImpl } from './BaseAccountImpl'
import { FinancialInstitutionImpl } from './FinancialInstitutionImpl'

export class CreditCardAccountImpl extends BaseAccountImpl<CreditCardAccountDetails>
  implements CreditCardAccount {
  constructor(
    details: CreditCardAccountDetails,
    username: string,
    password: string,
    institution: FinancialInstitutionImpl
  ) {
    super(details, username, password, institution)
  }

  protected unwrapStatementResponse(
    response: ResponseEnvelope
  ): /*throws OFXException*/ StatementResponse {
    const creditCardSet: CreditCardResponseMessageSet = response.getMessageSet(
      MessageSetType.creditcard
    ) as CreditCardResponseMessageSet
    if (creditCardSet == null) {
      throw new OFXException('No credit card response message set.')
    }

    const statementTransactionResponse: CreditCardStatementResponseTransaction | null = creditCardSet.getStatementResponse()
    if (statementTransactionResponse == null) {
      throw new OFXException('No credit card statement response transaction.')
    }

    const statement: CreditCardStatementResponse = statementTransactionResponse.getMessage()
    if (statement == null) {
      throw new OFXException('No credit card statement in the transaction.')
    }

    return statement
  }

  protected createRequestMessageSet(
    transaction: TransactionWrappedRequestMessage<RequestMessage>
  ): RequestMessageSet {
    const creditCardRequest: CreditCardRequestMessageSet = new CreditCardRequestMessageSet()
    creditCardRequest.setStatementRequest(transaction as CreditCardStatementRequestTransaction)
    return creditCardRequest
  }

  protected createTransaction(): TransactionWrappedRequestMessage<RequestMessage> {
    return new CreditCardStatementRequestTransaction()
  }

  protected createStatementRequest(
    details: CreditCardAccountDetails,
    range: StatementRange
  ): StatementRequest {
    const bankRequest: CreditCardStatementRequest = new CreditCardStatementRequest()
    bankRequest.setAccount(details)
    bankRequest.setStatementRange(range)
    return bankRequest
  }
}
