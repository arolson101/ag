import { ImageProps } from '@ag/core/context'
import { SvgUri } from '@ag/react-native-svg-image'
import { toImageURISource } from '@ag/util'
import debug from 'debug'
import React from 'react'
import { Image as RNImage, ImageStyle, StyleProp } from 'react-native'

const log = debug('ui-nativebase:NativeImage')

export const Image = Object.assign(
  React.memo<ImageProps>(function _Image({ src, size, margin }) {
    if (!src) {
      return null
    }

    const source = toImageURISource(src)

    const style: StyleProp<ImageStyle> = {
      margin,
      width: size,
      height: size,
    }

    // log('uri %s', img.uri)
    if (src.startsWith('data:image/svg')) {
      return <SvgUri source={source} style={style} width={size} height={size} />
    } else {
      // log('not svg, src %o style %o', src, style)
      return <RNImage source={source} style={style} />
    }
  }),
  {
    displayName: 'Image',
  }
)
