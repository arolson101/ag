import { ImageUri, ISpec } from '@ag/util'
import crypto from 'crypto'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { DbEntity } from './DbEntity'

export interface ImageInput {
  data?: ImageUri
}

@Entity({ name: 'images' })
export class Image extends DbEntity<Image.Props> {
  @PrimaryColumn() id!: string
  @Column({ type: 'text', select: false, readonly: true }) data?: ImageUri
}

export namespace Image {
  export interface Props extends Pick<ImageInput, keyof ImageInput> {}
  export type Spec = ISpec<Props>
  export const empty: Props = {
    data: '',
  }

  export const generateId = (image: ImageUri): string => {
    const hash = crypto.createHash('sha1')
    hash.update(image)
    return hash.digest('hex')
  }
}
