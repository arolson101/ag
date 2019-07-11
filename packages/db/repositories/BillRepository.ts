import { EntityRepository } from 'typeorm'
import { Bill } from '../entities'
import { RecordRepository } from './RecordRepository'

@EntityRepository(Bill)
export class BillRepository extends RecordRepository<Bill> {}
