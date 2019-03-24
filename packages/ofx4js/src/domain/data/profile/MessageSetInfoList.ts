import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { AbstractMessageSetInfo } from './AbstractMessageSetInfo'

/**
 * @see "Section 7.2, OFX Spec"
 */
export class MessageSetInfoList {
  private informationList!: AbstractMessageSetInfo[]

  /**
   * The list of information for each message set.
   *
   * @return The list of information for each message set.
   */
  getInformationList(): AbstractMessageSetInfo[] {
    return this.informationList
  }

  /**
   * The list of information for each message set.
   *
   * @param informationList The list of information for each message set.
   */
  setInformationList(informationList: AbstractMessageSetInfo[]): void {
    this.informationList = informationList
  }
}

Aggregate_add(MessageSetInfoList, 'MSGSETLIST')
ChildAggregate_add(MessageSetInfoList, {
  order: 0,
  type: Array,
  collectionEntryType: AbstractMessageSetInfo,
  read: MessageSetInfoList.prototype.getInformationList,
  write: MessageSetInfoList.prototype.setInformationList,
})
