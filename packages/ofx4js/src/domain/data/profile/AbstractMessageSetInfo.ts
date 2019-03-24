import { ChildAggregate_add } from '../../../meta/ChildAggregate_Add'
import { VersionSpecificMessageSetInfo } from './VersionSpecificMessageSetInfo'

/**
 * Information about a message set.
 *
 * @see "Section 7.2.1, OFX Spec"
 */
export abstract class AbstractMessageSetInfo {
  private versionSpecificInformationList!: VersionSpecificMessageSetInfo[]

  /**
   * List of information about a message set for each version supported.
   *
   * @return List of information about a message set for each version supported.
   */
  getVersionSpecificInformationList(): VersionSpecificMessageSetInfo[] {
    return this.versionSpecificInformationList
  }

  /**
   * List of information about a message set for each version supported.
   *
   * @param versionSpecificInformationList List of information about a message
   * set for each version supported.
   */
  setVersionSpecificInformationList(
    versionSpecificInformationList: VersionSpecificMessageSetInfo[]
  ): void {
    this.versionSpecificInformationList = versionSpecificInformationList
  }
}

ChildAggregate_add(AbstractMessageSetInfo, {
  order: 0,
  type: Array,
  collectionEntryType: VersionSpecificMessageSetInfo,
  read: AbstractMessageSetInfo.prototype.getVersionSpecificInformationList,
  write: AbstractMessageSetInfo.prototype.setVersionSpecificInformationList,
})
