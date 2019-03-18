import assert from 'assert'
import { CancelTokenSource } from 'axios'
import debug from 'debug'
import { Arg, Mutation, Resolver } from 'type-graphql'
import { DbContext } from '../DbContext'

const log = debug('db:OnlineResolver')

interface Info {
  refcount: number
  source: CancelTokenSource
}

@Resolver()
export class OnlineResolver {
  constructor() {}

  private tokens = new Map<string, Info>()

  register(context: DbContext, cancelToken: string) {
    if (!this.tokens.has(cancelToken)) {
      const { axios } = context
      const source = axios.CancelToken.source()
      this.tokens.set(cancelToken, { refcount: 0, source })
    }
    const item = this.tokens.get(cancelToken)!
    item.refcount++
    // log('register %s => %i', cancelToken, item.refcount)
    return item.source
  }

  delete(cancelToken: string) {
    const item = this.tokens.get(cancelToken)
    assert(item)
    if (item) {
      item.refcount--
      // log('delete %s => %i', cancelToken, item.refcount)
      if (item.refcount === 0) {
        // log('deleted')
        this.tokens.delete(cancelToken)
      }
    }
  }

  @Mutation(returns => Boolean)
  async cancel(@Arg('cancelToken') cancelToken: string): Promise<boolean> {
    const item = this.tokens.get(cancelToken)
    if (!item) {
      // log('cancelToken %s not found', cancelToken)
      return false
    }

    log('cancelling %s', cancelToken)
    item.source.cancel()
    return true
  }
}
