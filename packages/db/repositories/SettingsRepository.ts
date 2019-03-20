import { AbstractRepository, EntityRepository } from 'typeorm'
import { Setting } from '../entities'

@EntityRepository(Setting)
export class SettingsRepository extends AbstractRepository<Setting> {
  async get(key: string) {
    return this.repository.findOne(key)
  }

  async set(key: string, value: string) {
    return this.repository.save(new Setting(key, value))
  }
}
