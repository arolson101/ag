import * as UUID from 'uuid'
import { Element_add } from '../../meta/Element_add'
import { RequestMessage } from './RequestMessage'

/**
 * A request message wrapped in a transaction.
 *
 * @see "Section 2.4.6, OFX Spec"
 */
export abstract class TransactionWrappedRequestMessage<
  M extends RequestMessage
> extends RequestMessage {
  private UID: string
  private clientCookie!: string
  private transactionAuthorizationNumber!: string

  constructor(UID: string = UUID.v1()) {
    super()
    this.UID = UID
  }

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

  /**
   * The transaction authorization number.
   *
   * @return The transaction authorization number.
   */
  getTransactionAuthorizationNumber(): string {
    return this.transactionAuthorizationNumber
  }

  /**
   * The transaction authorization number.
   *
   * @param transactionAuthorizationNumber The transaction authorization number.
   */
  setTransactionAuthorizationNumber(transactionAuthorizationNumber: string): void {
    this.transactionAuthorizationNumber = transactionAuthorizationNumber
  }

  /**
   * Set the wrapped message.
   *
   * @param message The wrapped message.
   */
  abstract setWrappedMessage(message: M): void
}

Element_add(TransactionWrappedRequestMessage, {
  name: 'TRNUID',
  required: true,
  order: 0,
  type: String,
  read: TransactionWrappedRequestMessage.prototype.getUID,
  write: TransactionWrappedRequestMessage.prototype.setUID,
})
Element_add(TransactionWrappedRequestMessage, {
  name: 'CLTCOOKIE',
  order: 10,
  type: String,
  read: TransactionWrappedRequestMessage.prototype.getClientCookie,
  write: TransactionWrappedRequestMessage.prototype.setClientCookie,
})
Element_add(TransactionWrappedRequestMessage, {
  name: 'TAN',
  order: 20,
  type: String,
  read: TransactionWrappedRequestMessage.prototype.getTransactionAuthorizationNumber,
  write: TransactionWrappedRequestMessage.prototype.setTransactionAuthorizationNumber,
})
