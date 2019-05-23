import { ImageProps } from '@ag/core/context'
import { ImageSource } from '@ag/util'
import React, { useMemo } from 'react'

export const Image = Object.assign(
  React.memo<ImageProps>(function _Image(props) {
    const { src, size, margin, title } = props
    const img = useMemo(() => {
      return ImageSource.fromString(src)
    }, [src])

    if (!img.uri) {
      return null
    }

    return (
      <img
        title={title}
        src={img.uri}
        style={{ margin, maxWidth: size, maxHeight: size, minWidth: size }}
      />
    )
  }),
  {
    displayName: 'Form',
  }
)
