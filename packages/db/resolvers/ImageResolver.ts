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
      // log('getImageList %s %s', url, cancelToken)
      const source = this.online.register(context, cancelToken)
      return getImageList(url, source.token, context)
    } finally {
      this.online.delete(cancelToken)
      // log('getImageList end')
    }
  }

  @Query(returns => ImageSource)
  async getImage(
    @Ctx() context: DbContext,
    @Arg('url') url: string,
    @Arg('cancelToken') cancelToken: string
  ): Promise<ImageSource> {
    try {
      // log('getImage %s %s', url, cancelToken)
      const source = this.online.register(context, cancelToken)
      const res = await getImage(url, source.token, context)
      return ImageSource.fromImageBuf(res)
    } finally {
      this.online.delete(cancelToken)
      // log('getImage end')
    }
  }

  @Query(returns => ImageSource)
  async getFavico(
    @Ctx() context: DbContext,
    @Arg('url') url: string,
    @Arg('cancelToken') cancelToken: string
  ): Promise<ImageSource> {
    try {
      // log('getFavico %s %s', url, cancelToken)
      const source = this.online.register(context, cancelToken)
      const res = await getFavico(url, source.token, context)
      return ImageSource.fromImageBuf(res)
    } finally {
      this.online.delete(cancelToken)
      // log('getFavico end')
    }
  }
}
