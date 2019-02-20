import { AppContext, ImageProps } from '@ag/app'
import debug from 'debug'
import React from 'react'
import { Image as RNImage, ImageStyle, StyleProp } from 'react-native'
import { SvgUri } from './react-native-svg-uri'

const log = debug('rn:NativeImage')

export class Image extends React.PureComponent<ImageProps> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  render() {
    const { src, size, margin } = this.props
    if (!src.uri) {
      return null
    }

    const style: StyleProp<ImageStyle> = {
      margin,
      width: size,
      height: size,
    }

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
      // log('not svg, src %o style %o', src, style)
      return <RNImage source={src} style={style} />
    }
  }
}
