import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { ApplicationSecurity } from '../ApplicationSecurity'
import { MessageSetProfile } from '../MessageSetProfile'
import { MessageSetType } from '../MessageSetType'
import { CoreMessageSetInfo } from './CoreMessageSetInfo'
import { SynchronizationCapability } from './SynchronizationCapability'

/**
 * Information specific to a version of a message set.
 *
 * @see "Section 7.2.1, OFX Spec"
 */
export abstract class VersionSpecificMessageSetInfo implements MessageSetProfile {
  private core: CoreMessageSetInfo

  /**
   * The information core.
   *
   * @return The information core.
   */
  getCore(): CoreMessageSetInfo {
    return this.core
  }

  /**
   * The information core.
   *
   * @param core The information core.
   */
  setCore(core: CoreMessageSetInfo): void {
    this.core = core
  }

  /**
   * The message set type.
   *
   * @return The message set type.
   */
  abstract getMessageSetType(): MessageSetType

  getVersion(): string {
    return this.core != null ? this.core.getVersion() : null
  }

  getServiceProviderName(): string {
    return this.core != null ? this.core.getServiceProviderName() : null
  }

  getUrl(): string {
    return this.core != null ? this.core.getUrl() : null
  }

  getSecurity(): ApplicationSecurity {
    return this.core != null ? this.core.getSecurity() : null
  }

  isSslRequired(): boolean {
    return this.core != null && this.core.getSslRequired() != null
      ? this.core.getSslRequired()
      : true
  }

  getRealm(): string {
    return this.core != null ? this.core.getRealm() : null
  }

  getLanguage(): string {
    return this.core != null ? this.core.getLanguage() : null
  }

  getSyncCapability(): SynchronizationCapability {
    return this.core != null ? this.core.getSyncCapability() : null
  }

  hasFileBasedErrorRecoverySupport(): boolean {
    return this.core != null && this.core.getFileBasedErrorRecoverySupport() != null
      ? this.core.getFileBasedErrorRecoverySupport()
      : false
  }
}

ChildAggregate_add(VersionSpecificMessageSetInfo, {
  order: 0,
  type: CoreMessageSetInfo,
  read: VersionSpecificMessageSetInfo.prototype.getCore,
  write: VersionSpecificMessageSetInfo.prototype.setCore,
})
