import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { SignonInfo } from './SignonInfo'

/**
 * List of signon information.
 *
 * @see "Section 7.2.2, OFX Spec"
 */
export class SignonInfoList {
  private infoList!: SignonInfo[]

  /**
   * List of sign-on information.
   *
   * @return List of sign-on information.
   */
  getInfoList(): SignonInfo[] {
    return this.infoList
  }

  /**
   * List of sign-on information.
   *
   * @param infoList List of sign-on information.
   */
  setInfoList(infoList: SignonInfo[]): void {
    this.infoList = infoList
  }
}

Aggregate_add(SignonInfoList, 'SIGNONINFOLIST')
ChildAggregate_add(SignonInfoList, {
  order: 0,
  type: Array,
  collectionEntryType: SignonInfo,
  read: SignonInfoList.prototype.getInfoList,
  write: SignonInfoList.prototype.setInfoList,
})
