import { ISpec } from '@ag/util/iupdate'
import { fail } from 'assert'
import { Connection } from 'typeorm'
import { Record } from '../entities/Record'

export interface Change {
  readonly seq?: number
  readonly text: string
}

export interface DbRecordEdit {
  id: string
  q: ISpec<{}>
}

type Table = any

export interface DbChange {
  table: Table
  t: number
  adds?: Array<Record<any>>
  deletes?: string[]
  edits?: DbRecordEdit[]
}

export const dbWrite = async (db: Connection, changes: DbChange[]) => {
  try {
    await db.transaction(async manager => {
      for (const change of changes) {
        if (change.adds) {
          await manager.save(change.table, change.adds)
        }

        if (change.deletes) {
          await manager
            .createQueryBuilder()
            .update(change.table)
            .set({ _deleted: change.t })
            .whereInIds(change.deletes)
            .execute()
        }

        if (change.edits) {
          const edits = change.edits
          const items: Array<Record<any>> = (await manager.findByIds(
            change.table,
            change.edits.map(edit => edit.id)
          )) as any[]
          items.forEach((record, i) => {
            record.update(change.t, edits[i].q)
          })
          await manager.save(change.table, items)
        }
      }

      // const text = JSON.stringify(changes)
      // await this._changes.add({ text })
    })
  } catch (err) {
    fail(err)
  }
}
