import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../../meta/ChildAggregate_Add'
import { BasePosition } from './BasePosition'

/**
 * Aggregate for a list of invesment positions.
 * @see "Section 13.9.2.2, OFX Spec"
 */
export class InvestmentPositionList {
  private positions!: BasePosition[]

  /**
   * Gets the list of positions
   *
   * @return the list of positions
   */
  getPositions(): BasePosition[] {
    return this.positions
  }

  /**
   * Sets the list of positions.
   *
   * @param positions the list of positions
   */
  setPositions(positions: BasePosition[]): void {
    this.positions = positions
  }
}

Aggregate_add(InvestmentPositionList, 'INVPOSLIST')
ChildAggregate_add(InvestmentPositionList, {
  order: 10,
  type: Array,
  collectionEntryType: BasePosition,
  read: InvestmentPositionList.prototype.getPositions,
  write: InvestmentPositionList.prototype.setPositions,
})
