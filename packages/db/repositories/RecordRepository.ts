import debug from 'debug'
import { AbstractRepository } from 'typeorm'
import { DbEntity } from '../entities'

const log = debug('db:RecordRepository')

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
    const ret: Record<string, T> = {}
    // log('getByIds')
    const res = await this.createQueryBuilder('e')
      .whereInIds(ids)
      .getMany()
    if (!res) {
      throw new Error('no results')
    }

    res.forEach(elt => {
      ret[elt.id] = elt
    })
    return ret
  }

  async all() {
    return this.createQueryBuilder('e').getMany()
  }
}
