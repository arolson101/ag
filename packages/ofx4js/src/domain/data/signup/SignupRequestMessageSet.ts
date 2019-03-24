import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { MessageSetType } from '../MessageSetType'
import { RequestMessage } from '../RequestMessage'
import { RequestMessageSet } from '../RequestMessageSet'
import { AccountInfoRequestTransaction } from './AccountInfoRequestTransaction'

export class SignupRequestMessageSet extends RequestMessageSet {
  private accountInfoRequest!: AccountInfoRequestTransaction

  getType(): MessageSetType {
    return MessageSetType.signup
  }

  /**
   * The account info request.
   *
   * @return The account info request.
   */
  getAccountInfoRequest(): AccountInfoRequestTransaction {
    return this.accountInfoRequest
  }

  /**
   * The account info request.
   *
   * @param accountInfoRequest The account info request.
   */
  setAccountInfoRequest(accountInfoRequest: AccountInfoRequestTransaction): void {
    this.accountInfoRequest = accountInfoRequest
  }

  /**
   * The request messages.
   *
   * @return The request messages.
   */
  getRequestMessages(): RequestMessage[] {
    const messages: RequestMessage[] = new Array<RequestMessage>()

    if (this.getAccountInfoRequest() != null) {
      messages.push(this.getAccountInfoRequest())
    }

    return messages
  }
}

Aggregate_add(SignupRequestMessageSet, 'SIGNUPMSGSRQV1')
ChildAggregate_add(SignupRequestMessageSet, {
  order: 0,
  type: AccountInfoRequestTransaction,
  read: SignupRequestMessageSet.prototype.getAccountInfoRequest,
  write: SignupRequestMessageSet.prototype.setAccountInfoRequest,
})
