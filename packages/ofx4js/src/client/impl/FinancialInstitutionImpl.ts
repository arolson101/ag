// tslint:disable:max-line-length
import { StringSet } from '../../collections/collections'
import { SortedSet } from '../../collections/SortedSet'
import { ApplicationSecurity } from '../../domain/data/ApplicationSecurity'
import { BankAccountDetails } from '../../domain/data/banking/BankAccountDetails'
import { KnownCode, Status } from '../../domain/data/common/Status'
import { instanceof_StatusHolder, StatusHolder } from '../../domain/data/common/StatusHolder'
import { CreditCardAccountDetails } from '../../domain/data/creditcard/CreditCardAccountDetails'
import { InvestmentAccountDetails } from '../../domain/data/investment/accounts/InvestmentAccountDetails'
import { MessageSetType } from '../../domain/data/MessageSetType'
import { ProfileRequest } from '../../domain/data/profile/ProfileRequest'
import { ProfileRequestMessageSet } from '../../domain/data/profile/ProfileRequestMessageSet'
import { ProfileRequestTransaction } from '../../domain/data/profile/ProfileRequestTransaction'
import { ProfileResponse } from '../../domain/data/profile/ProfileResponse'
import { ProfileResponseMessageSet } from '../../domain/data/profile/ProfileResponseMessageSet'
import { ProfileResponseTransaction } from '../../domain/data/profile/ProfileResponseTransaction'
import { RequestEnvelope } from '../../domain/data/RequestEnvelope'
import { RequestMessage } from '../../domain/data/RequestMessage'
import { RequestMessageSet } from '../../domain/data/RequestMessageSet'
import { ResponseEnvelope } from '../../domain/data/ResponseEnvelope'
import { ResponseMessage } from '../../domain/data/ResponseMessage'
import { ResponseMessageSet } from '../../domain/data/ResponseMessageSet'
import { FinancialInstitutionInfo } from '../../domain/data/signon/FinancialInstitution'
import { SignonRequest } from '../../domain/data/signon/SignonRequest'
import { SignonRequestMessageSet } from '../../domain/data/signon/SignonRequestMessageSet'
import { SignonResponse } from '../../domain/data/signon/SignonResponse'
import { SignonResponseMessageSet } from '../../domain/data/signon/SignonResponseMessageSet'
import { AccountInfoRequest } from '../../domain/data/signup/AccountInfoRequest'
import { AccountInfoRequestTransaction } from '../../domain/data/signup/AccountInfoRequestTransaction'
import { AccountInfoResponse } from '../../domain/data/signup/AccountInfoResponse'
import { AccountInfoResponseTransaction } from '../../domain/data/signup/AccountInfoResponseTransaction'
import { AccountProfile } from '../../domain/data/signup/AccountProfile'
import { SignupRequestMessageSet } from '../../domain/data/signup/SignupRequestMessageSet'
import { SignupResponseMessageSet } from '../../domain/data/signup/SignupResponseMessageSet'
import { TransactionWrappedRequestMessage } from '../../domain/data/TransactionWrappedRequestMessage'
import { TransactionWrappedResponseMessage } from '../../domain/data/TransactionWrappedResponseMessage'
import { OFXException } from '../../OFXException'
import { OFXStatusException } from '../../OFXStatusException'
import { OFXTransactionException } from '../../OFXTransactionException'
import { UnsupportedOFXSecurityTypeException } from '../../UnsupportedOFXSecurityTypeException'
import { BankAccount } from '../BankAccount'
import { OFXApplicationContextHolder } from '../context/OFXApplicationContextHolder'
import { CreditCardAccount } from '../CreditCardAccount'
import { FinancialInstitutionData } from '../FinancialInstitutionData'
import { FinancialInstitutionProfile } from '../FinancialInstitutionProfile'
import { InvestmentAccount } from '../InvestmentAccount'
import { OFXConnection } from '../net/OFXConnection'
import { NoOFXResponseException } from '../NoOFXResponseException'
import { BankingAccountImpl } from './BankingAccountImpl'
import { CreditCardAccountImpl } from './CreditCardAccountImpl'
import { InvestmentAccountImpl } from './InvestmentAccountImpl'

/**
 * Base implementation for the financial institution.
 */
export class FinancialInstitutionImpl extends FinancialInstitutionInfo {
  private connection: OFXConnection
  private data: FinancialInstitutionData

  constructor(data: FinancialInstitutionData, connection: OFXConnection) {
    super()
    if (data == null) {
      throw new OFXException('Data cannot be null')
    }
    if (connection == null) {
      throw new OFXException('An OFX connection must be supplied')
    }

    this.data = data
    this.connection = connection
  }

  // Inherited.
  readProfile(): /*throws OFXException*/ Promise<FinancialInstitutionProfile> {
    const request: RequestEnvelope = this.createAuthenticatedRequest(
      SignonRequest.ANONYMOUS_USER,
      SignonRequest.ANONYMOUS_USER
    )
    const profileRequest: ProfileRequestMessageSet = new ProfileRequestMessageSet()
    profileRequest.setProfileRequest(this.createProfileTransaction())
    request.getMessageSets().insert(profileRequest)
    return this.sendRequest(request, this.getData().getOFXURL()).then(
      (response: ResponseEnvelope): FinancialInstitutionProfile => {
        this.doGeneralValidationChecks(request, response)
        return this.getProfile(response)
      }
    )
  }

  // Inherited.
  readAccountProfiles(
    username: string,
    password: string
  ): /*throws OFXException*/ Promise<AccountProfile[]> {
    const request: RequestEnvelope = this.createAuthenticatedRequest(username, password)
    const signupRequest: SignupRequestMessageSet = new SignupRequestMessageSet()
    signupRequest.setAccountInfoRequest(this.createAccountInfoTransaction())
    request.getMessageSets().insert(signupRequest)
    return this.sendRequest(request, this.getData().getOFXURL()).then(
      (response: ResponseEnvelope): AccountProfile[] => {
        this.doGeneralValidationChecks(request, response)
        return this.getAccountProfiles(response)
      }
    )
  }

  // Inherited.
  loadBankAccount(details: BankAccountDetails, username: string, password: string): BankAccount {
    return new BankingAccountImpl(details, username, password, this)
  }

  // Inherited.
  loadCreditCardAccount(
    details: CreditCardAccountDetails,
    username: string,
    password: string
  ): CreditCardAccount {
    return new CreditCardAccountImpl(details, username, password, this)
  }

  // Inherited
  loadInvestmentAccount(
    details: InvestmentAccountDetails,
    username: string,
    password: string
  ): InvestmentAccount {
    return new InvestmentAccountImpl(details, username, password, this)
  }

  /**
   * Create an authenticated request envelope.
   *
   * @param username The username.
   * @param password The password.
   * @return The request envelope.
   */
  createAuthenticatedRequest(username: string, password: string): RequestEnvelope {
    const request: RequestEnvelope = new RequestEnvelope()
    const messageSets: SortedSet<RequestMessageSet> = new SortedSet<RequestMessageSet>(
      RequestMessageSet.contentCompare
    )
    const signonRequest: SignonRequestMessageSet = new SignonRequestMessageSet()
    signonRequest.setSignonRequest(this.createSignonRequest(username, password))
    messageSets.insert(signonRequest)
    request.setMessageSets(messageSets)
    return request
  }

  /**
   * Send a request to a specific URL.
   *
   * @param request The request.
   * @param url The url.
   * @return The request.
   */
  sendRequest(
    request: RequestEnvelope,
    url: string = this.getData().getOFXURL()
  ): /*throws OFXConnectionException*/ Promise<ResponseEnvelope> {
    return this.getConnection().sendRequest(request, url)
  }

  /**
   * Open the specified response envelope and look for the profile.
   *
   * @param response The response envelope.
   * @return The profile.
   */
  protected getProfile(
    response: ResponseEnvelope
  ): /*throws OFXException*/ FinancialInstitutionProfile {
    const profileSet: ProfileResponseMessageSet = response.getMessageSet(
      MessageSetType.profile
    ) as ProfileResponseMessageSet
    if (profileSet == null) {
      throw new OFXException('No profile response set.')
    }

    const transactionResponse: ProfileResponseTransaction = profileSet.getProfileResponse()
    if (transactionResponse == null) {
      throw new OFXException('No profile transaction wrapper.')
    }

    const message: ProfileResponse = transactionResponse.getMessage()
    if (message == null) {
      throw new OFXException('No profile message.')
    }
    return message
  }

  /**
   * General validation checks on the specified response.
   *
   * @param request The request.
   * @param response Their response.
   * @throws OFXException Upon invalid response.
   */
  doGeneralValidationChecks(
    request: RequestEnvelope,
    response: ResponseEnvelope
  ): /*throws OFXException*/ void {
    if (response.getSecurity() !== ApplicationSecurity.NONE) {
      throw new UnsupportedOFXSecurityTypeException(
        'Unable to participate in ' + response.getSecurity() + ' security.'
      )
    }

    if (request.getUID() !== response.getUID()) {
      throw new OFXException(
        "Invalid transaction ID '" + response.getUID() + "' in response.  Expected: " + request
      )
    }

    for (const requestSet of request.getMessageSets().values()) {
      const responseSet: ResponseMessageSet | null = response.getMessageSet(requestSet.getType())
      if (responseSet == null) {
        throw new NoOFXResponseException(
          'No response for the ' + requestSet.getType() + ' request.'
        )
      }

      if (responseSet.getType() === MessageSetType.signon) {
        const signonResponse: SignonResponse = (responseSet as SignonResponseMessageSet).getSignonResponse()

        if (signonResponse == null) {
          throw new NoOFXResponseException('No signon response.')
        }
      }

      const transactionIds: StringSet = {}
      for (const requestMessage of requestSet.getRequestMessages()) {
        if (requestMessage instanceof TransactionWrappedRequestMessage) {
          transactionIds[
            (requestMessage as TransactionWrappedRequestMessage<RequestMessage>).getUID()
          ] = true
        }
      }

      for (const responseMessage of responseSet.getResponseMessages()) {
        if (instanceof_StatusHolder(responseMessage)) {
          this.validateStatus((responseMessage as any) as StatusHolder)
        }

        if (responseMessage instanceof TransactionWrappedResponseMessage) {
          const uid: string = (responseMessage as TransactionWrappedResponseMessage<
            ResponseMessage
          >).getUID()
          if (uid == null) {
            throw new OFXTransactionException('Invalid response transaction: no UID.')
          } else if (!(uid in transactionIds)) {
            throw new OFXTransactionException('Response to an unknown transaction: ' + uid + '.')
          } else {
            delete transactionIds[uid]
          }
        }
      }

      if (Object.keys(transactionIds).length !== 0) {
        throw new OFXTransactionException(
          'No response to the following transactions: ' + transactionIds
        )
      }
    }
  }

  /**
   * Validate the status of the given status holder.
   *
   * @param statusHolder The status holder.
   */
  protected validateStatus(statusHolder: StatusHolder): /*throws OFXException*/ void {
    const status: Status = statusHolder.getStatus()
    if (status == null) {
      throw new OFXException(
        'Invalid OFX response: no status returned in the ' +
          statusHolder.getStatusHolderName() +
          ' response.'
      )
    }

    if (KnownCode.SUCCESS !== status.getCode()) {
      let message: string = status.getMessage()
      if (message == null) {
        message = 'No response status code.'

        if (status.getCode() != null) {
          message = status.getCode().getMessage()
        }
      }

      throw new OFXStatusException(
        status,
        'Invalid ' + statusHolder.getStatusHolderName() + ': ' + message
      )
    }
  }

  /**
   * Create a transaction message for a profile request.
   *
   * @return The transaction message.
   */
  protected createProfileTransaction(): ProfileRequestTransaction {
    const profileTx: ProfileRequestTransaction = new ProfileRequestTransaction()
    profileTx.setMessage(this.createProfileRequest())
    return profileTx
  }

  /**
   * Create a profile request.
   *
   * @return The profile request.
   */
  protected createProfileRequest(): ProfileRequest {
    const profileRequest: ProfileRequest = new ProfileRequest()
    profileRequest.setProfileLastUpdated(new Date(0))
    return profileRequest
  }

  /**
   * Create a sign-on request for the specified user.
   *
   * @param username The username.
   * @param password The password.
   * @return The signon request.
   */
  protected createSignonRequest(username: string, password: string): SignonRequest {
    const signonRequest: SignonRequest = new SignonRequest()
    signonRequest.setTimestamp(new Date())
    const fi: FinancialInstitutionInfo = new FinancialInstitutionInfo()
    fi.setId(this.getData().getFinancialInstitutionId())
    fi.setOrganization(this.getData().getOrganization())
    signonRequest.setFinancialInstitution(fi)
    signonRequest.setUserId(username)
    signonRequest.setPassword(password)
    signonRequest.setApplicationId(OFXApplicationContextHolder.getCurrentContext().getAppId())
    signonRequest.setApplicationVersion(
      OFXApplicationContextHolder.getCurrentContext().getAppVersion()
    )
    return signonRequest
  }

  /**
   * Create a transaction for an account info request.
   *
   * @return The transaction.
   */
  protected createAccountInfoTransaction(): AccountInfoRequestTransaction {
    const transaction: AccountInfoRequestTransaction = new AccountInfoRequestTransaction()
    transaction.setMessage(this.createAccountInfoRequest())
    return transaction
  }

  /**
   * Create an account info request.
   *
   * @return The account info request.
   */
  protected createAccountInfoRequest(): AccountInfoRequest {
    return new AccountInfoRequest()
  }

  /**
   * Get the account profiles for the specified response envelope.
   *
   * @param response The response envelope.
   * @return The account profiles.
   */
  protected getAccountProfiles(
    response: ResponseEnvelope
  ): /*throws OFXException*/ AccountProfile[] {
    const messageSet: SignupResponseMessageSet = response.getMessageSet(
      MessageSetType.signup
    ) as SignupResponseMessageSet
    if (messageSet == null) {
      throw new OFXException('No signup response message set.')
    }

    const transaction: AccountInfoResponseTransaction = messageSet.getAccountInfoResponse()
    if (transaction == null) {
      throw new OFXException('No account info transaction in the signup response.')
    }

    const infoResponse: AccountInfoResponse = transaction.getMessage()
    if (infoResponse == null) {
      throw new OFXException('No account info response in the transaction.')
    }

    return infoResponse.getAccounts()
  }

  /**
   * The connection used by this implementation.
   *
   * @return The connection used by this implementation.
   */
  getConnection(): OFXConnection {
    return this.connection
  }

  /**
   * The financial institution data.
   *
   * @return The financial institution data.
   */
  getData(): FinancialInstitutionData {
    return this.data
  }
}
