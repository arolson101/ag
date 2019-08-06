import { appTable, DbChange, DbEntity, makeRecords } from '@ag/db/entities'
import debug from 'debug'
import { SaveOptions } from 'typeorm'
import { actions, LoadEntities } from '../actions'
import { selectors } from '../reducers'
import { CoreThunk } from './CoreThunk'

const log = debug('core:dbWrite')

export const dbSaveOptions: SaveOptions = {
  chunk: 500,
  reload: false,
}

export const dbWrite = (changes: DbChange[]): CoreThunk =>
  async function _dbWrite(dispatch, getState) {
    log('dbWrite %o', changes)
    const { connection } = selectors.appDb(getState())
    const loadEntities: LoadEntities[] = []

    await connection.transaction(async manager => {
      for (const change of changes) {
        const entity = appTable[change.table]
        const le: LoadEntities = { table: change.table, deletes: [], entities: [] }

        if (change.adds) {
          await manager.save(entity, change.adds, dbSaveOptions)
          le.entities.push(...change.adds)
        }

        if (change.deletes) {
          await manager
            .createQueryBuilder()
            .update(entity)
            .set({ _deleted: change.t })
            .whereInIds(change.deletes)
            .execute()
          le.deletes.push(...change.deletes)
        }

        if (change.edits) {
          const edits = change.edits
          const ids = change.edits.map(edit => edit.id)
          const items = await manager.findByIds<DbEntity<any>>(entity, ids)
          items.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
          items.forEach((record, i) => {
            // log('before %o %o', record, edits[i].q)
            record.update(change.t, edits[i].q)
          })
          await manager.save(entity, items, dbSaveOptions)
          le.entities.push(...items)
        }

        loadEntities.push(le)
      }

      // const records = makeRecords(changes)
      // const text = JSON.stringify(changes)
      // await this._changes.add({ text })
    })

    dispatch(actions.dbEntities(loadEntities))
  }
