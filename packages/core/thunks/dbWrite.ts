import { DbChange, Record } from '@ag/db/entities'
import debug from 'debug'
import { actions } from '../actions'
import { WrittenChanges } from '../actions/queryActions'
import { selectors } from '../reducers'
import { CoreThunk } from './CoreThunk'

const log = debug('core:dbWrite')

export const dbWrite = (changes: DbChange[]): CoreThunk =>
  async function _dbWrite(dispatch, getState) {
    log('dbWrite %o', changes)
    const { connection } = selectors.getAppDb(getState())
    const writtenChanges: WrittenChanges[] = []

    await connection.transaction(async manager => {
      for (const change of changes) {
        const wc: WrittenChanges = { table: change.table, deletes: [], entities: [] }

        if (change.adds) {
          await manager.save(change.table, change.adds)
          wc.entities.push(...change.adds)
        }

        if (change.deletes) {
          await manager
            .createQueryBuilder()
            .update(change.table)
            .set({ _deleted: change.t })
            .whereInIds(change.deletes)
            .execute()
          wc.deletes.push(...change.deletes)
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
          wc.entities.push(...items)
        }

        writtenChanges.push(wc)
      }

      // const text = JSON.stringify(changes)
      // await this._changes.add({ text })
    })

    dispatch(actions.changesWritten(writtenChanges))
  }
