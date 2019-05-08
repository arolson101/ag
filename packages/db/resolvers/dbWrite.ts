import { fail } from 'assert'
import debug from 'debug'
import { Connection } from 'typeorm'
import { DbChange, Record } from '../entities'

const log = debug('db:dbWrite')

export const dbWrite = async (db: Connection, changes: DbChange[]) => {
  log('dbWrite %o', changes)
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
          const ids = change.edits.map(edit => edit.id)
          const items = await manager.findByIds<Record<any>>(change.table, ids)
          items.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
          items.forEach((record, i) => {
            // log('before %o %o', record, edits[i].q)
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
