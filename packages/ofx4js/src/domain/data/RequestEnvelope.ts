import * as UUID from 'uuid'
import { SortedSet } from '../../collections/SortedSet'
import { Aggregate_add } from '../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../meta/ChildAggregate_Add'
import { Header_add } from '../../meta/Header_add'
import { ApplicationSecurity } from './ApplicationSecurity'
import { RequestMessageSet } from './RequestMessageSet'

// import java.util.SortedSet;
// import java.util.UUID;

/**
 * Envelope for enclosing an OFX request.
 *
 * @see "Section 2.4.3, OFX Spec"
 */
export class RequestEnvelope {
  // headers
  private security: ApplicationSecurity
  private UID: string
  private lastProcessedUID!: string

  // content
  private messageSets!: SortedSet<RequestMessageSet>

  constructor(UID: string = UUID.v1()) {
    this.security = ApplicationSecurity.NONE
    this.UID = UID
  }

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
   * The UID of the last-processed request/response (used for file-based error recovery).
   *
   * @return The UID of the last-processed request/response (used for file-based error recovery).
   * @see "Section 2.2, OFX spec"
   */
  getLastProcessedUID(): string {
    return this.lastProcessedUID
  }

  /**
   * The UID of the last-processed request/response (used for file-based error recovery).
   *
   * @param lastProcessedUID The UID of the last-processed request/response
   * (used for file-based error recovery).
   * @see "Section 2.2, OFX spec"
   */
  setLastProcessedUID(lastProcessedUID: string): void {
    this.lastProcessedUID = lastProcessedUID
  }

  /**
   * The message sets that make up the content of this request.
   *
   * @return The message sets that make up the content of this request.
   * @see "Section 2.4.5, OFX Spec"
   */
  getMessageSets(): SortedSet<RequestMessageSet> {
    return this.messageSets
  }

  /**
   * The message sets that make up the content of this request.
   *
   * @param messageSets The message sets that make up the content of this request.
   * @see "Section 2.4.5, OFX Spec"
   */
  setMessageSets(messageSets: SortedSet<RequestMessageSet>): void {
    this.messageSets = messageSets
  }
}

Aggregate_add(RequestEnvelope, 'OFX')
Header_add(RequestEnvelope, {
  name: 'SECURITY',
  type: ApplicationSecurity,
  read: RequestEnvelope.prototype.getSecurity,
  write: RequestEnvelope.prototype.setSecurity,
})
Header_add(RequestEnvelope, {
  name: 'NEWFILEUID',
  type: String,
  read: RequestEnvelope.prototype.getUID,
  write: RequestEnvelope.prototype.setUID,
})
Header_add(RequestEnvelope, {
  name: 'OLDFILEUID',
  type: String,
  read: RequestEnvelope.prototype.getLastProcessedUID,
  write: RequestEnvelope.prototype.setLastProcessedUID,
})
ChildAggregate_add(RequestEnvelope, {
  order: 1,
  type: SortedSet,
  collectionEntryType: RequestMessageSet,
  read: RequestEnvelope.prototype.getMessageSets,
  write: RequestEnvelope.prototype.setMessageSets,
})
