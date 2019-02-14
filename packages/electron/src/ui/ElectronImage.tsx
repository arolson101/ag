import { ImageProps } from '@ag/app'
import React from 'react'

export class ElectronImage extends React.PureComponent<ImageProps> {
  render() {
    const { src, size, margin, title } = this.props
    if (!src.uri) {
      return null
    }

    return <img title={title} src={src.uri} style={{ margin, maxWidth: size, maxHeight: size }} />
  }
}
