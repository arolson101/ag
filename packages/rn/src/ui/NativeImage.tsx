import { ImageProps } from '@ag/app'
import debug from 'debug'
import React from 'react'
import { Image } from 'react-native'
import { SvgUri } from './react-native-svg-uri'

const log = debug('rn:NativeImage')

export class NativeImage extends React.PureComponent<ImageProps> {
  render() {
    const { src, size, margin } = this.props
    if (!src.uri) {
      return null
    }

    const style = { margin, maxWidth: size, maxHeight: size }

    // log('uri %s', src.uri)
    if (src.uri.startsWith('data:image/svg')) {
      return <SvgUri source={src} style={style} />
    } else {
      return <Image source={src} style={style} />
    }
  }
}
