import { Db } from '@ag/lib-entities'
import { Connection, Repository } from 'typeorm'

export class IndexDb {
  connection: Connection
  dbRepository: Repository<Db>

  constructor(connection: Connection) {
    this.connection = connection
    this.dbRepository = connection.getRepository(Db)
  }
}
