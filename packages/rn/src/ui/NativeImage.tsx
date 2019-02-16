import { AppContext, ImageProps } from '@ag/app'
import debug from 'debug'
import React from 'react'
import { Image } from 'react-native'
import { SvgUri } from './react-native-svg-uri'

const log = debug('rn:NativeImage')

export class NativeImage extends React.PureComponent<ImageProps> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  render() {
    const { src, size, margin } = this.props
    if (!src.uri) {
      return null
    }

    const style = { margin, maxWidth: size, maxHeight: size }

    // log('uri %s', src.uri)
    if (src.uri.startsWith('data:image/svg')) {
      return (
        <SvgUri
          source={src}
          style={style}
          width={size}
          height={size}
          fetcher={this.context.fetch}
        />
      )
    } else {
      return <Image source={src} style={style} />
    }
  }
}
