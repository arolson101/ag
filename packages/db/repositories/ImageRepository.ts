import { ImageUri } from '@ag/util'
import debug from 'debug'
import { EntityRepository } from 'typeorm'
import { Image } from '../entities'
import { RecordRepository } from './RecordRepository'

const log = debug('db:ImageRepository')

@EntityRepository(Image)
export class ImageRepository extends RecordRepository<Image> {
  async loadFullImage(id: string) {
    const buf: keyof Image.Props = 'buf'
    const res = (await this.createQueryBuilder('e')
      .select()
      .addSelect(`e.${buf}`)
      .whereInIds([id])
      .getOne()) as Required<Image>

    if (!res) {
      throw new Error('image not found')
    }

    log('loadImage(%s) %o', id, res)
    if (!res.buf) {
      throw new Error('image does not have a buffer')
    }

    res.blob = new Blob([res.buf], { type: res.mime })
    res.src = URL.createObjectURL(res.blob) as ImageUri

    return res
  }
}
