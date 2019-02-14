import { ImageProps } from '@ag/app'
import React from 'react'
import { Image } from 'react-native'

export class NativeImage extends React.PureComponent<ImageProps> {
  render() {
    const { src, size, margin } = this.props
    if (!src.uri) {
      return null
    }

    return <Image source={src} style={{ margin, maxWidth: size, maxHeight: size }} />
  }
}
