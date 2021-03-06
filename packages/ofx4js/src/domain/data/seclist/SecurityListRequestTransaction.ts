import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_Add'
import { TransactionWrappedRequestMessage } from '../TransactionWrappedRequestMessage'
import { SecurityListRequest } from './SecurityListRequest'

/**
 * Security list transaction request.
 * @see "Section 13.8.2.1, OFX Spec"
 */
export class SecurityListRequestTransaction extends TransactionWrappedRequestMessage<
  SecurityListRequest
> {
  private message!: SecurityListRequest

  /**
   * The message.
   *
   * @return The message.
   */
  getMessage(): SecurityListRequest {
    return this.message
  }

  /**
   * The message.
   *
   * @param message The message.
   *
   */
  setMessage(message: SecurityListRequest) {
    this.message = message
  }

  // Inherited.
  setWrappedMessage(message: SecurityListRequest): void {
    this.setMessage(message)
  }
}

Aggregate_add(SecurityListRequestTransaction, 'SECLISTTRNRQ')
ChildAggregate_add(SecurityListRequestTransaction, {
  required: true,
  order: 30,
  type: SecurityListRequest,
  read: SecurityListRequestTransaction.prototype.getMessage,
  write: SecurityListRequestTransaction.prototype.setMessage,
})
