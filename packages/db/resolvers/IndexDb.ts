import { Connection, Repository } from 'typeorm'
import { Db } from '../entities'

export class IndexDb {
  connection: Connection
  dbRepository: Repository<Db>

  constructor(connection: Connection) {
    this.connection = connection
    this.dbRepository = connection.getRepository(Db)
  }
}
