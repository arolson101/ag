import { ImageProps } from '@ag/app'
import { ImageString, memoizeOne, toImageSource } from '@ag/app/util'
import React from 'react'

export class ElectronImage extends React.PureComponent<ImageProps> {
  decodeImage = memoizeOne(toImageSource)

  render() {
    const { src, size, margin, title } = this.props
    const data = this.decodeImage(src as ImageString)
    if (!data) {
      return null
    }

    return <img title={title} src={data.uri} style={{ margin, maxWidth: size, maxHeight: size }} />
  }
}
