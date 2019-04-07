import { AbstractRepository } from 'typeorm'
import { Record } from '../entities'

export abstract class RecordRepository<T extends Record<any>> extends AbstractRepository<T> {
  async getById(id: string) {
    const res = await this.createQueryBuilder('e')
      .whereInIds([id])
      .getOne()
    if (!res) {
      throw new Error('entity not found')
    }
    return res
  }

  async getByIds(ids: string[]) {
    const res = await this.createQueryBuilder('e')
      .whereInIds(ids)
      .getMany()
    if (!res) {
      throw new Error('no results')
    }
    return res
  }

  async all() {
    return this.createQueryBuilder('e')
      .where({ _deleted: 0 })
      .getMany()
  }
}
