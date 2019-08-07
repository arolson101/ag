import { appTable, AppTable, ChangeRecord, DbChange, DbEntity } from '@ag/db/entities'
import { simplifyEntity, unsimplifyEntity } from '@ag/db/export'
import { iupdate } from '@ag/util'
import assert = require('assert')
import debug from 'debug'
import * as R from 'ramda'
import { Brackets, SaveOptions } from 'typeorm'
import { actions, LoadEntities } from '../actions'
import { selectors } from '../reducers'
import { CoreThunk } from './CoreThunk'

const log = debug('core:dbWrite')

export const dbSaveOptions: SaveOptions = {
  chunk: 300,
  reload: false,
}

export const dbWrite = (dbChanges: DbChange[]): CoreThunk =>
  async function _dbWrite(dispatch, getState) {
    log('dbWrite %o', dbChanges)
    const { connection } = selectors.appDb(getState())
    const loadEntities: LoadEntities[] = []

    await connection.transaction(async manager => {
      const crr = manager.getRepository(ChangeRecord)

      const changesByTable = R.groupBy(a => a.table, dbChanges)

      for (const table of Object.keys(changesByTable) as AppTable[]) {
        const le: LoadEntities = { table, deletes: [], entities: [] }
        const entity = appTable[table]
        const tableChanges = changesByTable[table]
        if (table === 'image') {
          for (const change of tableChanges) {
            if (!change.adds) {
              throw new Error('images can only be added')
            }
            const saved = await manager.save(entity, change.adds)
            le.entities.push(...saved)
          }
        } else {
          const records = ChangeRecord.fromDbChange(connection, tableChanges)
          await crr.save(records, dbSaveOptions)

          const entityMetadata = connection.entityMetadatas.find(emd => emd.target === entity)
          if (!entityMetadata) {
            throw new Error('no entityMetadata for table ' + table)
          }

          for (const { id, t } of records) {
            const prev = await crr
              .createQueryBuilder('e')
              .where('e.table = :table', { table })
              .andWhere('e.id = :id', { id })
              .andWhere('e.t < :t', { t })
              .orderBy('e.t', 'DESC')
              .take(1)
              .getOne()

            const base = prev && prev.value ? simplifyEntity(prev.value, entityMetadata) : undefined
            let ent: object | undefined = base
            let deleted = false

            const next = await crr
              .createQueryBuilder('e')
              .where('e.table = :table', { table })
              .andWhere('e.id = :id', { id })
              .andWhere('e.t >= :t', { t })
              .orderBy('e.t', 'DESC')
              .getMany()

            for (const n of next) {
              switch (n.type) {
                case 'add':
                  deleted = false
                  assert(n.value)
                  ent = n.value
                  break

                case 'delete':
                  deleted = true
                  break

                case 'edit':
                  assert(ent)
                  deleted = false
                  ent = n.edit && ent ? iupdate(ent, n.edit) : ent
                  n.value = ent
                  break
              }

              crr.save(next, dbSaveOptions)

              if (deleted) {
                await manager.delete(entity, { id })
                le.deletes.push(id)
              } else {
                if (ent) {
                  const values = unsimplifyEntity(ent, entityMetadata)
                  const saved = await manager.save(entity, { id, ...values })
                  le.entities.push(saved)
                }
              }
            }
          }

          loadEntities.push(le)
        }
      }
    })

    dispatch(actions.dbEntities(loadEntities))
  }
