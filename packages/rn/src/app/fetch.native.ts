import debug from 'debug'
import RNFetchBlob, { FetchBlobResponse } from 'rn-fetch-blob'

const log = debug('rn:fetch')

export const rnfetch = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
  try {
    if (typeof input !== 'string') {
      throw new Error('input must be a string')
    }

    // log('rnfetch %s %o', input, init)
    let response: Response

    // handle data URI
    const dataSig = 'data:'

    if (input.startsWith(dataSig)) {
      const colon = input.indexOf(':')
      const semi = input.indexOf(';')
      const comma = input.indexOf(',')
      const mime = input.substring(colon + 1, semi)
      const encoding = input.substring(semi + 1, comma)
      const base64 = input.substring(comma + 1)

      // log('data uri %o', { mime, encoding, base64 })

      const headers = { 'content-type': mime } as Record<string, any>

      response = {
        ok: true,
        url: input,

        headers: {
          get: (name: string) => headers[name],
          has: (name: string) => name in headers,

          raw: headers,
        },

        statusText: `Data URI`,

        text: async () => Buffer.from(base64, encoding).toString(),
        arrayBuffer: async (): Promise<ArrayBuffer> => Buffer.from(base64, encoding),
      } as any
    } else {
      init = init || {}

      const task = RNFetchBlob.config({}).fetch((init.method as 'GET') || 'GET', input, {
        ...((init.headers || {}) as Record<string, string>),
        'RNFB-Response': 'base64',
      })

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

      // log('%s: %o', input, rbresponse)

      response = {
        ok: info.status >= 200 && info.status <= 299,
        url: info.redirects[info.redirects.length - 1],

        headers: {
          get: (name: string) => info.headers[name],
          has: (name: string) => name in info.headers,

          raw: info.headers,
        },

        statusText: `HTTP status ${info.status} returned from server`,

        text: async () => rbresponse.text(),
        arrayBuffer: async (): Promise<ArrayBuffer> => Buffer.from(rbresponse.base64(), 'base64'),

        rbresponse,
      } as any
    }

    // log('rnfetch %s %o => %o', input, init, response)

    return response
  } catch (error) {
    log('rnfetch error %o', error)
    throw error
  }
}
