'use strict'
const fs = require('fs')

let upstreamTransformer = require('react-native-typescript-transformer')

module.exports.getCacheKey = function() {
  return upstreamTransformer.getCacheKey()
}

module.exports.transform = function(src, filename, options) {
  if (typeof src === 'object') {
    // handle RN >= 0.46
    ;({ src, filename, options } = src)
  }

  if (filename.endsWith('.xlsx')) {
    const buffer = fs.readFileSync(filename)
    const data = buffer.toString('base64')
    const src =
      `import { Buffer } from 'buffer'\n` + `module.exports = Buffer.from('${data}', 'base64')`

    return upstreamTransformer.transform({
      src,
      filename,
      options,
    })
  } else {
    return upstreamTransformer.transform({
      src,
      filename,
      options,
    })
  }
}
