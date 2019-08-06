import { ISpec } from '@ag/util'
import { AppTable } from './appEntities'
import { DbChange } from './DbChange'
import { DbEntity } from './DbEntity'

export class ChangeRecord {
  table!: AppTable
  id!: string
  t!: number
  add?: DbEntity<any>
  edit?: ISpec<{}>
  del?: boolean

  constructor(props?: ChangeRecordProps) {
    if (props) {
      Object.assign(this, props)
    }
  }
}

interface ChangeRecordProps extends ChangeRecord {}

export const makeRecords = (changes: DbChange[]): ChangeRecord[] => {
  const records: ChangeRecord[] = changes.flatMap(({ table, t, adds, edits, deletes }) => [
    ...(adds ? adds.map(add => new ChangeRecord({ id: add.id, table, t, add })) : []),
    ...(edits ? edits.map(({ id, q }) => new ChangeRecord({ id, table, t, edit: q })) : []),
    ...(deletes ? deletes.map(id => new ChangeRecord({ id, table, t, del: true })) : []),
  ])
  return records
}
