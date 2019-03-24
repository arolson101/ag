import { SortedSet } from '../../collections/SortedSet'
import { Aggregate_add } from '../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../meta/ChildAggregate_Add'
import { Header_add } from '../../meta/Header_add'
import { ApplicationSecurity } from './ApplicationSecurity'
import { MessageSetType } from './MessageSetType'
import { ResponseMessageSet } from './ResponseMessageSet'
import { SignonResponse } from './signon/SignonResponse'
import { SignonResponseMessageSet } from './signon/SignonResponseMessageSet'

// import java.util.SortedSet;

/**
 * Envelope for enclosing an OFX response.
 *
 * @see "Section 2.4.3, OFX Spec"
 */
export class ResponseEnvelope {
  // headers
  private security!: ApplicationSecurity
  private UID!: string

  // content
  private messageSets!: SortedSet<ResponseMessageSet>

  /**
   * The security of this envelope.
   *
   * @return The security of this envelope.
   * @see "Section 2.2, OFX spec"
   */
  getSecurity(): ApplicationSecurity {
    return this.security
  }

  /**
   * The security of this envelope.
   *
   * @param security The security of this envelope.
   * @see "Section 2.2, OFX spec"
   */
  setSecurity(security: ApplicationSecurity): void {
    this.security = security
  }

  /**
   * The UID for the envelope.
   *
   * @return The UID for the envelope.
   * @see "Section 2.2, OFX spec"
   */
  getUID(): string {
    return this.UID
  }

  /**
   * The UID for the envelope.
   *
   * @param UID The UID for the envelope.
   * @see "Section 2.2, OFX spec"
   */
  setUID(UID: string): void {
    this.UID = UID
  }

  /**
   * The message sets that make up the content of this response.
   *
   * @return The message sets that make up the content of this response.
   * @see "Section 2.4.5, OFX Spec"
   */
  getMessageSets(): SortedSet<ResponseMessageSet> {
    return this.messageSets
  }

  /**
   * The message sets that make up the content of this response.
   *
   * @param messageSets The message sets that make up the content of this response.
   * @see "Section 2.4.5, OFX Spec"
   */
  setMessageSets(messageSets: SortedSet<ResponseMessageSet>): void {
    this.messageSets = messageSets
  }

  /**
   * Helper method for looking up the signon response.
   *
   * @return The signon response, or null if none found.
   */
  getSignonResponse(): SignonResponse {
    const type: MessageSetType = MessageSetType.signon
    const message: ResponseMessageSet = this.getMessageSet(type)

    if (message != null) {
      return (message as SignonResponseMessageSet).getSignonResponse()
    } else {
      throw new Error('null message')
    }
  }

  /**
   * Get the message set of the specified type.
   *
   * @param type The type.
   * @return The message set, or null.
   */
  getMessageSet(type: MessageSetType): ResponseMessageSet {
    let message: ResponseMessageSet | null = null
    if (this.messageSets != null) {
      for (const messageSet of this.messageSets.values()) {
        if (messageSet.getType() === type) {
          message = messageSet
          break
        }
      }
    }
    if (message) {
      return message
    } else {
      throw new Error('null message')
    }
  }
}

Aggregate_add(ResponseEnvelope, 'OFX')
Header_add(ResponseEnvelope, {
  name: 'SECURITY',
  type: ApplicationSecurity,
  read: ResponseEnvelope.prototype.getSecurity,
  write: ResponseEnvelope.prototype.setSecurity,
})
Header_add(ResponseEnvelope, {
  name: 'NEWFILEUID',
  type: String,
  read: ResponseEnvelope.prototype.getUID,
  write: ResponseEnvelope.prototype.setUID,
})
ChildAggregate_add(ResponseEnvelope, {
  order: 1,
  type: SortedSet,
  collectionEntryType: ResponseMessageSet,
  read: ResponseEnvelope.prototype.getMessageSets,
  write: ResponseEnvelope.prototype.setMessageSets,
})
