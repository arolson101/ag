import debug from 'debug'
import RNFetchBlob, { FetchBlobResponse } from 'rn-fetch-blob'

const log = debug('rn:fetch')

export const rnfetch = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
  if (typeof input !== 'string') {
    throw new Error('input must be a string')
  }

  init = init || {}

  const task = RNFetchBlob.config({}).fetch(
    (init.method as 'GET') || 'GET',
    input,
    init.headers as Record<string, string>
  )

  const listener = () => {
    log('fetch for %s is being cancelled', input)
    task.cancel(reason => {
      log('fetch for %s was cancelled (%o)', input, reason)
    })
  }

  if (init && init.signal) {
    init.signal.addEventListener('abort', listener)
  }

  const rbresponse: FetchBlobResponse = await task
  const info = rbresponse.respInfo

  if (init && init.signal) {
    init.signal.removeEventListener('abort', listener)
  }

  const response: Response = {
    ok: info.status >= 200 && info.status <= 299,
    url: (info.headers as any)['X-Originating-URL']
      ? (info.headers as any)['X-Originating-URL']
      : input,

    headers: {
      get: (name: string) => info.headers[name],
      has: (name: string) => name in info.headers,
    },

    statusText: `HTTP status ${info.status} returned from server`,

    text: async () => rbresponse.text(),
    arrayBuffer: async (): Promise<ArrayBuffer> => Buffer.from(rbresponse.base64(), 'base64'),
  } as any

  return response
}
