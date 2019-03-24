import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { Element_add } from '../../../../meta/Element_add'
import { MessageSetType } from '../../MessageSetType'
import { VersionSpecificMessageSetInfo } from '../VersionSpecificMessageSetInfo'

/**
 * @see "Section 13.7.2.1, OFX Spec"
 */
export class SecurityListV1MessageSetInfo extends VersionSpecificMessageSetInfo {
  private supportsSecurityListDownload!: boolean

  getMessageSetType(): MessageSetType {
    return MessageSetType.investment_security
  }

  getSupportsSecurityListDownload(): boolean {
    return this.supportsSecurityListDownload
  }

  setSupportsSecurityListDownload(supportsSecurityListDownload: boolean): void {
    this.supportsSecurityListDownload = supportsSecurityListDownload
  }
}

Aggregate_add(SecurityListV1MessageSetInfo, 'SECLISTMSGSETV1')
Element_add(SecurityListV1MessageSetInfo, {
  name: 'SECLISTRQDNLD',
  required: true,
  order: 10,
  type: Boolean,
  read: SecurityListV1MessageSetInfo.prototype.getSupportsSecurityListDownload,
  write: SecurityListV1MessageSetInfo.prototype.setSupportsSecurityListDownload,
})
