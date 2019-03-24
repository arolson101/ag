import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { MessageSetType } from '../MessageSetType'
import { ResponseMessage } from '../ResponseMessage'
import { ResponseMessageSet } from '../ResponseMessageSet'
import { AccountInfoResponseTransaction } from './AccountInfoResponseTransaction'

export class SignupResponseMessageSet extends ResponseMessageSet {
  private accountInfoResponse!: AccountInfoResponseTransaction

  getType(): MessageSetType {
    return MessageSetType.signup
  }

  /**
   * The account info response.
   *
   * @return The account info response.
   */
  getAccountInfoResponse(): AccountInfoResponseTransaction {
    return this.accountInfoResponse
  }

  /**
   * The account info response.
   *
   * @param accountInfoResponse The account info response.
   */
  setAccountInfoResponse(accountInfoResponse: AccountInfoResponseTransaction): void {
    this.accountInfoResponse = accountInfoResponse
  }

  /**
   * The response messages.
   *
   * @return The response messages.
   */
  getResponseMessages(): ResponseMessage[] {
    const messages: ResponseMessage[] = new Array<ResponseMessage>()

    if (this.getAccountInfoResponse() != null) {
      messages.push(this.getAccountInfoResponse())
    }

    return messages
  }
}

Aggregate_add(SignupResponseMessageSet, 'SIGNUPMSGSRSV1')
ChildAggregate_add(SignupResponseMessageSet, {
  order: 0,
  type: AccountInfoResponseTransaction,
  read: SignupResponseMessageSet.prototype.getAccountInfoResponse,
  write: SignupResponseMessageSet.prototype.setAccountInfoResponse,
})
