import { ISpec } from '@ag/util'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { AppTable } from './appEntities'
import { DbChange } from './DbChange'

type ChangeType = 'add' | 'edit' | 'delete'

@Entity({ name: 'changes' })
export class ChangeRecord<T extends {} = {}> {
  @PrimaryColumn('text') table!: AppTable
  @PrimaryColumn() id!: string
  @PrimaryColumn() t!: number
  @Column('text') type!: ChangeType
  @Column('simple-json', { nullable: true }) edit?: ISpec<T>
  @Column('simple-json', { nullable: true }) value?: T

  constructor(props?: ChangeRecordProps) {
    if (props) {
      Object.assign(this, props)
    }
  }

  static fromDbChange = (change: DbChange[]): ChangeRecord[] => {
    const records: ChangeRecord[] = change.flatMap(({ table, t, adds, edits, deletes }) => {
      return [
        ...(adds
          ? adds.map(add => new ChangeRecord({ table, id: add.id, t, type: 'add', value: add }))
          : []),
        ...(edits
          ? edits.map(
              edit => new ChangeRecord({ table, id: edit.id, t, type: 'edit', edit: edit.q })
            )
          : []),
        ...(deletes
          ? deletes.map(id => new ChangeRecord({ table, id, t, type: 'delete' })) //
          : []),
      ]
    })
    return records
  }
}

interface ChangeRecordProps extends ChangeRecord {}
