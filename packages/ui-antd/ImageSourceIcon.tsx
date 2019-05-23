import { IconName } from '@ag/core/context'
import { ImageSource, ImageString } from '@ag/util'
import * as Antd from 'antd'
import React, { useMemo } from 'react'

type Props = React.ComponentProps<typeof Antd.Icon> & {
  src: ImageString | undefined
}

export const ImageSourceIcon: React.FC<Props> = ({ src, ...props }) => {
  const img = useMemo(() => {
    return ImageSource.fromString(src)
  }, [src])
  return (
    <Antd.Icon
      {...props}
      component={
        src
          ? () => (
              <Antd.Avatar size='small' shape='square' style={{ borderRadius: 0 }} src={img.uri} />
            )
          : undefined
      }
    />
  )
}

export const mapIconName = (icon?: IconName): string | undefined => {
  // https://beta.ant.design/components/icon/
  switch (icon) {
    case 'url':
      return 'global'

    case 'image':
      return 'picture'

    case 'library':
      return 'folder-open'

    case 'add':
      return 'file-add'

    case 'refresh':
      return 'reload'

    case 'trash':
      return 'delete'

    case 'edit':
    case 'sync':
    default:
      return icon
  }
}
