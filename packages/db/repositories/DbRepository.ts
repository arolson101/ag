import { Repository } from 'typeorm'
import { Db } from '../entities'

export type DbRepository = Repository<Db>
