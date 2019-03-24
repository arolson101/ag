import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { RequestMessage } from '../RequestMessage'
import { StatementRange } from './StatementRange'

export class StatementRequest extends RequestMessage {
  private statementRange!: StatementRange

  /**
   * The statement range.
   *
   * @return The statement range.
   */
  getStatementRange(): StatementRange {
    return this.statementRange
  }

  /**
   * The statement range.
   *
   * @param statementRange The statement range.
   */
  setStatementRange(statementRange: StatementRange): void {
    this.statementRange = statementRange
  }
}

Aggregate_add(StatementRequest, 'STMTRQ')
ChildAggregate_add(StatementRequest, {
  name: 'INCTRAN',
  required: false,
  order: 10,
  type: StatementRange,
  read: StatementRequest.prototype.getStatementRange,
  write: StatementRequest.prototype.setStatementRange,
})
