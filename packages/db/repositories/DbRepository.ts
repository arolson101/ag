import { AbstractRepository, EntityRepository } from 'typeorm'
import { Db } from '../entities'

@EntityRepository(Db)
export class DbRepository extends AbstractRepository<Db> {
  async deleteDb(dbId: string) {
    await this.repository
      .createQueryBuilder()
      .delete()
      .from(Db)
      .where('dbId = :dbId', { dbId })
      .execute()
  }

  async get(dbId: string) {
    return this.repository.findOneOrFail(dbId)
  }

  async all(): Promise<DbInfo[]> {
    return this.repository.find()
  }

  async save(obj: DbInfo) {
    return this.repository.save(obj)
  }
}
