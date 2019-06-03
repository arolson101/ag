import debug from 'debug'
import { flatten, nest } from 'flatnest'
import { Connection } from 'typeorm'
import XLSX from 'xlsx'

const log = debug('export')

export const exportDb = async (connection: Connection) => {
  const wb = XLSX.utils.book_new()
  for (const entityMetadata of connection.entityMetadatas) {
    const { tableName } = entityMetadata
    const repo = connection.manager.getRepository<object>(tableName)
    const data = (await repo.createQueryBuilder().getMany()).map(flatten)
    const header = entityMetadata.columns.map(col => col.propertyPath)
    log('%s: %d items', tableName, data.length)
    const ws = XLSX.utils.json_to_sheet(data, { header })
    XLSX.utils.book_append_sheet(wb, ws, tableName)
  }

  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
}

export const importDb = async (connection: Connection, data: any) => {
  // log('importDb')

  const wb = XLSX.read(data, { type: 'buffer' })
  // log('importDb %o', wb)
  for (const sheetName of wb.SheetNames) {
    const sheet = wb.Sheets[sheetName]
    const obj = XLSX.utils.sheet_to_json<object>(sheet)

    const repo = connection.manager.getRepository<object>(sheetName)
    const ents = obj.map(o => repo.create(nest(o)))
    // log('importDb %s %o', sheetName, ents)
    if (ents.length) {
      await repo.insert(ents)
    }
  }
}
