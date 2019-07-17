import { decodeDataUri, ImageUri, isDataUri, ISpec } from '@ag/util'
import crypto from 'crypto'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { DbChange } from './DbChange'
import { DbEntity } from './DbEntity'

export interface ImageInput {
  mime: string
  width: number
  height: number
  buf?: Buffer
  src: ImageUri
}

@Entity({ name: 'images' })
export class Image extends DbEntity<Image.Props> {
  @PrimaryColumn() id!: string
  @Column() mime!: string
  @Column() width!: number
  @Column() height!: number
  @Column('blob') buf?: Buffer
  @Column({ type: 'text', select: false, readonly: true }) src?: ImageUri
}

export namespace Image {
  export interface Props extends Pick<ImageInput, keyof ImageInput> {}
  export type Spec = ISpec<Props>

  export const generateId = (image: ImageUri): string => {
    const hash = crypto.createHash('sha1')
    hash.update(image)
    return hash.digest('hex')
  }

  export namespace change {
    export const create = (t: number, imageId?: string): [string | undefined, DbChange[]] => {
      if (imageId && isDataUri(imageId)) {
        const uri = imageId as ImageUri
        const {
          buf,
          attrs: { width, height },
          mime,
        } = decodeDataUri(uri)
        const id = generateId(uri)
        const image = new Image(id, {
          mime,
          width: +width,
          height: +height,
          buf,
          src: imageId as ImageUri,
        })
        const dbChange: DbChange = {
          table: Image,
          t,
          adds: [image],
        }
        return [id, [dbChange]]
      } else {
        return [imageId, []]
      }
    }
  }
}
