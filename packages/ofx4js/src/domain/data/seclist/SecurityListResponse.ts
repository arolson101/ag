import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ResponseMessage } from '../ResponseMessage'

/**
 * Security list response. This is an empty aggregate. The actual security information is included
 * in the "SECLIST" aggregate.
 * @see "Section 13.8.3, OFX Spec"
 */
export class SecurityListResponse extends ResponseMessage {
  getResponseMessageName(): string {
    return 'security list'
  }
}

Aggregate_add(SecurityListResponse, 'SECLISTRS')
