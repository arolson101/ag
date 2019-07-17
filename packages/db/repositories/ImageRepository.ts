import { EntityRepository } from 'typeorm'
import { Image } from '../entities'
import { RecordRepository } from './RecordRepository'

@EntityRepository(Image)
export class ImageRepository extends RecordRepository<Image> {}
