import { EntityRepository } from 'typeorm'
import { Bank } from '../../entities'
import { RecordRepository } from './RecordRepository'

@EntityRepository(Bank)
export class BankRepository extends RecordRepository<Bank> {}
