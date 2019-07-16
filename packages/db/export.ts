import { dehydrate, hydrate } from '@ag/util'
import debug from 'debug'
import { flatten, nest } from 'flatnest'
import { Connection } from 'typeorm'
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata'
import XLSX from 'xlsx'
import { DbEntity, HistoryType } from './entities'

const log = debug('export')

const fixExport = (
  columns: ColumnMetadata[],
  object: DbEntity<any> & Record<string, any>
): object => {
  for (const col of columns) {
    const key = col.propertyPath as keyof typeof object
    if (col.transformer) {
      const transforms = Array.isArray(col.transformer) ? col.transformer : [col.transformer]
      const value = transforms.reduce((val, tx) => tx.to(val), object[key])
      object[key] = value
    } else if (key === '_history' && object._history) {
      try {
        const value = JSON.stringify(hydrate(object._history), null, '  ')
        object[key] = value as any
      } catch (err) {}
    }
  }

  return object
}

const fixImport = (row: Record<string, any>): object => {
  for (const key of Object.keys(row) as Array<keyof typeof row>) {
    if (key === '_history') {
      try {
        const val = JSON.parse(row[key])
        if (Array.isArray(val)) {
          const str = dehydrate(val)
          row[key] = str as any
        }
      } catch (error) {}
    }
  }
  return row
}

export const exportDb = async (connection: Connection) => {
  const wb = XLSX.utils.book_new()
  for (const entityMetadata of connection.entityMetadatas) {
    const { tableName } = entityMetadata
    const repo = connection.manager.getRepository<DbEntity<any>>(tableName)
    const data = (await repo.createQueryBuilder().getMany())
      .map(ent => fixExport(entityMetadata.columns, ent))
      .map(flatten)
    const header = entityMetadata.columns.map(col => col.propertyPath)
    log('%s: %d items', tableName, data.length)
    const ws = XLSX.utils.json_to_sheet(data, { header })
    XLSX.utils.book_append_sheet(wb, ws, tableName)
  }

  return XLSX.write(wb, { type: 'buffer', bookType: 'ods' })
}

export const importDb = async (connection: Connection, data: any) => {
  // log('importDb')

  const wb = XLSX.read(data, { type: 'buffer' })
  // log('importDb %o', wb)
  for (const sheetName of wb.SheetNames) {
    const sheet = wb.Sheets[sheetName]
    const obj = XLSX.utils.sheet_to_json<object>(sheet)

    const repo = connection.manager.getRepository<object>(sheetName)
    const ents = obj.map(o => repo.create(fixImport(nest(o))))
    // log('importDb %s %o', sheetName, ents)
    if (ents.length) {
      await repo.insert(ents)
    }
  }
}
