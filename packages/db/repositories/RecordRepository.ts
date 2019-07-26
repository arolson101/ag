import { AbstractRepository } from 'typeorm'
import { DbEntity } from '../entities'

export abstract class RecordRepository<T extends DbEntity<any>> extends AbstractRepository<T> {
  async getById(id: string) {
    const res = await this.createQueryBuilder('e')
      .whereInIds([id])
      .getOne()
    if (!res) {
      throw new Error('entity not found')
    }
    return res
  }

  async getByIds(ids: string[]): Promise<Record<string, T>> {
    const res = await this.createQueryBuilder('e')
      .whereInIds(ids)
      .getMany()
    if (!res) {
      throw new Error('no results')
    }
    return res.reduce(
      (ret, elt) => {
        ret[elt.id] = elt
        return ret
      },
      {} as Record<string, T>
    )
  }

  async all() {
    return this.createQueryBuilder('e')
      .where({ _deleted: 0 })
      .getMany()
  }
}
