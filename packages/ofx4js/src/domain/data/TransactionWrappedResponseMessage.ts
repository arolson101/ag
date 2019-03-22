import { ChildAggregate_add } from '../../meta/ChildAggregate_add'
import { Element_add } from '../../meta/Element_add'
import { Status } from './common/Status'
import { StatusHolder } from './common/StatusHolder'
import { ResponseMessage } from './ResponseMessage'

/**
 * A response message wrapped in a transaction.
 *
 * @see "Section 2.4.6, OFX Spec"
 */
export abstract class TransactionWrappedResponseMessage<M extends ResponseMessage>
  extends ResponseMessage
  implements StatusHolder {
  private UID: string
  private clientCookie: string
  private status: Status

  /**
   * UID of this transaction.
   *
   * @return UID of this transaction.
   */
  getUID(): string {
    return this.UID
  }

  /**
   * UID of this transaction.
   *
   * @param UID UID of this transaction.
   */
  setUID(UID: string): void {
    this.UID = UID
  }

  /**
   * Client cookie (echoed back by the response).
   *
   * @return Client cookie (echoed back by the response).
   */
  getClientCookie(): string {
    return this.clientCookie
  }

  /**
   * Client cookie (echoed back by the response).
   *
   * @param clientCookie Client cookie (echoed back by the response).
   */
  setClientCookie(clientCookie: string): void {
    this.clientCookie = clientCookie
  }

  // Inherited.
  getStatusHolderName(): string {
    return this.getResponseMessageName()
  }

  // Inherited.
  getResponseMessageName(): string {
    let name: string = 'transaction response'
    if (this.getWrappedMessage() != null) {
      name = this.getWrappedMessage().getResponseMessageName() + ' transaction'
    }
    //    else if ((<any>(<Object>this).constructor).Aggregate) {
    //      // TODO- does this work?
    //      var aggregate: AggregateInfo = (<any>(<Object>this).constructor).Aggregate;
    //      name = aggregate.getName() + " transaction";
    //    }

    return name
  }

  /**
   * Status of the transaction.
   *
   * @return Status of the transaction.
   */
  getStatus(): Status {
    return this.status
  }

  /**
   * Status of the transaction.
   *
   * @param status Status of the transaction.
   */
  setStatus(status: Status): void {
    this.status = status
  }

  /**
   * Get the wrapped message.
   *
   * @return The wrapped message.
   */
  abstract getWrappedMessage(): M
}

Element_add(TransactionWrappedResponseMessage, {
  name: 'TRNUID',
  required: true,
  order: 0,
  type: String,
  read: TransactionWrappedResponseMessage.prototype.getUID,
  write: TransactionWrappedResponseMessage.prototype.setUID,
})
Element_add(TransactionWrappedResponseMessage, {
  name: 'CLTCOOKIE',
  order: 20,
  type: String,
  read: TransactionWrappedResponseMessage.prototype.getClientCookie,
  write: TransactionWrappedResponseMessage.prototype.setClientCookie,
})
ChildAggregate_add(TransactionWrappedResponseMessage, {
  required: true,
  order: 10,
  type: Status,
  read: TransactionWrappedResponseMessage.prototype.getStatus,
  write: TransactionWrappedResponseMessage.prototype.setStatus,
})
