import { CancelTokenSource } from 'axios'
import debug from 'debug'
import { Arg, Mutation, Resolver } from 'type-graphql'
import { DbContext } from '../DbContext'

const log = debug('app:OnlineResolver')

@Resolver()
export class OnlineResolver {
  constructor() {}

  private tokens = new Map<string, CancelTokenSource>()

  register(context: DbContext, cancelToken: string) {
    const { axios } = context
    const source = axios.CancelToken.source()
    this.tokens.set(cancelToken, source)
    return source
  }

  delete(cancelToken: string) {
    this.tokens.delete(cancelToken)
  }

  @Mutation(returns => Boolean)
  async cancel(@Arg('cancelToken') cancelToken: string): Promise<boolean> {
    const source = this.tokens.get(cancelToken)
    if (!source) {
      return false
    }

    source.cancel()
    return true
  }
}
