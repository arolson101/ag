import { IconName } from '@ag/core/context'
import { ImageSource } from '@ag/util'
import * as Antd from 'antd'
import React from 'react'

type Props = React.ComponentProps<typeof Antd.Icon> & {
  src: ImageSource | undefined
}

export const ImageSourceIcon: React.FC<Props> = ({ src, ...props }) => (
  <Antd.Icon
    {...props}
    component={
      src
        ? () => (
            <Antd.Avatar size='small' shape='square' style={{ borderRadius: 0 }} src={src.uri} />
          )
        : undefined
    }
  />
)

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
