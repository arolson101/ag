import { ImageProps } from '@ag/core'
import React from 'react'

export const Image = Object.assign(
  React.memo<ImageProps>(props => {
    const { src, size, margin, title } = props
    if (!src.uri) {
      return null
    }

    return (
      <img
        title={title}
        src={src.uri}
        style={{ margin, maxWidth: size, maxHeight: size, minWidth: size }}
      />
    )
  }),
  {
    displayName: 'Form',
  }
)
