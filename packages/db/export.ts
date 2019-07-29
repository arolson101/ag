import { dbSaveOptions } from '@ag/core/thunks/dbWrite'
import { dehydrate, hydrate } from '@ag/util'
import assert from 'assert'
import csvParse from 'csv-parse/lib/sync'
import csvStringify from 'csv-stringify/lib/sync'
import debug from 'debug'
import { flatten, nest } from 'flatnest'
import JSZip from 'jszip'
import { DateTime } from 'luxon'
import { ColumnType, Connection, EntityMetadata } from 'typeorm'
import { DbEntity } from './entities'

const log = debug('db:export')

export const exportExt = 'agz'

const getExt = (obj: object | any): string => {
  const mime = obj.mime
  switch (mime) {
    case 'image/png':
      return '.png'
    case 'image/svg+xml':
      return '.svg'
    case 'image/jpeg':
      return '.jpg'
    case 'image/gif':
      return '.gif'
    case 'icns':
      return '.icns'
    case 'image/bmp':
      return '.bmp'
    case 'image/webp':
      return '.webp'
    default:
      return ''
  }
}

const isDate = (type: ColumnType): boolean => {
  if (typeof type === 'function' && type.name === 'Date') {
    return true
  } else if (typeof type === 'string') {
    switch (type) {
      case 'date':
      case 'datetime':
      case 'time':
      case 'datetime2':
      case 'datetimeoffset':
      case 'time with time zone':
      case 'time without time zone':
      case 'timestamp':
      case 'timestamp without time zone':
      case 'timestamp with time zone':
      case 'timestamp with local time zone':
        return true
    }
  }
  return false
}

const fixExport = (
  object: DbEntity<any> & Record<string, any>,
  entityMetadata: EntityMetadata,
  zip: JSZip
): object => {
  for (const col of entityMetadata.columns) {
    const key = col.propertyPath as keyof typeof object
    if (col.transformer) {
      const transforms = Array.isArray(col.transformer) ? col.transformer : [col.transformer]
      const value = transforms.reduce((val, tx) => tx.to(val), object[key])
      object[key] = value
    } else if (col.type === 'blob') {
      assert(object[key] instanceof Buffer)
      const ext = getExt(object)
      const path = `${entityMetadata.tableName}/${object.id}_${key}${ext}`
      zip.file(path, object[key] as Buffer)
      object[key] = path
    } else if (isDate(col.type)) {
      object[key] = DateTime.fromJSDate(object[key]).toISO()
    } else if (key === '_history' && object._history) {
      try {
        const value = JSON.stringify(hydrate(object._history), null, '  ')
        object[key] = value as any
      } catch (err) {}
    }
  }

  return object
}

const fixImport = async (
  zip: JSZip,
  entityMetadata: EntityMetadata,
  row: Record<string, any>
): Promise<object> => {
  for (const key of Object.keys(row) as Array<keyof typeof row>) {
    const col = entityMetadata.columns.find(c => c.propertyPath === key)
    if (!col) {
      continue
    }

    if (col.type === 'blob') {
      const path = row[key] as string
      const data: Buffer = await zip.file(path).async('nodebuffer')
      row[key] = data
    } else if (isDate(col.type)) {
      row[key] = DateTime.fromISO(row[key]).toJSDate()
    } else if (key === '_history' && row[key]) {
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
  const zip = new JSZip()
  for (const entityMetadata of connection.entityMetadatas) {
    const { tableName } = entityMetadata
    const hiddenColumns = entityMetadata.columns
      .filter(col => !col.isSelect)
      .map(col => `ent.${col.propertyName}`)
    const repo = connection.manager.getRepository<DbEntity<any>>(tableName)
    const data = (await repo
      .createQueryBuilder('ent')
      .select()
      .addSelect(hiddenColumns)
      .getMany())
      .map(ent => fixExport(ent, entityMetadata, zip))
      .map(flatten)

    log('%s: %d items', tableName, data.length)

    const columns = entityMetadata.columns.map(col => col.propertyName)
    const csv = csvStringify(data, { columns, header: true })
    await zip.file(`${tableName}.csv`, csv)
  }

  return zip.generateAsync({ type: 'base64' })
}

export const importDb = async (connection: Connection, data: Buffer) => {
  // log('importDb')
  const zip = new JSZip()
  await zip.loadAsync(data)

  // log('importDb %o', wb)
  for (const entityMetadata of connection.entityMetadatas) {
    const { tableName } = entityMetadata
    const csv = await zip.file(`${tableName}.csv`).async('text')

    const obj = csvParse(csv, {
      columns: true,
      skip_empty_lines: true,
      skip_lines_with_error: true,
      skip_lines_with_empty_values: true,
    }) as object[]

    const repo = connection.manager.getRepository<object>(tableName)
    const ents = await Promise.all(
      obj.map(async o => repo.create(await fixImport(zip, entityMetadata, nest(o))))
    )
    // log('importDb %s %o', sheetName, ents)
    if (ents.length) {
      await repo.save(ents, dbSaveOptions)
    }
  }
}
