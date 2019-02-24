import * as rnfb from 'rn-fetch-blob'

declare module "rn-fetch-blob" {
    interface RNFetchBlobResponseInfo {
      redirects: string[]
    }
}
