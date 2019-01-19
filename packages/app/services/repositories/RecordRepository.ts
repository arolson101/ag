import { AbstractRepository } from 'typeorm'

export abstract class RecordRepository<T> extends AbstractRepository<T> {
  async get(id: string) {
    const res = await this.createQueryBuilder('e')
      .where({ _deleted: 0, id })
      .getOne()
    if (!res) {
      throw new Error('entity not found')
    }
    return res
  }

  async all() {
    return this.createQueryBuilder('e')
      .where({ _deleted: 0 })
      .getMany()
  }
}
