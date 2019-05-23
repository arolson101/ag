import { ImageProps } from '@ag/core/context'
import { SvgUri } from '@ag/react-native-svg-image'
import { ImageSource } from '@ag/util'
import debug from 'debug'
import React, { useMemo } from 'react'
import { Image as RNImage, ImageStyle, StyleProp } from 'react-native'

const log = debug('ui-nativebase:NativeImage')

export const Image = Object.assign(
  React.memo<ImageProps>(function _Image({ src, size, margin }) {
    const img = useMemo(() => {
      return ImageSource.fromString(src)
    }, [src])

    if (!img.uri) {
      return null
    }

    const style: StyleProp<ImageStyle> = {
      margin,
      width: size,
      height: size,
    }

    // log('uri %s', img.uri)
    if (img.uri.startsWith('data:image/svg')) {
      return <SvgUri source={img} style={style} width={size} height={size} />
    } else {
      // log('not svg, src %o style %o', src, style)
      return <RNImage source={img} style={style} />
    }
  }),
  {
    displayName: 'Image',
  }
)
