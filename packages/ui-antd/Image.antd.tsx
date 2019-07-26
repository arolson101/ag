import { useImage } from '@ag/core/components'
import { ImageProps } from '@ag/core/context'
import React from 'react'

export const Image = Object.assign(
  React.memo<ImageProps>(function _Image(props) {
    const { id, size, margin, title } = props
    const source = useImage(id)

    if (!source) {
      return null
    }

    return (
      <img
        title={title}
        src={source.src}
        style={{ margin, maxWidth: size, maxHeight: size, minWidth: size }}
      />
    )
  }),
  {
    displayName: 'Image',
  }
)
