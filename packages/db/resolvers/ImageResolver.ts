import { ImageSource } from '@ag/util'
import debug from 'debug'
import { Arg, Ctx, Query, Resolver } from 'type-graphql'
import { DbContext } from '../DbContext'
import { getFavico, getImage, getImageList } from '../online'
import { OnlineResolver } from './OnlineResolver'

const log = debug('db:ImageResolver')

@Resolver()
export class ImageResolver {
  constructor(
    private online: OnlineResolver //
  ) {}

  @Query(returns => [String])
  async getImageList(
    @Ctx() context: DbContext,
    @Arg('url') url: string,
    @Arg('cancelToken') cancelToken: string
  ): Promise<string[]> {
    try {
      const source = this.online.register(context, cancelToken)
      return getImageList(url, source.token, context)
    } finally {
      this.online.delete(cancelToken)
    }
  }

  @Query(returns => ImageSource)
  async getImage(
    @Ctx() context: DbContext,
    @Arg('url') url: string,
    @Arg('cancelToken') cancelToken: string
  ): Promise<ImageSource> {
    try {
      const source = this.online.register(context, cancelToken)
      const res = await getImage(url, source.token, context)
      return ImageSource.fromImageBuf(res)
    } finally {
      this.online.delete(cancelToken)
    }
  }

  @Query(returns => ImageSource)
  async getFavico(
    @Ctx() context: DbContext,
    @Arg('url') url: string,
    @Arg('cancelToken') cancelToken: string
  ): Promise<ImageSource> {
    try {
      const source = this.online.register(context, cancelToken)
      const res = await getFavico(url, source.token, context)
      return ImageSource.fromImageBuf(res)
    } finally {
      this.online.delete(cancelToken)
    }
  }
}
