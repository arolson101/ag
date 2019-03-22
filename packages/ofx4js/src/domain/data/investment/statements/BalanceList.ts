import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../../meta/ChildAggregate_add'
import { BalanceRecord } from '../../common/BalanceRecord'

/**
 * Aggregate for the investment balance list.
 * @see "Section 13.9.2.7, OFX Spec"
 */
export class BalanceList {
  private balanceRecords: BalanceRecord[]

  /**
   * Gets the list of balance records.
   *
   * @return the list of balance records.
   */
  getBalanceRecords(): BalanceRecord[] {
    return this.balanceRecords
  }

  /**
   * Sets the list of balance records.
   *
   * @param balanceRecords the list of balance records.
   */
  setBalanceRecords(balanceRecords: BalanceRecord[]): void {
    this.balanceRecords = balanceRecords
  }
}

Aggregate_add(BalanceList, 'BALLIST')
ChildAggregate_add(BalanceList, {
  order: 10,
  type: Array,
  collectionEntryType: BalanceRecord,
  read: BalanceList.prototype.getBalanceRecords,
  write: BalanceList.prototype.setBalanceRecords,
})
