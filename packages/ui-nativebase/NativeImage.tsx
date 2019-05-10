import { ImageProps } from '@ag/core/context'
import { SvgUri } from '@ag/react-native-svg-image'
import debug from 'debug'
import React from 'react'
import { Image as RNImage, ImageStyle, StyleProp } from 'react-native'

const log = debug('ui-nativebase:NativeImage')

export const Image = Object.assign(
  React.memo<ImageProps>(function _Image({ src, size, margin }) {
    if (!src.uri) {
      return null
    }

    const style: StyleProp<ImageStyle> = {
      margin,
      width: size,
      height: size,
    }

    // log('uri %s', src.uri)
    if (src.uri.startsWith('data:image/svg')) {
      return <SvgUri source={src} style={style} width={size} height={size} />
    } else {
      // log('not svg, src %o style %o', src, style)
      return <RNImage source={src} style={style} />
    }
  }),
  {
    displayName: 'Image',
  }
)
