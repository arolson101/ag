import { Bank } from '@ag/lib-entities'
import { EntityRepository } from 'typeorm'
import { RecordRepository } from './RecordRepository'

@EntityRepository(Bank)
export class BankRepository extends RecordRepository<Bank> {}
