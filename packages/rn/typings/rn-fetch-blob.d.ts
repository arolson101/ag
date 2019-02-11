import * as rnfb from 'rn-fetch-blob'

//augment validate.js
declare module "rn-fetch-blob" {
    interface RNFetchBlobResponseInfo {
      redirects: string[]
    }
}
