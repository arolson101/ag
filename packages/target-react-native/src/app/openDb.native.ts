import debug from 'debug'
import SqlitePlugin from 'react-native-sqlite-storage'
import { Connection, ConnectionOptions, createConnection } from 'typeorm'

const log = debug('rn:db')
log.enabled = process.env.NODE_ENV !== 'production'

// https://github.com/andpor/react-native-sqlite-storage#opening-a-database
const iosDatabaseLocation: SqlitePlugin.Location = 'Documents'

export const openDb = async (
  name: string,
  key: string,
  entities: ConnectionOptions['entities']
): Promise<Connection> => {
  const type = 'react-native'
  const database = name + '.db'
  log('opening %s', database)
  const db = await createConnection({
    type,
    name,
    database,
    synchronize: true,
    location: iosDatabaseLocation,
    entities,
    extra: {
      key,
    },
    // logging: true,
  })
  log('opened')
  return db
}

export const deleteDb = async (name: string) => {
  log('deleteDb %s', name)
  await SqlitePlugin.deleteDatabase({
    name: name + '.db',
    location: iosDatabaseLocation,
  })
}
