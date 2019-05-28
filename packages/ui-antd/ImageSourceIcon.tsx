import { IconName } from '@ag/core/context'
import { ImageUri } from '@ag/util'
import * as Antd from 'antd'
import React from 'react'

type Props = React.ComponentProps<typeof Antd.Icon> & {
  src: ImageUri | undefined
  header?: boolean
}

export const ImageSourceIcon: React.FC<Props> = ({ src, header, ...props }) => {
  return (
    <Antd.Icon
      {...props}
      component={
        src
          ? () => (
              <Antd.Avatar
                size={header ? 'large' : 'small'}
                shape='square'
                style={{ borderRadius: 0 }}
                src={src}
              />
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
