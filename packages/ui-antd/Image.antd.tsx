import { ImageProps } from '@ag/core/context'
import React from 'react'

export const Image = Object.assign(
  React.memo<ImageProps>(function _Image(props) {
    const { src, size, margin, title } = props

    if (!src) {
      return null
    }

    return (
      <img
        title={title}
        src={src.src}
        style={{ margin, maxWidth: size, maxHeight: size, minWidth: size }}
      />
    )
  }),
  {
    displayName: 'Form',
  }
)
