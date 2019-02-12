import { ImageProps } from '@ag/app'
import { ImageString, memoizeOne, toImageSource } from '@ag/app/util'
import React from 'react'
import { Image } from 'react-native'

export class NativeImage extends React.PureComponent<ImageProps> {
  decodeImage = memoizeOne(toImageSource)

  render() {
    const { src, size, margin } = this.props
    const data = this.decodeImage(src as ImageString)
    if (!data) {
      return null
    }

    return <Image source={data} style={{ margin }} />
  }
}
