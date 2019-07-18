import { useImage } from '@ag/core/components'
import { ImageProps } from '@ag/core/context'
import { SvgUri } from '@ag/react-native-svg-image'
import debug from 'debug'
import React from 'react'
import { ImageStyle, StyleProp } from 'react-native'

const log = debug('ui-nativebase:NativeImage')

export const Image = Object.assign(
  React.memo<ImageProps>(function _Image({ id, size, margin }) {
    const source = useImage(id)

    if (!source) {
      return null
    }

    const style: StyleProp<ImageStyle> = {
      margin,
      width: size,
      height: size,
    }

    // log('uri %s', img.uri)
    if (source.src && source.src.startsWith('data:image/svg')) {
      return <SvgUri source={source} style={style} width={size} height={size} />
    } else {
      // log('not svg, src %o style %o', src, style)
      // return <RNImage source={source} style={style} />
      return null
    }
  }),
  {
    displayName: 'Image',
  }
)
