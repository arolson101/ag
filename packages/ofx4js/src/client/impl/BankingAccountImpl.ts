// tslint:disable:max-line-length
import { BankAccountDetails } from '../../domain/data/banking/BankAccountDetails'
import { BankingRequestMessageSet } from '../../domain/data/banking/BankingRequestMessageSet'
import { BankingResponseMessageSet } from '../../domain/data/banking/BankingResponseMessageSet'
import { BankStatementRequest } from '../../domain/data/banking/BankStatementRequest'
import { BankStatementRequestTransaction } from '../../domain/data/banking/BankStatementRequestTransaction'
import { BankStatementResponse } from '../../domain/data/banking/BankStatementResponse'
import { BankStatementResponseTransaction } from '../../domain/data/banking/BankStatementResponseTransaction'
import { StatementRange } from '../../domain/data/common/StatementRange'
import { StatementRequest } from '../../domain/data/common/StatementRequest'
import { StatementResponse } from '../../domain/data/common/StatementResponse'
import { MessageSetType } from '../../domain/data/MessageSetType'
import { RequestMessage } from '../../domain/data/RequestMessage'
import { RequestMessageSet } from '../../domain/data/RequestMessageSet'
import { ResponseEnvelope } from '../../domain/data/ResponseEnvelope'
import { TransactionWrappedRequestMessage } from '../../domain/data/TransactionWrappedRequestMessage'
import { OFXException } from '../../OFXException'
import { BankAccount } from '../BankAccount'
import { BaseAccountImpl } from './BaseAccountImpl'
import { FinancialInstitutionImpl } from './FinancialInstitutionImpl'

export class BankingAccountImpl extends BaseAccountImpl<BankAccountDetails> implements BankAccount {
  constructor(
    details: BankAccountDetails,
    username: string,
    password: string,
    institution: FinancialInstitutionImpl
  ) {
    super(details, username, password, institution)
  }

  protected unwrapStatementResponse(
    response: ResponseEnvelope
  ): /*throws OFXException*/ StatementResponse {
    const bankingSet: BankingResponseMessageSet = response.getMessageSet(
      MessageSetType.banking
    ) as BankingResponseMessageSet
    if (bankingSet == null) {
      throw new OFXException('No banking response message set.')
    }

    const statementTransactionResponse: BankStatementResponseTransaction | null = bankingSet.getStatementResponse()
    if (statementTransactionResponse == null) {
      throw new OFXException('No banking statement response transaction.')
    }

    const statement: BankStatementResponse = statementTransactionResponse.getMessage()
    if (statement == null) {
      throw new OFXException('No banking statement in the transaction.')
    }

    return statement
  }

  protected createRequestMessageSet(
    transaction: TransactionWrappedRequestMessage<RequestMessage>
  ): RequestMessageSet {
    const bankingRequest: BankingRequestMessageSet = new BankingRequestMessageSet()
    bankingRequest.setStatementRequest(transaction as BankStatementRequestTransaction)
    return bankingRequest
  }

  protected createTransaction(): TransactionWrappedRequestMessage<RequestMessage> {
    return new BankStatementRequestTransaction()
  }

  protected createStatementRequest(
    details: BankAccountDetails,
    range: StatementRange
  ): StatementRequest {
    const bankRequest: BankStatementRequest = new BankStatementRequest()
    bankRequest.setAccount(details)
    bankRequest.setStatementRange(range)
    return bankRequest
  }
}
